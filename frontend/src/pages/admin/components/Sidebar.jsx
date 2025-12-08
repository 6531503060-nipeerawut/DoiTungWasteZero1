import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material';
import { Dashboard as DashboardIcon, UploadFile as UploadIcon } from '@mui/icons-material';

const Sidebar = () => (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', height: '100%' }}>
        <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid #eee' }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
                เมนูจัดการระบบ
            </Typography>
        </Box>
        <List>
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/">
                    <ListItemIcon>
                        <DashboardIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="แดชบอร์ดภาพรวม" />
                </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/upload">
                    <ListItemIcon>
                        <UploadIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="อัปโหลดข้อมูล Excel" />
                </ListItemButton>
            </ListItem>
        </List>
        <Divider />
        {/* สามารถเพิ่มเมนูอื่นๆ ได้ที่นี่ */}
    </Box>
);

export default Sidebar;