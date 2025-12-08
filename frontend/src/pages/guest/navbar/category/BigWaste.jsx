// BigWaste.jsx
import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Weekend as FurnitureIcon } from '@mui/icons-material';
import { LocalShipping as TruckIcon } from '@mui/icons-material';
import { Phone as PhoneIcon } from '@mui/icons-material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';
import { Info as InfoIcon } from '@mui/icons-material';


axios.defaults.withCredentials = true;

// --- Theme Constants ---
const themeColors = {
    primary: '#2E5D4B',    
    secondary: '#8D6E63',  
    accent: '#D4AF37',     
    bg: '#F7F9F6',         
    textHeader: '#1A3C34', 
    
    // สีประจำหมวดหมู่ (ขยะชิ้นใหญ่ - สีม่วงเข้ม)
    categoryColor: '#5E35B1',
    categoryBg: '#EDE7F6'
};

function BigWaste() {
    document.title = "ขยะชิ้นใหญ่ - DoiTung Zero-Waste";

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/bigwaste`)
            .then(res => console.log("Accessed Big Waste Page"))
            .catch(err => console.error("Error fetching data:", err));
    }, []);

    // ข้อมูลรายการขยะ (Static Data)
    const wasteItems = [
        { name: "ฟูกที่นอน", category: "ขยะชิ้นใหญ่", image: "/images/bigwaste/bigwaste1.png" },
        { name: "เก้าอี้ / โซฟา", category: "ขยะชิ้นใหญ่", image: "/images/bigwaste/bigwaste2.png" },
        { name: "เฟอร์นิเจอร์เก่า", category: "ขยะชิ้นใหญ่", image: "/images/bigwaste/bigwaste3.png" },
        // เพิ่มรายการอื่นๆ ได้ที่นี่
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
                                    <FurnitureIcon sx={{ fontSize: 40 }} />
                                </Box>
                                <Typography variant="h4" fontWeight="bold" color={themeColors.textHeader} sx={{ fontFamily: 'Sarabun' }}>
                                    ขยะชิ้นใหญ่ (Bulky Waste)
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Sarabun', lineHeight: 1.6 }}>
                                ขยะที่มีขนาดใหญ่ น้ำหนักมาก หรือมีความยาวเกินกว่าจะใส่ในถังขยะทั่วไปได้ 
                                เช่น เฟอร์นิเจอร์ชำรุด ที่นอน ตู้เตียง หรือเศษวัสดุก่อสร้าง
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} textAlign={{ xs: 'left', md: 'right' }}>
                            <Chip 
                            icon={<TruckIcon style={{ color: 'white' }} />} 
                            label="ต้องการการขนย้ายพิเศษ" 
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
                            <Grid item xs={12} sm={6} md={4} key={index}>
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
                                            height="220" // เพิ่มความสูงรูปสำหรับขยะชิ้นใหญ่ให้ดูเต็มตา
                                            image={item.image}
                                            alt={item.name}
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                                            sx={{ bgcolor: '#f5f5f5', objectFit: 'contain', p: 2 }}
                                        />
                                        
                                        <Chip 
                                            label={item.category} 
                                            size="small"
                                            sx={{ 
                                                position: 'absolute', 
                                                top: 10, 
                                                right: 10,
                                                bgcolor: '#EDE7F6', // ม่วงอ่อน
                                                color: themeColors.categoryColor,
                                                fontWeight: 'bold',
                                                fontFamily: 'Sarabun',
                                                border: `1px solid ${themeColors.categoryColor}`,
                                                borderRadius: 0
                                            }} 
                                        />
                                    </Box>
                                    
                                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography variant="h6" fontWeight="bold" color="#333" sx={{ fontFamily: 'Sarabun' }}>
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
                        <InfoIcon sx={{ color: themeColors.primary, mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Sarabun' }}>
                            ข้อแนะนำการจัดการ
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={7}>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon><CheckIcon sx={{ color: themeColors.categoryColor }} /></ListItemIcon>
                                    <ListItemText 
                                        primary="ขยะประเภทนี้ไม่สามารถทิ้งรวมกับรถเก็บขยะทั่วไปได้" 
                                        primaryTypographyProps={{ fontFamily: 'Sarabun', fontWeight: 'bold' }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#757575' }} /></ListItemIcon>
                                    <ListItemText 
                                        primary="กรุณานำไปวางไว้ ณ จุดพักขยะชิ้นใหญ่ที่ชุมชนกำหนดไว้เท่านั้น" 
                                        primaryTypographyProps={{ fontFamily: 'Sarabun' }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#757575' }} /></ListItemIcon>
                                    <ListItemText 
                                        primary="หากสภาพยังใช้งานได้ แนะนำให้บริจาคหรือขายเป็นสินค้ามือสอง" 
                                        primaryTypographyProps={{ fontFamily: 'Sarabun' }}
                                    />
                                </ListItem>
                            </List>
                        </Grid>
                        
                        <Grid item xs={12} md={5}>
                            <Alert 
                                severity="info" 
                                icon={<PhoneIcon fontSize="inherit" />}
                                sx={{ borderRadius: 2, fontFamily: 'Sarabun', height: '100%', alignItems: 'center' }}
                            >
                                <AlertTitle sx={{ fontWeight: 'bold', fontFamily: 'Sarabun' }}>ต้องการความช่วยเหลือ?</AlertTitle>
                                หากมีปริมาณมาก หรือไม่สะดวกขนย้าย กรุณาติดต่อศูนย์ประสานงานเพื่อขอกำลังคนช่วยขนย้าย
                                <br/>
                                <strong>โทร: 053-763-xxx</strong>
                            </Alert>
                        </Grid>
                    </Grid>
                </Paper>

            </Container>

            <Footer />
        </div>
    );
}

export default BigWaste;