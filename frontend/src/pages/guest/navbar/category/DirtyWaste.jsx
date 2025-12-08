// DirtyWaste.jsx
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
    DeleteOutline as GeneralWasteIcon, // ไอคอนขยะทั่วไป
    Warning as WarningIcon,
    Info as InfoIcon,
    Wash as WashIcon // ไอคอนสื่อถึงการล้างทำความสะอาด
} from '@mui/icons-material';

axios.defaults.withCredentials = true;

// --- Theme Constants ---
const themeColors = {
    primary: '#2E5D4B',    
    secondary: '#8D6E63',  
    accent: '#D4AF37',     
    bg: '#F7F9F6',         
    textHeader: '#1A3C34',
    
    // สีประจำหมวดหมู่ (ขยะเปื้อน - สีเหลือง)
    categoryColor: '#FBC02D',
    categoryBg: '#FFFDE7'
};

function DirtyWaste() {
    document.title = "ขยะเปื้อน/ขยะทั่วไป - DoiTung Zero-Waste";

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/dirtywaste`)
            .then(res => console.log("Accessed Dirty Waste Page"))
            .catch(err => console.error("Error fetching data:", err));
    }, []);

    // ข้อมูลรายการขยะ (Static Data)
    const wasteItems = [
        { name: "ถ้วยอาหารกึ่งสำเร็จรูป (เปื้อน)", category: "ขยะเปื้อน", image: "/images/dirtywaste/dirtywaste1.png" },
        { name: "ถุงแกงเปื้อนเศษอาหาร", category: "ขยะเปื้อน", image: "/images/dirtywaste/dirtywaste2.png" },
        { name: "ถุงน้ำจิ้ม", category: "ขยะเปื้อน", image: "/images/dirtywaste/dirtywaste3.png" },
        { name: "กล่องโฟม/กระดาษเปื้อน", category: "ขยะเปื้อน", image: "/images/dirtywaste/dirtywaste4.png" },
        { name: "แก้วเครื่องดื่ม (กระดาษเคลือบ)", category: "ขยะเปื้อน", image: "/images/dirtywaste/dirtywaste5.png" },
        { name: "แก้วกาแฟพลาสติก (เปื้อน)", category: "ขยะเปื้อน", image: "/images/dirtywaste/dirtywaste6.png" },
        { name: "ทิชชู่ใช้แล้ว/ทิชชู่เปียก", category: "ขยะเปื้อน", image: "/images/dirtywaste/dirtywaste7.png" },
        { name: "ถุงพลาสติกเปื้อนคราบมัน", category: "ขยะเปื้อน", image: "/images/dirtywaste/dirtywaste8.png" }
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
                                    <GeneralWasteIcon sx={{ fontSize: 40 }} />
                                </Box>
                                <Typography variant="h3" fontWeight="bold" color={themeColors.textHeader} sx={{ fontFamily: 'Sarabun' }}>
                                    ขยะเปื้อน
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'Sarabun', lineHeight: 1.6 }}>
                                ขยะที่มีคราบสกปรก ไขมัน หรือเปียกน้ำที่ไม่สามารถทำความสะอาดได้โดยง่าย 
                                ทำให้ไม่เหมาะแก่การนำไปรีไซเคิล จำเป็นต้องแยกทิ้งเพื่อนำไปกำจัดอย่างถูกวิธี (ฝังกลบ)
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} textAlign={{ xs: 'left', md: 'right' }}>
                            <Chip 
                                icon={<WarningIcon />} 
                                label="ไม่สามารถรีไซเคิลได้" 
                                sx={{ 
                                    bgcolor: themeColors.categoryColor, 
                                    color: '#37474F', // สีเทาเข้มให้อ่านง่ายบนพื้นเหลือง
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
                                        
                                        <Chip 
                                            label={item.category} 
                                            size="small"
                                            sx={{ 
                                                position: 'absolute', 
                                                top: 8, 
                                                right: 8,
                                                bgcolor: '#FFF9C4', // เหลืองอ่อน
                                                color: '#F57F17',   // ส้มเหลืองเข้ม
                                                fontWeight: 'bold',
                                                fontSize: '0.75rem',
                                                fontFamily: 'Sarabun',
                                                border: '1px solid #FFF59D',
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

                {/* 4. Info / Tip Box */}
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, bgcolor: 'white' }}>
                    <Alert 
                        severity="info" 
                        icon={<InfoIcon fontSize="inherit" />}
                        sx={{ 
                            bgcolor: '#FFFDE7', 
                            color: '#F57F17', 
                            border: '1px solid #FFF59D',
                            borderRadius: 2,
                            mb: 3
                        }}
                    >
                        <AlertTitle sx={{ fontWeight: 'bold', fontFamily: 'Sarabun' }}>ทำไมต้องแยกขยะเปื้อน?</AlertTitle>
                        <Typography variant="body2" sx={{ fontFamily: 'Sarabun' }}>
                            การทิ้งขยะเปื้อนรวมกับขยะรีไซเคิล (เช่น กระดาษหรือพลาสติกสะอาด) จะทำให้ขยะรีไซเคิลเหล่านั้นสกปรกและเสียหาย จนไม่สามารถนำไปขายหรือเข้าสู่กระบวนการรีไซเคิลได้อีกต่อไป
                        </Typography>
                    </Alert>

                    <Box display="flex" alignItems="center" bgcolor="#E0F2F1" p={2} borderRadius={2}>
                        <WashIcon sx={{ color: themeColors.primary, mr: 2, fontSize: 30 }} />
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" color={themeColors.primary} sx={{ fontFamily: 'Sarabun' }}>
                                เคล็ดลับการจัดการ
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Sarabun' }}>
                                หากขยะเปื้อนสามารถล้างทำความสะอาดได้ง่าย (เช่น แก้วน้ำพลาสติก) ควรล้างและตากให้แห้งก่อน เพื่อเปลี่ยนให้เป็น <strong>ขยะรีไซเคิล</strong> ที่มีมูลค่า
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

            </Container>

            <Footer />
        </div>
    );
}

export default DirtyWaste;