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
    document.title = "DoiTung Zero-Waste";
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
                    alert("Registration successful! You can now log in.");
                    navigate('/login');
                } else {
                    alert(res.data?.Error || "An unknown error occurred.");
                }
            })
            .catch(err => {
                console.error("Registration Error: ", err);
                alert("An error occurred during registration. Please try again.");
            });
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
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
                        <Avatar sx={{ m: 'auto', bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            ลงทะเบียน
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="fullName"
                                label="ชื่อ-นามสกุล"
                                name="fullName"
                                autoComplete="name"
                                autoFocus
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
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="role-label">สถานะผู้ใช้งาน</InputLabel>
                                <Select
                                    labelId="role-label"
                                    id="role"
                                    value={values.role || ''}
                                    onChange={e => setValues({ ...values, role: e.target.value })}
                                    displayEmpty
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
                                sx={{ mt: 3, mb: 2 }}
                            >
                                ลงทะเบียน
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link href="/login" variant="body2">
                                        {"มีบัญชีอยู่แล้ว? เข้าสู่ระบบ"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}

export default Register;
