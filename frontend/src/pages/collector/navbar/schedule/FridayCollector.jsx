// Friday.jsx
import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// MUI Components
import { 
    Container, Grid, Paper, Typography, Box, Button, 
    Chip, Card, CardMedia, Alert, AlertTitle, CardContent
} from '@mui/material';

// MUI Icons
import { 
    ArrowBack as ArrowBackIcon,
    Info as InfoIcon,
    Category as CategoryIcon,
    Dangerous as DangerIcon // ไอคอนสื่อถึงอันตราย
} from '@mui/icons-material';

// --- Theme Constants (Friday Theme) ---
const themeColors = {
    primary: '#2E5D4B',    
    secondary: '#8D6E63',  
    accent: '#D4AF37',     
    bg: '#F7F9F6',         
    textHeader: '#1A3C34',
    
    // สีเฉพาะของวันศุกร์ (ฟ้า/Blue)
    dayColor: '#1976D2',   
    dayBg: '#E3F2FD'       
};

function FridaySchedule() {
    document.title = "วันศุกร์ (ขยะอันตราย) - DoiTung Zero-Waste";

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/fridaycollector`)
            .then(res => console.log("Accessed Friday Page"))
            .catch(err => console.log(err));
    }, []);

    // ✅ รวมข้อมูลชื่อและรูปภาพไว้ด้วยกัน
    const wasteItems = [
        { name: 'หลอดไฟ', image: '/images/hazardouswaste/hazardouswaste5.png' },
        { name: 'ถ่านไฟฉาย', image: '/images/hazardouswaste/hazardouswaste2.png' },
        { name: 'แบตเตอรี่มือถือเก่า', image: '/images/hazardouswaste/hazardouswaste1.png' },
        { name: 'ยาหมดอายุ', image: '/images/garbagetruckschedule/garbagetruckschedule18.png' },
        { name: 'กระป๋องสเปรย์', image: '/images/garbagetruckschedule/garbagetruckschedule17.png' },
        { name: 'ขวดยาฆ่าแมลง', image: '/images/garbagetruckschedule/garbagetruckschedule16.png' }
    ];

    const pageData = {
        dayName: 'วันศุกร์',
        type: 'ขยะอันตราย',
        description: 'ขยะที่มีสารเคมีปนเปื้อน หรือวัตถุอันตราย เช่น สารพิษ หรือโลหะหนัก ซึ่งต้องแยกทิ้งอย่างระมัดระวังเพื่อไม่ให้รั่วไหลออกสู่สิ่งแวดล้อม',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: themeColors.bg, fontFamily: 'Sarabun, sans-serif' }}>
            <Header type="menu" />

            <Container maxWidth="md" sx={{ mt: 4, mb: 8, flexGrow: 1 }}>
                
                {/* 1. Back Button */}
                <Box mb={3}>
                    <Button 
                        component={Link} 
                        to="/c/GarbageTruckSchedulecollector" 
                        startIcon={<ArrowBackIcon />}
                        sx={{ 
                            color: themeColors.secondary, 
                            fontFamily: 'Sarabun',
                            textTransform: 'none',
                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                        }}
                    >
                        กลับสู่ตาราง
                    </Button>
                </Box>

                {/* 2. Main Content Card */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        borderRadius: 4, 
                        overflow: 'hidden',
                        borderTop: `8px solid ${themeColors.dayColor}`
                    }}
                >
                    {/* Header Banner */}
                    <Box 
                        sx={{ 
                            bgcolor: themeColors.dayBg, 
                            p: 4, 
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <Box 
                            sx={{ 
                                bgcolor: 'white', 
                                borderRadius: '50%', 
                                p: 2, 
                                mb: 2,
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                color: themeColors.dayColor
                            }}
                        >
                            <DangerIcon sx={{ fontSize: 50 }} />
                        </Box>
                        
                        <Typography variant="h4" fontWeight="bold" color={themeColors.textHeader} sx={{ fontFamily: 'Sarabun' }}>
                            {pageData.dayName}
                        </Typography>
                        
                        {/* Chip Group (จัดเรียงแนวตั้ง) */}
                        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                            <Chip 
                                label={pageData.type} 
                                sx={{ 
                                    mt: 1, 
                                    bgcolor: themeColors.dayColor, 
                                    color: '#fff', 
                                    fontWeight: 'bold', 
                                    fontSize: '1rem',
                                    fontFamily: 'Sarabun',
                                    px: 2
                                }} 
                            />
                            <Chip 
                                label="ระวังอันตราย" 
                                color="error" 
                                size="small"
                                sx={{ fontWeight: 'bold', fontFamily: 'Sarabun' }}
                            />
                        </Box>
                    </Box>

                    <Box p={4}>
                        
                        {/* Warning Alert */}
                        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                            <AlertTitle sx={{ fontFamily: 'Sarabun', fontWeight: 'bold' }}>คำเตือน</AlertTitle>
                            โปรดแยกขยะประเภทนี้ออกจากขยะทั่วไปอย่างเคร่งครัด และห้ามทิ้งรวมกับขยะเปียกเด็ดขาด
                        </Alert>

                        {/* Description Section */}
                        <Box mb={4}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <InfoIcon sx={{ color: themeColors.dayColor, mr: 1 }} />
                                <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Sarabun' }}>
                                    คำอธิบาย
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'Sarabun', lineHeight: 1.6, pl: 4 }}>
                                {pageData.description}
                            </Typography>
                        </Box>

                        <Box mb={4}>
                            <Box display="flex" alignItems="center" mb={3}>
                                <CategoryIcon sx={{ color: themeColors.dayColor, mr: 1 }} />
                                <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Sarabun' }}>
                                    ตัวอย่างขยะที่ทิ้งได้
                                </Typography>
                            </Box>

                            {/* ✅ Grid Layout ใหม่: รูปใหญ่ + ชื่ออยู่ด้านล่าง */}
                            <Grid container spacing={3}>
                                {wasteItems.map((item, index) => (
                                    <Grid item xs={6} sm={4} key={index}>
                                        <Card 
                                            elevation={2}
                                            sx={{ 
                                                height: '100%', 
                                                borderRadius: 3, 
                                                transition: 'transform 0.2s',
                                                '&:hover': { transform: 'translateY(-5px)', boxShadow: 4 }
                                            }}
                                        >
                                            {/* ส่วนรูปภาพ */}
                                            <CardMedia
                                                component="img"
                                                height="180" 
                                                image={item.image}
                                                alt={item.name}
                                                sx={{ objectFit: 'contain', p: 2, bgcolor: '#F5F5F5' }}
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }}
                                            />
                                            
                                            {/* ส่วนชื่อขยะ */}
                                            <CardContent sx={{ textAlign: 'center', p: 2, bgcolor: 'white' }}>
                                                <Typography 
                                                    variant="body1" 
                                                    fontWeight="bold" 
                                                    color="#333"
                                                    sx={{ fontFamily: 'Sarabun', lineHeight: 1.3 }}
                                                >
                                                    {item.name}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Box>
                </Paper>

            </Container>

            <Footer />
        </div>
    );
}

export default FridaySchedule;