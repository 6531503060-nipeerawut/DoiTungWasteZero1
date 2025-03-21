const logout = (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
    return res.json({Status: "Success"});
};

module.exports = logout;