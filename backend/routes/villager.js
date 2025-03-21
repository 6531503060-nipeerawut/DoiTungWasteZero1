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

            if (!decoded.vill_id) {
                return res.status(400).json({ error: "Invalid token format" });
            }

            req.name = decoded.name;
            req.vill_id = decoded.vill_id;
            next();
        });

    } catch (error) {
        console.error("Unexpected error in verifyUser:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// HomeVillager Page
router.get('/homevillager', verifyUser, (req, res) => {
    if (!req.vill_id) {
        return res.status(400).json({ error: "vill_id is missing from the token" });
    }
    return res.status(200).json({ status: "success", name: req.name, vill_id: req.vill_id });
});

// Get Adding Waste Data from Villager
router.get('/addingwastevillager', verifyUser, (req, res) => {
    const getVillager = "SELECT * FROM villagerAddWeights WHERE vill_id = ?";
    db.query(getVillager, [req.vill_id], (err, result) => {
        if (err) return res.status(500).json({ error: "Cannot refresh from server", villagerAddWeights: null });
        res.status(200).json({ status: "success", message: "Refresh Success", villagerAddWeights: result, vill_id: req.vill_id });
    });
});

// Adding Waste Data from Villager
router.post('/addingwastevillager', verifyUser, (req, res) => {
    const { vaw_date, vaw_wasteType, vaw_subWasteType, vaw_wasteTotal, vaw_description } = req.body;
    const requiredFields = [vaw_date, vaw_wasteType, vaw_subWasteType, vaw_wasteTotal];

    if (requiredFields.some(field => {
        return field === undefined || field === null ||
                (typeof field === 'string' && field.trim() === "") ||
                (typeof field === 'number' && isNaN(field))
    })) {
        return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    if (!vaw_date || isNaN(Date.parse(vaw_date))) {
        return res.status(400).json({ error: "Invalid date format" });
    }

    console.log("Received Data:", { vaw_date, vaw_wasteType, vaw_subWasteType, vaw_wasteTotal, vaw_description });

    const addWeightQuery = `INSERT INTO villagerAddWeights
        (vaw_date, vaw_time, vaw_wasteType, vaw_subWasteType, vaw_wasteTotal, vaw_description, vill_id)
        VALUES (?, NOW(), ?, ?, ?, ?, ?)`;

    db.query(addWeightQuery, [vaw_date, vaw_wasteType, vaw_subWasteType, vaw_wasteTotal, vaw_description, req.vill_id], (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: "Server Error", villagerAddWeights: null });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: "Failed to add village data" });
        }

        const getUpdatedData = "SELECT * FROM villagerAddWeights WHERE vill_id = ?";
        db.query(getUpdatedData, [req.vill_id], (err, updatedResult) => {
            if (err) {
                console.error("Error fetching updated data:", err);
                return res.status(500).json({ error: "Cannot fetch updated data", villagerAddWeights: null });
            }

            res.status(200).json({
                status: "success",
                message: "Data added successfully",
                villagerAddWeights: updatedResult,
                vill_id: req.vill_id
            });
        });
    });
});

// Get Waste data from villager added
router.get('/wastedatavillager', verifyUser, (req, res) => {
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
                return res.status(200).json({ status: "success", name: name, data: result, vill_id: req.vill_id });
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
            res.status(200).json({ options: options, vill_id: req.vill_id });
        });

    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Profile Villager
router.get('/profile-villager/:vill_id', verifyUser, (req, res) => {
    const vill_id = req.vill_id;

    if (!req.vill_id) {
        return res.status(400).json({ error: "vill_id is missing from the token" });
    }

    const sql = `SELECT villagers.vill_profileImage, vill_fullName, roles.role_name, vill_descriptionRole, details.phone
        FROM villagers
        JOIN details ON villagers.details_id = details.id
        JOIN roles ON details.role = roles.role_id
        WHERE villagers.vill_id = ?`;

    db.query(sql, [vill_id], (err, result) => {
        if (err) {
            return res.status(500).json({ Error: "Database query error" });
        }
        if (result.length === 0) {
            return res.status(404).json({ Error: "Villager not found" });
        }
        return res.status(200).json({ status: "success", data: result[0], vill_id: req.vill_id });
    });
});

// Update Profile Villager
router.put('/update-profile-villager/:vill_id', verifyUser, upload.single('profileImage'), (req, res) => {
    const vill_id = req.vill_id;
    const { fullName, role, descriptionRole, phone } = req.body;
    const profileImage = req.file ? `${req.file.filename}` : null;

    let sql1 = `UPDATE villagers
        JOIN details ON villagers.details_id = details.id
        SET villagers.vill_fullName = ?, details.role = ?, villagers.vill_descriptionRole = ?, details.phone = ?`;

    const values = [fullName, role, descriptionRole, phone];
    
    if (profileImage) {
        sql1 += `, villagers.vill_profileImage = ?`;
        values.push(profileImage);
    }

    sql1 += ` WHERE villagers.vill_id = ?`;
    values.push(vill_id);

    db.query(sql1, values, (err, result) => {
        if (err) {
            return res.status(500).json({ Error: err.message });
        }
        return res.status(200).json({ status: "success", vill_id: req.vill_id });
    });
});

module.exports = router;