// EnergyRDFWaste.jsx
import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// MUI Components
import { 
    Container, Grid, Paper, Typography, Box, Card, CardMedia, 
    CardContent, Chip, Button, Alert, AlertTitle
} from '@mui/material';

// MUI Icons
import { 
    ArrowBack as ArrowBackIcon,
    ElectricBolt as EnergyIcon, // ไอคอนพลังงาน/ไฟฟ้า
    LocalFireDepartment as FireIcon, // ไอคอนไฟ/ความร้อน
    WaterDrop as WaterIcon, // ไอคอนน้ำ (ใช้ในคำเตือน)
} from '@mui/icons-material';

axios.defaults.withCredentials = true;

// --- Theme Constants ---
const themeColors = {
    primary: '#2E5D4B',    
    secondary: '#8D6E63',  
    accent: '#D4AF37',     
    bg: '#F7F9F6',         
    textHeader: '#1A3C34',
    
    // สีประจำหมวดหมู่ (ขยะพลังงาน - สีส้มแสด)
    categoryColor: '#EF6C00',
    categoryBg: '#FFF3E0'
};

function EnergyRDFWaste() {
    document.title = "ขยะพลังงาน RDF - DoiTung Zero-Waste";

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/energyrdfwaste`)
            .then(res => console.log("Accessed RDF Waste Page"))
            .catch(err => console.error("Error fetching data:", err));
    }, []);

    // ข้อมูลรายการขยะ (Static Data)
    const wasteItems = [
        { name: "ถุงขนม/ซองกาแฟ", category: "ขยะพลังงาน", image: "/images/energyrdfwaste/energyrdfwaste1.png" },
        { name: "กล่องนม/น้ำผลไม้ (UHT)", category: "ขยะพลังงาน", image: "/images/energyrdfwaste/energyrdfwaste2.png" },
        { name: "แก้วกาแฟกระดาษ (เคลือบมัน)", category: "ขยะพลังงาน", image: "/images/energyrdfwaste/energyrdfwaste3.png" },
        { name: "ภาชนะอาหารย่อยสลายได้", category: "ขยะพลังงาน", image: "/images/energyrdfwaste/energyrdfwaste4.png" },
        { name: "ตะเกียบ/ไม้เสียบลูกชิ้น", category: "ขยะพลังงาน", image: "/images/energyrdfwaste/energyrdfwaste5.png" },
        { name: "เศษผ้า/เศษด้าย", category: "ขยะพลังงาน", image: "/images/energyrdfwaste/energyrdfwaste6.png" },
        { name: "เสื้อผ้าเก่า/รองเท้าเก่า", category: "ขยะพลังงาน", image: "/images/energyrdfwaste/energyrdfwaste7.png" },
        { name: "กระดาษสติกเกอร์", category: "ขยะพลังงาน", image: "/images/energyrdfwaste/energyrdfwaste8.png" },
        { name: "ถุงพลาสติกกรอบ", category: "ขยะพลังงาน", image: "/images/energyrdfwaste/energyrdfwaste9.png" },
        { name: "ขวดพลาสติกสี (Non-PET)", category: "ขยะพลังงาน", image: "/images/energyrdfwaste/energyrdfwaste10.png" }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: themeColors.bg, fontFamily: 'Sarabun, sans-serif' }}>
            <Header type="menu" />

            <Container maxWidth="lg" sx={{ mt: 4, mb: 8, flexGrow: 1 }}>
                
                {/* 1. Back Button */}
                <Box mb={3}>
                    <Button 
                        component={Link} 
                        to="/category" 
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
                                    <EnergyIcon sx={{ fontSize: 40 }} />
                                </Box>
                                <Typography variant="h4" fontWeight="bold" color={themeColors.textHeader} sx={{ fontFamily: 'Sarabun' }}>
                                    ขยะพลังงาน (RDF)
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'Sarabun', lineHeight: 1.6 }}>
                                ขยะที่แห้งและติดไฟได้ดี ซึ่งไม่สามารถนำไปรีไซเคิลได้ง่าย แต่สามารถนำไปผ่านกระบวนการแปรรูป
                                อัดเป็นแท่งเพื่อใช้เป็น <strong>"เชื้อเพลิงขยะ"</strong> ผลิตพลังงานความร้อนหรือไฟฟ้าทดแทนถ่านหินได้
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} textAlign={{ xs: 'left', md: 'right' }}>
                            <Chip 
                                icon={<FireIcon />} 
                                label="ใช้ผลิตเป็นเชื้อเพลิง" 
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
                        ตัวอย่างขยะ RDF
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
                                        
                                        <Chip 
                                            label={item.category} 
                                            size="small"
                                            sx={{ 
                                                position: 'absolute', 
                                                top: 8, 
                                                right: 8,
                                                bgcolor: '#FFE0B2', // ส้มอ่อน
                                                color: '#E65100',   // ส้มเข้ม
                                                fontWeight: 'bold',
                                                fontSize: '0.75rem',
                                                fontFamily: 'Sarabun',
                                                border: '1px solid #FFCC80',
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

                {/* 4. Critical Requirement Box */}
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, bgcolor: 'white' }}>
                    <Alert 
                        severity="warning" 
                        icon={<WaterIcon fontSize="inherit" />}
                        sx={{ 
                            bgcolor: '#FFF3E0', 
                            color: '#E65100', 
                            border: '1px solid #FFE0B2',
                            borderRadius: 2,
                            mb: 0
                        }}
                    >
                        <AlertTitle sx={{ fontWeight: 'bold', fontFamily: 'Sarabun' }}>เงื่อนไขสำคัญ (Critical Requirement)</AlertTitle>
                        <Typography variant="body2" sx={{ fontFamily: 'Sarabun' }}>
                            ขยะ RDF ต้องเป็น <strong>"ขยะแห้ง"</strong> เท่านั้น หากเปียกชื้นจะทำให้ค่าความร้อนลดลงและเผาไหม้ได้ยาก 
                            กรุณาเทน้ำ/ของเหลวออกให้หมด และผึ่งให้แห้งก่อนทิ้ง
                        </Typography>
                    </Alert>
                </Paper>

            </Container>

            <Footer />
        </div>
    );
}

export default EnergyRDFWaste;