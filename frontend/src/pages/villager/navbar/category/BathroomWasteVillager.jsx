// BathroomWaste.jsx
import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../components/Header'; // ปรับ Path ตามจริง
import Footer from '../../components/Footer';

// MUI Components
import { 
    Container, Grid, Paper, Typography, Box, Card, CardMedia, 
    CardContent, Chip, Divider, Button, Alert, AlertTitle, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';

// MUI Icons
import { 
    ArrowBack as ArrowBackIcon,
    Wc as BathroomIcon, // ไอคอนห้องน้ำ
    Coronavirus as VirusIcon, // ไอคอนเชื้อโรค/ติดเชื้อ
    DeleteOutline as TrashIcon,
    CheckCircle as CheckIcon,
} from '@mui/icons-material';

axios.defaults.withCredentials = true;

// --- Theme Constants ---
const themeColors = {
    primary: '#2E5D4B',    // เขียวแม่ฟ้าหลวง
    secondary: '#8D6E63',  // น้ำตาลดิน
    accent: '#D4AF37',     // ทอง
    bg: '#F7F9F6',         // พื้นหลัง
    textHeader: '#1A3C34', // เขียวเข้มหัวข้อ
    
    // สีประจำหมวดหมู่ (ขยะห้องน้ำ - สีฟ้า)
    categoryColor: '#06B6D4',
    categoryBg: '#E0F7FA'
};

function BathroomWaste() {
    document.title = "ขยะห้องน้ำ/ปนเปื้อน - DoiTung Zero-Waste";

    useEffect(() => {
        // ยิง API เก็บ Log การเข้าชม (ถ้ามี)
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/bathroomwastevillager`)
            .then(res => console.log("Accessed Bathroom Waste Page"))
            .catch(err => console.error("Error fetching data:", err));
    }, []);

    // ข้อมูลรายการขยะ (Static Data)
    const wasteItems = [
        { name: "ถ้วยอาหารกึ่งสำเร็จรูป", category: "ขยะเปื้อน", image: "/images/dirtywaste/dirtywaste1.png", type: 'general' },
        { name: "ถุงแกงเปื้อน", category: "ขยะเปื้อน", image: "/images/dirtywaste/dirtywaste2.png", type: 'general' },
        { name: "ถุงน้ำจิ้ม", category: "ขยะเปื้อน", image: "/images/dirtywaste/dirtywaste3.png", type: 'general' },
        { name: "กล่องใส่อาหารที่เปื้อน", category: "ขยะเปื้อน", image: "/images/dirtywaste/dirtywaste4.png", type: 'general' },
        { name: "แก้วเครื่องดื่ม/แก้วกาแฟ", category: "ขยะเปื้อน", image: "/images/dirtywaste/dirtywaste6.png", type: 'general' },
        { name: "ผ้าเปียก/ทิชชู่เปียก", category: "ขยะเปื้อน", image: "/images/bathroomwaste/bathroomwaste1.png", type: 'general' },
        { name: "ถุงพลาสติกเปื้อน", category: "ขยะเปื้อน", image: "/images/bathroomwaste/bathroomwaste2.png", type: 'general' },
        
        { name: "ผ้าอนามัย", category: "ขยะห้องน้ำ", image: "/images/bathroomwaste/bathroomwaste3.png", type: 'sanitary' },
        { name: "ผ้าอ้อมเด็ก/แพมเพิส", category: "ขยะห้องน้ำ", image: "/images/bathroomwaste/bathroomwaste4.png", type: 'sanitary' },
        { name: "กระดาษชำระเปื้อน", category: "ขยะห้องน้ำ", image: "/images/bathroomwaste/bathroomwaste5.png", type: 'sanitary' },
        
        // ขยะติดเชื้อ
        { name: "หน้ากากอนามัย", category: "ขยะติดเชื้อ", image: "/images/bathroomwaste/bathroomwaste6.png", type: 'infectious' },
        { name: "ชุดตรวจ ATK", category: "ขยะติดเชื้อ", image: "/images/bathroomwaste/bathroomwaste7.png", type: 'infectious' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: themeColors.bg, fontFamily: 'Sarabun, sans-serif' }}>
            <Header type="menu" />

            <Container maxWidth="lg" sx={{ mt: 4, mb: 8, flexGrow: 1 }}>
                
                {/* 1. Back Button */}
                <Box mb={3}>
                    <Button 
                        component={Link} 
                        to="/v/categoryvillager" // หรือ Link กลับหน้าหมวดหมู่รวม
                        startIcon={<ArrowBackIcon />}
                        sx={{ 
                            color: themeColors.secondary, 
                            fontFamily: 'Sarabun',
                            textTransform: 'none',
                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                        }}
                    >
                        กลับสู่หน้าหมวดหมู่
                    </Button>
                </Box>

                {/* 2. Hero Header Section */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4, 
                        mb: 5, 
                        borderRadius: 4, 
                        position: 'relative', 
                        overflow: 'hidden',
                        background: `linear-gradient(135deg, white 60%, ${themeColors.categoryBg} 100%)`,
                        borderLeft: `8px solid ${themeColors.categoryColor}`
                    }}
                >
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Box 
                                    sx={{ 
                                        bgcolor: themeColors.categoryBg, 
                                        p: 1.5, 
                                        borderRadius: '50%', 
                                        color: themeColors.categoryColor,
                                        mr: 2
                                    }}
                                >
                                    <BathroomIcon sx={{ fontSize: 40 }} />
                                </Box>
                                <Typography variant="h4" fontWeight="bold" color={themeColors.textHeader} sx={{ fontFamily: 'Sarabun' }}>
                                    ขยะห้องน้ำ ขยะปนเปื้อน
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Sarabun', lineHeight: 1.6 }}>
                                ขยะที่ไม่สามารถนำกลับมาใช้ใหม่ได้เนื่องจากมีความสกปรก ปนเปื้อนเศษอาหาร คราบมัน หรือสารคัดหลั่ง 
                                ซึ่งจำเป็นต้องกำจัดอย่างถูกวิธีเพื่อสุขอนามัยที่ดี
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} textAlign={{ xs: 'left', md: 'right' }}>
                            <Chip 
                                icon={<TrashIcon />} 
                                label="ขยะทั่วไป / ติดเชื้อ" 
                                sx={{ 
                                    bgcolor: themeColors.categoryColor, 
                                    color: 'white', 
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    py: 2.5,
                                    px: 1,
                                    fontFamily: 'Sarabun'
                                }} 
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* 3. Waste Items Grid */}
                <Box mb={5}>
                    <Typography variant="h5" fontWeight="bold" color={themeColors.textHeader} mb={3} sx={{ fontFamily: 'Sarabun', borderBottom: '2px solid #E0E0E0', pb: 1, display: 'inline-block' }}>
                        ตัวอย่างขยะในหมวดหมู่นี้
                    </Typography>

                    <Grid container spacing={3}>
                        {wasteItems.map((item, index) => (
                            <Grid item xs={6} sm={4} md={3} key={index}>
                                <Card 
                                    sx={{ 
                                        height: '100%', 
                                        transition: '0.3s',
                                        border: '1px solid transparent',
                                        '&:hover': { 
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                            borderColor: themeColors.categoryColor
                                        }
                                    }}
                                >
                                    <Box sx={{ position: 'relative' }}>
                                        <CardMedia
                                            component="img"
                                            height="160"
                                            image={item.image}
                                            alt={item.name}
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }}
                                            sx={{ bgcolor: '#f5f5f5', objectFit: 'contain', p: 1 }}
                                        />
                                        
                                        {/* Badge Logic */}
                                        <Chip 
                                            label={item.category} 
                                            size="small"
                                            icon={item.type === 'infectious' ? <VirusIcon style={{ fontSize: 14, color: 'white' }} /> : null}
                                            sx={{ 
                                                position: 'absolute', 
                                                top: 8, 
                                                right: 8,
                                                bgcolor: item.type === 'infectious' ? '#EF5350' : // แดง (ติดเชื้อ)
                                                            item.type === 'sanitary' ? '#42A5F5' : // ฟ้า (ห้องน้ำ)
                                                            '#BDBDBD', // เทา (ทั่วไป)
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: '0.75rem',
                                                fontFamily: 'Sarabun',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                borderRadius: 0
                                            }} 
                                        />
                                    </Box>
                                    
                                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="body1" fontWeight="bold" color="#333" sx={{ fontFamily: 'Sarabun' }}>
                                            {item.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* 4. Instruction Box (คำแนะนำ) */}
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, bgcolor: 'white' }}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <CheckIcon sx={{ color: themeColors.primary, mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Sarabun' }}>
                            ข้อแนะนำในการจัดการ
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon><Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#0288D1' }} /></ListItemIcon>
                                    <ListItemText 
                                        primary="เทเศษอาหารออกให้หมดก่อนทิ้งภาชนะปนเปื้อน" 
                                        primaryTypographyProps={{ fontFamily: 'Sarabun' }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#D32F2F' }} /></ListItemIcon>
                                    <ListItemText 
                                        primary="ขยะติดเชื้อ (หน้ากาก/ATK) ควรใส่ถุงแยกและมัดปากถุงให้แน่น เขียนหน้าถุงว่า 'ขยะติดเชื้อ'" 
                                        primaryTypographyProps={{ fontFamily: 'Sarabun', color: 'error.main', fontWeight: 'bold' }}
                                    />
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon><Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ED6C02' }} /></ListItemIcon>
                                    <ListItemText 
                                        primary="ห้ามทิ้งปะปนกับขยะรีไซเคิลโดยเด็ดขาด" 
                                        primaryTypographyProps={{ fontFamily: 'Sarabun' }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#0288D1' }} /></ListItemIcon>
                                    <ListItemText 
                                        primary="หากเป็นขยะมีกลิ่นรุนแรง ควรห่อหุ้มด้วยกระดาษหรือถุงพลาสติกให้มิดชิดก่อนทิ้ง" 
                                        primaryTypographyProps={{ fontFamily: 'Sarabun' }}
                                    />
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>

                    {/* Alert Warning */}
                    <Alert severity="warning" sx={{ mt: 2, borderRadius: 2, fontFamily: 'Sarabun' }}>
                        <AlertTitle sx={{ fontWeight: 'bold' }}>ข้อควรระวัง</AlertTitle>
                        การทิ้งขยะปนเปื้อนรวมกับขยะรีไซเคิล จะทำให้ขยะรีไซเคิลสกปรกและขายไม่ได้ โปรดแยกทิ้งให้ถูกต้อง
                    </Alert>
                </Paper>

            </Container>

            <Footer />
        </div>
    );
}

export default BathroomWaste;