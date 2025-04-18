require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("./db-config");
const upload = require("./upload");



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
          JOIN subWasteTypes ON villagerAddWeights.vaw_subWasteType = subWasteTypes.subWasteType_id
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
        coll_id: req.coll_id,
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


// Get all waste categories
router.get('/category', verifyUser, (req, res) => {
  const search = req.query.search || '';
  const query = `SELECT * FROM waste_categories WHERE name LIKE ? OR description LIKE ?`;

  const values = [`%${search}%`, `%${search}%`];

  db.query(query, values, (err, result) => {
      if (err) {
          return res.status(500).json({ Error: err.message });
      }
      return res.status(200).json({
          status: "success",
          results: result,
          coll_id: req.coll_id,
      });
  });
});;


//get all category

router.get('/DirtyGarbage', verifyUser, (req, res) => {
  if (!req.coll_id) {
      return res.status(400).json({ error: "coll_id is missing from the token" });
  }
  return res.status(200).json({ status: "success", name: req.name, coll_id: req.coll_id });
});

router.get('/GarbageSell', verifyUser, (req, res) => {
  if (!req.coll_id) {
      return res.status(400).json({ error: "coll_id is missing from the token" });
  }
  return res.status(200).json({ status: "success", name: req.name, coll_id: req.coll_id });
});

router.get('/ComposableGarbage', verifyUser, (req, res) => {
  if (!req.coll_id) {
      return res.status(400).json({ error: "coll_id is missing from the token" });
  }
  return res.status(200).json({ status: "success", name: req.name, coll_id: req.coll_id });
});

router.get('/EnergyRDFwaste', verifyUser, (req, res) => {
  if (!req.coll_id) {
      return res.status(400).json({ error: "coll_id is missing from the token" });
  }
  return res.status(200).json({ status: "success", name: req.name, coll_id: req.coll_id });
});

router.get('/HazardousGarbage', verifyUser, (req, res) => {
  if (!req.coll_id) {
      return res.status(400).json({ error: "coll_id is missing from the token" });
  }
  return res.status(200).json({ status: "success", name: req.name, coll_id: req.coll_id });
});


router.get('/BathroomGarbage', verifyUser, (req, res) => {
  if (!req.coll_id) {
      return res.status(400).json({ error: "coll_id is missing from the token" });
  }
  return res.status(200).json({ status: "success", name: req.name, coll_id: req.coll_id });
});


router.get('/BigGarbage', verifyUser, (req, res) => {
  if (!req.coll_id) {
      return res.status(400).json({ error: "coll_id is missing from the token" });
  }
  return res.status(200).json({ status: "success", name: req.name, coll_id: req.coll_id });
});


//get GarbageTruckSchedule
router.get('/garbagetruckschedulecollector', verifyUser, (req, res) => {
  if (!req.coll_id) {
      return res.status(400).json({ error: "coll_id is missing from the token" });
  }
  return res.status(200).json({ status: "success", name: req.name, coll_id: req.coll_id });
});

router.get('/garbageData', verifyUser, (req, res) => {
  if (!req.coll_id) {
      return res.status(400).json({ error: "coll_id is missing from the token" });
  }
  return res.status(200).json({ status: "success", name: req.name, coll_id: req.coll_id });
});

//get wastepricecollector
router.get('/wastepricecollector',verifyUser, (req, res) => {
  return res.status(200).json({ status: "success" });
})



module.exports = router;

