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
  Paper,
  IconButton,
  InputAdornment,
  Modal,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  LockOutlined as LockOutlinedIcon,
  Visibility,
  VisibilityOff,
  Recycling as RecyclingIcon,
  AdminPanelSettings as AdminIcon,
  Public as PublicIcon
} from '@mui/icons-material';

function Login() {
  document.title = 'เข้าสู่ระบบ - DoiTung Zero-Waste';
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
        alert(res.data.Error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
    } catch (err) {
      console.error('Login Error:', err);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
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
    if (!adminPassword) return;
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
        // ✅ ตั้งค่ารูปพื้นหลัง
        backgroundImage: 'url(/images/doitung-travel-1.jpg)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4,
        position: 'relative',
        // ✅ เพิ่ม Overlay สีดำจางๆ เพื่อให้ข้อความเด่นขึ้น
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // ปรับความเข้มตรงนี้ (0.4 = 40%)
            backdropFilter: 'blur(3px)', // เบลอพื้นหลังเล็กน้อย
            zIndex: 0
        }
      }}
    >
      {/* ✅ ใช้ zIndex: 1 เพื่อให้เนื้อหาลอยอยู่เหนือ Overlay */}
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={12} 
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)', // พื้นหลังขาวโปร่งแสงนิดๆ
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Logo / Branding Section */}
          <Avatar sx={{ m: 1, bgcolor: '#10B981', width: 64, height: 64, boxShadow: 3 }}>
            <RecyclingIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', color: '#1E293B', mt: 1, fontFamily: 'Sarabun' }}>
            DoiTung Zero-Waste
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontFamily: 'Sarabun' }}>
            ระบบจัดการขยะเพื่อสิ่งแวดล้อม
          </Typography>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="เบอร์โทรศัพท์"
              name="phone"
              autoComplete="tel"
              autoFocus
              value={values.phone}
              onChange={(e) =>
                setValues({ ...values, phone: e.target.value.replace(/\D/g, '') })
              }
              InputProps={{
                sx: { borderRadius: 2, fontFamily: 'Sarabun' }
              }}
              InputLabelProps={{ sx: { fontFamily: 'Sarabun' } }}
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
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              InputProps={{
                sx: { borderRadius: 2, fontFamily: 'Sarabun' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ sx: { fontFamily: 'Sarabun' } }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5, 
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '1rem',
                fontFamily: 'Sarabun',
                backgroundColor: '#0F766E',
                boxShadow: '0 4px 14px rgba(15, 118, 110, 0.4)',
                '&:hover': { backgroundColor: '#115E59', transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(15, 118, 110, 0.6)' },
                transition: 'all 0.3s ease'
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'เข้าสู่ระบบ'}
            </Button>

            <Grid container sx={{ mt: 1 }}>
              <Grid item xs>
                <Link href="/forgot-password" variant="body2" underline="hover" color="text.secondary" sx={{ fontFamily: 'Sarabun' }}>
                  ลืมรหัสผ่าน?
                </Link>
              </Grid>
              <Grid item>
                <Link 
                  component="button" 
                  variant="body2" 
                  onClick={openAdminModal} 
                  underline="hover"
                  sx={{ display: 'flex', alignItems: 'center', color: '#0F766E', fontWeight: 'bold', fontFamily: 'Sarabun' }}
                  type="button"
                >
                  <AdminIcon sx={{ fontSize: 16, mr: 0.5 }} /> สำหรับผู้ดูแลระบบ
                </Link>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'Sarabun' }}>หรือ</Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<PublicIcon />}
              sx={{ 
                py: 1.2, 
                borderRadius: 2,
                color: '#64748B',
                borderColor: '#CBD5E1',
                fontFamily: 'Sarabun',
                '&:hover': { borderColor: '#94A3B8', backgroundColor: '#F8FAFC' }
              }}
              onClick={() => (window.location.href = '/')}
            >
              เข้าชมเว็บไซต์หน้าแรก
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Admin Modal */}
      <Modal open={showAdminModal} onClose={closeAdminModal}>
        <Paper
          elevation={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 350,
            bgcolor: 'background.paper',
            borderRadius: 3,
            p: 4,
            outline: 'none'
          }}
        >
          <Box textAlign="center" mb={2}>
            <Avatar sx={{ m: 'auto', bgcolor: '#F59E0B', mb: 1 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h6" component="h2" fontWeight="bold" sx={{ fontFamily: 'Sarabun' }}>
              ยืนยันสิทธิ์ผู้ดูแลระบบ
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Sarabun' }}>
              กรุณากรอกรหัสผ่านเพื่อเข้าสู่หน้าสมัครสมาชิก
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="รหัสผ่าน Admin"
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            variant="outlined"
            margin="normal"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') verifyAdminPassword();
            }}
            InputProps={{ sx: { borderRadius: 2, fontFamily: 'Sarabun' } }}
            InputLabelProps={{ sx: { fontFamily: 'Sarabun' } }}
          />
          
          {adminError && (
            <Typography color="error" variant="caption" display="block" sx={{ mt: 1, fontFamily: 'Sarabun' }}>
              {adminError}
            </Typography>
          )}

          <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={closeAdminModal} color="inherit" sx={{ fontFamily: 'Sarabun' }}>
              ยกเลิก
            </Button>
            <Button 
                onClick={verifyAdminPassword} 
                variant="contained" 
                color="warning"
                sx={{ color: 'white', fontFamily: 'Sarabun' }}
            >
              ยืนยัน
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}

export default Login;