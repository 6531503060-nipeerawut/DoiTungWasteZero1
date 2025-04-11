import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Modal from '@mui/material/Modal';

function Login() {
    document.title = "DoiTung Zero-Waste";
    const [values, setValues] = useState({
        phone: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [adminPassword, setAdminPassword] = useState('');
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminError, setAdminError] = useState('');

    axios.defaults.withCredentials = true;

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!values.phone || !values.password) {
            alert("Phone and Password are required!");
            return;
        }
    
        // if (!/^\d{10}$/.test(values.phone)) {
        //     alert("Please enter a valid 10-digit phone number!");
        //     return;
        // }
    
        setLoading(true);
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, values, { withCredentials: true });
    
            if (res.data.Status === "Success") {
                navigate(res.data.Redirect);
            } else {
                alert(res.data.Error);
            }
        } catch (err) {
            console.error("Login Error: ", err);
            alert("An error occurred while logging in. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const openAdminModal = () => {
        setAdminPassword('');
        setAdminError('');
        setShowAdminModal(true);
    };

    const closeAdminModal = () => {
        setShowAdminModal(false);
    };

    const verifyAdminPassword = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/verifyAdmin`, { password: adminPassword });

            if (res.data.Status === "Success") {
                navigate('/register');
            } else {
                setAdminError("รหัสผ่านไม่ถูกต้อง");
            }
        } catch (err) {
            console.error("Admin Verification Error:", err);
            setAdminError("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Card sx={{ boxShadow: 4 }}>
                    <CardContent sx={{ m: 3 }}>
                        <Avatar sx={{ m: 'auto', bgcolor: 'primary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            ลงชื่อเข้าใช้
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="phone"
                                label="เบอร์โทรศัพท์"
                                name="phone"
                                autoComplete="phone"
                                autoFocus
                                onChange={e => {
                                    const phoneNumber = e.target.value.replace(/\D/g, '');
                                    setValues({ ...values, phone: phoneNumber });
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="รหัสผ่าน"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                onChange={e => setValues({ ...values, password: e.target.value })}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                                aria-label="toggle password visibility"
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'เข้าสู่ระบบ'}
                            </Button>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Link href="/forgotPassword" variant="body2">
                                        ลืมรหัสผ่าน?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link onClick={openAdminModal} variant="body2" style={{ cursor: 'pointer' }}>
                                        สร้างบัญชี
                                    </Link>
                                </Grid>
                            </Grid>
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 3 }}
                                onClick={() => window.location.href = 'http://localhost:3000/'}
                            >
                                ผู้เข้าชม
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Modal สำหรับตรวจสอบรหัสผ่าน Admin */}
            <Modal open={showAdminModal} onClose={closeAdminModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        width: 300,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        ยืนยันตัวตนผู้ดูแลระบบ(Admin)
                    </Typography>
                    <TextField
                        fullWidth
                        label="รหัสผ่าน"
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        margin="normal"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                verifyAdminPassword();
                            }
                        }}
                    />
                    {adminError && <Typography color="error">{adminError}</Typography>}
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button onClick={closeAdminModal} variant="outlined">
                            ยกเลิก
                        </Button>
                        <Button onClick={verifyAdminPassword} variant="contained">
                            ยืนยัน
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </Container>
    );
}

export default Login;