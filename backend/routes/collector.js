require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("./db-config");

// User Verification Middleware
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authenticated" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is not okay" });
            } else {
                req.name = decoded.name;
                next();
            }
        });
    }
};

// HomeCollector Page
router.get('/homecollector', verifyUser, (req, res) => {
    return res.status(200).json({ status: "success", name: req.name });
});

module.exports = router;