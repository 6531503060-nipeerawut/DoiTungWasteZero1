// Tuesday.jsx
import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// MUI Components
import { 
    Container, Grid, Paper, Typography, Box, Button, 
    Chip, Card, CardMedia, CardContent
} from '@mui/material';

// MUI Icons
import { 
    ArrowBack as ArrowBackIcon,
    Info as InfoIcon,
    Category as CategoryIcon,
    ElectricBolt as EnergyIcon // ไอคอนสื่อถึงพลังงาน/RDF
} from '@mui/icons-material';

// --- Theme Constants (Tuesday Theme) ---
const themeColors = {
    primary: '#2E5D4B',    
    secondary: '#8D6E63',  
    accent: '#D4AF37',     
    bg: '#F7F9F6',         
    textHeader: '#1A3C34',
    
    // สีเฉพาะของวันอังคาร (ชมพู/Pink)
    dayColor: '#EC407A',   
    dayBg: '#FCE4EC'       
};

function TuesdaySchedule() {
    document.title = "วันอังคาร (ขยะพลังงาน) - DoiTung Zero-Waste";

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/v/tuesdayvillager`)
            .then(res => console.log("Accessed Tuesday Page"))
            .catch(err => console.log(err));
    }, []);

    // ✅ รวมข้อมูลชื่อและรูปภาพไว้ด้วยกัน
    const wasteItems = [
        { name: 'ถุงขนมขบเคี้ยว', image: '/images/energyrdfwaste/energyrdfwaste1.png' },
        { name: 'ถุงพลาสติกต่างๆ', image: '/images/energyrdfwaste/energyrdfwaste9.png' },
        { name: 'เสื้อผ้าเก่า', image: '/images/energyrdfwaste/energyrdfwaste7.png' }, // แก้ path ตามที่คุณให้มา (check อีกทีได้ครับ)
        { name: 'รองเท้าเก่า', image: '/images/energyrdfwaste/energyrdfwaste7.png' }, // ถ้าใช้รูปเดียวกัน
        { name: 'เศษผ้า/เศษด้าย', image: '/images/energyrdfwaste/energyrdfwaste6.png' },
        { name: 'พลาสติก', image: '/images/assets/plasticwaste-13.png' },
        { name: 'กระดาษ', image: '/images/assets/PaperWaste-2.png' }
    ];

    const pageData = {
        dayName: 'วันอังคาร',
        type: 'ขยะเชื้อเพลิง / พลังงาน',
        description: 'ขยะแห้งที่สามารถนำไปเผาเพื่อผลิตพลังงานทดแทนได้ เช่น ถุงพลาสติกที่ไม่เปื้อน ถุงขนมขบเคี้ยว หรือสิ่งทอที่ไม่ใช้แล้ว',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: themeColors.bg, fontFamily: 'Sarabun, sans-serif' }}>
            <Header type="menu" />

            <Container maxWidth="md" sx={{ mt: 4, mb: 8, flexGrow: 1 }}>
                
                {/* 1. Back Button */}
                <Box mb={3}>
                    <Button 
                        component={Link} 
                        to="/v/garbagetruckschedulevillager" 
                        startIcon={<ArrowBackIcon />}
                        sx={{ 
                            color: themeColors.secondary, 
                            fontFamily: 'Sarabun',
                            textTransform: 'none',
                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                        }}
                    >
                        กลับสู่ตารางเดินรถ
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
                            <EnergyIcon sx={{ fontSize: 50 }} />
                        </Box>
                        
                        <Typography variant="h4" fontWeight="bold" color={themeColors.textHeader} sx={{ fontFamily: 'Sarabun' }}>
                            {pageData.dayName}
                        </Typography>
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
                    </Box>

                    <Box p={4}>
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
                                            {/* ส่วนรูปภาพ (ปรับความสูงให้ใหญ่ขึ้น) */}
                                            <CardMedia
                                                component="img"
                                                height="180" // ✅ ปรับความสูงรูปให้ใหญ่ขึ้น
                                                image={item.image}
                                                alt={item.name}
                                                sx={{ objectFit: 'contain', p: 2, bgcolor: '#F5F5F5' }}
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }}
                                            />
                                            
                                            {/* ส่วนชื่อขยะ (อยู่ด้านล่าง) */}
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

export default TuesdaySchedule;