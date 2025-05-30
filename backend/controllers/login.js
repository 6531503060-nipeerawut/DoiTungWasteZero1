const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../routes/db-config");

const login = (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ Error: "Phone and password are required" });
    }

    const sql = `SELECT d.*, v.vill_id, c.coll_id, a.admin_id
        FROM details d
        LEFT JOIN collectors c ON d.id = c.details_id AND d.role = 1
        LEFT JOIN villagers v ON d.id = v.details_id AND (d.role = 2 OR d.role = 3)
        LEFT JOIN admins a ON d.id = a.details_id AND d.role = 4
        WHERE d.phone = ?`;

    db.query(sql, [phone], (err, data) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ Error: "Database query error" });
        }

        if (data.length > 0) {
            const user = data[0];

            if (!user.password) {
                return res.status(500).json({ Error: "Invalid user data" });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error("Error comparing password:", err);
                    return res.status(500).json({ Error: "Server error while comparing passwords" });
                }

                if (isMatch) {
                    const { name, role, vill_id, coll_id, admin_id } = user;
                    const payload = {
                        name,
                        role,
                        vill_id: vill_id || null,
                        coll_id: coll_id || null,
                        admin_id: admin_id || null
                    };
                    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY || "jwt-secret-key", { expiresIn: '1d' });

                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'Lax'
                    });

                    if (role === 1) {
                        return res.status(200).json({ Status: "Success", Redirect: "/c/homecollector" });
                    } else if (role === 2 || role === 3) {
                        return res.status(200).json({ Status: "Success", Redirect: "/v/homevillager" });
                    } else if (role === 4) {
                        return res.status(200).json({ Status: "Success", Redirect: "/admin/all-waste-records" });
                    } else {
                        return res.status(403).json({ Error: "Unauthorized role" });
                    }
                } else {
                    return res.status(401).json({ Error: "Invalid password" });
                }
            });
        } else {
            return res.status(404).json({ Error: "Phone number not found" });
        }
    });
};

const verifyAdmin = async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ Error: "Password is required" });
    }

    const adminHashedPassword = process.env.ADMIN_PASS;

    if (!adminHashedPassword) {
        return res.status(500).json({ Error: "Admin password is not set in environment variables" });
    }

    try {
        const isMatch = await bcrypt.compare(password, adminHashedPassword);
        if (!isMatch) {
            return res.status(401).json({ Error: "Invalid Admin Password" });
        }

        return res.status(200).json({ Status: "Success" });
    } catch (error) {
        console.error("Error comparing password:", error);
        return res.status(500).json({ Error: "Server error while verifying admin password" });
    }
};

module.exports = { login, verifyAdmin };
