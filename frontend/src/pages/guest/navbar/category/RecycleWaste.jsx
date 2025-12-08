// RecycleWaste.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// MUI Components
import { 
    Container, Grid, Card, CardActionArea, CardContent, CardMedia, 
    Typography, Box, CircularProgress, Chip, Divider, Button
} from '@mui/material';

// MUI Icons
import { 
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon, 
    Recycling as RecyclingIcon,
    MonetizationOn as MoneyIcon 
} from '@mui/icons-material';

// --- Theme Constants ---
const themeColors = {
    primary: '#2E5D4B',    // เขียวแม่ฟ้าหลวง
    recycle: '#43A047',    // เขียวรีไซเคิล
    accent: '#D4AF37',     // ทอง
    textHeader: '#1A3C34'
};

// ข้อมูลจำลอง (Mock Data)
const defaultWastes = [
    { id: 'glass', name: 'ขวดแก้ว', description: 'ขวดแก้วใส/สีน้ำตาล/สีเขียวและเศษแก้ว', image: '/images/sellwaste/sellwaste02.png', link: '/sellwaste/glass' },
    { id: 'paper', name: 'กระดาษ', description: 'กระดาษลัง, กระดาษขาว-ดำ, กระดาษย่อย', image: '/images/sellwaste/sellwaste03.png', link: '/sellwaste/paper' },
    { id: 'plastic', name: 'พลาสติก', description: 'ขวด PET, ขวดขุ่น, พลาสติกกรอบ, ท่อ PVC', image: '/images/sellwaste/sellwaste01.png', link: '/sellwaste/plastic' },
    { id: 'metal', name: 'โลหะ', description: 'กระป๋องอลูมิเนียม, เหล็ก, ทองแดง, สแตนเลส', image: '/images/sellwaste/sellwaste04.png', link: '/sellwaste/metal' },
];

