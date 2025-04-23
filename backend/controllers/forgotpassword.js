require("dotenv").config();
const db = require("../routes/db-config");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

exports.requestOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60000);

        await db.promise().query('INSERT INTO otp (email, otp, expires_at) VALUES (?, ?, ?)', [email, otp, expiresAt]);

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP สำหรับรีเซ็ตรหัสผ่าน',
            text: `OTP ของคุณคือ: ${otp}`,
        });
        res.json({ message: 'ส่ง OTP เรียบร้อย' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'กรุณาใส่ Email ที่ถูกต้อง เพื่อส่งรหัส OTP' });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const [result] = await db.promise().query(
        'SELECT * FROM otp WHERE email = ? AND otp = ? AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
        [email, otp]
    );

    if (result.length === 0) return res.status(400).json({ message: 'OTP ไม่ถูกต้องหรือหมดอายุ' });

    await db.promise().query('DELETE FROM otp WHERE email = ?', [email]);

    res.json({ message: 'OTP ถูกต้อง' });
};

exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const hashed = await bcrypt.hash(newPassword, 10);

    const [result] = await db.promise().query('UPDATE details SET password = ? WHERE email = ?', [hashed, email]);

    if (result.affectedRows === 0) {
        return res.status(400).json({ message: 'ไม่พบอีเมลในระบบ' });
    }

    res.json({ message: 'รีเซ็ตรหัสผ่านเรียบร้อย' });
};