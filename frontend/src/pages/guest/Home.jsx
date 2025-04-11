import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTrash, FaTachometerAlt, FaBars } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MapView from './components/MapView';
import WasteChart from './components/WasteChart';
import dayjs from 'dayjs';

function Home() {
    document.title = "DoiTung Zero-Waste";
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [wasteData, setWasteData] = useState([]);
    const [mode, setMode] = useState('day');
    const [type, setType] = useState('village');
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

    const fetchWaste = useCallback((locationId) => {
        setSelectedLocation(locationId);
        const query = new URLSearchParams({
            dataSet: type,
            locationId: type === 'all' ? '' : locationId,
            mode: mode,
            date: mode === 'day' ? date : dayjs(date).format(mode === 'month' ? 'MM-YYYY' : 'YYYY')
        });
    
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/?${query.toString()}`, { withCredentials: true })
            .then(res => setWasteData(res.data.results))
            .catch(err => console.error(err));
    }, [type, date, mode]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/home-locations?type=${type}`, { withCredentials: true })
            .then(res => {
                setLocations(res.data.results);
            })        
            .catch(err => console.error(err));
    }, [type]);

    useEffect(() => {
        if (selectedLocation) {
            fetchWaste(selectedLocation);
        }
    }, [fetchWaste, selectedLocation]);

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
                    <li><Link className="dropdown-item" to="/waste-price">ราคารับซื้อ</Link></li>
                    <li><Link className="dropdown-item" to="/category">วิธีการแยกชนิดขยะ</Link></li>
                    <li><Link className="dropdown-item" to="/GarbageTruckSchedule">ตารางรถเก็บขยะ</Link></li>
                    <li><Link className="dropdown-item" to="/carbons">คำนวณคาร์บอน</Link></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>ออกจากระบบ</button></li>
                </ul>
                </div>
            </nav>

            {/* Body */}
            <div className="dashboard">
                <h2>แผนที่แสดงจุดเก็บขยะ</h2>

                {/* ตัวเลือกการกรอง */}
                <div>
                <select onChange={e => setType(e.target.value)} value={type}>
                    <option value="village">หมู่บ้าน</option>
                    <option value="agency">หน่วยงาน</option>
                    <option value="all">ทั้งหมด</option>
                </select>

                    <select onChange={e => setMode(e.target.value)} value={mode}>
                    <option value="day">รายวัน</option>
                    <option value="month">รายเดือน</option>
                    <option value="year">รายปี</option>
                    </select>

                    <input
                    type={mode === 'day' ? 'date' : mode === 'month' ? 'month' : 'number'}
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    />
                </div>

                {/* แผนที่ */}
                <MapView locations={locations} onSelect={fetchWaste} />

                {/* กราฟวงกลม */}
                {wasteData.length > 0 && <WasteChart
                    data={wasteData}
                    options={{
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const value = context.raw;  // Get the value of the slice (weight in kg)
                                        const total = context.chart._metasets[context.datasetIndex].total;  // Total value of the dataset
                                        const percentage = ((value / total) * 100).toFixed(2);  // Calculate percentage
                                        return `${context.label}: ${value.toLocaleString()} กก. (${percentage}%)`;  // Return formatted string
                                    }
                                }
                            }
                        }
                    }}
                />}
            </div>

            {/* ถ้าไม่มีข้อมูลขยะ */}
            {wasteData.length === 0 && (
                <p className="text-muted text-center">ไม่มีข้อมูลขยะสำหรับช่วงเวลานี้</p>
            )}

            {/* Table List */}
            <ul className="text-sm">
                {wasteData.map(item => (
                    <li key={item.wasteType_name}>
                        {item.wasteType_name} ... {parseFloat(item.total).toLocaleString()} กก.
                    </li>
                ))}
            </ul>

            {/* Footer */}
            <footer className="bg-light py-3 d-flex justify-content-around border-top mt-auto">
            <Link to="/" className="text-dark text-decoration-none"><FaHome size={30} /></Link>
            <Link to="/wastedata" className="text-dark text-decoration-none"><FaTrash size={30} /></Link>
            <Link to="/dashboard" className="text-dark text-decoration-none"><FaTachometerAlt size={30} /></Link>
            </footer>
        </div>
    );
}

export default Home;