import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Box } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon, Assessment as LogoIcon } from '@mui/icons-material';

export default function Header({ adminId, adminName, toggleSidebar }) {
    return (
        <AppBar position="sticky" sx={{ bgcolor: '#0F766E', zIndex: 1100 }}> {/* สีองค์กร */}
            <Toolbar>
                {/* ปุ่ม Hamburger menu สำหรับ Mobile และ Desktop */}
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleSidebar}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                {/* ชื่อแอปหรือโลโก้ */}
                <LogoIcon sx={{ mr: 1 }} />
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ flexGrow: 1, fontWeight: 'bold' }}
                >
                    DoiTung Zero-Waste (Admin)
                </Typography>

                {/* ข้อมูลผู้ใช้ */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* ชื่อผู้ใช้งาน */}
                    <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {adminName || `Admin ID: ${adminId}`}
                    </Typography>
                    
                    {/* รูปโปรไฟล์ */}
                    <Avatar 
                        src="/path/to/avatar.jpg" // ต้องเปลี่ยนเป็น Path จริง
                        sx={{ bgcolor: '#4DB6AC' }}
                    >
                        A
                    </Avatar>

                    {/* ปุ่ม logout */}
                    <Button
                        color="inherit"
                        startIcon={<LogoutIcon />}
                        onClick={() => {
                            // ตัวอย่าง logout handler
                            alert('ออกจากระบบสำเร็จ');
                        }}
                    >
                        ออกจากระบบ
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}