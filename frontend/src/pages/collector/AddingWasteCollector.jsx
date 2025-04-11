import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTrash, FaPlus, FaTachometerAlt, FaBars } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

axios.defaults.withCredentials = true;

function AddingWasteCollector() {
    document.title = "DoiTung Zero-Waste";
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const [collId, setCollId] = useState(null);

    // สำหรับโชว์วันที่แบบไทยบนหน้าจอ
    const formatThaiDate = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear() + 543;
        return `${day}-${month}-${year}`;
    };

    const today = new Date();
    today.setHours(today.getHours() + 7);

    const [displayDate, setDisplayDate] = useState(formatThaiDate(today));

    // สำหรับส่งไป backend (รูปแบบ MySQL: YYYY-MM-DD)
    const formatDateForMySQL = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState({
        caw_date: formatDateForMySQL(today),
        caw_wasteType: '',
        caw_subWasteType: '',
        caw_wasteTotal: '',
        caw_description: '',
        caw_location: ''
    });
    
    const [locations, setLocations] = useState([]);
    const [isVillage, setIsVillage] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const today = new Date();
        today.setHours(today.getHours() + 7);
        setFormData(prev => ({
            ...prev,
            caw_date: formatDateForMySQL(today)
        }));
        setDisplayDate(formatThaiDate(today));
    }, [isVillage]);

    const fetchLocations = useCallback(async () => {
        const formattedDate = formatDateForMySQL(new Date());
        setFormData(prevData => ({ ...prevData, caw_date: formattedDate }));
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/locations?village=${isVillage}`, { withCredentials: true });
            if (response.data.status === 'success') {
                setLocations(response.data.rows);
                setCollId(response.data.coll_id);
                setAuth(true);
            } else {
                setAuth(false);
                setMessage(response.data.error || "Unauthorized access");
            }
        } catch (err) {
            console.error('Error fetching locations:', err);
            setError('Failed to fetch locations');
        } finally {
            setLoading(false);
        }
    }, [isVillage]);
    
    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/c/addingwastecollector`, formData, { withCredentials: true });
            if (response.data.status === 'success') {
            alert('Data added successfully from collector');
            navigate('/c/homecollector');
            }
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.response?.data?.error || 'Failed to add waste data');
        }
    };

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

    const resetForm = () => {
        setFormData({
            caw_date: formatDateForMySQL(today),
            caw_wasteType: '',
            caw_subWasteType: '',
            caw_wasteTotal: '',
            caw_description: '',
            caw_location: ''
        });
        setError('');
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
                    <div className="max-w-xl mx-auto mt-10 p-4 bg-white shadow-xl rounded-2xl">
                        <h2 className="text-2xl font-bold mb-4">เพิ่มรายการน้ำหนักขยะ</h2>
                        {error && <p className="text-red-500 mb-2">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="mb-3">
                                <label className="form-label">วันที่เก็บขยะ*</label>
                                <input
                                    type="text"
                                    name="caw_date"
                                    value={displayDate}
                                    onChange={handleChange}
                                    readOnly
                                    required
                                    className="form-control"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">สถานที่</label>
                                <select
                                    onChange={(e) => setIsVillage(e.target.value === 'village')}
                                    className="w-full border px-3 py-2 rounded mb-2"
                                >
                                    <option value="village">หมู่บ้าน</option>
                                    <option value="agency">หน่วยงาน</option>
                                </select>

                                <select
                                    name="caw_location"
                                    value={formData.caw_location}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                >
                                    <option value="" disabled>เลือกสถานที่</option>
                                    {locations.map((loc) => (
                                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* ประเภทขยะ */}
                            <div className="mb-3">
                                <label className="form-label">ประเภทขยะ*</label>
                                <select
                                    name="caw_wasteType"
                                    value={formData.caw_wasteType}
                                    onChange={handleChange}
                                    required
                                    className="form-select"
                                >
                                    <option value="" disabled>เลือกประเภทขยะ</option>
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
                                    name="caw_subWasteType"
                                    value={formData.caw_subWasteType}
                                    onChange={handleChange}
                                    required
                                    className="form-select"
                                >
                                    <option value="" disabled>เลือกประเภทขยะย่อย</option>
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
                                    name="caw_wasteTotal"
                                    value={formData.caw_wasteTotal}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*(\.\d{0,2})?$/.test(value)) {
                                            handleChange(e);
                                        }
                                    }}
                                    required
                                    className="form-control"
                                    step="0.01"
                                />
                            </div>

                            {/* รายละเอียดอื่น ๆ */}
                            <div className="mb-3">
                                <label className="form-label">รายละเอียดอื่น ๆ</label>
                                <textarea
                                    name="caw_description"
                                    value={formData.caw_description}
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

export default AddingWasteCollector;