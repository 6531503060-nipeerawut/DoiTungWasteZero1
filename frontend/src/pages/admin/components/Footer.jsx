import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => (
    <Box 
        component="footer" 
        sx={{ 
            bgcolor: '#E0E0E0', // สีเทาอ่อน
            textAlign: 'center', 
            p: 1.5, 
            fontSize: 12, 
            color: '#616161' 
        }}
    >
        <Typography variant="caption">
            &copy; {new Date().getFullYear()} Waste Management System | DoiTung Zero-Waste Initiative
        </Typography>
    </Box>
);

export default Footer;