import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTrash, FaPlus, FaTachometerAlt, FaBars } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

axios.defaults.withCredentials = true;
const WasteDataCollector = () => {
    document.title = "DoiTung Zero-Waste";
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const [collId, setCollId] = useState(null);

    const [type, setType] = useState('หมู่บ้าน');
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [options, setOptions] = useState([]);

    // fetchData ใช้ useCallback เพื่อความเสถียร
    const fetchData = useCallback(async () => {
        try {
            let url = `${process.env.REACT_APP_BACKEND_URL}/c/wastedatacollector`;
            if (search) {
                url += `?type=${type}&search=${search}`;
            }
            const response = await axios.get(url, { withCredentials: true });
            setData(response.data.data);
            setName(response.data.name);
            setCollId(response.data.coll_id);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching data');
            setData([]);
            setName('');
        }
    }, [search, type]); // เพิ่ม type เข้าไปด้วย เพราะใช้ใน URL เช่นกัน

    // ใช้ useEffect สำหรับ fetchOptions เมื่อ type เปลี่ยน
    useEffect(() => {
        const fetchOptions = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/waste-options?type=${type}`, { withCredentials: true });
                if (response.status === 200) {
                    const opt = response.data.options || [];
                    if (opt.length > 0) {
                        setOptions(opt);
                        setAuth(true);
                        setMessage('');
                        setCollId(response.data.coll_id);

                        if (!search || !opt.includes(search)) {
                            if (search !== opt[0]) {
                                setSearch(opt[0]);
                            }
                        }
                    } else {
                        setOptions([]);
                        setAuth(false);
                        setMessage('No options found');
                    }
                }
            } catch (err) {
                if (err.response) {
                    if (err.response.status === 401 || err.response.status === 403) {
                        setAuth(false);
                        setMessage('Unauthorized access');
                    } else {
                        setMessage(err.response.data.message || 'Error fetching options');
                    }
                } else {
                    setMessage('Error connecting to server');
                }
                setOptions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, [type]); // เพิ่ม search เพื่อให้ ESLint ไม่เตือน (ไม่เป็นไรเพราะ setSearch ด้านใน)

    // ปิด dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
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

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        fetchData();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    };

    const formatTime = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit'
        });
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
                            <button className="btn btn-secondary dropdown-toggle" type="button" onClick={() => setDropdownOpen(!isDropdownOpen)}>
                                <FaBars />
                            </button>
                            <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`}>
                                <li><Link className="dropdown-item" to="/c/wastepricecollector">ราคารับซื้อ</Link></li>
                                <li><Link className="dropdown-item" to="/c/categorycollector">วิธีการแยกชนิดขยะ</Link></li>
                                <li><Link className="dropdown-item" to="/c/garbagetruckschedulecollector">ตารางรถเก็บขยะ</Link></li>
                                <li><Link className="dropdown-item" to="/carbons">คำนวณคาร์บอน</Link></li>
                                <li><Link className="dropdown-item" to={`/c/profile-collector/${collId}`}>บัญชีผู้ใช้</Link></li>
                                <li><button className="dropdown-item text-danger" onClick={handleLogout}>ออกจากระบบ</button></li>
                            </ul>
                        </div>
                    </nav>

                    {/* Body */}
                    <div className="p-4">
                        <h1 className="text-xl font-bold mb-4 text-center">จำนวนขยะที่ต้องการจะทิ้งแต่ละสถานที่</h1>

                        <div className="flex items-center justify-center space-x-4 mb-4">
                            <label className="flex items-center space-x-2">
                                <input type="radio" value="หมู่บ้าน" checked={type === 'หมู่บ้าน'} onChange={() => setType('หมู่บ้าน')} />
                                <span>หมู่บ้าน</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" value="หน่วยงาน" checked={type === 'หน่วยงาน'} onChange={() => setType('หน่วยงาน')} />
                                <span>หน่วยงาน</span>
                            </label>
                        </div>

                        <form onSubmit={handleSearchSubmit} className="flex flex-col space-y-1 mb-3">
                            <div className="flex items-center space-x-2 mb-4">
                                <select value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2">
                                    {options.length > 0 ? (
                                        options.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))
                                    ) : (
                                        <option>ไม่มีข้อมูลขยะ</option>
                                    )}
                                </select>
                            </div>
                            <input type="submit" value="ค้นหา" className="btn btn-primary btn-sm rounded-pill shadow-sm px-3 fw-bold mt-2 self-start" />
                        </form>

                        {message && <div className="alert alert-warning text-center">{message}</div>}
                        {error && <div className="text-danger text-center mb-4">{error}</div>}
                        {name && <p className="text-center mb-4">{name}</p>}

                        <div className="flex justify-center items-center min-h-screen">
                            <table className="w-3/4 bg-white border border-gray-300 mx-auto">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-4 py-2 border">วันที่</th>
                                        <th className="px-4 py-2 border">เวลา</th>
                                        <th className="px-4 py-2 border">ประเภทขยะ</th>
                                        <th className="px-4 py-2 border">ประเภทขยะ (ย่อย)</th>
                                        <th className="px-4 py-2 border">น้ำหนักขยะ (กก.)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center py-4">ไม่มีข้อมูล</td></tr>
                                    ) : (
                                        data.map((item, index) => (
                                            <tr key={index} className="text-center border-t">
                                                <td className="px-4 py-2 border">{formatDate(item.vaw_date)}</td>
                                                <td className="px-4 py-2 border">{formatTime(item.vaw_time)}</td>
                                                <td className="px-4 py-2 border">{item.wasteType_name}</td>
                                                <td className="px-4 py-2 border">{item.subWasteType_name}</td>
                                                <td className="px-4 py-2 border">{item.vaw_wasteTotal}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="bg-light py-3 d-flex justify-content-around border-top mt-auto">
                        <Link to="/c/homecollector" className="text-dark text-decoration-none"><FaHome size={30} /></Link>
                        <Link to="/c/wastedatacollector" className="text-dark text-decoration-none"><FaTrash size={30} /></Link>
                        <Link to="/c/addingwastecollector" className="text-dark text-decoration-none"><FaPlus size={30} /></Link>
                        <Link to="/c/dashboard" className="text-dark text-decoration-none"><FaTachometerAlt size={30} /></Link>
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
};

export default WasteDataCollector;
