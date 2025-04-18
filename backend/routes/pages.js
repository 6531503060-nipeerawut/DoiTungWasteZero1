require("dotenv").config();
const express = require("express");
const { login, verifyAdmin } = require("../controllers/login");
const logout = require("../controllers/logout");
const register = require("../controllers/register");
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
        // ถ้าเป็น 'all' ไม่ต้องกรองตามสถานที่
        // ไม่ต้องเพิ่มเงื่อนไข
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

  //get garbagetruckschedule
router.get('/garbagetruckschedule', (req, res) => { 
  return res.status(200).json({ status: "success"});
});

router.get('/garbageData', (req, res) => {
  return res.status(200).json({ status: "success"});
});

//get all category
router.get('/BathroomWaste', (req, res) => {
    return res.status(200).json({ status: "success", name: req.name});
  });

  router.get('/bigwaste', (req, res) => {
    return res.status(200).json({ status: "success"});
  });
  
  router.get('/composablewaste', (req, res) => {
    return res.status(200).json({ status: "success"});
  });

  router.get('/dirtywaste', (req, res) => {
    return res.status(200).json({ status: "success" });
  });

  router.get('/EnergyRDFwaste', (req, res) => {
    return res.status(200).json({ status: "success" });
  });

  router.get('/SellWaste', (req, res) => {
    return res.status(200).json({ status: "success" });
  });

  router.get('/hazardouswaste', (req, res) => {
    return res.status(200).json({ status: "success" });
  })

  // Get all waste categories
router.get('/category', (req, res) => {
    const search = req.query.search || '';
    const query = `SELECT * FROM waste_categories WHERE name LIKE ? OR description LIKE ?`;
  
    const values = [`%${search}%`, `%${search}%`];
  
    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ Error: err.message });
        }
        return res.status(200).json({
            status: "success",
            results: result
        });
    });
  });;

module.exports = router;