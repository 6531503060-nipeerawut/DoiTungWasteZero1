// ComposableWaste.jsx
import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// MUI Components
import { 
    Container, Grid, Paper, Typography, Box, Card, CardMedia, 
    CardContent, Chip, Divider, Button, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';

// MUI Icons
import { 
    ArrowBack as ArrowBackIcon,
    // แก้ไข: เปลี่ยน 'Compost' ที่ทำให้เกิด Error ไปเป็น 'LocalFlorist' ซึ่งมีโอกาสมีอยู่สูง
    // ชื่อ 'LocalFlorist' สื่อถึง ดอกไม้/พืช ซึ่งสอดคล้องกับขยะย่อยสลาย (Organic)
    LocalFlorist as CompostIcon, // ไอคอนปุ๋ยหมัก (ใช้ LocalFlorist แทน Compost)
    Spa as LeafIcon,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon, 
    Info as InfoIcon
} from '@mui/icons-material';

axios.defaults.withCredentials = true;

// --- Theme Constants ---
const themeColors = {
    primary: '#2E5D4B',     // เขียวแม่ฟ้าหลวง
    secondary: '#8D6E63',   // น้ำตาลดิน
    accent: '#D4AF37',      // ทอง
    bg: '#F7F9F6',          // พื้นหลัง
    textHeader: '#1A3C34', // เขียวเข้มหัวข้อ
    
    // สีประจำหมวดหมู่ (ขยะย่อยสลาย - สีเขียวสดใส)
    categoryColor: '#66BB6A',
    categoryBg: '#F1F8E9'
};

function ComposableWaste() {
    document.title = "ขยะย่อยสลายได้ - DoiTung Zero-Waste";

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/composablewastecollector`)
            .then(res => console.log("Accessed Composable Waste Page"))
            .catch(err => console.error("Error fetching data:", err));
    }, []);

    // ข้อมูลรายการขยะ
    const wasteItems = [
        { name: "เศษอาหาร/เศษผัก/ผลไม้", category: "ขยะย่อยสลายได้", image: "/images/composablewaste/composablewaste1.png" },
        { name: "เปลือกมะพร้าว", category: "ขยะย่อยสลายได้", image: "/images/composablewaste/composablewaste2.png" },
        { name: "เศษใบไม้/กิ่งไม้เล็ก", category: "ขยะย่อยสลายได้", image: "/images/composablewaste/composablewaste3.png" },
        { name: "น้ำแกง (กรองกาก)", category: "ขยะย่อยสลายได้", image: "/images/composablewaste/composablewaste4.png" },
        { name: "เปลือกไข่", category: "ขยะย่อยสลายได้", image: "/images/composablewaste/composablewaste5.png" },
        { name: "กากกาแฟ", category: "ขยะย่อยสลายได้", image: "/images/composablewaste/composablewaste6.png" },
        { name: "วัสดุปลูก", category: "ขยะย่อยสลายได้", image: "/images/composablewaste/composablewaste7.png" },
        { name: "ไขมัน/เศษไขมัน", category: "ขยะย่อยสลายได้", image: "/images/composablewaste/composablewaste8.png" }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: themeColors.bg, fontFamily: 'Sarabun, sans-serif' }}>
            <Header type="menu" />

            <Container maxWidth="lg" sx={{ mt: 4, mb: 8, flexGrow: 1 }}>
                
                {/* 1. Back Button */}
                <Box mb={3}>
                    <Button 
                        component={Link} 
                        to="/c/categorycollector" 
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
                                    {/* Icon ถูกใช้ตามชื่อที่ Import มา */}
                                    <CompostIcon sx={{ fontSize: 45 }} /> 
                                </Box>
                                <Typography variant="h5" fontWeight="bold" color={themeColors.textHeader} sx={{ fontFamily: 'Sarabun' }}>
                                    ขยะย่อยสลายได้ (Organic)
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Sarabun', lineHeight: 1.6 }}>
                                ขยะอินทรีย์ที่สามารถย่อยสลายได้ตามธรรมชาติ มีความชื้นสูง หากทิ้งไม่ถูกวิธีอาจส่งกลิ่นเหม็น 
                                แต่มีประโยชน์มหาศาลหากนำไปหมักทำปุ๋ย
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} textAlign={{ xs: 'left', md: 'right' }}>
                            <Chip 
                                icon={<LeafIcon />} 
                                label="นำไปทำปุ๋ยหมักได้" 
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
                                        
                                        <Chip 
                                            label={item.category} 
                                            size="small"
                                            sx={{ 
                                                position: 'absolute', 
                                                top: 8, 
                                                right: 8,
                                                bgcolor: '#DCFCE7', // เขียวอ่อนมาก
                                                color: '#1B5E20',    // เขียวเข้ม
                                                fontWeight: 'bold',
                                                fontSize: '0.75rem',
                                                fontFamily: 'Sarabun',
                                                border: '1px solid #A5D6A7',
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

                {/* 4. Instruction Box (Do & Don't) */}
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, bgcolor: 'white' }}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <InfoIcon sx={{ color: themeColors.primary, mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Sarabun' }}>
                            ข้อแนะนำการจัดการ
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" fontWeight="bold" color="success.main" mb={1} sx={{ fontFamily: 'Sarabun' }}>
                                สิ่งที่ควรทำ (Do)
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="กรองน้ำแกงหรือของเหลวออกให้มากที่สุด (Dry Waste)" primaryTypographyProps={{ fontFamily: 'Sarabun' }} />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="หากเป็นไปได้ควรแยกใส่ถังหมักปุ๋ยชีวภาพ" primaryTypographyProps={{ fontFamily: 'Sarabun' }} />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="มัดปากถุงให้แน่นเพื่อป้องกันแมลงและกลิ่นรบกวน" primaryTypographyProps={{ fontFamily: 'Sarabun' }} />
                                </ListItem>
                            </List>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" fontWeight="bold" color="error.main" mb={1} sx={{ fontFamily: 'Sarabun' }}>
                                สิ่งที่ไม่ควรทำ (Don't)
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon><CancelIcon color="error" /></ListItemIcon>
                                    <ListItemText primary="ห้ามทิ้งปะปนกับขยะรีไซเคิล เพราะจะทำให้สกปรกและขายไม่ได้" primaryTypographyProps={{ fontFamily: 'Sarabun' }} />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><CancelIcon color="error" /></ListItemIcon>
                                    <ListItemText primary="ไม่ควรทิ้งลงท่อระบายน้ำเพราะจะทำให้ท่ออุดตัน (โดยเฉพาะไขมัน)" primaryTypographyProps={{ fontFamily: 'Sarabun' }} />
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </Paper>

            </Container>

            <Footer />
        </div>
    );
}

export default ComposableWaste;