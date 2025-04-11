import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTrash, FaTachometerAlt, FaBars } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function ComposableWaste() {
    document.title = "DoiTung Zero-Waste";
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/composavlewaste`)
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

    const WasteInfo = () => {
        const wasteItems = [
            "เศษอาหาร/เศษผัก/เศษผลไม้",
            "มะพร้าว",
            "เศษใบไม้",
            "น้ำแกง",
            "เปลือกไข่",
            "กากกาแฟ",
            "วัสดุปลูก",
            "ไขมัน"
        ];

        return (
            <div className="p-4 bg-orange-100 rounded-2xl shadow-md my-4 mx-auto" style={{ maxWidth: "600px" }}>
                <h1 className="text-xl font-bold text-center border-bottom pb-2 mb-4">ขยะย่อยสลายได้</h1>
                <p className="text-sm text-dark mb-4">
                    ขยะย่อยสลายได้ คือ ขยะประเภทที่ย่อยสลายได้ เช่น เศษอาหาร ใบไม้ หรือวัสดุบรรจุภัณฑ์ที่มีสัญลักษณ์ย่อยสลายได้
                </p>
                <h2 className="text-danger font-weight-semibold mb-2">ตัวอย่างชนิดขยะย่อยสลายได้</h2>
                <ul className="list-group list-group-flush">
                    {wasteItems.map((item, index) => (
                        <li key={index} className="list-group-item">{item}</li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className='container-fluid d-flex flex-column min-vh-100'>
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
                                <li><Link className="dropdown-item" to="/waste-price">ราคารับซื้อ</Link></li>
                                <li><Link className="dropdown-item" to="/category">วิธีการแยกชนิดขยะ</Link></li>
                                <li><Link className="dropdown-item" to="/GarbageTruckSchedule">ตารางรถเก็บขยะ</Link></li>
                                <li><Link className="dropdown-item" to="/carbons">คำนวณคาร์บอน</Link></li>
                                <li><button className="dropdown-item text-danger" onClick={handleLogout}>ออกจากระบบ</button></li>
                            </ul>
                        </div>
                    </nav>

                     {/* Body */}
                    <WasteInfo />

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

export default ComposableWaste;
