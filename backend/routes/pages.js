require("dotenv").config();
const express = require("express");
const login = require("../controllers/login");
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
router.post("/register", upload.single('profileImage'), register);

// Home Page
router.get('/', (req, res) => {
    return res.status(200).json({ status: "success" });
})

// Waste Data Page from Villager or Agency
router.get('/waste-data', (req, res) => {
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

module.exports = router;