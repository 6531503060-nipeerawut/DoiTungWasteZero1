// HazardousWaste.jsx
import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// MUI Components
import { 
    Container, Grid, Paper, Typography, Box, Card, CardMedia, 
    CardContent, Chip, Button, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';

// MUI Icons
import { 
    ArrowBack as ArrowBackIcon,
    Dangerous as DangerIcon, 
    WarningAmber as WarningIcon,
    ReportProblem as ReportIcon,
    PanTool as StopIcon,
    DoNotTouch as DoNotTouchIcon,
    Info as InfoIcon
} from '@mui/icons-material';

axios.defaults.withCredentials = true;

// --- Theme Constants ---
const themeColors = {
    primary: '#2E5D4B',    
    secondary: '#8D6E63',  
    accent: '#D4AF37',     
    bg: '#F7F9F6',         
    textHeader: '#1A3C34',
    
    // สีประจำหมวดหมู่ (ขยะอันตราย - สีแดงเข้ม)
    categoryColor: '#D32F2F',
    categoryBg: '#FFEBEE'
};

function HazardousWaste() {
    document.title = "ขยะอันตราย - DoiTung Zero-Waste";

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/hazardouswastecollector`)
            .then(res => console.log("Accessed Hazardous Waste Page"))
            .catch(err => console.error("Error fetching data:", err));
    }, []);

    // ข้อมูลรายการขยะ (Static Data)
    const wasteItems = [
        { name: "แบตเตอรี่ (โทรศัพท์/ยานยนต์)", category: "ขยะอันตราย", image: "/images/hazardouswaste/hazardouswaste1.png" },
        { name: "ถ่านไฟฉาย", category: "ขยะอันตราย", image: "/images/hazardouswaste/hazardouswaste2.png" },
        { name: "หมึกปริ้น/ตลับหมึก", category: "ขยะอันตราย", image: "/images/hazardouswaste/hazardouswaste4.png" },
        { name: "กระป๋องสี/สารเคมี", category: "ขยะอันตราย", image: "/images/hazardouswaste/hazardouswaste5.png" },
        { name: "หลอดไฟฟ้า/หลอดนีออน", category: "ขยะอันตราย", image: "/images/hazardouswaste/hazardouswaste5.png" }, // *Note: Check Image Path
        { name: "ปากกา/น้ำยาลบคำผิด", category: "ขยะอันตราย", image: "/images/hazardouswaste/hazardouswaste6.png" }
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
                                    <DangerIcon sx={{ fontSize: 40 }} />
                                </Box>
                                <Typography variant="h5" fontWeight="bold" color={themeColors.textHeader} sx={{ fontFamily: 'Sarabun' }}>
                                    ขยะอันตราย (Hazardous Waste)
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Sarabun', lineHeight: 1.6 }}>
                                ขยะที่มีส่วนประกอบของสารเคมีอันตราย สารพิษ สารไวไฟ หรือสารกัมมันตรังสี 
                                ซึ่งอาจส่งผลกระทบต่อสุขภาพและสิ่งแวดล้อมหากกำจัดไม่ถูกวิธี ต้องแยกทิ้งเป็นพิเศษ
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} textAlign={{ xs: 'left', md: 'right' }}>
                            <Chip 
                                icon={<ReportIcon />} 
                                label="อันตรายสูง แยกทิ้งพิเศษ" 
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
                                            icon={<WarningIcon style={{ fontSize: 14, color: 'white' }} />}
                                            sx={{ 
                                                position: 'absolute', 
                                                top: 8, 
                                                right: 8,
                                                bgcolor: '#EF5350', // แดงอ่อนกว่า Chip หลักเล็กน้อย
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

                {/* 4. Safety Guidelines Box */}
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, bgcolor: '#FFEBEE', border: '1px solid #FFCDD2' }}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Box sx={{ bgcolor: '#D32F2F', borderRadius: '50%', p: 1, mr: 2, color: 'white', display: 'flex' }}>
                            <ReportIcon />
                        </Box>
                        <Typography variant="h6" fontWeight="bold" color="#C62828" sx={{ fontFamily: 'Sarabun' }}>
                            ข้อควรระวัง (Safety First)
                        </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon><StopIcon color="error" /></ListItemIcon>
                                    <ListItemText 
                                        primary="ห้ามทิ้งรวม: ต้องแยกออกจากขยะทั่วไปโดยเด็ดขาด ใส่ถุงแยกต่างหาก" 
                                        primaryTypographyProps={{ fontFamily: 'Sarabun', fontWeight: 'bold' }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><InfoIcon color="error" /></ListItemIcon>
                                    <ListItemText 
                                        primary="ห่อหุ้มให้มิดชิด: หากมีสารเคมีรั่วไหล หรือหลอดไฟแตก ควรห่อกระดาษหนังสือพิมพ์และใส่ถุงซ้อนหลายชั้น" 
                                        primaryTypographyProps={{ fontFamily: 'Sarabun' }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><DoNotTouchIcon color="error" /></ListItemIcon>
                                    <ListItemText 
                                        primary="ระวังการสัมผัส: หลีกเลี่ยงการสัมผัสสารเคมีโดยตรง ควรล้างมือทุกครั้งหลังจัดการขยะเหล่านี้" 
                                        primaryTypographyProps={{ fontFamily: 'Sarabun' }}
                                    />
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

export default HazardousWaste;