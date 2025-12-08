//Header.jsx (Guest)
import React, { useState } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Box, 
    Container, 
    Button, 
    IconButton,
    Drawer,
    List,
    ListItem,
    Divider
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu'; 
import LoginIcon from '@mui/icons-material/Login';
import RecyclingIcon from '@mui/icons-material/Recycling';

// Icons สำหรับเมนูใน Drawer (Mobile)
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CategoryIcon from '@mui/icons-material/Category';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import Co2Icon from '@mui/icons-material/Co2';
import HomeIcon from '@mui/icons-material/Home';

// รายการเมนูตามที่คุณต้องการ
const menuItems = [
    // ผมขออนุญาตเพิ่มหน้าหลักเข้าไปด้วยเพื่อให้ Navigation สมบูรณ์
    { label: 'หน้าหลัก', path: '/', icon: <HomeIcon /> }, 
    { label: 'ราคารับซื้อ', path: '/waste-price', icon: <MonetizationOnIcon /> },
    { label: 'ประเภทขยะ', path: '/category', icon: <CategoryIcon /> },
    { label: 'ตารางรถเก็บขยะ', path: '/GarbageTruckSchedule', icon: <DirectionsBusIcon /> },
    { label: 'คำนวณคาร์บอน', path: '/notfoundguest', icon: <Co2Icon /> },
];

function Header() {
    const location = useLocation();
    
    // State สำหรับ Mobile Drawer (เมนูด้านข้าง)
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // เช็ค Active Link
    const isActive = (path) => location.pathname === path;

    // --- ส่วนแสดงผล Mobile Drawer (เมนูสไลด์ข้าง) ---
const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
        <Box sx={{ py: 2, backgroundColor: '#1A3C34', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <RecyclingIcon />
            <Typography variant="h6" sx={{ fontFamily: 'Sarabun' }}>
                เมนูหลัก
            </Typography>
        </Box>
        <Divider />
        <List>
            {menuItems.map((item) => (
                <ListItem 
                    key={item.label} 
                    component={Link} 
                    to={item.path}
                    disablePadding
                    sx={{ 
                        color: isActive(item.path) ? '#2E5D4B' : 'inherit',
                        backgroundColor: isActive(item.path) ? '#F4F6F0' : 'transparent',
                        borderRight: isActive(item.path) ? '4px solid #D4AF37' : 'none'
                    }}
                >
                    <Button 
                        fullWidth 
                        startIcon={item.icon}
                        sx={{ 
                            justifyContent: 'flex-start', 
                            color: 'inherit',
                            py: 1.5,
                            pl: 3,
                            fontFamily: 'Sarabun',
                            fontWeight: isActive(item.path) ? 700 : 400,
                            textTransform: 'none'
                        }}
                    >
                        {item.label}
                    </Button>
                </ListItem>
            ))}

            <Divider sx={{ my: 1 }} />

            {/* ปุ่มเข้าสู่ระบบสำหรับ Mobile Drawer */}
            <ListItem disablePadding>
                <Button
                    component={Link}
                    to="/login"
                    fullWidth
                    startIcon={<LoginIcon />}
                    sx={{
                        justifyContent: 'flex-start',
                        color: '#D4AF37',
                        py: 1.5,
                        pl: 3,
                        fontFamily: 'Sarabun',
                        fontWeight: 500,
                        textTransform: 'none'
                    }}
                >
                    เข้าสู่ระบบ
                </Button>
            </ListItem>

        </List>
    </Box>
);


    return (
        <>
            <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#2E5D4B',borderBottom: '2px solid #D4AF37', zIndex: 1200 }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ minHeight: { xs: 60, md: 70 }, justifyContent: 'space-between' }}>
                        
                        {/* 1. Mobile Hamburger Icon (Left) */}
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { md: 'none' }, color: '#D4AF37' }} // สีทอง
                        >
                            <MenuIcon />
                        </IconButton>

                        {/* 2. Branding / Logo */}
                        <Box 
                            display="flex" 
                            alignItems="center" 
                            gap={1.5} 
                            component={Link} 
                            to="/" 
                            sx={{ 
                                textDecoration: 'none', 
                                color: 'inherit',
                                flexGrow: { xs: 1, md: 0 }
                            }}
                        >
                            {/* โลโก้เดียวกับ Collector */}
                            <Box 
                                sx={{
                                    bgcolor: 'white',
                                    borderRadius: '50%',
                                    p: 0.7,
                                    display: 'flex',
                                }}
                            >
                                <RecyclingIcon sx={{ color: '#2E5D4B', fontSize: { xs: 26, md: 30 } }} />
                            </Box>

                            <Box>
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{
                                        fontWeight: 700, 
                                        lineHeight: 1.2, 
                                        color: '#fff',
                                        fontSize: { xs: '0.9rem', md: '1rem'}
                                    }}
                                >
                                    DoiTung Zero-Waste
                                </Typography>
                            </Box>
                        </Box>

                        {/* 3. Desktop Menu (Center/Right) */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, mx: 4 }}>
                            {menuItems.map((item) => (
                                <Button
                                    key={item.label}
                                    component={Link}
                                    to={item.path}
                                    sx={{
                                        my: 2,
                                        color: isActive(item.path) ? '#D4AF37' : 'white',
                                        fontWeight: isActive(item.path) ? 700 : 400,
                                        fontSize: '0.95rem',
                                        fontFamily: 'Sarabun, sans-serif',
                                        whiteSpace: 'nowrap',
                                        '&:hover': { color: '#D4AF37', bgcolor: 'transparent' }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>

                        {/* 4. Login Button */}
                        <Box sx={{ flexGrow: 0 }}>
                            <Button 
                                component={Link}
                                to="/login"
                                variant="outlined" 
                                sx={{ 
                                    color: '#D4AF37', 
                                    borderColor: '#D4AF37',
                                    borderRadius: '20px',
                                    px: 3,
                                    fontFamily: 'Sarabun',
                                    display: { xs: 'none', md: 'flex' },
                                    '&:hover': { borderColor: '#fff', color: '#fff', bgcolor: 'rgba(212, 175, 55, 0.1)' }
                                }}
                            >
                                เข้าสู่ระบบ
                            </Button>
                            {/* Mobile Login Icon */}
                            <IconButton component={Link} to="/login" sx={{ display: { xs: 'flex', md: 'none' }, color: '#D4AF37' }}>
                                <LoginIcon />
                            </IconButton>
                        </Box>

                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer Implementation */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }} // Better open performance on mobile.
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
}

export default Header;