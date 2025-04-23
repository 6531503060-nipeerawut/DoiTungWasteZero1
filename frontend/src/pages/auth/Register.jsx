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
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

function Register() {
    document.title = "Register";

    const [values, setValues] = useState({
        fullName: '',
        phone: '',
        password: '',
        role: '',
        descriptionRole: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!values.role) {
            alert("กรุณาเลือกบทบาทของคุณ");
            return;
        }
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, values)
            .then(res => {
                if (res.data?.Status === "Success") {
                    alert("ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ");
                    navigate('/login');
                } else {
                    alert(res.data?.Error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
                }
            })
            .catch(err => {
                console.error("Registration Error: ", err);
                alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
            });
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Box
        sx={{
            background: 'linear-gradient(to right, #e97e9b, #99b6ed)',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            }}
        >
            <Container maxWidth="sm">
                <Card sx={{
                    borderRadius: '1rem',
                    boxShadow: 4,
                    p: 3
                }}>
                    <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <Avatar sx={{ m: 'auto', bgcolor: '#e97e9b' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
                                ลงทะเบียน
                            </Typography>
                        </Box>

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="fullName"
                                label="ชื่อ-นามสกุล"
                                name="fullName"
                                autoComplete="name"
                                onChange={e => setValues({ ...values, fullName: e.target.value })}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="phone"
                                label="เบอร์โทรศัพท์"
                                name="phone"
                                autoComplete="phone"
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
                                            <IconButton onClick={togglePasswordVisibility} edge="end">
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <FormControl fullWidth margin="normal" required>
                                <InputLabel id="role-label">สถานะผู้ใช้งาน</InputLabel>
                                <Select
                                    labelId="role-label"
                                    id="role"
                                    value={values.role || ''}
                                    onChange={e => setValues({ ...values, role: e.target.value })}
                                >
                                    <MenuItem value="" disabled>เลือกบทบาทของคุณ</MenuItem>
                                    <MenuItem value="1">เจ้าหน้าที่เก็บขยะ</MenuItem>
                                    <MenuItem value="2">ตัวแทนหน่วยงานราชการ</MenuItem>
                                    <MenuItem value="3">ตัวแทนหมู่บ้าน</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                margin="normal"
                                fullWidth
                                id="descriptionRole"
                                label="ชื่อหมู่บ้านหรือหน่วยงาน"
                                name="descriptionRole"
                                autoComplete="descriptionRole"
                                onChange={e => setValues({ ...values, descriptionRole: e.target.value })}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    backgroundColor: '#e97e9b',
                                    '&:hover': {
                                        backgroundColor: '#d46e8b'
                                    }
                                }}
                            >
                                ลงทะเบียน
                            </Button>
                            <Grid container justifyContent="center">
                                <Grid item>
                                    <Link href="/login" variant="body2">
                                        {"มีบัญชีอยู่แล้ว? เข้าสู่ระบบ"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default Register;