function RecycleWaste() {
    document.title = "ขยะรีไซเคิล - DoiTung Zero-Waste";

    const [wastes, setWastes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecycleWaste = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sellwaste`);
                if (res.data.status?.toLowerCase() === 'success') {
                    setWastes(res.data.results);
                } else {
                    setWastes(defaultWastes);
                }
            } catch (err) {
                console.error("Error fetching recycle waste:", err);
                setWastes(defaultWastes);
            } finally {
                setLoading(false);
            }
        };
        fetchRecycleWaste();
    }, []);

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh', 
            background: `linear-gradient(180deg, ${themeColors.primary} 0%, ${themeColors.recycle} 100%)`, 
            fontFamily: 'Sarabun, sans-serif',
            position: 'relative',
            overflowX: 'hidden' 
        }}>
            
            {/* Decorative Background Circles */}
            <Box sx={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', top: '20%', right: -50, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', bottom: 0, left: '10%', width: 500, height: 500, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

            <Header type="menu" />

            {/* ✅ ย้ายปุ่มมาไว้นอก Container หลัก เพื่อให้อยู่ชิดขอบจอซ้ายสุด */}
            <Box sx={{ 
                width: '100%', 
                px: { xs: 2, md: 4 }, // เว้นระยะจากขอบจอนิดหน่อย
                mt: { xs: 3, md: 9 }, // เว้นระยะจาก Header
                position: 'relative', 
                zIndex: 10 
            }}>
                <Button 
                    component={Link} 
                    to="/category" 
                    startIcon={<ArrowBackIcon />}
                    sx={{ 
                        color: 'white',
                        fontFamily: 'Sarabun',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        borderRadius: 30,
                        bgcolor: 'rgba(255,255,255,0.15)', 
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        transition: 'all 0.3s ease',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        '&:hover': { 
                            bgcolor: 'rgba(255,255,255,0.3)',
                            border: '1px solid white',
                            transform: 'translateX(-5px)'
                        }
                    }}
                >
                    กลับสู่หน้าหมวดหมู่
                </Button>
            </Box>

            {/* Content Container */}
            <Container maxWidth="lg" sx={{ flexGrow: 1, pb: 8, position: 'relative', zIndex: 1 }}>
                
                {/* Title Section */}
                <Box textAlign="center" color="white" mb={6} mt={{ xs: 2, md: 0 }}>
                    <Box 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center" 
                        mb={1}
                        sx={{ 
                            flexDirection: 'row', 
                            gap: 2 
                        }}
                    >
                        {/* ไอคอนรีไซเคิล */}
                        <RecyclingIcon 
                            sx={{ 
                                fontSize: { xs: 40, md: 56 }, 
                                color: '#FFD700', 
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                            }} 
                        />
                        
                        {/* ข้อความหัวข้อ */}
                        <Typography 
                            variant="h3" 
                            fontWeight="bold" 
                            sx={{ 
                                fontFamily: 'Sarabun', 
                                textShadow: '0 4px 10px rgba(0,0,0,0.5)', 
                                fontSize: { xs: '2rem', md: '3rem' },
                                lineHeight: 1.2
                            }}
                        >
                            ขยะรีไซเคิล
                        </Typography>

                        {/* ไอคอนเงิน */}
                        <MoneyIcon 
                            sx={{ 
                                fontSize: { xs: 40, md: 56 }, 
                                color: '#FFD700',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                            }} 
                        />
                    </Box>

                    <Typography variant="h6" sx={{ mt: 1, opacity: 0.95, fontWeight: 300, fontFamily: 'Sarabun', maxWidth: '800px', mx: 'auto', textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontSize: { xs: '1rem', md: '1.25rem' } }}>
                        ตรวจสอบราคารับซื้อวัสดุรีไซเคิลประจำวัน แยกขยะให้ถูกวิธี สร้างรายได้ สร้างสิ่งแวดล้อมที่ดี
                    </Typography>
                </Box>

                {/* Grid Cards */}
                {loading ? (
                    <Box display="flex" justifyContent="center" py={10}>
                        <CircularProgress sx={{ color: 'white' }} size={60} thickness={4} />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {wastes.length > 0 ? wastes.map((waste) => (
                            <Grid item xs={12} sm={6} md={3} key={waste.id || waste.waste_id}>
                                <Card 
                                    elevation={6}
                                    sx={{
                                        borderRadius: 4, 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        transition: 'all 0.3s ease',
                                        bgcolor: 'rgba(255, 255, 255, 0.95)', 
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.5)',
                                        '&:hover': { 
                                            transform: 'translateY(-10px)', 
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                            bgcolor: 'white',
                                            borderColor: themeColors.recycle
                                        }
                                    }}
                                >
                                    <CardActionArea 
                                        component={Link} 
                                        to={waste.link || `/sellwaste/${waste.waste_id}`} 
                                        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                                    >
                                        <Box sx={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={waste.image || '/images/default.jpg'}
                                                alt={waste.name}
                                                sx={{ 
                                                    objectFit: 'cover', 
                                                    transition: 'transform 0.5s', 
                                                    '.MuiCardActionArea-root:hover &': { transform: 'scale(1.1)' } 
                                                }}
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }}
                                            />
                                            <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                                                <Chip 
                                                    label="รับซื้อ" 
                                                    size="small" 
                                                    sx={{ 
                                                        bgcolor: themeColors.accent, 
                                                        color: themeColors.textHeader, 
                                                        fontWeight: 'bold', 
                                                        fontFamily: 'Sarabun',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                                    }} 
                                                />
                                            </Box>
                                        </Box>

                                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                            <Typography gutterBottom variant="h5" fontWeight="bold" color={themeColors.textHeader} sx={{ fontFamily: 'Sarabun' }}>
                                                {waste.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: 'Sarabun', minHeight: '40px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {waste.description}
                                            </Typography>
                                            
                                            <Divider sx={{ my: 2 }} />
                                            
                                            <Box display="flex" justifyContent="flex-end" alignItems="center">
                                                <Typography variant="button" sx={{ fontWeight: 'bold', color: themeColors.primary, display: 'flex', alignItems: 'center', fontFamily: 'Sarabun' }}>
                                                    ดูราคา <ArrowForwardIcon sx={{ ml: 1, fontSize: 18 }} />
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )) : (
                            <Grid item xs={12}>
                                <Box textAlign="center" py={8} color="rgba(255,255,255,0.8)">
                                    <RecyclingIcon sx={{ fontSize: 80, opacity: 0.6, mb: 2 }} />
                                    <Typography variant="h5" gutterBottom fontFamily="Sarabun" color="white" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                        ไม่พบข้อมูลขยะรีไซเคิล
                                    </Typography>
                                    <Typography variant="body1" fontFamily="Sarabun">กรุณาลองใหม่อีกครั้งในภายหลัง</Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Container>

            <Footer />
        </Box>
    );
}

export default RecycleWaste;