import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

function Header({ type = 'default', collId }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const isDropdownOpen = Boolean(anchorEl);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setAnchorEl(null);
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

    const navLinks = [
        { to: '/c/wastepricecollector', label: 'ราคารับซื้อ' },
        { to: '/c/category', label: 'ประเภทขยะ' },
        { to: '/c/garbagetruckschedulecollector', label: 'ตารางรถเก็บขยะ' },
        { to: '/carbons', label: 'คำนวณคาร์บอน' },
        { to: `/c/profile-collector/${collId}`, label: 'บัญชีผู้ใช้' }
    ];

    const renderNavbar = () => (
        <nav className="navbar navbar-expand-lg navbar-light" style={{ background: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)' }}>
            <Link className="navbar-brand" to="/c/homecollector">
                <Typography variant="h6" color="#ffffff">DoiTung Zero-Waste</Typography>
            </Link>
            <div className="ms-auto" ref={dropdownRef}>
                <Button 
                    variant="contained" 
                    color={type === 'menu' ? 'primary' : 'secondary'} 
                    onClick={handleMenuClick}
                    startIcon={<FaBars />}
                    sx={{ backgroundColor: '#4f83cc', '&:hover': { backgroundColor: '#6fa8e5' }}}
                >
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    MenuListProps={{ 'aria-labelledby': 'menu-button' }}
                >
                    {navLinks.map(({ to, label }) => (
                        <MenuItem onClick={handleCloseMenu} key={to}>
                            <Link className="dropdown-item" to={to}>{label}</Link>
                        </MenuItem>
                    ))}
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
            {renderNavbar()}
        </header>
    );
}

export default Header;
