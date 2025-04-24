import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaTrash, FaTachometerAlt, FaPlus } from 'react-icons/fa';
import { Box, IconButton } from '@mui/material';

function Footer() {
    return (
        <footer style={{ backgroundColor: '#f4f4f4', padding: '8px 0', borderTop: '2px solid #e0e0e0', marginTop: 'auto' }}>
            <Box
                display="flex"
                justifyContent="space-around"
                alignItems="center"
                width="100%"
            >
                <Link to="/v/homevillager" style={{ textDecoration: 'none' }}>
                    <IconButton
                        color="primary"
                        sx={{
                            '&:hover': { transform: 'scale(1.2)', color: '#1976d2' },
                            transition: 'transform 0.3s ease, color 0.3s ease'
                        }}
                    >
                        <FaHome size={30} />
                    </IconButton>
                </Link>

                <Link to="/v/wastedatavillager" style={{ textDecoration: 'none' }}>
                    <IconButton
                        color="primary"
                        sx={{
                            '&:hover': { transform: 'scale(1.2)', color: '#1976d2' },
                            transition: 'transform 0.3s ease, color 0.3s ease'
                        }}
                    >
                        <FaTrash size={30} />
                    </IconButton>
                </Link>

                <Link to="/v/addingwastevillager" style={{ textDecoration: 'none' }}>
                    <IconButton
                        color="primary"
                        sx={{
                            '&:hover': { transform: 'scale(1.2)', color: '#1976d2' },
                            transition: 'transform 0.3s ease, color 0.3s ease'
                        }}
                    >
                        <FaPlus size={30} />
                    </IconButton>
                </Link>

                <Link to="/v/dashboard" style={{ textDecoration: 'none' }}>
                    <IconButton
                        color="primary"
                        sx={{
                            '&:hover': { transform: 'scale(1.2)', color: '#1976d2' },
                            transition: 'transform 0.3s ease, color 0.3s ease'
                        }}
                    >
                        <FaTachometerAlt size={30} />
                    </IconButton>
                </Link>
            </Box>
        </footer>
    );
}

export default Footer;
