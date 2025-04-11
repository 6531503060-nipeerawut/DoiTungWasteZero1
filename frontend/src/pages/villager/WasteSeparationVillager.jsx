import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTrash, FaPlus, FaTachometerAlt, FaBars } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

axios.defaults.withCredentials = true;

function WasteSeparationVillager() {
    document.title = "DoiTung Zero-Waste";
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const [villId, setVillId] = useState(null);

    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');

    const fetchCategories = async (searchQuery = '') => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v/categoryvillager`, { params: { search: searchQuery }, withCredentials: true });
            if (res.data.status?.toLowerCase() === "success") {
                setAuth(true);
                setVillId(res.data.vill_id);
                setCategories(res.data.results);
            } else {
                setAuth(false);
                setMessage(res.data.error || "Unauthorized access");
            }
        } catch (err) {
            console.log("Error fetching categories:", err);
            setMessage("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
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

    const getCategoryInfo = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('ขยะเปื้อน')) {
            return { image: '/images/logo192.png', link: '/v/DirtyWasteVillager' };
        }
        if (lower.includes('ขยะขายได้')) {
            return { image: '/images/organic.jpg', link: '/v/sellwastevillager' };
        }
        if (lower.includes('ขยะย่อยสลายได้')) {
            return { image: '/images/hazardous.jpg', link: '/v/composablewastevillager' };
        }
        if (lower.includes('ขยะพลังงาน')) {
            return { image: '/images/energy.jpg', link: '/v/energyrdfwastevillager' };
        }
        if (lower.includes('ขยะอันตราย')) {
            return { image: '/images/Hazardous.jpg', link: '/v/hazardouswastevillager' };
        }
        if (lower.includes('ขยะห้องน้ำ/ปนเปื้อน')) {
            return { image: '/images/Bathroom.jpg', link: '/v/bathroomwastevillager' };
        }
        if (lower.includes('ขยะชิ้นใหญ่')) {
            return { image: '/images/Big.jpg', link: '/v/bigwastevillager' };
        }
        return { image: '/images/default.jpg', link: '#' };
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        fetchCategories(search);
    };

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
                                <li><Link className="dropdown-item" to="/v/wastepricevillager">ราคารับซื้อ</Link></li>
                                <li><Link className="dropdown-item" to="/v/categoryvillager">วิธีการแยกชนิดขยะ</Link></li>
                                <li><Link className="dropdown-item" to="/v/garbagetruckschedulevillager">ตารางรถเก็บขยะ</Link></li>
                                <li><Link className="dropdown-item" to="/carbons">คำนวณคาร์บอน</Link></li>
                                <li><Link className="dropdown-item" to={`/v/profile-villager/${villId}`}>บัญชีผู้ใช้</Link></li>
                                <li><button className="dropdown-item text-danger" onClick={handleLogout}>ออกจากระบบ</button></li>
                            </ul>
                        </div>
                    </nav>

                    {/* Body */}
                    <div className="p-6 max-w-6xl mx-auto">
                        <h1 className="text-2xl font-bold mb-4">ประเภทขยะ</h1>

                        <form onSubmit={handleSearch} className="mb-6 flex gap-3">
                            <input
                            type="text"
                            placeholder="ค้นหา..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-4 py-2 rounded w-full"
                            />
                            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
                            ค้นหา
                            </button>
                        </form>

                        {loading ? (
                            <p>กำลังโหลด...</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {categories.map((cat) => {
                                const { image, link } = getCategoryInfo(cat.name);
                                return (
                                <div key={cat.id} className="border rounded-xl shadow hover:shadow-lg transition p-4">
                                    <h2 className="text-xl font-semibold mb-1">{cat.name}</h2>
                                    <Link to={link}>
                                    <img
                                        src={image}
                                        alt={cat.name}
                                        className="w-full h-48 object-cover rounded-md mb-3 cursor-pointer"
                                    />
                                    </Link>
                                    <p className="text-gray-600">{cat.description}</p>
                                </div>
                                );
                            })}
                            </div>
                        )}
                    </div>


                     {/* Footer */}
                    <footer className="bg-light py-3 d-flex justify-content-around border-top mt-auto">
                    <Link to="/v/homevillager" className="text-dark text-decoration-none"><FaHome size={30} /></Link>
                    <Link to="/v/wastedatavillager" className="text-dark text-decoration-none"><FaTrash size={30} /></Link>
                    <Link to="/v/addingwastevillager" className="text-dark text-decoration-none"><FaPlus size={30} /></Link>
                    <Link to="/v/dashboard" className="text-dark text-decoration-none"><FaTachometerAlt size={30} /></Link>
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

export default WasteSeparationVillager;