require("dotenv").config();
const express = require("express");
const { login, verifyAdmin } = require("../controllers/login");
const logout = require("../controllers/logout");
const register = require("../controllers/register");
const forgot = require('../controllers/forgotpassword');
const router = express.Router();
const upload = require("./upload");
const db = require("./db-config");

// Routes
router.get("/register", (req, res) => res.json({ Status: "null", name: null }));
router.get("/login", (req, res) => res.json({ Status: "null", name: null }));
router.get("/logout", logout);
router.post("/login", login);
router.post("/verifyAdmin", verifyAdmin)
router.post("/register", upload.single('profileImage'), register);

router.post('/request-otp', forgot.requestOtp);
router.post('/verify-otp', forgot.verifyOtp);
router.post('/reset-password', forgot.resetPassword);

router.get('/', (req, res) => {
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
        res.status(200).json({status: "success", results: results });
    });
  });
  
  // Get locations by type for get Waste data using with home page
  router.get('/home-locations', (req, res) => {
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
        res.status(200).json({ status: "success", results: results  });
    });
  });

  // Get Waste data from villager added
router.get('/wastedata', (req, res) => {
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
                return res.status(200).json({ status: "success", name: name, data: result });
            });
        });
    });
  });
  
  // Select descriptionRole from villagers table for show waste data Villager or Agency
  router.get('/waste-options', (req, res) => {
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
            res.status(200).json({ options: options });
        });
  
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  });
  
// Get Waste data from collector added
router.get('/dashboard', (req, res) => {
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
        res.status(200).json({status: "success", results: results });
    });
});


// Get locations by type for get Waste data
router.get('/dashboard-locations', (req, res) => {
    const { type } = req.query;

    if (!['village', 'agency'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    const query = `SELECT id, name FROM locations WHERE type = ? ORDER BY id ASC`;

    db.query(query, [type], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json({status: "success", results: results });
    });
});

// verify user login before get data added from collector
router.get('/verify',(req, res) => {
    res.json({
        status: "success"
    });
});

//get wasteprice
router.get('/waste-price', (req, res) => {
    return res.status(200).json({ status: "success" });
  })


// ตารางรถขยะ (Guest)
const garbageDataGuest = {
    Monday: {
        dayName: 'วันจันทร์',
        type: 'ขยะเปื้อน / เปียกน้ำ',
        themeColor: '#EAB308',
        icon: 'bi-droplet-fill',
        heading: 'ประเภทขยะเปื้อนและเปียกน้ำ',
        description: 'ขยะที่มีการปนเปื้อนสารอินทรีย์ หรือเปียกชื้น ไม่สามารถนำไปรีไซเคิลได้ง่าย',
        link: '/schedule/monday'
    },
    Tuesday: {
        dayName: 'วันอังคาร',
        type: 'ขยะเชื้อเพลิง / พลังงาน',
        themeColor: '#DB2777',
        icon: 'bi-lightning-charge-fill',
        heading: 'ประเภทขยะเชื้อเพลิง (RDF)',
        description: 'ขยะแห้งที่ผ่านการคัดแยกแล้ว สามารถนำไปเป็นเชื้อเพลิงทดแทน',
        link: '/schedule/tuesday'
    },
    Wednesday: {
        dayName: 'วันพุธ',
        type: 'ขยะห้องน้ำ',
        themeColor: '#16A34A',
        icon: 'bi-trash-fill',
        heading: 'ประเภทขยะห้องน้ำ',
        description: 'ขยะทั่วไปที่เกิดจากการใช้งานสุขอนามัย',
        link: '/schedule/wednesday'
    },
    Friday: {
        dayName: 'วันศุกร์',
        type: 'ขยะอันตราย',
        specialTag: 'ระวังอันตราย',
        themeColor: '#2563EB',
        icon: 'bi-exclamation-triangle-fill',
        heading: 'ประเภทขยะอันตราย',
        description: 'ขยะที่มีสารปนเปื้อนวัตถุอันตราย ห้ามทิ้งรวมกับขยะอื่น',
        link: '/schedule/friday'
    }
};

// Route ตารางรถขยะทั้งหมด
router.get('/garbagetruckschedule', (req, res) => {
    res.status(200).json({ status: "success", data: garbageDataGuest });
});

// Route รายวัน
router.get('/schedule/monday', (req, res) => res.json({ status: "success", data: garbageDataGuest.Monday }));
router.get('/schedule/tuesday', (req, res) => res.json({ status: "success", data: garbageDataGuest.Tuesday }));
router.get('/schedule/wednesday', (req, res) => res.json({ status: "success", data: garbageDataGuest.Wednesday }));
router.get('/schedule/friday', (req, res) => res.json({ status: "success", data: garbageDataGuest.Friday }));

// GET: Category list (for /category)
router.get('/category', (req, res) => {
    const search = req.query.search || '';

    const query = `
        SELECT * FROM waste_categories
        WHERE name LIKE ? OR description LIKE ?
    `;

    db.query(query, [`%${search}%`, `%${search}%`], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json({
            status: "success",
            results: result
        });
    });
});

// GET: waste category detail by type
router.get('/waste/type/:type', (req, res) => {
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
            results: result
        });
    });
});

//RecycleWaste
// -------------------- Sell Waste --------------------
router.get('/sellwaste/:category', (req, res) => {
    const category = req.params.category.toLowerCase();
    const categoryMap = { glass: 1, plastic: 2, metal: 3, paper: 4 };
    const subWasteTypeId = categoryMap[category];
    if (!subWasteTypeId) return res.status(400).json({ status: "error", message: "Invalid category" });

    const sql = `
        SELECT item_id, item_name, price_per_kg
        FROM recycle_waste_items
        WHERE subWasteType_id = ?
    `;

    db.query(sql, [subWasteTypeId], (err, rows) => {
        if (err) return res.status(500).json({ status: "error", message: "Server error" });
        res.status(200).json({ status: "success", data: rows });
    });
});
  
module.exports = router;