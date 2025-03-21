import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTrash, FaPlus, FaTachometerAlt, FaBars } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

axios.defaults.withCredentials = true;

function HomeVillager() {
    document.title = "DoiTung Zero-Waste";
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const [villId, setVillId] = useState(null);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v/homevillager`, { withCredentials: true });
                if (res.data.status?.toLowerCase() === "success") {
                    setAuth(true);
                    setVillId(res.data.vill_id);
                } else {
                    setAuth(false);
                    setMessage(res.data.error || "Unauthorized access");
                }
            } catch (err) {
                console.log("Error fetching auth status:", err);
                setMessage("Error connecting to server");
            } finally {
                setLoading(false);
            }
        };
        fetchAuthStatus();
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
            setAuth(false);
            navigate('/login');
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <h3>Loading...</h3>
            </div>
        );
    }

    return (
        <div className='container-fluid d-flex flex-column min-vh-100'>
            {auth ? (
                <>
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
                                <li><Link className="dropdown-item" to={`/v/profile-villager/${villId}`}>บัญชีผู้ใช้</Link></li>
                                <li><button className="dropdown-item text-danger" onClick={handleLogout}>ออกจากระบบ</button></li>
                            </ul>
                        </div>
                    </nav>

                    {/* Body */}
                    <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                        <img src="https://www.doitung.com/wp-content/uploads/2024/02/%E0%B8%AA%E0%B8%A7%E0%B8%99%E0%B9%81%E0%B8%A1%E0%B9%88%E0%B8%9F%E0%B9%89%E0%B8%B2%E0%B8%AB%E0%B8%A5%E0%B8%A7%E0%B8%87-1.jpg"
                            alt="Doitung Zero Waste"
                            className="img-fluid rounded w-100"
                            style={{ maxWidth: '600px', height: 'auto' }} />
                    </div>


                    {/* Footer */}
                    <footer className="bg-light py-3 d-flex justify-content-around border-top mt-auto">
                        <Link to="/v/homevillager" className="text-dark text-decoration-none"><FaHome size={30} /></Link>
                        <Link to="/v/wastedatavillager" className="text-dark text-decoration-none"><FaTrash size={30} /></Link>
                        <Link to="/v/addingwastevillager" className="text-dark text-decoration-none"><FaPlus size={30} /></Link>
                        <Link to="/dashboard" className="text-dark text-decoration-none"><FaTachometerAlt size={30} /></Link>
                    </footer>
                </>
            ) : (
                <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
                    <h3>{message}</h3>
                    <h3>Login Now</h3>
                    <Link to="/login" className='btn btn-primary'>Login</Link>
                </div>
            )}
        </div>
    );
}

export default HomeVillager;