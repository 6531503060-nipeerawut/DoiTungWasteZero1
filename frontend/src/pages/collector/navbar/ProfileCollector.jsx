// ProfileCollector.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UnauthorizedMessage from '../../../components/UnauthorizedMessage';

// ✅ Import useNavigate เข้ามา (เผื่อใช้ในอนาคต)
import { useParams, useNavigate } from 'react-router-dom'; 

// MUI Components
import {
    Container, Paper, Typography, Box, Button, Avatar, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    CircularProgress, List, ListItem, ListItemIcon, ListItemText,
    IconButton, useMediaQuery, useTheme, Chip 
} from '@mui/material';

import {
    Edit as EditIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Badge as BadgeIcon,
    CameraAlt as CameraIcon,
    Save as SaveIcon,
    Close as CloseIcon
} from '@mui/icons-material';

axios.defaults.withCredentials = true;

// --- Theme Constants ---
const themeColors = {
    primary: '#2E5D4B',    // เขียวแม่ฟ้าหลวง
    secondary: '#8D6E63',  // น้ำตาลดิน
    accent: '#D4AF37',     // ทอง
    bg: '#F7F9F6',         // พื้นหลัง
    textHeader: '#1A3C34'  // เขียวเข้มหัวข้อ
};

const ProfileCollector = () => {
    document.title = "ข้อมูลส่วนตัว (เจ้าหน้าที่) - DoiTung Zero-Waste";
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    // ✅ ใส่ Comment ปิดการแจ้งเตือน (เก็บไว้เผื่อใช้ในอนาคต)
    // eslint-disable-next-line no-unused-vars
    const navigate = useNavigate();

    // ✅ ดึง ID จาก URL
    const { id } = useParams(); 

    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const [profile, setProfile] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        descriptionRole: '',
        phone: '',
        profileImage: null,
        role: ''
    });
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            // ป้องกันกรณี id เป็น null หรือ undefined
            if (!id) {
                setLoading(false);
                setMessage("ไม่พบรหัสผู้ใช้งาน");
                return;
            }

            try {
                // ใช้ id จาก URL ยิงไปที่ API โดยตรง
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/profile-collector/${id}`, { withCredentials: true });
                
                if (res.data.status?.toLowerCase() === "success"){
                    setAuth(true);
                    setProfile(res.data.data);
                    
                    setFormData({
                        fullName: res.data.data.coll_fullName,
                        descriptionRole: res.data.data.coll_descriptionRole,
                        phone: res.data.data.phone,
                        profileImage: null,
                        role: res.data.data.role_name
                    });
                } else {
                    setAuth(false);
                    setMessage(res.data.error || "Unauthorized access");
                }
            } catch (err) {
                console.error("Axios Error:", err.response ? err.response.data : err.message);
                setMessage("Error connecting to server");
            } finally {
                setLoading(false);
            }
        };
        fetchAuthStatus();
    }, [id]); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, profileImage: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedData = new FormData();

        updatedData.append('fullName', formData.fullName);
        updatedData.append('phone', formData.phone);

        const roleMap = {
            'เจ้าหน้าที่เก็บขยะ': 1,
            'ตัวแทนหน่วยงานราชการ': 2,
            'ตัวแทนหมู่บ้าน': 3
        };
        const roleId = roleMap[profile.role_name] || 1; 
        updatedData.append('role', roleId);

        if (formData.profileImage) {
            updatedData.append('profileImage', formData.profileImage);
        }

        axios.put(`${process.env.REACT_APP_BACKEND_URL}/c/update-profile-collector/${id}`, updatedData, { withCredentials: true })
            .then(res => {
                setOpenDialog(false);
                window.location.reload();
            })
            .catch(err => {
                console.error('Error updating profile:', err);
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor={themeColors.bg}>
                <CircularProgress sx={{ color: themeColors.primary }} />
            </Box>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: themeColors.bg, fontFamily: 'Sarabun, sans-serif' }}>
            {auth ? (
                <>
                    <Header collId={id} />

                    <Container maxWidth="sm" sx={{ mt: 4, mb: 10, flexGrow: 1 }}>
                        <Paper elevation={2} sx={{ borderRadius: 4, overflow: 'hidden', position: 'relative', bgcolor: 'white' }}>
                            
                            {/* Header Background Decor */}
                            <Box sx={{ 
                                height: '140px', 
                                background: `linear-gradient(135deg, #43A047 0%, ${themeColors.primary} 100%)`,
                                position: 'relative'
                            }}>
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: -20,
                                    left: 0,
                                    right: 0,
                                    height: '40px',
                                    bgcolor: 'white',
                                }} />
                            </Box>

                            {/* Profile Image */}
                            <Box display="flex" flexDirection="column" alignItems="center" mt="-70px" position="relative" px={3}>
                                <Avatar
                                    src={profile?.coll_profileImage ? `${process.env.REACT_APP_BACKEND_URL}/images/${profile.coll_profileImage}` : "/default-avatar.png"}
                                    alt={profile?.coll_fullName}
                                    sx={{ 
                                        width: 140, 
                                        height: 140, 
                                        border: '5px solid white', 
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                        bgcolor: '#E0E0E0'
                                    }}
                                />
                                
                                <Typography variant="h5" fontWeight="bold" mt={2} color={themeColors.textHeader} sx={{ fontFamily: 'Sarabun' }}>
                                    {profile?.coll_fullName}
                                </Typography>
                                
                                <Chip 
                                    label={profile?.role_name || 'เจ้าหน้าที่'} 
                                    sx={{ 
                                        mt: 1, 
                                        bgcolor: '#E8F5E9', 
                                        color: themeColors.primary, 
                                        fontWeight: 'bold',
                                        fontFamily: 'Sarabun'
                                    }} 
                                />
                            </Box>

                            <Divider sx={{ my: 3, mx: 3 }} />

                            {/* Info List */}
                            <List sx={{ px: 2 }}>
                                <ListItem>
                                    <ListItemIcon>
                                        <Avatar sx={{ bgcolor: '#FFF8E1', color: themeColors.accent }}>
                                            <PersonIcon />
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="ชื่อ-นามสกุล" 
                                        secondary={profile?.coll_fullName} 
                                        primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontFamily: 'Sarabun' }}
                                        secondaryTypographyProps={{ variant: 'body1', color: 'text.primary', fontWeight: 'medium', fontFamily: 'Sarabun' }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Avatar sx={{ bgcolor: '#E3F2FD', color: '#1976D2' }}>
                                            <BadgeIcon />
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="สถานะ" 
                                        secondary={profile?.role_name} 
                                        primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontFamily: 'Sarabun' }}
                                        secondaryTypographyProps={{ variant: 'body1', color: 'text.primary', fontWeight: 'medium', fontFamily: 'Sarabun' }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Avatar sx={{ bgcolor: '#E8F5E9', color: themeColors.primary }}>
                                            <PhoneIcon />
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="เบอร์โทรศัพท์" 
                                        secondary={profile?.phone ? `0${profile.phone}` : '-'} 
                                        primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontFamily: 'Sarabun' }}
                                        secondaryTypographyProps={{ variant: 'body1', color: 'text.primary', fontWeight: 'medium', fontFamily: 'Sarabun' }}
                                    />
                                </ListItem>
                            </List>

                            <Box p={3} mt={2} textAlign="center">
                                <Button 
                                    variant="contained" 
                                    fullWidth
                                    startIcon={<EditIcon />} 
                                    onClick={() => setOpenDialog(true)}
                                    sx={{ 
                                        borderRadius: 3, 
                                        py: 1.5,
                                        textTransform: 'none',
                                        bgcolor: themeColors.primary,
                                        fontFamily: 'Sarabun',
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 12px rgba(46, 93, 75, 0.3)',
                                        '&:hover': { bgcolor: '#1A3C34' }
                                    }}
                                >
                                    แก้ไขข้อมูลส่วนตัว
                                </Button>
                            </Box>

                        </Paper>
                    </Container>

                    {/* --- Edit Profile Dialog --- */}
                    <Dialog 
                        open={openDialog} 
                        onClose={() => setOpenDialog(false)} 
                        fullWidth 
                        fullScreen={isMobile}
                        maxWidth="xs"
                        PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3 } }}
                    >
                        <DialogTitle sx={{ 
                            borderBottom: '1px solid #eee', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            bgcolor: isMobile ? themeColors.primary : 'white',
                            color: isMobile ? 'white' : 'inherit'
                        }}>
                            <Typography variant="h6" fontWeight="bold" fontFamily="Sarabun">แก้ไขข้อมูล</Typography>
                            <IconButton onClick={() => setOpenDialog(false)} sx={{ color: 'inherit' }}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        
                        <DialogContent sx={{ pt: 3, bgcolor: '#FAFAFA' }}>
                            <Box display="flex" flexDirection="column" gap={2} mt={1}>
                                
                                {/* Image Upload with Preview */}
                                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                    <Avatar 
                                        src={previewImage || (profile?.coll_profileImage ? `${process.env.REACT_APP_BACKEND_URL}/images/${profile.coll_profileImage}` : "/default-avatar.png")}
                                        sx={{ width: 100, height: 100, mb: 2, border: '3px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                    />
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="upload-profile-pic"
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="upload-profile-pic">
                                        <Button variant="outlined" component="span" startIcon={<CameraIcon />} size="small" sx={{ fontFamily: 'Sarabun', borderRadius: 20, borderColor: themeColors.primary, color: themeColors.primary }}>
                                            เปลี่ยนรูปโปรไฟล์
                                        </Button>
                                    </label>
                                    {formData.profileImage && (
                                        <Typography variant="caption" mt={1} color="text.secondary">
                                            ไฟล์ที่เลือก: {formData.profileImage.name}
                                        </Typography>
                                    )}
                                </Box>

                                <TextField
                                    label="ชื่อ - นามสกุล"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    sx={{ bgcolor: 'white', fontFamily: 'Sarabun' }}
                                />

                                <TextField
                                    label="สถานะ (แก้ไขไม่ได้)"
                                    value={formData.role}
                                    fullWidth
                                    variant="filled"
                                    InputProps={{ readOnly: true }}
                                    sx={{ fontFamily: 'Sarabun' }}
                                />

                                <TextField
                                    label="เบอร์โทรศัพท์"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    type="tel"
                                    helperText="กรอกเฉพาะตัวเลข 10 หลัก"
                                    sx={{ bgcolor: 'white', fontFamily: 'Sarabun' }}
                                />
                            </Box>
                        </DialogContent>
                        
                        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee', bgcolor: 'white' }}>
                            <Button onClick={() => setOpenDialog(false)} color="inherit" sx={{ fontFamily: 'Sarabun' }}>
                                ยกเลิก
                            </Button>
                            <Button 
                                onClick={handleSubmit} 
                                variant="contained" 
                                startIcon={<SaveIcon />}
                                sx={{ 
                                    bgcolor: themeColors.accent, 
                                    fontFamily: 'Sarabun', 
                                    fontWeight: 'bold',
                                    '&:hover': { bgcolor: '#BFA130' }
                                }}
                            >
                                บันทึก
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Footer />
                </>
            ) : (
                <UnauthorizedMessage message={message} />
            )}
        </div>
    );
};

export default ProfileCollector;