import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaHome, FaTrash, FaPlus, FaTachometerAlt, FaBars } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function AddingWasteVillager() {
    document.title = "DoiTung Zero-Waste";
    const [auth, setAuth] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [villId, setVillId] = useState(null);

    const formatThaiDate = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear() + 543;
        return `${day}-${month}-${year}`;
    };

    const today = new Date();
    today.setHours(today.getHours() + 7);

    const [formData, setFormData] = useState({
        vaw_date: formatThaiDate(today),
        vaw_wasteType: '',
        vaw_subWasteType: '',
        vaw_wasteTotal: '',
        vaw_description: ''
    });

    useEffect(() => {
        const formattedDate = formatThaiDate(new Date());
        setFormData(prevData => ({ ...prevData, vaw_date: formattedDate }));
    
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/v/addingwastevillager`, { withCredentials: true })
            .then(res => {
                if (res.data.status === 'success') {
                    setAuth(true);
                    setVillId(res.data.vill_id);
                } else {
                    setMessage(res.data.error || 'Unauthorized');
                }
            })
            .catch(err => console.error('Auth check failed:', err));
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const formatForDB = (date) => {
        const [day, month, year] = date.split("-");
        return `${parseInt(year) - 543}-${month}-${day}`;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataToSend = { ...formData, vaw_date: formatForDB(formData.vaw_date) };
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/v/addingwastevillager`, dataToSend, { withCredentials: true })
            .then(res => {
                if (res.data.status === "success") {
                    alert("Adding Waste Weights successful!");
                    navigate('/v/homevillager');
                    setVillId(res.data.vill_id);
                } else {
                    alert(res.data.error || 'Unknown error occurred.');
                }
            })
            .catch(err => {
                console.error("Error adding weight: ", err);
                alert("Failed to add weight. Please try again.");
            });
    };

    const resetForm = () => {
        const today = new Date();
        today.setHours(today.getHours() + 7);
        setFormData({
            vaw_date: formatThaiDate(today),
            vaw_wasteType: '',
            vaw_subWasteType: '',
            vaw_wasteTotal: '',
            vaw_description: ''
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
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

                    <div className="container mt-4">
                        <div className="card shadow-lg">
                            <div className="card-body">
                            <h2 className="text-center mb-4">เพิ่มรายการน้ำหนักขยะ</h2>
                            <form onSubmit={handleSubmit}>
                                {/* วันที่ทิ้งขยะ */}
                                <div className="mb-3">
                                <label className="form-label">วันที่ทิ้งขยะ*</label>
                                <input
                                    type="text"
                                    name="vaw_date"
                                    value={formData.vaw_date}
                                    onChange={handleChange}
                                    readOnly
                                    required
                                    className="form-control"
                                />
                                </div>

                                {/* ประเภทขยะ */}
                                <div className="mb-3">
                                <label className="form-label">ประเภทขยะ*</label>
                                <select
                                    name="vaw_wasteType"
                                    value={formData.vaw_wasteType}
                                    onChange={handleChange}
                                    required
                                    className="form-select"
                                >
                                    <option value="">เลือกประเภทขยะ</option>
                                    <option value="1">01 ขยะเปื้อน</option>
                                    <option value="2">02 ขยะห้องน้ำ</option>
                                    <option value="3">03 ขยะพลังงาน</option>
                                    <option value="4">04 ขยะอันตราย</option>
                                    <option value="5">05 ขยะขายได้</option>
                                    <option value="6">06 ขยะย่อยสลาย</option>
                                    <option value="7">07 ขยะชิ้นใหญ่</option>
                                </select>
                                </div>

                                {/* ประเภทขยะ (ย่อย) */}
                                <div className="mb-3">
                                <label className="form-label">ประเภทขยะ (ย่อย)*</label>
                                <select
                                    name="vaw_subWasteType"
                                    value={formData.vaw_subWasteType}
                                    onChange={handleChange}
                                    required
                                    className="form-select"
                                >
                                    <option value="">เลือกประเภทขยะย่อย</option>
                                    <option value="1">01 ขวดแก้ว</option>
                                    <option value="2">02 ขวดพลาสติกใส</option>
                                    <option value="3">03 เหล็ก/โลหะ/สังกะสี/กระป๋องอลูมิเนียม</option>
                                    <option value="4">04 กระดาษ</option>
                                </select>
                                </div>

                                {/* น้ำหนักขยะ */}
                                <div className="mb-3">
                                <label className="form-label">น้ำหนักขยะ (กก.)*</label>
                                <input
                                    type="number"
                                    name="vaw_wasteTotal"
                                    value={formData.vaw_wasteTotal}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                                </div>

                                {/* รายละเอียดอื่น ๆ */}
                                <div className="mb-3">
                                <label className="form-label">รายละเอียดอื่น ๆ</label>
                                <textarea
                                    name="vaw_description"
                                    value={formData.vaw_description}
                                    onChange={handleChange}
                                    className="form-control"
                                    rows="3"
                                ></textarea>
                                </div>

                                {/* ปุ่มกด */}
                                <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                                    ยกเลิก
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    ยืนยัน
                                </button>
                                </div>
                            </form>
                            </div>
                        </div>
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

export default AddingWasteVillager;