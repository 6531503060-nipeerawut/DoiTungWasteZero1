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

function Login() {
    document.title = "DoiTung Zero-Waste";
    const [values, setValues] = useState({
        phone: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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
                            <Grid container>
                                <Grid item xs>
                                    <Link href="/forgotPassword" variant="body2">
                                        ลืมรหัสผ่าน?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/register" variant="body2">
                                        {"Don't have an account? Create Account"}
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
        </Container>
    );
}

export default Login;