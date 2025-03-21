import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTrash, FaTachometerAlt, FaBars } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

axios.defaults.withCredentials = true;

const WasteData = () => {
    document.title = "DoiTung Zero-Waste";
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const [type, setType] = useState('หมู่บ้าน');
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [options, setOptions] = useState([]);
    const [isSearched, setIsSearched] = useState(false); // State สำหรับเช็คว่าได้กด search หรือยัง

    // ดึงข้อมูลตัวเลือก (options) สำหรับการค้นหา
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/waste-options?type=${type}`);
                console.log('API Response:', response.data);

                if (response.status === 200) {
                    if (Array.isArray(response.data.options) && response.data.options.length > 0) {
                        setOptions(response.data.options);
                    } else {
                        setMessage('No options found');
                    }
                }
            } catch (err) {
                setMessage('Error fetching options');
                console.error('Error fetching options:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, [type]);

    // ฟังก์ชันดึงข้อมูลขยะ
    const fetchData = async () => {
        try {
            setLoading(true);
            let url = `${process.env.REACT_APP_BACKEND_URL}/waste-data`;
            const searchTerm = search || (options.length === 1 ? options[0] : null);
            if (searchTerm) {
                url += `?type=${type}&search=${searchTerm}`;
            }
            const response = await axios.get(url);
            setData(response.data.data);
            setName(response.data.name);
        } catch (err) {
            setMessage('Error fetching data');
            setData([]);
        } finally {
            setLoading(false);
            setIsSearched(true); // ตั้งค่าให้รู้ว่าได้ทำการค้นหาแล้ว
        }
    };

    // ฟังก์ชันสำหรับการค้นหา
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        fetchData();
    };

    // ฟังก์ชันสำหรับการคลิกนอก dropdown เพื่อปิด
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

    // ฟังก์ชันแปลงวันที่
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    };

    // ฟังก์ชันแปลงเวลา
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

                {message && <div className="text-red-500 text-center mb-4">{message}</div>}

                {name && <p className="text-center mb-4">{name}</p>}

                {/* Table display only after search */}
                {isSearched && (
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
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">ไม่มีข้อมูล</td>
                                    </tr>
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
                )}
            </div>

            {/* Footer */}
            <footer className="bg-light py-3 d-flex justify-content-around border-top mt-auto">
                <Link to="/" className="text-dark text-decoration-none"><FaHome size={30} /></Link>
                <Link to="/waste-data" className="text-dark text-decoration-none"><FaTrash size={30} /></Link>
                <Link to="/dashboard" className="text-dark text-decoration-none"><FaTachometerAlt size={30} /></Link>
            </footer>
        </div>
    );
}

export default WasteData;