// HeaderCollector.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    Divider
} from '@mui/material';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CategoryIcon from '@mui/icons-material/Category';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import Co2Icon from '@mui/icons-material/Co2';
import RecyclingIcon from '@mui/icons-material/Recycling';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

function HeaderCollector({ collId }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const handleLogout = async () => {
        try {
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}/logout`);
            navigate('/login');
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { label: 'หน้าหลัก', path: '/c/homecollector', icon: <HomeIcon /> },
        { label: 'ราคารับซื้อ', path: '/c/wastepricecollector', icon: <MonetizationOnIcon /> },
        { label: 'ประเภทขยะ', path: '/c/categorycollector', icon: <CategoryIcon /> },
        { label: 'ตารางรถเก็บขยะ', path: '/c/garbagetruckschedulecollector', icon: <DirectionsBusIcon /> },
        { label: 'คำนวณคาร์บอน', path: '/c/notfoundcollector', icon: <Co2Icon /> },
        { label: 'ข้อมูลส่วนตัว', path: `/c/profile-collector/${collId}`, icon: <PersonIcon /> },
    ];

    // Mobile Drawer
    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Box sx={{ py: 2, backgroundColor: '#2E5D4B', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <RecyclingIcon />
                <Typography variant="h6" sx={{ fontFamily: 'Sarabun' }}>
                    เมนูหลัก
                </Typography>
            </Box>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <Button
                        key={item.label}
                        component={Link}
                        to={item.path}
                        fullWidth
                        startIcon={item.icon}
                        sx={{
                            justifyContent: 'flex-start',
                            color: isActive(item.path) ? '#1A3C34' : 'inherit',
                            backgroundColor: isActive(item.path) ? '#F4F6F0' : 'transparent',
                            borderRight: isActive(item.path) ? '4px solid #D4AF37' : 'none',
                            py: 1.5,
                            pl: 3,
                            fontFamily: 'Sarabun',
                            fontWeight: isActive(item.path) ? 700 : 400,
                            textTransform: 'none',
                            '& .MuiButton-startIcon': {
                                display: { xs: 'inline-flex', md: 'none' } // icon เฉพาะ mobile
                            }
                        }}
                    >
                        {item.label}
                    </Button>
                ))}

                <Divider sx={{ my: 1 }} />

                <Button
                    onClick={handleLogout}
                    fullWidth
                    startIcon={<LogoutIcon />}
                    sx={{
                        justifyContent: 'flex-start',
                        color: '#D4AF37',
                        py: 1.5,
                        pl: 3,
                        fontFamily: 'Sarabun',
                        fontWeight: 400,
                        textTransform: 'none',
                        '& .MuiButton-startIcon': {
                            display: { xs: 'inline-flex', md: 'none' } // icon เฉพาะ mobile
                        }
                    }}
                >
                    ออกจากระบบ
                </Button>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#2E5D4B',borderBottom: '2px solid #D4AF37', zIndex: 1200 }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ minHeight: { xs: 60, md: 70 }, justifyContent: 'space-between' }}>

                        {/* Mobile Hamburger */}
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { md: 'none' }, color: '#D4AF37' }}
                        >
                            <MenuIcon />
                        </IconButton>

                        {/* Branding */}
                        <Box display="flex" alignItems="center" gap={1.5} component={Link} to="/c/homecollector" sx={{ textDecoration: 'none', color: 'inherit', flexGrow: { xs: 1, md: 0 } }}>
                            <Box sx={{ bgcolor: 'white', borderRadius: '50%', p: 0.7, display: 'flex' }}>
                                <RecyclingIcon sx={{ color: '#2E5D4B', fontSize: { xs: 26, md: 30 } }} />
                            </Box>
                            <Box>
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ fontWeight: 700, lineHeight: 1.2, color: '#fff', fontSize: { xs: '0.9rem', md: '1rem' } 
                                }}
                                >
                                    DoiTung Zero-Waste
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#D4AF37',
                                        display: { xs: 'block', md: 'block' },
                                        fontFamily: 'Sarabun',
                                        fontSize: { xs: '0.7rem', md: '0.85rem' },
                                        lineHeight: 1.2 
                                                                 }}
                                >
                                    สำหรับเจ้าหน้าที่ (Collector)
                                </Typography>
                            </Box>
                        </Box>

                        {/* Desktop Menu */}
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
                                        textTransform: 'none',
                                        '&:hover': { color: '#D4AF37', bgcolor: 'transparent' }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>

                        {/* Logout */}
                        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* Desktop Logout */}
                            <Button
                                onClick={handleLogout}
                                variant="outlined"
                                sx={{
                                    color: '#D4AF37',
                                    borderColor: '#D4AF37',
                                    borderRadius: '20px',
                                    px: 3,
                                    fontFamily: 'Sarabun',
                                    display: { xs: 'none', md: 'flex' },
                                    '&:hover': { borderColor: '#fff', color: '#fff', bgcolor: 'rgba(239, 68, 68, 0.1)' }
                                }}
                            >
                                ออกจากระบบ
                            </Button>

                            {/* Mobile Logout Icon */}
                            <IconButton
                                onClick={handleLogout}
                                sx={{ display: { xs: 'flex', md: 'none' }, color: '#D4AF37' }}
                            >
                                <LogoutIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
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

export default HeaderCollector;
