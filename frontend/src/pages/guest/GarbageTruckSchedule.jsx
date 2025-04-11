import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTrash, FaTachometerAlt, FaBars } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function GarbageTruckSchedule() {
    document.title = "DoiTung Zero-Waste";

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/garbagetruckschedule`)
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
        <div className='container-fluid d-flex flex-column min-vh-100'>
            <>
                {/* Navbar */}
                <nav className="navbar navbar-light bg-light d-flex justify-content-between p-3">
                    <span className="navbar-brand font-weight-bold">DoiTung Zero - Waste</span>
                    <div className="dropdown" ref={dropdownRef}>
                        <button
                            className="btn btn-secondary dropdown-toggle"
                            type="button"
                            onClick={() => setDropdownOpen(!isDropdownOpen)}
                        >
                            <FaBars />
                        </button>
                        <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`}>
                            <li><Link className="dropdown-item" to="/waste-price">ราคารับซื้อ</Link></li>
                            <li><Link className="dropdown-item" to="/category">วิธีการแยกชนิดขยะ</Link></li>
                            <li><Link className="dropdown-item" to="/GarbageTruckSchedule">ตารางรถเก็บขยะ</Link></li>
                            <li><Link className="dropdown-item" to="/carbons">คำนวณคาร์บอน</Link></li>
                            <li><button className="dropdown-item text-danger" onClick={handleLogout}>ออกจากระบบ</button></li>
                        </ul>
                    </div>
                </nav>

                {/* Garbage Schedule */}
                <GarbageData />

                {/* Footer */}
                <footer className="bg-light py-3 d-flex justify-content-around border-top mt-auto">
                <Link to="/" className="text-dark text-decoration-none"><FaHome size={30} /></Link>
                <Link to="/wastedata" className="text-dark text-decoration-none"><FaTrash size={30} /></Link>
                <Link to="/dashboard" className="text-dark text-decoration-none"><FaTachometerAlt size={30} /></Link>
                </footer>
            </>
        </div>
    );
}

const GarbageData = () => {
    const [selectedDay, setSelectedDay] = useState(null);

    const garbageData = {
        Monday: {
            type: 'ขยะเปียก เปียกน้ำ',
            examples: ['พลาสติก', 'กระดาษ', 'โฟม ฟองน้ำ', 'ถ้วยน้ำมัน', 'รองเท้า'],
        },
        Tuesday: {
            type: 'ขยะเชื้อเพลิง พลังงาน',
            examples: ['ถุงขนม', 'เสื้อผ้าเก่า', 'กล่องนม'],
        },
        Wednesday: {
            type: 'ขยะห้องน้ำ',
            examples: ['ผ้าอนามัย', 'หน้ากากอนามัย', 'แพมเพิส'],
        },
        Friday: {
            type: 'ขยะอันตราย (เฉพาะวันศุกร์แรกของเดือน)',
            examples: ['หลอดไฟ', 'แบตเตอรี่', 'สารเคมี', 'สเปรย์'],
        },
    };

    const handleClick = (day) => {
        setSelectedDay(day);
    };

    return (
        <div className="container my-4">
            <h2 className="mb-4">📅 ตารางรถเก็บขยะ</h2>
            <div className="d-flex flex-wrap gap-2 mb-4">
                <button className="btn btn-outline-primary" onClick={() => handleClick('Monday')}>วันจันทร์</button>
                <button className="btn btn-outline-primary" onClick={() => handleClick('Tuesday')}>วันอังคาร</button>
                <button className="btn btn-outline-primary" onClick={() => handleClick('Wednesday')}>วันพุธ</button>
                <button className="btn btn-outline-primary" onClick={() => handleClick('Friday')}>วันศุกร์</button>
            </div>

            {selectedDay && (
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title">📌 ข้อมูลวัน{{
                            Monday: 'จันทร์',
                            Tuesday: 'อังคาร',
                            Wednesday: 'พุธ',
                            Friday: 'ศุกร์'
                        }[selectedDay]}</h5>
                        <p><strong>ประเภทขยะ:</strong> {garbageData[selectedDay].type}</p>
                        <p><strong>ตัวอย่างขยะ:</strong></p>
                        <ul>
                            {garbageData[selectedDay].examples.map((item, index) => (
                                <li key={index}>- {item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GarbageTruckSchedule;
