const bcrypt = require("bcrypt");
const db = require("../routes/db-config");
const jwt = require("jsonwebtoken");
const salt = 10;

const register = (req, res) => {
    const { fullName, phone, password, role, descriptionRole } = req.body;
    const defaultProfileImage = 'default-profile-picture1.png';
    if (!fullName || !phone || !password || !role) {
        return res.status(400).json({ Error: "Missing required fields" });
    }

    const checkPhoneSQL = "SELECT * FROM details WHERE phone = ?";
    db.query(checkPhoneSQL, [phone], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ Error: "Error checking phone number" });
        }

        if (result.length > 0) {
            return res.status(400).json({ Error: "Phone number already registered" });
        }

        bcrypt.hash(password.toString(), salt, (err, hash) => {
            if (err) return res.json({ Error: "Error hashing password" });

            const sql = "INSERT INTO details (`phone`, `password`, `role`) VALUES (?, ?, ?)";
            db.query(sql, [phone, hash, role], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ Error: "Register Failed" });
                }

                const detailID = result.insertId;

                if (role === "1") {
                    const wasteCollectorSQL = "INSERT INTO collectors (`details_id`, `coll_fullName`, `coll_descriptionRole`, `coll_profileImage`) VALUES (?, ?, ?, ?)";
                    db.query(wasteCollectorSQL, [detailID, fullName, descriptionRole, defaultProfileImage], (err, result) => {
                        if (err) {
                            console.error("Error inserting into collectors", err);
                            return res.status(500).json({ Error: "Register Failed (1)" });
                        }

                        const vill_id = result.insertId;
                        const token = jwt.sign({ name: fullName, vill_id: vill_id, role: role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

                        return res.json({ Status: "Success", token: token });
                    });
                } else if (role === "2" || role === "3") {
                    const villagerSQL = "INSERT INTO villagers (`details_id`, `vill_fullName`, `vill_descriptionRole`, `vill_profileImage`) VALUES (?, ?, ?, ?)";
                    db.query(villagerSQL, [detailID, fullName, descriptionRole, defaultProfileImage], (err, result) => {
                        if (err) {
                            console.error("Error inserting into villagers", err);
                            return res.status(500).json({ Error: "Register Failed (2)" });
                        }

                        const vill_id = result.insertId;
                        const token = jwt.sign({ name: fullName, vill_id: vill_id, role: role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
                        
                        return res.json({ Status: "Success", token: token });
                    });
                } else {
                    return res.status(400).json({ Error: "Invalid role" });
                }
            });
        });
    });
};

module.exports = register;