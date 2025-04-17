import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';

function Header({ type = 'default' }) {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
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

    const renderDefaultNavbar = () => (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
            <Link className="navbar-brand" to="/">DoiTung Zero-Waste</Link>
            <div className="ms-auto" ref={dropdownRef}>
                <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                >
                    <FaBars />
                </button>

                <ul className={`dropdown-menu dropdown-menu-end mt-2 ${isDropdownOpen ? 'show' : ''}`} style={{ right: 0 }}>
                    <li><Link className="dropdown-item" to="/waste-price">ราคารับซื้อ</Link></li>
                    <li><Link className="dropdown-item" to="/category">วิธีการแยกชนิดขยะ</Link></li>
                    <li><Link className="dropdown-item" to="/GarbageTruckSchedule">ตารางรถเก็บขยะ</Link></li>
                    <li><Link className="dropdown-item" to="/carbons">คำนวณคาร์บอน</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>ออกจากระบบ</button></li>
                </ul>
            </div>
        </nav>
    );

    const renderMenuNavbar = () => (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
            <Link className="navbar-brand" to="/">DoiTung Zero-Waste</Link>
            <div className="ms-auto" ref={dropdownRef}>
                <button
                    className="btn btn-primary dropdown-toggle"
                    type="button"
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                >
                    <FaBars />
                </button>

                <ul className={`dropdown-menu dropdown-menu-end mt-2 ${isDropdownOpen ? 'show' : ''}`} style={{ right: 0 }}>
                    <li><Link className="dropdown-item" to="/waste-price">ราคารับซื้อ</Link></li>
                    <li><Link className="dropdown-item" to="/category">วิธีการแยกชนิดขยะ</Link></li>
                    <li><Link className="dropdown-item" to="/GarbageTruckSchedule">ตารางรถเก็บขยะ</Link></li>
                    <li><Link className="dropdown-item" to="/carbons">คำนวณคาร์บอน</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>ออกจากระบบ</button></li>
                </ul>
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