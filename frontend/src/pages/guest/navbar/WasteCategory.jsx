// WasteCategory.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

// MUI Components
import { 
    Container, Grid, Paper, Typography, Box, InputBase, 
    IconButton, Card, CardActionArea, CardContent, CardMedia, 
    Chip, CircularProgress, Divider 
} from '@mui/material';

// MUI Icons
import { 
    Search as SearchIcon,
    Category as CategoryIcon,
    ArrowForward as ArrowForwardIcon,
    Recycling as RecyclingIcon
} from '@mui/icons-material';

axios.defaults.withCredentials = true;

// --- Theme Constants ---
const themeColors = {
    primary: '#2E5D4B',    // เขียวแม่ฟ้าหลวง
    secondary: '#8D6E63',  // น้ำตาลดิน
    accent: '#D4AF37',     // ทอง
    bg: '#F7F9F6',         // พื้นหลัง
    textHeader: '#1A3C34'  // เขียวเข้มหัวข้อ
};

function WasteCategory() {
    document.title = "หมวดหมู่ขยะ - DoiTung Zero-Waste";

    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchCategories = async (searchQuery = '') => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/category`, {
                params: { search: searchQuery },
                withCredentials: true
            });
            if (res.data.status?.toLowerCase() === "success") {
                setCategories(res.data.results);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Helper function to map category names to images and links
    const getCategoryInfo = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('ขยะเปื้อน')) return { image: '/images/logo192.jpg', link: '/dirtywaste', color: '#EAB308' }; // Yellow
        if (lower.includes('วัสดุรีไซเคิล')) return { image: '/images/recyclable.jpg', link: '/sellwaste', color: '#43A047' }; // Green
        if (lower.includes('ขยะย่อยสลาย')) return { image: '/images/compostable.jpg', link: '/composablewaste', color: '#8BC34A' }; // Light Green
        if (lower.includes('ขยะพลังงาน')) return { image: '/images/energy.jpg', link: '/energyrdfwaste', color: '#FB8C00' }; // Orange
        if (lower.includes('ขยะอันตราย')) return { image: '/images/hazardous.jpeg', link: '/hazardouswaste', color: '#E53935' }; // Red
        if (lower.includes('ขยะห้องน้ำ')) return { image: '/images/bathroom.jpg', link: '/bathroomwaste', color: '#039BE5' }; // Light Blue
        if (lower.includes('ขยะชิ้นใหญ่')) return { image: '/images/big.jpg', link: '/bigwaste', color: '#5E35B1' }; // Purple
        
        // Sub-categories
        if (lower.includes('พลาสติก')) return { image: '/images/plastic.jpg', link: '/sellwaste/plastic', color: '#1E88E5' };
        if (lower.includes('กระดาษ')) return { image: '/images/paper.jpg', link: '/sellwaste/paper', color: '#795548' };
        if (lower.includes('ขวดแก้ว')) return { image: '/images/glass.jpg', link: '/sellwaste/glass', color: '#43A047' };
        if (lower.includes('โลหะ')) return { image: '/images/metal.jpg', link: '/sellwaste/metal', color: '#607D8B' };

        return { image: '/images/default.jpg', link: '#', color: '#757575' }; // Default Grey
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCategories(search);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: themeColors.bg, fontFamily: 'Sarabun, sans-serif' }}>
            <Header type="menu" />
            
            {/* --- Hero Header Section --- */}
            <Box sx={{ 
                background: `linear-gradient(135deg, ${themeColors.primary} 0%, #1A3C34 100%)`,
                color: 'white',
                pt: 8, pb: 10,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                mb: 4
            }}>
                {/* Decoration Circles */}
                <Box sx={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Box sx={{ position: 'absolute', bottom: -50, right: -50, width: 150, height: 150, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />

                <Container maxWidth="md">
                    <Typography variant="h3" fontWeight="bold" sx={{ fontFamily: 'Sarabun', mb: 2 }}>
                        ประเภทขยะ
                    </Typography>
                    <Typography variant="h6" sx={{ fontFamily: 'Sarabun', opacity: 0.9, fontWeight: 300 }}>
                        เรียนรู้การแยกขยะแต่ละประเภทอย่างถูกต้อง
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ flexGrow: 1, mt: -8, mb: 8, position: 'relative', zIndex: 2 }}>
                
                {/* --- Search Bar --- */}
                <Paper
                    component="form"
                    onSubmit={handleSearch}
                    elevation={3}
                    sx={{
                        p: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: 600,
                        mx: 'auto',
                        mb: 6,
                        borderRadius: 50,
                        border: '1px solid #E0E0E0'
                    }}
                >
                    <InputBase
                        sx={{ ml: 3, flex: 1, fontFamily: 'Sarabun', fontSize: '1.1rem' }}
                        placeholder="ค้นหาประเภทขยะ เช่น ขวดพลาสติก, กระดาษ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <IconButton type="submit" sx={{ p: '10px', bgcolor: themeColors.accent, color: 'white', mr: 0.5, '&:hover': { bgcolor: '#C09E30' } }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>

                {/* --- Categories Grid --- */}
                {loading ? (
                    <Box display="flex" justifyContent="center" py={5}>
                        <CircularProgress sx={{ color: themeColors.primary }} />
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {categories.length > 0 ? (
                            categories.map((cat) => {
                                const info = getCategoryInfo(cat.name);
                                
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={cat.category_id}>
                                        <Card 
                                            sx={{ 
                                                borderRadius: 4, 
                                                height: '100%', 
                                                display: 'flex', 
                                                flexDirection: 'column',
                                                transition: '0.3s',
                                                border: '1px solid transparent',
                                                '&:hover': { 
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                                                    borderColor: info.color
                                                }
                                            }}
                                        >
                                            <CardActionArea component={Link} to={info.link} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                                                
                                                {/* Category Image */}
                                                <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="200"
                                                        image={info.image}
                                                        alt={cat.name}
                                                        sx={{ 
                                                            transition: 'transform 0.5s',
                                                            '.MuiCardActionArea-root:hover &': { transform: 'scale(1.1)' }
                                                        }}
                                                    />
                                                    {/* Tag Overlay */}
                                                    <Box sx={{ position: 'absolute', top: 15, right: 15 }}>
                                                        <Chip 
                                                            label="หมวดหมู่" 
                                                            size="small"
                                                            icon={<CategoryIcon style={{ fontSize: 16, color: 'white' }} />}
                                                            sx={{ 
                                                                bgcolor: info.color, 
                                                                color: 'white', 
                                                                fontWeight: 'bold',
                                                                fontFamily: 'Sarabun',
                                                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                                            }} 
                                                        />
                                                    </Box>
                                                </Box>

                                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                                    <Typography gutterBottom variant="h5" component="div" fontWeight="bold" color={themeColors.textHeader} sx={{ fontFamily: 'Sarabun' }}>
                                                        {cat.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Sarabun', mb: 2, minHeight: '40px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                        {cat.description || 'รายละเอียดและวิธีการจัดการขยะประเภทนี้อย่างถูกต้อง...'}
                                                    </Typography>
                                                    
                                                    <Divider sx={{ my: 2 }} />
                                                    
                                                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                                                        <Typography variant="button" sx={{ fontFamily: 'Sarabun', fontWeight: 'bold', color: info.color, display: 'flex', alignItems: 'center' }}>
                                                            ดูรายละเอียด <ArrowForwardIcon sx={{ ml: 1, fontSize: 18 }} />
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                );
                            })
                        ) : (
                            // Empty State
                            <Grid item xs={12}>
                                <Box textAlign="center" py={8} color="text.secondary">
                                    <RecyclingIcon sx={{ fontSize: 80, opacity: 0.3, mb: 2 }} />
                                    <Typography variant="h5" fontFamily="Sarabun" gutterBottom>
                                        ไม่พบข้อมูลหมวดหมู่ขยะ
                                    </Typography>
                                    <Typography variant="body1" fontFamily="Sarabun">
                                        ลองค้นหาด้วยคำอื่น หรือตรวจสอบการสะกดคำ
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Container>

            <Footer />
        </div>
    );
}

export default WasteCategory;