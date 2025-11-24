require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("./db-config");
const upload = require("./upload");

const multer = require("multer");
const XLSX = require("xlsx");
const util = require("util");
const uploadExcel = multer({ storage: multer.memoryStorage() });


const query = util.promisify(db.query).bind(db);

// 1) FIX DATE SHIFT (No timezone problem)
function excelDayToDate(dayNumber, year, month) {
    const d = parseInt(dayNumber, 10);
    return `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// 2) NORMALIZE VILLAGE NAME
function normalizeVillageName(name) {
    return name
        .replace(/บ้าน|หมู่บ้าน|หมู่ที่|หมู่|บ\.|ม\./g, "")
        .replace(/\s+/g, " ")
        .trim();
}

// 3) EXTRACT MOO NUMBER (ม.1 → 1)
function extractMoo(name) {
    const match = name.match(/ม\.?\s*(\d+)/);
    return match ? parseInt(match[1], 10) : null;
}

// 4) STRING SIMILARITY (simple scoring)
function stringSimilarity(a, b) {
    if (!a || !b) return 0;

    a = a.toLowerCase();
    b = b.toLowerCase();

    if (a === b) return 1;
    if (b.includes(a)) return 0.7;
    if (a.includes(b)) return 0.7;

    // basic similarity
    let matchCount = 0;
    for (let ch of a) if (b.includes(ch)) matchCount++;

    return matchCount / Math.max(a.length, b.length);
}

// 5) SMART LOCATION MATCHING (VERSION B)
function smartMatchLocation(excelName, dbLocations) {
    const raw = excelName.trim();

    // clean names for comparison
    const cleanName = normalizeVillageName(raw);
    const moo = extractMoo(raw);

    let bestMatch = null;
    let bestScore = 0;

    dbLocations.forEach((loc) => {
        const dbName = loc.name;

        const hasMoo = moo && dbName.includes(`หมู่${moo}`);
        const sim = stringSimilarity(cleanName, dbName);

        let score = sim;

        if (hasMoo) score += 0.4;       // bonus for same Moo
        if (dbName.includes(cleanName)) score += 0.3;

        if (score > bestScore) {
            bestScore = score;
            bestMatch = loc;
        }
    });

    // confidence threshold
    if (bestScore >= 0.55) return bestMatch;

    return null;
}

// แปลงชื่อ sheet เช่น "พ.ค.2566", "ก.ค.67", "ธ.ค.", "มีนาคม 2568"
function parseSheetName(sheetName, index) {
    const originalName = sheetName;
    const normalized = String(sheetName).replace(/\s+/g, "").toLowerCase();

    const monthPatterns = [
        { re: /(มกราคม|ม\.ค\.)/, month: 1 },
        { re: /(กุมภาพันธ์|ก\.พ\.)/, month: 2 },
        { re: /(มีนาคม|มี\.ค\.)/, month: 3 },
        { re: /(เมษายน|เม\.ย\.)/, month: 4 },
        { re: /(พฤษภาคม|พ\.ค\.)/, month: 5 },
        { re: /(มิถุนายน|มิ\.ย\.)/, month: 6 },
        { re: /(กรกฎาคม|ก\.ค\.)/, month: 7 },
        { re: /(สิงหาคม|ส\.ค\.)/, month: 8 },
        { re: /(กันยายน|ก\.ย\.)/, month: 9 },
        { re: /(ตุลาคม|ต\.ค\.)/, month: 10 },
        { re: /(พฤศจิกายน|พ\.ย\.)/, month: 11 },
        { re: /(ธันวาคม|ธ\.ค\.)/, month: 12 },
    ];

    let month = null;
    for (const m of monthPatterns) {
        if (m.re.test(normalized)) {
            month = m.month;
            break;
        }
    }

    if (!month) {
        console.warn("Cannot detect month from sheet:", originalName);
        return { sheetName: originalName, index, month: null, year: null, hasYear: false };
    }

    let year = null;
    let hasYear = false;

    // พ.ศ. 4 หลัก เช่น 2566
    const y4 = normalized.match(/25(\d{2})/);
    if (y4) {
        const be = 2500 + parseInt(y4[1], 10);
        year = be - 543; // แปลงเป็น ค.ศ.
        hasYear = true;
    } else {
        // เลข 2 หลักท้าย เช่น 66, 67
        const y2 = normalized.match(/(\d{2})$/);
        if (y2) {
            const be = 2500 + parseInt(y2[1], 10);
            year = be - 543;
            hasYear = true;
        }
    }

    return { sheetName: originalName, index, month, year, hasYear };
}

// override manual สำหรับชื่อที่สะกดต่างกัน เช่น "บ้านผาบือ" vs "ผ่าบือ"
const locationOverrideMap = {
    // ตัวอย่าง (คุณเพิ่มเองได้เรื่อย ๆ)
    "บ้านห้วยน้ำขุ่น ม.1": "ห้วยน้ำขุ่น (หมู่1)",
    "บ้านผาบือ": "ผ่าบือ",
};


// User Verification Middleware
const verifyUser = (req, res, next) => {
    try {
        let token = req.cookies.token;

        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        if (!token) {
            return res.status(401).json({ error: "You are not authenticated" });
        }

        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            console.error("JWT_SECRET_KEY is missing in environment variables.");
            return res.status(500).json({ error: "Server configuration error" });
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.error("JWT verification error:", err.message);
                return res.status(403).json({ error: "Token is not valid or expired" });
            }

            if (!decoded.coll_id) {
                return res.status(400).json({ error: "Invalid token format" });
            }

            req.name = decoded.name;
            req.coll_id = decoded.coll_id;
            next();
        });

    } catch (error) {
        console.error("Unexpected error in verifyUser:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// HomeCollector Page
router.get('/homecollector', verifyUser, (req, res) => {
    const { dataSet, locationId, mode, date, type } = req.query;

    if (!date) return res.status(400).json({ error: "Date is required" });

    let baseQuery = `SELECT wt.wasteType_name, SUM(caw.caw_wasteTotal) as total
    FROM collectorAddWeights caw
    JOIN wasteTypes wt ON caw.caw_wasteType = wt.wasteType_id
    JOIN locations l ON caw.caw_location = l.id`;

    let conditions = [];
    let params = [];

    if (dataSet === 'village') {
        conditions.push('l.type = "village"');
    } else if (dataSet === 'agency') {
        conditions.push('l.type = "agency"');
    } else if (dataSet === 'all') {
        conditions.push('(l.type = "agency" OR l.type = "village")');
    }

    if (locationId) {
        conditions.push('l.id = ?');
        params.push(locationId);
    }

    if (mode === 'day') {
        conditions.push('DATE(caw.caw_date) = ?');
        params.push(date);
    } else if (mode === 'month') {
        conditions.push('MONTH(caw.caw_date) = ? AND YEAR(caw.caw_date) = ?');
        const [year, month] = date.split('-');
        params.push(month, year);
    } else if (mode === 'year') {
        conditions.push('YEAR(caw.caw_date) = ?');
        params.push(date);
    }

    if (conditions.length > 0) {
        baseQuery += ' WHERE ' + conditions.join(' AND ');
    }

    baseQuery += ' GROUP BY wt.wasteType_name';

    db.query(baseQuery, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json({status: "success", results: results, coll_id: req.coll_id });
    });
});

// Get locations by type for get Waste data using with home page
router.get('/home-locations', verifyUser, (req, res) => {
    const { type } = req.query;

    let query = 'SELECT * FROM locations ORDER BY id ASC';
    let params = [];

    // Modify the query based on the 'type'
    if (type && type !== 'all') {
        if (!['village', 'agency'].includes(type)) {
            return res.status(400).json({ error: 'Invalid type' });
        }
        query = `SELECT * FROM locations WHERE type = ? ORDER BY id ASC`;
        params.push(type);
    }

    // Execute the query
    db.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json({ status: "success", results: results, coll_id: req.coll_id });
    });
});

// Get Waste data from villager added
router.get('/wastedatacollector', verifyUser, (req, res) => {
  const { type, search } = req.query;
  if (!type || !search) {
      return res.status(400).json({ message: 'Missing type or search' });
  }

  if (type !== 'หมู่บ้าน' && type !== 'หน่วยงาน') {
      return res.status(400).json({ message: 'Invalid type' });
  }

  const roleName = type === 'หมู่บ้าน' ? 'ตัวแทนหมู่บ้าน' : 'ตัวแทนหน่วยงานราชการ';
  const getVillIdQuery = `SELECT villagers.vill_id
      FROM villagers
      JOIN details ON villagers.details_id = details.id
      JOIN roles ON details.role = roles.role_id
      WHERE roles.role_name = ? AND villagers.vill_descriptionRole LIKE ?
      LIMIT 1`;

  db.query(getVillIdQuery, [roleName, '%' + search + '%'], (err, villResult) => {
      if (err) {
          console.error('Error fetching vill_id:', err.sqlMessage || err);
          return res.status(500).json({ message: 'Error fetching vill_id', error: err.sqlMessage || err });
      }
      if (villResult.length === 0) {
          return res.status(404).json({ message: 'No villager found with given search' });
      }

      const vill_id = villResult[0].vill_id;

      const query1 = `SELECT vaw_date, vaw_time, wasteTypes.wasteType_name, subWasteTypes.subWasteType_name, vaw_wasteTotal
          FROM villagerAddWeights
          JOIN wasteTypes ON villagerAddWeights.vaw_wasteType = wasteTypes.wasteType_id
          LEFT JOIN subWasteTypes ON villagerAddWeights.vaw_subWasteType = subWasteTypes.subWasteType_id
          WHERE villagerAddWeights.vill_id = ?`;

      db.query(query1, [vill_id], (err, result) => {
          if (err) {
              console.error('Error executing query:', err.sqlMessage || err);
              return res.status(500).json({ message: 'Error searching data(1)', error: err.sqlMessage || err });
          }

          const nameQuery = `SELECT vill_descriptionRole FROM villagers WHERE vill_id = ?`;
          db.query(nameQuery, [vill_id], (err, nameResult) => {
              if (err) {
                  return res.status(500).json({ message: 'Error searching data(2)', error: err.sqlMessage || err });
              }
              const name = nameResult[0]?.vill_descriptionRole;
              return res.status(200).json({ status: "success", name: name, data: result, coll_id: req.coll_id });
          });
      });
  });
});

// Select descriptionRole from villagers table for show waste data Villager or Agency
router.get('/waste-options', verifyUser, (req, res) => {
  try {
      const { type } = req.query;

      const roleMap = {
          'หมู่บ้าน': 'ตัวแทนหมู่บ้าน',
          'หน่วยงาน': 'ตัวแทนหน่วยงานราชการ'
      };
      const roleName = roleMap[type];

      if (!roleName) {
          return res.status(400).json({ message: 'Invalid or missing type' });
      }

      const query = `SELECT villagers.vill_descriptionRole
          FROM villagers
          JOIN details ON villagers.details_id = details.id
          JOIN roles ON details.role = roles.role_id
          WHERE roles.role_name = ?
          ORDER BY villagers.vill_descriptionRole;`;

      db.query(query, [roleName], (err, results) => {
          if (err) {
              console.error('Error fetching options:', err);
              return res.status(500).json({ message: 'Error fetching options' });
          }

          if (!Array.isArray(results) || results.length === 0) {
              return res.status(404).json({ message: 'No options found' });
          }

          const options = results.map(row => row.vill_descriptionRole);
          res.status(200).json({ options: options, coll_id: req.coll_id });
      });

  } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


// Get Adding Waste Data from Collector
router.get('/addingwastecollector', verifyUser, (req, res) => {
    const getCollectors = "SELECT * FROM collectoraddweights WHERE coll_id  = ?";
    db.query(getCollectors, [req.coll_id], (err, result) => {
        if (err) return res.status(500).json({ error: "Cannot refresh from server", collectoraddweights: null });
        res.status(200).json({ status: "success", message: "Refresh Success", collectoraddweights: result, coll_id: req.coll_id });
    });
});

// Adding Waste Data from collectors
router.post('/addingwastecollector', verifyUser, (req, res) => {
    const { caw_date, caw_wasteType, caw_subWasteType, caw_wasteTotal, caw_description, caw_location } = req.body;
    const requiredFields = [caw_date, caw_wasteType, caw_wasteTotal, caw_location];

    if (requiredFields.some(field => {
        return field === undefined || field === null ||
                (typeof field === 'string' && field.trim() === "") ||
                (typeof field === 'number' && isNaN(field))
    })) {
        return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    if (!caw_date || isNaN(Date.parse(caw_date))) {
        return res.status(400).json({ error: "Invalid date format" });
    }

    console.log("Received Data:", { caw_date, caw_wasteType, caw_subWasteType, caw_wasteTotal, caw_description, caw_location });

    const addWeightQuery1 = `INSERT INTO collectorAddWeights
        (caw_date, caw_time, caw_wasteType, caw_subWasteType, caw_wasteTotal, caw_description, coll_id, caw_location)
        VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)`;

    db.query(addWeightQuery1, [caw_date, caw_wasteType, caw_subWasteType, caw_wasteTotal, caw_description, req.coll_id, caw_location], (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: "Server Error", collectorAddWeights: null });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: "Failed to add collector data" });
        }

        const getUpdatedData1 = "SELECT * FROM collectorAddWeights WHERE coll_id = ?";
        db.query(getUpdatedData1, [req.coll_id], (err, updatedResult1) => {
            if (err) {
                console.error("Error fetching updated data:", err);
                return res.status(500).json({ error: "Cannot fetch updated data", collectorAddWeights: null });
            }

            res.status(200).json({
                status: "success",
                message: "Data added successfully",
                collectorAddWeights: updatedResult1,
                coll_id: req.coll_id
            });
        });
    });
});

// Get locations by type
router.get("/locations", verifyUser, (req, res) => {
    const type = req.query.village === "true" ? "village" : "agency";
    const getLocationsQuery = "SELECT * FROM locations WHERE type = ?";

    db.query(getLocationsQuery, [type], (err, rows) => {
        if (err) {
            console.error("Error fetching locations:", err);
            return res.status(500).json({ error: "Database Error" });
        }
        res.status(200).json({status: "success", rows: rows, coll_id: req.coll_id });
    });
});

// Get Waste data from collector added
router.get('/dashboard', verifyUser, (req, res) => {
    const { dataSet, locationId, mode, date } = req.query;

    if (!date) return res.status(400).json({ error: "Date is required" });

    let baseQuery = `SELECT wt.wasteType_name, SUM(caw.caw_wasteTotal) as total
    FROM collectorAddWeights caw
    JOIN wasteTypes wt ON caw.caw_wasteType = wt.wasteType_id
    JOIN locations l ON caw.caw_location = l.id`;

    let conditions = [];
    let params = [];

    if (dataSet === 'village') {
        conditions.push('l.type = "village"');
    } else if (dataSet === 'agency') {
        conditions.push('l.type = "agency"');
    }

    if (dataSet !== 'all' && locationId) {
        conditions.push('l.id = ?');
        params.push(locationId);
    }

    if (mode === 'day') {
        conditions.push('DATE(caw.caw_date) = ?');
        params.push(date);
    } else if (mode === 'month') {
        conditions.push('MONTH(caw.caw_date) = ? AND YEAR(caw.caw_date) = ?');
        const [month, year] = date.split('-');
        params.push(month, year);
    } else if (mode === 'year') {
        conditions.push('YEAR(caw.caw_date) = ?');
        params.push(date);
    }

    if (conditions.length > 0) {
        baseQuery += ' WHERE ' + conditions.join(' AND ');
    }
    
    baseQuery += ' GROUP BY wt.wasteType_name';
    
    db.query(baseQuery, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json({status: "success", results: results, coll_id: req.coll_id });
    });
});

// Get locations by type for get Waste data
router.get('/dashboard-locations', verifyUser, (req, res) => {
    const { type } = req.query;

    if (!['village', 'agency'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    const query = `SELECT id, name FROM locations WHERE type = ? ORDER BY id ASC`;

    db.query(query, [type], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json({status: "success", results: results, coll_id: req.coll_id });
    });
});

// verify user login before get data added from collector
router.get('/verify', verifyUser, (req, res) => {
    res.json({
        status: "success",
        coll_id: req.coll_id
    });
});

// Profile Collector
router.get('/profile-collector/:coll_id', verifyUser, (req, res) => {
  const coll_id = req.coll_id;

  if (!req.coll_id) {
      return res.status(400).json({ error: "coll_id is missing from the token" });
  }

  const sql = `SELECT collectors.coll_profileImage, coll_fullName, roles.role_name, details.phone
      FROM collectors
      JOIN details ON collectors.details_id = details.id
      JOIN roles ON details.role = roles.role_id
      WHERE collectors.coll_id = ?`;

  db.query(sql, [coll_id], (err, result) => {
      if (err) {
          return res.status(500).json({ Error: "Database query error" });
      }
      if (result.length === 0) {
          return res.status(404).json({ Error: "Collector not found" });
      }
      return res.status(200).json({ status: "success", data: result[0], coll_id: req.coll_id });
  });
});

// Update Profile Collector
router.put('/update-profile-collector/:coll_id', verifyUser, upload.single('profileImage'), (req, res) => {
  const coll_id = req.coll_id;
  const { fullName, role, phone } = req.body;
  const profileImage = req.file ? `${req.file.filename}` : null;

  let sql1 = `UPDATE collectors
      JOIN details ON collectors.details_id = details.id
      SET collectors.coll_fullName = ?, details.role = ?, details.phone = ?`;

  const values = [fullName, role, phone];

  if (profileImage) {
      sql1 += `, collectors.coll_profileImage = ?`;
      values.push(profileImage);
  }

  sql1 += ` WHERE collectors.coll_id = ?`;
  values.push(coll_id);

  db.query(sql1, values, (err, result) => {
      if (err) {
          return res.status(500).json({ Error: err.message });
      }
      return res.status(200).json({ status: "success", coll_id: req.coll_id });
  });
});

// GET all categories (for main categorycollector page)
router.get('/categorycollector', verifyUser, (req, res) => {
    const search = req.query.search || '';

    const query = `
        SELECT * FROM waste_categories 
        WHERE name LIKE ? OR description LIKE ?
    `;

    db.query(query, [`%${search}%`, `%${search}%`], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json({
            status: "success",
            results: result,
            coll_id: req.coll_id
        });
    });
});
// GET: collector waste by type  
router.get('/wastecollector/type/:type', verifyUser, (req, res) => {
    const type = req.params.type.toLowerCase();

    const validTypes = [
        "bathroom", "big", "composable",
        "dirty", "energyrdf", "hazardous",
        "recycle"
    ];

    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: "Invalid waste type" });
    }

    db.query(`SELECT * FROM waste_categories WHERE type = ?`, [type], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json({
            status: "success",
            results: result,
            coll_id: req.coll_id
        });
    });
});


// ตารางรถขยะ (Collector)
const garbageDataCollector = {
    Mondaycollector: {
        dayName: 'วันจันทร์',
        type: 'ขยะเปื้อน / เปียกน้ำ',
        themeColor: '#EAB308',
        icon: 'bi-droplet-fill',
        heading: 'ประเภทขยะเปื้อนและเปียกน้ำ',
        description: 'ขยะที่มีการปนเปื้อนสารอินทรีย์ หรือเปียกชื้น ไม่สามารถนำไปรีไซเคิลได้ง่าย',
        link: '/schedule/mondaycollector'
    },
    Tuesdaycollector: {
        dayName: 'วันอังคาร',
        type: 'ขยะเชื้อเพลิง / พลังงาน',
        themeColor: '#DB2777',
        icon: 'bi-lightning-charge-fill',
        heading: 'ประเภทขยะเชื้อเพลิง (RDF)',
        description: 'ขยะแห้งที่ผ่านการคัดแยกแล้ว สามารถนำไปเป็นเชื้อเพลิงทดแทน',
        link: '/schedule/tuesdaycollector'
    },
    Wednesdaycollector: {
        dayName: 'วันพุธ',
        type: 'ขยะห้องน้ำ',
        themeColor: '#16A34A',
        icon: 'bi-trash-fill',
        heading: 'ประเภทขยะห้องน้ำ',
        description: 'ขยะทั่วไปที่เกิดจากการใช้งานสุขอนามัย',
        link: '/schedule/wednesdaycollector'
    },
    Fridaycollector: {
        dayName: 'วันศุกร์',
        type: 'ขยะอันตราย',
        specialTag: 'ระวังอันตราย',
        themeColor: '#2563EB',
        icon: 'bi-exclamation-triangle-fill',
        heading: 'ประเภทขยะอันตราย',
        description: 'ขยะที่มีสารปนเปื้อนวัตถุอันตราย ห้ามทิ้งรวมกับขยะอื่น',
        link: '/schedule/fridaycollector'
    }
};

// Route ตารางรถขยะทั้งหมด
router.get('/garbagetruckschedulecollector', (req, res) => {
    res.status(200).json({
        status: "success",
        data: garbageDataCollector
    });
});

// Route รายวันแบบถูกต้อง!!
router.get('/schedule/mondaycollector', (req, res) =>
    res.json({ status: "success", data: garbageDataCollector.Mondaycollector })
);

router.get('/schedule/tuesdaycollector', (req, res) =>
    res.json({ status: "success", data: garbageDataCollector.Tuesdaycollector })
);

router.get('/schedule/wednesdaycollector', (req, res) =>
    res.json({ status: "success", data: garbageDataCollector.Wednesdaycollector })
);

router.get('/schedule/fridaycollector', (req, res) =>
    res.json({ status: "success", data: garbageDataCollector.Fridaycollector })
);


//get wastepricecollector
router.get('/wastepricecollector',verifyUser, (req, res) => {
  return res.status(200).json({ status: "success" });
})


// UPLOAD EXCEL (SMART TIMELINE + SMART LOCATION + วันจันทร์/อ./พ./ศ.)
router.post("/upload-excel", verifyUser, uploadExcel.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" }); // ไม่มีไฟล์อัปโหลด
        }

        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });

        // === 1) อ่านข้อมูล META ของชื่อชีต (Parse Sheet Meta: month/year) ===
        let sheetMetas = workbook.SheetNames.map((name, idx) =>
            parseSheetName(name, idx)
        ).filter((m) => m.month !== null);  // เอาเฉพาะชีตที่เจอเดือนจริง

        if (sheetMetas.length === 0) {
            return res.status(400).json({ error: "Cannot detect any month" }); // หาเดือนไม่เจอ
        }

        // === เติมปีถ้าชีตไม่ระบุปี โดยใช้ปีของชีตก่อนหน้า (Fill missing years by previous sheet) ===
        let lastYear = null;
        for (const meta of sheetMetas) {
            if (meta.year != null) lastYear = meta.year;
            else if (lastYear != null) meta.year = lastYear;
        }

        // === เติมปีจากชีตในอนาคต (Back-fill missing by future context) ===
        for (let i = 0; i < sheetMetas.length; i++) {
            const meta = sheetMetas[i];
            if (meta.year == null) {
                let future = null;
                for (let j = i + 1; j < sheetMetas.length; j++) {
                    if (sheetMetas[j].year != null) {
                        future = sheetMetas[j];
                        break;
                    }
                }
                if (future) {
                    // ถ้าเดือนปัจจุบัน ≤ เดือนที่เจอในอนาคต → ถือเป็นปีเดียวกัน
                    // ถ้ามากกว่า → แปลว่าข้ามปี (ปีใหม่)
                    if (meta.month <= future.month) meta.year = future.year;
                    else meta.year = future.year - 1;
                }
            }
        }

        // === กรองเฉพาะชีตที่มีปีครบ และเรียงลำดับตาม timeline จริง ===
        sheetMetas = sheetMetas.filter((m) => m.year != null);
        sheetMetas.sort((a, b) =>
            a.year === b.year ? a.month - b.month : a.year - b.year
        );

        // === โหลดรายชื่อ location ทั้งหมดจาก DB (Smart Location Matching) ===
        const locRows = await query("SELECT id, name FROM locations");

        let totalInserted = 0;

        // === 2) เริ่มประมวลผลทีละชีต (Process each sheet) ===
        for (const meta of sheetMetas) {
            const { sheetName, month, year } = meta;
            const sheet = workbook.Sheets[sheetName];
            if (!sheet) continue;

            // ลบข้อมูลเดิมของ collector ในเดือนนี้ (Delete old data of this month)
            await query(
                `DELETE FROM collectoraddweights
                 WHERE coll_id = ? AND MONTH(caw_date)=? AND YEAR(caw_date)=?`,
                [req.coll_id, month, year]
            );

            // อ่านข้อมูลชีตแบบ Matrix (Raw Matrix) — ใช้แก้ปัญหาคอลัมน์เคลื่อน
            const range = XLSX.utils.decode_range(sheet["!ref"]);
            let matrix = [];

            for (let r = range.s.r; r <= range.e.r; r++) {
                let row = [];
                for (let c = range.s.c; c <= range.e.c; c++) {
                    const cellAddr = XLSX.utils.encode_cell({ r, c });
                    const cell = sheet[cellAddr];
                    row.push(cell ? cell.v : ""); // ถ้าเซลล์ว่างให้ใส่ ""
                }
                matrix.push(row);
            }

            if (matrix.length < 3) continue;

            // === หาหัวคอลัมน์ที่เป็นวันที่ (Header Row: date of month) ===
            const headerRow = matrix[1];

            const dayCols = [];
            for (let c = 0; c < headerRow.length; c++) {
                const d = parseInt(headerRow[c], 10);
                if (!isNaN(d) && d > 0 && d <= 31) {
                    dayCols.push({ col: c, day: d }); // เก็บ index ของคอลัมน์ที่เป็นวันที่จริง
                }
            }
            if (dayCols.length === 0) continue;

            // === Loop ทีละแถวของสถานที่ (Village/Agency rows) ===
            for (let r = 2; r < matrix.length; r++) {
                const row = matrix[r];
                const rawLoc = row[1] ? String(row[1]).trim() : "";
                if (!rawLoc) continue;

                // Smart location matching (จับคู่ชื่อสถานที่)
                const matched = smartMatchLocation(rawLoc, locRows);
                if (!matched) {
                    console.log("NO LOCATION MATCH:", rawLoc);
                    continue;
                }
                const locationId = matched.id;

                // === Loop ทีละวันที่ (Daily loop per location row) ===
                for (const dcol of dayCols) {
                    const weight = parseFloat(row[dcol.col]);
                    if (!weight || isNaN(weight)) continue; // ข้ามถ้าไม่มีข้อมูลน้ำหนัก

                    const day = dcol.day;

                    // สร้างวันที่แบบไม่เหลื่อมวัน (Fix timezone date shift)
                    const caw_date = excelDayToDate(day, year, month);

                    // ตรวจสอบวันในสัปดาห์ (Check day of week)
                    // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, ..., 6 = Sat
                    const dow = new Date(year, month - 1, day).getDay();

                    let wasteType = null;
                    if (dow === 1) wasteType = 1;       // จันทร์ → ขยะเปื้อน
                    else if (dow === 2) wasteType = 3;  // อังคาร → ขยะพลังงาน
                    else if (dow === 3) wasteType = 2;  // พุธ → ขยะห้องน้ำ
                    else if (dow === 5) wasteType = 4;  // ศุกร์ → ขยะอันตราย
                    else continue; // วันอื่นไม่เก็บ

                    // INSERT ข้อมูลลงฐานข้อมูล
                    await query(
                        `INSERT INTO collectoraddweights
                         (caw_date, caw_time, caw_wasteType, caw_subWasteType,
                          caw_wasteTotal, caw_description, coll_id, caw_location)
                         VALUES (?, NOW(), ?, NULL, ?, '', ?, ?)`,
                        [caw_date, wasteType, weight, req.coll_id, locationId]
                    );

                    totalInserted++;
                }
            }
        }

        // === ส่งผลกลับไป frontend ===
        return res.status(200).json({
            status: "success",
            message: `Upload completed: ${totalInserted} records`, // อัปโหลดสำเร็จทั้งหมดกี่รายการ
            coll_id: req.coll_id
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Upload failed" }); // อัปโหลดล้มเหลว
    }
});


module.exports = router;