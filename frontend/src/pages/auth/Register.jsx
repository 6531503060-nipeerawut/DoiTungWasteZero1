// Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// MUI Components
import {
  Button, TextField, Link, Grid, Box, Typography, Container,
  Card, CardContent, IconButton, InputAdornment, MenuItem, Select, 
  FormControl, InputLabel, CircularProgress, Divider
} from '@mui/material';

// MUI Icons
import {
  Visibility, VisibilityOff,
  AppRegistration as RegIcon,
  Person as PersonIcon,
  HomeWork as HomeIcon,
  Key as KeyIcon
} from '@mui/icons-material';

// --- Theme Constants ---
const themeColors = {
  primary: '#2E5D4B',    
  secondary: '#8D6E63',  
  accent: '#D4AF37',     
  bg: '#F7F9F6',         
  textHeader: '#1A3C34'
};

const locations = [
  { id:1, name:'ห้วยน้ำขุ่น (หมู่1)', type:'village' },
  { id:2, name:'ห้วยไร่สามัคคี', type:'village' },
  { id:3, name:'ป่าคา', type:'village' },
  { id:4, name:'สี่หลัง', type:'village' },
  { id:5, name:'ขาแหย่งพัฒนา', type:'village' },
  { id:6, name:'มูเซอป่ากล้วย', type:'village' },
  { id:7, name:'อาข่าป่ากล้วย', type:'village' },
  { id:8, name:'มูเซอลาบา', type:'village' },
  { id:9, name:'ลิเช', type:'village' },
  { id:10, name:'จะลอ', type:'village' },
  { id:11, name:'สามัคคีเก่า', type:'village' },
  { id:12, name:'ป่าซางนาเงิน', type:'village' },
  { id:13, name:'สามัคคีใหม่', type:'village' },
  { id:14, name:'สวนป่า', type:'village' },
  { id:15, name:'ห้วยปูใหม่', type:'village' },
  { id:16, name:'ป่าซางแสนสุดแดน', type:'village' },
  { id:17, name:'ป่ายางมูเซอ', type:'village' },
  { id:18, name:'ป่ายางอาข่า', type:'village' },
  { id:19, name:'ปางหนุนพัฒนา', type:'village' },
  { id:20, name:'แม่เปิน', type:'village' },
  { id:21, name:'ผ่าบือ', type:'village' },
  { id:22, name:'ห้วยน้ำริน', type:'village' },
  { id:23, name:'อาข่าผาฮี้', type:'village' },
  { id:24, name:'มูเซอผาฮี้', type:'village' },
  { id:25, name:'สันป่าสัก', type:'village' },
  { id:26, name:'ผาหมี', type:'village' },
  { id:27, name:'ปางพระราชทาน', type:'village' },
  { id:28, name:'ห้วยน้ำขุ่น หมู่ 17', type:'village' },
  { id:29, name:'ห้วยน้ำขุ่น หมู่ 18', type:'village' },
  { id:30, name:'สถานีควบคุมไฟป่าพญาลอ', type:'agency' },
  { id:31, name:'พระธาตุดอยตุง', type:'agency' },
  { id:32, name:'วัดน้อยดอยตุง', type:'agency' },
  { id:33, name:'วัดห้วยน้ำขุ่น', type:'agency' },
  { id:34, name:'ศูนย์ส่งเสริมเกษตรที่สูง', type:'agency' },
  { id:35, name:'อบต.แม่ฟ้าหลวง', type:'agency' },
  { id:36, name:'ที่ว่าการอำเภอแม่ฟ้าหลวง', type:'agency' },
  { id:37, name:'สถานีตำรวจ', type:'agency' },
  { id:38, name:'ทหารพราน', type:'agency' },
  { id:39, name:'ตชด.327', type:'agency' },
  { id:40, name:'กองรักษาการณ์ทหาร', type:'agency' },
  { id:41, name:'กองรักษาการณ์ตำรวจ', type:'agency' },
  { id:42, name:'ฐานทหารช้างมูบ', type:'agency' },
  { id:43, name:'ฐานทหารนาเงิน', type:'agency' },
  { id:44, name:'สถานีอนามัยเฉลิมพระเกียรติฯ', type:'agency' },
  { id:45, name:'สาธารณสุขอำเภอ', type:'agency' },
  { id:46, name:'สถานีเพาะเลี้ยงสัตว์ป่าดอยตุง', type:'agency' },
  { id:47, name:'สถานีวิจัยพืชสวน กม.14', type:'agency' },
  { id:48, name:'รพ.สต.บ้านผาหมี', type:'agency' },
  { id:49, name:'รพ.สต.บ้านผาฮี้', type:'agency' },
  { id:50, name:'รพ.สต.บ้านสามัคคีใหม่', type:'agency' },
  { id:51, name:'รพ.สต.บ้านห้วยน้ำขุ่น', type:'agency' },
  { id:52, name:'รพ.สต.บ้านป่ายาง', type:'agency' },
  { id:53, name:'โรงเรียนบ้านขาแหย่งพัฒนา', type:'agency' },
  { id:54, name:'โรงเรียนอนุบาลแม่ฟ้าหลวง', type:'agency' },
  { id:55, name:'โรงเรียนห้วยไร่สามัคคี(ประถม)', type:'agency' },
  { id:56, name:'โรงเรียนห้วยไร่สามัคคี(มัธยม)', type:'agency' },
  { id:57, name:'โรงเรียนสังวาลย์วิท 8', type:'agency' },
  { id:58, name:'โรงเรียนตชด.ศรีสมวงศ์', type:'agency' },
];

