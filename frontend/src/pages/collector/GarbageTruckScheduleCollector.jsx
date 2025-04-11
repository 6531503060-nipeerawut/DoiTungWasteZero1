import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTrash, FaPlus, FaTachometerAlt, FaBars } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

axios.defaults.withCredentials = true;

function GarbageTruckScheduleCollector() {
    document.title = "DoiTung Zero-Waste";

    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const [collId, setcollId] = useState(null);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/garbagetruckschedulecollector`, { withCredentials: true });

                if (res.data.status?.toLowerCase() === "success") {
                    setAuth(true);
                    setcollId(res.data.coll_id);
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
                                <li><Link className="dropdown-item" to="/c/wastepricecollector">ราคารับซื้อ</Link></li>
                                <li><Link className="dropdown-item" to="/c/categorycollector">วิธีการแยกชนิดขยะ</Link></li>
                                <li><Link className="dropdown-item" to="/c/garbagetruckschedulecollector">ตารางรถเก็บขยะ</Link></li>
                                <li><Link className="dropdown-item" to="/carbons">คำนวณคาร์บอน</Link></li>
                                <li><Link className="dropdown-item" to={`/c/profile-collector/${collId}`}>บัญชีผู้ใช้</Link></li>
                                <li><button className="dropdown-item text-danger" onClick={handleLogout}>ออกจากระบบ</button></li>
                            </ul>
                        </div>
                    </nav>

                    {/* Garbage Schedule */}
                    <GarbageData />
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
        <div style={{ padding: '20px' }}>
            <h2>📅 ตารางรถเก็บขยะ</h2>
            <div>
                <button onClick={() => handleClick('Monday')}>วันจันทร์</button>
                <button onClick={() => handleClick('Tuesday')}>วันอังคาร</button>
                <button onClick={() => handleClick('Wednesday')}>วันพุธ</button>
                <button onClick={() => handleClick('Friday')}>วันศุกร์</button>
            </div>

            {selectedDay && (
                <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
                    <h3>📌 ข้อมูลวัน{selectedDay === 'Monday'
                        ? 'จันทร์'
                        : selectedDay === 'Tuesday'
                        ? 'อังคาร'
                        : selectedDay === 'Wednesday'
                        ? 'พุธ'
                        : 'ศุกร์'}</h3>
                    <p><strong>ประเภทขยะ:</strong> {garbageData[selectedDay].type}</p>
                    <p><strong>ตัวอย่างขยะ:</strong></p>
                    <ul>
                        {garbageData[selectedDay].examples.map((item, index) => (
                            <li key={index}>- {item}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default GarbageTruckScheduleCollector;
