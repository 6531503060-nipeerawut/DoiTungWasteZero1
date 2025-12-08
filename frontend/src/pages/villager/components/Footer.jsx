// Footer.jsx (villager)
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';
import { 
    Home as HomeIcon, 
    RestoreFromTrash as TrashIcon, 
    AddCircle as AddCircleIcon, 
    Dashboard as DashboardIcon 
} from '@mui/icons-material';

function Footer() {
    const location = useLocation();
    const currentPath = location.pathname;
    const isActive = (path) => currentPath.startsWith(path);

    // Theme Colors
    const BG_COLOR = '#1A3C34'; 
    const ACTIVE_COLOR = '#D4AF37'; // สีทอง (สำหรับปุ่มทั่วไป)
    const SAVE_ACTIVE_COLOR = '#4CAF50'; // 💡 สีเขียว (สำหรับปุ่มบันทึกโดยเฉพาะ)
    const INACTIVE_COLOR = '#A3B1AD';

    return (
        <Paper 
            sx={{ 
                position: 'sticky', 
                bottom: 0, 
                left: 0, 
                right: 0,
                zIndex: 1000,
                borderRadius: '20px 20px 0 0',
                bgcolor: BG_COLOR,
                boxShadow: '0px -5px 15px rgba(0,0,0,0.15)',
                height: '80px', 
                pb: 1,
                borderTop: '3px solid #D4AF37'
            }} 
            elevation={10}
        >
            <Box 
                display="flex" 
                justifyContent="space-between"
                alignItems="flex-end" 
                height="100%"
                px={0}
            >
                {/* 1. หน้าหลัก */}
                <NavButton 
                    to="/v/homevillager" 
                    icon={<HomeIcon />} 
                    label="หน้าหลัก" 
                    active={isActive('/v/homevillager')} 
                    activeColor={ACTIVE_COLOR} 
                    inactiveColor={INACTIVE_COLOR} 
                />

                {/* 2. รายการ */}
                <NavButton 
                    to="/v/wastedatavillager" 
                    icon={<TrashIcon />} 
                    label="รายการ" 
                    active={isActive('/v/wastedatavillager')} 
                    activeColor={ACTIVE_COLOR} 
                    inactiveColor={INACTIVE_COLOR} 
                />

                {/* 3. ปุ่มบันทึก (สีเขียวเมื่อ Active) */}
                <NavButton 
                    to="/v/addingwastevillager"
                    icon={<AddCircleIcon />} 
                    label="บันทึก"
                    active={isActive('/v/addingwastevillager')}
                    activeColor={SAVE_ACTIVE_COLOR} // 💡 ใช้สีเขียวที่ประกาศไว้
                    inactiveColor={INACTIVE_COLOR}
                />

                {/* 4. สรุป */}
                <NavButton 
                    to="/v/dashboard" 
                    icon={<DashboardIcon />} 
                    label="สรุป" 
                    active={isActive('/v/dashboard')} 
                    activeColor={ACTIVE_COLOR} 
                    inactiveColor={INACTIVE_COLOR} 
                />
            </Box>
        </Paper>
    );
}

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

const NavButton = ({ to, icon, label, active, activeColor, inactiveColor }) => (
    <Link to={to} style={{ textDecoration: 'none', flex: 1, display: 'flex', justifyContent: 'center', height: '100%' }}>
        <Box 
            display="flex" 
            flexDirection="column" 
            justifyContent="flex-end" 
            alignItems="center"
            pb={1.5} 
            sx={{ 
                color: active ? activeColor : inactiveColor, // 💡 สีจะเปลี่ยนตาม activeColor ที่ส่งมา
                width: '100%',
                transition: '0.3s',
                transform: active ? 'translateY(-2px)' : 'none'
            }}
        >
            {/* ไอคอน */}
            {React.cloneElement(icon, { sx: { fontSize: 30, mb: 0.5 } })} 
            
            {/* ข้อความ Label */}
            <Typography 
                variant="caption" 
                sx={{ 
                    fontSize: '0.75rem', 
                    fontFamily: 'Sarabun', 
                    fontWeight: active ? 700 : 400, 
                    lineHeight: 1
                }}
            >
                {label}
            </Typography>
        </Box>
    </Link>
);

export default Footer;