function Register() {
  document.title = "ลงทะเบียน - DoiTung Zero-Waste";

  const [values, setValues] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    descriptionRole: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // ✅ เพิ่ม state สำหรับ confirm password
  const [adminExists, setAdminExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/check/admin`)
      .then(res => setAdminExists(res.data.exists))
      .catch(() => setAdminExists(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (values.password !== values.confirmPassword) {
        setPasswordError(true);
        alert("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
        return;
    }

    if (!values.role) {
      alert("กรุณาเลือกสถานะผู้ใช้งาน");
      return;
    }
    if (values.role === "4" && adminExists) {
      alert("ไม่สามารถลงทะเบียน Admin ได้ เพราะมีอยู่แล้ว");
      return;
    }
    if ((values.role === "2" || values.role === "3") && !values.descriptionRole) {
      alert("กรุณาเลือกหมู่บ้านหรือหน่วยงานของคุณ");
      return;
    }

    setLoading(true);
    
    const { confirmPassword, ...dataToSend } = values;

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, dataToSend)
      .then(res => {
        if (res.data?.Status === "Success") {
          alert("ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ");
          navigate('/login');
        } else {
          alert(res.data?.Error || "เกิดข้อผิดพลาด");
        }
      })
      .catch(err => {
        console.error(err);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      })
      .finally(() => setLoading(false));
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev); // ✅ เพิ่มฟังก์ชันสลับการมองเห็น

  const availableVillages = locations.filter(l => l.type === 'village');
  const availableAgencies = locations.filter(l => l.type === 'agency');

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${themeColors.bg} 0%, #E8F5E9 100%)`,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4,
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <Card 
          elevation={10}
          sx={{ 
            borderRadius: 4, 
            overflow: 'visible',
            position: 'relative',
            mt: 4
          }}
        >
            {/* Decorative Header */}
            <Box 
                sx={{
                    position: 'absolute',
                    top: -40,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: themeColors.primary,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 4px 20px rgba(46, 93, 75, 0.4)',
                    zIndex: 1
                }}
            >
                <RegIcon sx={{ color: 'white', fontSize: 40 }} />
            </Box>

          <CardContent sx={{ pt: 6, px: { xs: 3, md: 5 }, pb: 4 }}>
            
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography component="h1" variant="h5" fontWeight="bold" color={themeColors.textHeader}>
                ลงทะเบียนสมาชิก
              </Typography>
              <Typography variant="body2" color="text.secondary">
                DoiTung Zero-Waste Management System
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
                
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            label="ชื่อ-นามสกุล"
                            value={values.fullName}
                            onChange={e => setValues({ ...values, fullName: e.target.value })}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>,
                                sx: { borderRadius: 2, fontFamily: 'Sarabun' }
                            }}
                            InputLabelProps={{ sx: { fontFamily: 'Sarabun' } }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            label="เบอร์โทรศัพท์"
                            value={values.phone}
                            onChange={e => setValues({ ...values, phone: e.target.value.replace(/\D/g, '') })}
                            type="tel"
                            InputProps={{
                                sx: { borderRadius: 2, fontFamily: 'Sarabun' }
                            }}
                            InputLabelProps={{ sx: { fontFamily: 'Sarabun' } }}
                        />
                    </Grid>

                    {/* รหัสผ่าน */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            label="รหัสผ่าน"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={e => {
                                setValues({ ...values, password: e.target.value });
                                setPasswordError(false);
                            }}
                            error={passwordError}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility} edge="end">
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                startAdornment: <InputAdornment position="start"><KeyIcon color="action" /></InputAdornment>,
                                sx: { borderRadius: 2, fontFamily: 'Sarabun' }
                            }}
                            InputLabelProps={{ sx: { fontFamily: 'Sarabun' } }}
                        />
                    </Grid>

                    {/* ✅ ยืนยันรหัสผ่าน (มีปุ่มเปิดปิดตา) */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            label="ยืนยันรหัสผ่าน"
                            type={showConfirmPassword ? 'text' : 'password'} // ใช้ state แยก
                            value={values.confirmPassword}
                            onChange={e => {
                                setValues({ ...values, confirmPassword: e.target.value });
                                setPasswordError(false);
                            }}
                            error={passwordError}
                            helperText={passwordError ? "รหัสผ่านไม่ตรงกัน" : ""}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                startAdornment: <InputAdornment position="start"><KeyIcon color="action" /></InputAdornment>,
                                sx: { borderRadius: 2, fontFamily: 'Sarabun' }
                            }}
                            InputLabelProps={{ sx: { fontFamily: 'Sarabun' } }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel sx={{ fontFamily: 'Sarabun' }}>สถานะผู้ใช้งาน</InputLabel>
                            <Select
                                value={values.role || ''}
                                label="สถานะผู้ใช้งาน"
                                onChange={e => setValues({ ...values, role: e.target.value, descriptionRole: '' })}
                                sx={{ borderRadius: 2, fontFamily: 'Sarabun' }}
                            >
                                <MenuItem value="1" sx={{ fontFamily: 'Sarabun' }}>เจ้าหน้าที่เก็บขยะ</MenuItem>
                                <MenuItem value="2" sx={{ fontFamily: 'Sarabun' }}>ตัวแทนหมู่บ้าน</MenuItem>
                                <MenuItem value="3" sx={{ fontFamily: 'Sarabun' }}>ตัวแทนหน่วยงานราชการ</MenuItem>
                                <MenuItem value="4" disabled={adminExists} sx={{ fontFamily: 'Sarabun' }}>
                                    Admin {adminExists ? "(มีแล้ว)" : ""}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {values.role === "2" && (
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel sx={{ fontFamily: 'Sarabun' }}>เลือกหมู่บ้าน</InputLabel>
                                <Select
                                    value={values.descriptionRole || ''}
                                    label="เลือกหมู่บ้าน"
                                    onChange={e => setValues({ ...values, descriptionRole: e.target.value })}
                                    startAdornment={<InputAdornment position="start"><HomeIcon color="action" /></InputAdornment>}
                                    sx={{ borderRadius: 2, fontFamily: 'Sarabun' }}
                                >
                                    {availableVillages.map(v => (
                                        <MenuItem key={v.id} value={v.name} sx={{ fontFamily: 'Sarabun' }}>{v.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}

                    {values.role === "3" && (
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel sx={{ fontFamily: 'Sarabun' }}>เลือกหน่วยงาน</InputLabel>
                                <Select
                                    value={values.descriptionRole || ''}
                                    label="เลือกหน่วยงาน"
                                    onChange={e => setValues({ ...values, descriptionRole: e.target.value })}
                                    startAdornment={<InputAdornment position="start"><HomeIcon color="action" /></InputAdornment>}
                                    sx={{ borderRadius: 2, fontFamily: 'Sarabun' }}
                                >
                                    {availableAgencies.map(a => (
                                        <MenuItem key={a.id} value={a.name} sx={{ fontFamily: 'Sarabun' }}>{a.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}

                </Grid>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                        mt: 4,
                        mb: 2,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        fontFamily: 'Sarabun',
                        backgroundColor: themeColors.primary,
                        '&:hover': { backgroundColor: '#1B4D3E' },
                        boxShadow: '0 4px 12px rgba(46, 93, 75, 0.3)'
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "ลงทะเบียน"}
                </Button>

                <Divider sx={{ my: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'Sarabun' }}>
                        มีบัญชีอยู่แล้ว?
                    </Typography>
                </Divider>

                <Box textAlign="center">
                    <Link 
                        href="/login" 
                        variant="body2" 
                        underline="hover" 
                        sx={{ 
                            color: themeColors.primary, 
                            fontWeight: 'bold',
                            fontFamily: 'Sarabun',
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}
                    >
                        เข้าสู่ระบบ
                    </Link>
                </Box>

            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Register;