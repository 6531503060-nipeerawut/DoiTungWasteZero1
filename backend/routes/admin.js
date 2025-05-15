require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("./db-config");

// Admin Verification Middleware
const verifyAdmin = (req, res, next) => {
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

            if (!decoded.admin_id) {
                return res.status(400).json({ error: "Invalid token format" });
            }

            req.name = decoded.name;
            req.admin_id = decoded.admin_id;
            next();
        });

    } catch (error) {
        console.error("Unexpected error in verifyUser:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// ดึงข้อมูลทั้งหมด (เฉพาะ admin)
router.get('/all-waste-records', verifyAdmin, (req, res) => {
    const { type } = req.query;

    // กรองเงื่อนไขตามประเภท
    let whereCondition = '';
    if (type === 'village') {
        whereCondition = `WHERE l.type = 'village'`;
    } else if (type === 'agency') {
        whereCondition = `WHERE l.type = 'agency'`;
    }

    const sql = `
        SELECT
            l.name AS village_name,
            GROUP_CONCAT(DISTINCT l.id) AS location_ids,
            MIN(l.id) AS min_location_id
        FROM locations l
        JOIN collectoraddweights w ON w.caw_location = l.id
        ${whereCondition}
        GROUP BY l.name
        ORDER BY min_location_id ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        res.status(200).json({ status: "success", results: results, admin_id: req.admin_id });
    });
});

router.get('/waste-by-type/:locationIds', verifyAdmin, (req, res) => {
    const ids = req.params.locationIds.split(',').map(id => parseInt(id));

    const sql = `
        SELECT
            wt.wasteType_name AS waste_type,
            swt.subWasteType_name AS sub_waste_type,
            SUM(w.caw_wasteTotal) AS weight
        FROM collectoraddweights w
        JOIN wastetypes wt ON w.caw_wasteType = wt.wasteType_id
        LEFT JOIN subwastetypes swt ON w.caw_subWasteType = swt.subWasteType_id
        WHERE w.caw_location IN (?)
        GROUP BY wt.wasteType_name, swt.subWasteType_name
        ORDER BY wt.wasteType_name ASC;
    `;
    db.query(sql, [ids], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json({ status: "success", results: results, admin_id: req.admin_id });
    });
});

router.get('/weight-by-date/:locationId', verifyAdmin, (req, res) => {
    const locationParam = req.params.locationId;
    const locationIds = locationParam.split(',').map(id => Number(id));
  
    if (locationIds.some(isNaN)) {
      return res.status(400).json({ error: "Invalid location IDs" });
    }
  
    const placeholders = locationIds.map(() => '?').join(',');

const sql = `
  SELECT
    sub.date,
    sub.waste_type,
    sub.sub_waste_type,
    sub.weight,
    dt.daily_total_weight
  FROM (
    SELECT
      DATE(w.created_at) AS date,
      wt.wasteType_name AS waste_type,
      swt.subWasteType_name AS sub_waste_type,
      SUM(w.caw_wasteTotal) AS weight
    FROM collectoraddweights w
    JOIN wasteTypes wt ON w.caw_wasteType = wt.wasteType_id
    LEFT JOIN subwastetypes swt ON w.caw_subWasteType = swt.subWasteType_id
    WHERE w.caw_location IN (${placeholders})
    GROUP BY DATE(w.created_at), wt.wasteType_name, swt.subWasteType_name
  ) AS sub
  JOIN (
    SELECT
      DATE(created_at) AS date,
      SUM(caw_wasteTotal) AS daily_total_weight
    FROM collectoraddweights
    WHERE caw_location IN (${placeholders})
    GROUP BY DATE(created_at)
  ) AS dt ON sub.date = dt.date
  ORDER BY sub.date
`;

// ✅ ดึงค่าซ้ำ 2 ครั้งเพราะ IN () ใช้ 2 จุด
const values = [...locationIds, ...locationIds];

db.query(sql, values, (err, results) => {
  if (err) return res.status(500).json({ error: err });
  res.status(200).json({
    status: "success",
    results,
    admin_id: req.admin_id,
  });
});
  });

// ตัวอย่าง 2: ลบรายการขยะตาม ID
router.delete('/delete-waste/:id', verifyAdmin, (req, res) => {
  const wasteId = req.params.id;
  const sql = 'DELETE FROM collectoraddweights WHERE id = ?';
  db.query(sql, [wasteId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Waste record not found' });
    }
    res.json({ message: 'Waste record deleted successfully' });
  });
});

// ตัวอย่าง 3: แก้ไขข้อมูลขยะ
router.put('/update-waste/:id', verifyAdmin, (req, res) => {
  const { waste_type, sub_type, weight } = req.body;
  const wasteId = req.params.id;
  const sql = `
    UPDATE collectoraddweights
    SET waste_type = ?, sub_type = ?, weight = ?
    WHERE id = ?`;
  db.query(sql, [waste_type, sub_type, weight, wasteId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Waste record updated successfully' });
  });
});

// ตัวอย่าง 5: ดูรายชื่อผู้ใช้ทั้งหมด
router.get('/users', verifyAdmin, (req, res) => {
  const sql = 'SELECT id, phone, role, email FROM details';
  db.query(sql, (err, users) => {
    if (err) return res.status(500).json({ error: err });
    res.json(users);
  });
});

module.exports = router;