// Footer.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';
import {
    Home as HomeIcon,
    RestoreFromTrash as TrashIcon,
    Dashboard as DashboardIcon
} from '@mui/icons-material';

function Footer() {
    const location = useLocation();

    // สีทองเมื่อ Active, สีขาวจางๆ เมื่อ Inactive
    const getColor = (path) => location.pathname === path ? '#D4AF37' : 'rgba(255,255,255,0.6)';
    const getScale = (path) => location.pathname === path ? 'scale(1.1)' : 'scale(1)';

    const navItemStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "all 0.3s ease",
        cursor: 'pointer'
    };

    return (
        <Paper
            sx={{
                position: 'sticky',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#1A3C34', // เขียวเข้มเกือบดำ
                color: 'white',
                borderRadius: '15px 15px 0 0', // โค้งมนด้านบนเล็กน้อย
                zIndex: 1000,
                borderTop: '3px solid #D4AF37' // เส้นคาดสีทอง
            }}
            elevation={10}
        >
            <Box display="flex" justifyContent="space-around" alignItems="center" py={1.5}>
                
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <Box sx={{ ...navItemStyle, transform: getScale('/') }}>
                        <HomeIcon sx={{ color: getColor('/'), fontSize: 28 }} />
                        <Typography variant="caption" sx={{ color: getColor('/'), mt: 0.5, fontWeight: 500 }}>
                            หน้าหลัก
                        </Typography>
                    </Box>
                </Link>

                <Link to="/wastedata" style={{ textDecoration: 'none' }}>
                    <Box sx={{ ...navItemStyle, transform: getScale('/wastedata') }}>
                        <TrashIcon sx={{ color: getColor('/wastedata'), fontSize: 28 }} />
                        <Typography variant="caption" sx={{ color: getColor('/wastedata'), mt: 0.5, fontWeight: 500 }}>
                            ข้อมูลขยะ
                        </Typography>
                    </Box>
                </Link>

                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Box sx={{ ...navItemStyle, transform: getScale('/dashboard') }}>
                        <DashboardIcon sx={{ color: getColor('/dashboard'), fontSize: 28 }} />
                        <Typography variant="caption" sx={{ color: getColor('/dashboard'), mt: 0.5, fontWeight: 500 }}>
                            แดชบอร์ด
                        </Typography>
                    </Box>
                </Link>

            </Box>
        </Paper>
    );
}

export default Footer;