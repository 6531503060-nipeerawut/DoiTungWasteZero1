import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

function Header({ type = 'default' }) {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDropdownOpen]);

    const handleLogout = async () => {
        try {
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}/logout`);
            navigate('/login');
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const renderDefaultNavbar = () => (
        <nav className="navbar navbar-expand-lg navbar-light" style={{ background: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)' }}>
            <Link className="navbar-brand" to="/">
                <Typography variant="h6" color="#ffffff">DoiTung Zero-Waste</Typography>
            </Link>
            <div className="ms-auto" ref={dropdownRef}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleMenuClick}
                    startIcon={<FaBars />}
                    sx={{ backgroundColor: '#4f83cc', '&:hover': { backgroundColor: '#6fa8e5' }}}
                >
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    MenuListProps={{
                        'aria-labelledby': 'menu-button',
                    }}
                >
                    <MenuItem onClick={handleCloseMenu}>
                        <Link className="dropdown-item" to="/waste-price">ราคารับซื้อ</Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu}>
                        <Link className="dropdown-item" to="/category">ประเภทขยะ</Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu}>
                        <Link className="dropdown-item" to="/GarbageTruckSchedule">ตารางรถเก็บขยะ</Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu}>
                        <Link className="dropdown-item" to="/carbons">คำนวณคาร์บอน</Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu}>
                        <Button 
                            className="dropdown-item text-danger"
                            onClick={handleLogout}
                            startIcon={<AccountCircle />}
                        >
                            ออกจากระบบ
                        </Button>
                    </MenuItem>
                </Menu>
            </div>
        </nav>
    );

    const renderMenuNavbar = () => (
        <nav className="navbar navbar-expand-lg navbar-light" style={{ background: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)' }}>
            <Link className="navbar-brand" to="/">
                <Typography variant="h6" color="#ffffff">DoiTung Zero-Waste</Typography>
            </Link>
            <div className="ms-auto" ref={dropdownRef}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleMenuClick}
                    startIcon={<FaBars />}
                    sx={{ backgroundColor: '#4f83cc', '&:hover': { backgroundColor: '#6fa8e5' }}}
                >
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    MenuListProps={{
                        'aria-labelledby': 'menu-button',
                    }}
                >
                    <MenuItem onClick={handleCloseMenu}>
                        <Link className="dropdown-item" to="/waste-price">ราคารับซื้อ</Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu}>
                        <Link className="dropdown-item" to="/category">ประเภทขยะ</Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu}>
                        <Link className="dropdown-item" to="/GarbageTruckSchedule">ตารางรถเก็บขยะ</Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu}>
                        <Link className="dropdown-item" to="/carbons">คำนวณคาร์บอน</Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu}>
                        <Button 
                            className="dropdown-item text-danger"
                            onClick={handleLogout}
                            startIcon={<AccountCircle />}
                        >
                            ออกจากระบบ
                        </Button>
                    </MenuItem>
                </Menu>
            </div>
        </nav>
    );

    return (
        <header>
            {type === 'menu' ? renderMenuNavbar() : renderDefaultNavbar()}
        </header>
    );
}

export default Header;
