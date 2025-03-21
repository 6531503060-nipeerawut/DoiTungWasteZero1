import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTrash, FaTachometerAlt, FaBars } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Home() {
    document.title = "DoiTung Zero-Waste";
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}`)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
    }, []);

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

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Navbar */}
            <nav className="navbar navbar-light bg-light d-flex justify-content-between p-3">
                <span className="navbar-brand font-weight-bold">Doitung Zero - Waste</span>
                <div className="dropdown" ref={dropdownRef}>
                    <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                    >
                        <FaBars />
                    </button>
                    <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`}>
                        <li><Link className="dropdown-item" to="/prices">ราคารับซื้อ</Link></li>
                        <li><Link className="dropdown-item" to="/separate-waste">วิธีการแยกชนิดขยะ</Link></li>
                        <li><Link className="dropdown-item" to="/garbage-truck">ตารางรถเก็บขยะ</Link></li>
                        <li><Link className="dropdown-item" to="/carbons">คำนวณคาร์บอน</Link></li>
                        <li><button className="dropdown-item text-danger" onClick={handleLogout}>ออกจากระบบ</button></li>
                    </ul>
                </div>
            </nav>

            {/* Body */}
            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-start">
                <h1 className="mb-3" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>ผู้เข้าชม</h1>
                <img
                    src="https://www.doitung.com/wp-content/uploads/2024/02/%E0%B8%AA%E0%B8%A7%E0%B8%99%E0%B9%81%E0%B8%A1%E0%B9%88%E0%B8%9F%E0%B9%89%E0%B8%B2%E0%B8%AB%E0%B8%A5%E0%B8%A7%E0%B8%87-1.jpg"
                    alt="Doitung Zero Waste"
                    className="img-fluid rounded w-100"
                    style={{ maxWidth: '600px', height: 'auto' }}
                />
            </div>

            {/* Footer */}
            <footer className="bg-light py-3 d-flex justify-content-around border-top mt-auto">
                <Link to="/" className="text-dark text-decoration-none"><FaHome size={30} /></Link>
                <Link to="/waste-data" className="text-dark text-decoration-none"><FaTrash size={30} /></Link>
                <Link to="#" className="text-dark text-decoration-none"><FaTachometerAlt size={30} /></Link>
            </footer>
        </div>
    );
}

export default Home;