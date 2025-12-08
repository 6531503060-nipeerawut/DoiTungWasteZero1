// ProfileVillager.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom'; // ✅ เพิ่ม useNavigate
import Header from '../components/Header';
import Footer from '../components/Footer';
import UnauthorizedMessage from '../../../components/UnauthorizedMessage';

// MUI Components
import {
    Container, Paper, Typography, Box, Button, Avatar, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    CircularProgress, List, ListItem, ListItemIcon, ListItemText,
    IconButton, useMediaQuery, useTheme, Chip // ✅ เพิ่ม Chip
} from '@mui/material';

// MUI Icons
import {
    Edit as EditIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Home as HomeIcon, 
    CameraAlt as CameraIcon,
    Save as SaveIcon,
    Close as CloseIcon
} from '@mui/icons-material';

axios.defaults.withCredentials = true;

// --- Theme Constants ---
const themeColors = {
    primary: '#2E5D4B',    
    secondary: '#8D6E63',  
    accent: '#D4AF37',     
    bg: '#F7F9F6',         
    textHeader: '#1A3C34'  
};

const ProfileVillager = () => {
    document.title = "ข้อมูลส่วนตัว (ชาวบ้าน) - DoiTung Zero-Waste";
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    

    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [villId, setVillId] = useState(null);

    
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
            try {
                // ✅ แก้ไข: ลบตัวแปร url ที่ไม่ได้ใช้ออกไปแล้ว
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v/profile-villager/${villId}`, { withCredentials: true })
                
                if (res.data.status?.toLowerCase() === "success"){
                    setAuth(true);
                    setProfile(res.data.data);
                    setVillId(res.data.vill_id);
                    setFormData({
                        fullName: res.data.data.vill_fullName,
                        descriptionRole: res.data.data.vill_descriptionRole,
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
            } finally {
                setLoading(false);
            }
        };
        fetchAuthStatus();
    }, [villId]); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImage: file });

        // สร้าง preview
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedData = new FormData();

        updatedData.append('fullName', formData.fullName);
        updatedData.append('descriptionRole', formData.descriptionRole);
        updatedData.append('phone', formData.phone);

        const roleMap = {
            'เจ้าหน้าที่เก็บขยะ': 1,
            'ตัวแทนหน่วยงานราชการ': 2,
            'ตัวแทนหมู่บ้าน': 3
        };
        const roleId = roleMap[profile.role_name] || null;
        updatedData.append('role', roleId);

        if (formData.profileImage) {
            updatedData.append('profileImage', formData.profileImage);
        }

        axios.put(`${process.env.REACT_APP_BACKEND_URL}/v/update-profile-villager/${villId}`, updatedData, { withCredentials: true })
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
                    <Header villId={villId} />

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
                                    src={profile?.vill_profileImage ? `${process.env.REACT_APP_BACKEND_URL}/images/${profile.vill_profileImage}` : "/default-avatar.png"}
                                    alt={profile?.vill_fullName}
                                    sx={{ 
                                        width: 140, 
                                        height: 140, 
                                        border: '5px solid white', 
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                        bgcolor: '#E0E0E0'
                                    }}
                                />
                                
                                <Typography variant="h5" fontWeight="bold" mt={2} color={themeColors.textHeader} sx={{ fontFamily: 'Sarabun', textAlign: 'center' }}>
                                    {profile?.vill_fullName}
                                </Typography>
                                
                                <Chip 
                                    label={profile?.role_name || 'ชาวบ้าน'} 
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
                                        secondary={profile?.vill_fullName} 
                                        primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontFamily: 'Sarabun' }}
                                        secondaryTypographyProps={{ variant: 'body1', color: 'text.primary', fontWeight: 'medium', fontFamily: 'Sarabun' }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Avatar sx={{ bgcolor: '#E3F2FD', color: '#1976D2' }}>
                                            <HomeIcon />
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="สังกัด (หมู่บ้าน/หน่วยงาน)" 
                                        secondary={profile?.vill_descriptionRole} 
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
                                        secondary={profile?.phone ? `0${String(profile.phone).replace(/^0/, '')}` : '-'} 
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
                                
                                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                    <Avatar 
                                        src={previewImage || (profile?.vill_profileImage ? `${process.env.REACT_APP_BACKEND_URL}/images/${profile.vill_profileImage}` : "/default-avatar.png")}
                                        sx={{ width: 100, height: 100, mb: 2, border: '3px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                    />
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="upload-profile-pic-vill"
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="upload-profile-pic-vill">
                                        <Button variant="outlined" component="span" startIcon={<CameraIcon />} size="small" sx={{ fontFamily: 'Sarabun', borderRadius: 20, borderColor: themeColors.primary, color: themeColors.primary }}>
                                            เปลี่ยนรูปโปรไฟล์
                                        </Button>
                                    </label>
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

                                {/* ✅ แก้ไขตรงนี้: ทำให้สังกัดแก้ไขไม่ได้ */}
                                <TextField
                                    label="สังกัด (หมู่บ้าน/หน่วยงาน) (แก้ไขไม่ได้)"
                                    value={formData.descriptionRole}
                                    fullWidth
                                    variant="filled" // เปลี่ยนเป็น filled เพื่อสื่อว่า Read-only
                                    InputProps={{ readOnly: true }} // ห้ามแก้ไข
                                    helperText="ไม่สามารถแก้ไขสังกัดได้"
                                    sx={{ bgcolor: '#f5f5f5', fontFamily: 'Sarabun' }}
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

export default ProfileVillager;