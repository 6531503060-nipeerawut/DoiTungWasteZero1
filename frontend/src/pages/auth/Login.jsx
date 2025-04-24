import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Modal,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Login() {
  document.title = 'DoiTung Zero-Waste';
  const navigate = useNavigate();

  const [values, setValues] = useState({ phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminError, setAdminError] = useState('');

  axios.defaults.withCredentials = true;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!values.phone || !values.password) {
      alert('กรุณากรอกเบอร์โทรศัพท์และรหัสผ่าน');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, values);
      if (res.data.Status === 'Success') {
        navigate(res.data.Redirect);
      } else {
        alert(res.data.Error || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      console.error('Login Error:', err);
      alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/verifyAdmin`, {
        password: adminPassword
      });

      if (res.data.Status === 'Success') {
        navigate('/register');
      } else {
        setAdminError('รหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      console.error('Admin Verification Error:', err);
      setAdminError('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง');
    }
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
        <Card sx={{ p: 4, borderRadius: 4, boxShadow: 6 }}>
          <CardContent>
            <Box textAlign="center" mb={2}>
              <Avatar sx={{ m: 'auto', bgcolor: 'primary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" mt={1}>
                ลงชื่อเข้าใช้
              </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="phone"
                label="เบอร์โทรศัพท์"
                name="phone"
                autoFocus
                value={values.phone}
                onChange={(e) =>
                  setValues({ ...values, phone: e.target.value.replace(/\D/g, '') })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="รหัสผ่าน"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={values.password}
                onChange={(e) => setValues({ ...values, password: e.target.value })}
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'เข้าสู่ระบบ'}
              </Button>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Link href="/ForgotPassword" variant="body2">
                    ลืมรหัสผ่าน?
                  </Link>
                </Grid>
                <Grid item>
                  <Link variant="body2" onClick={openAdminModal} sx={{ cursor: 'pointer' }}>
                    สมัครสมาชิก
                  </Link>
                </Grid>
              </Grid>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 3 }}
                onClick={() => (window.location.href = '/')}
              >
                เข้าชมเว็บไซต์
              </Button>
            </Box>
          </CardContent>
        </Card>

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
              width: 320,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              ยืนยันตัวตนผู้ดูแลระบบ (Admin)
            </Typography>
            <TextField
              fullWidth
              label="รหัสผ่านแอดมิน"
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              margin="normal"
              onKeyDown={(e) => {
                if (e.key === 'Enter') verifyAdminPassword();
              }}
            />
            {adminError && (
              <Typography color="error" variant="body2">
                {adminError}
              </Typography>
            )}
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
    </Box>
  );
}

export default Login;
