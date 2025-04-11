import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTrash, FaPlus, FaTachometerAlt, FaBars } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MapView from './components/MapView';
import WasteChart from './components/WasteChart';
import dayjs from 'dayjs';

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

    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [wasteData, setWasteData] = useState([]);
    const [mode, setMode] = useState('day');
    const [type, setType] = useState('village');
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

    const fetchWaste = useCallback(async (locationId) => {
        setSelectedLocation(locationId);
        const query = new URLSearchParams({
            dataSet: type,
            locationId: type === 'all' ? '' : locationId,
            mode: mode,
            date: mode === 'day' ? date : dayjs(date).format(mode === 'month' ? 'MM-YYYY' : 'YYYY')
        });

        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v/homevillager?${query.toString()}`);
            if (res.data.status?.toLowerCase() === "success") {
                setAuth(true);
                setVillId(res.data.vill_id);
                setWasteData(res.data.results);
            } else {
                setAuth(false);
                setMessage(res.data.error || "Unauthorized access");
            }
        } catch (err) {
            console.log("Error fetching waste data:", err);
            setMessage("Error connecting to server");
        } finally {
            setLoading(false);
        }
    }, [type, date, mode]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v/home-locations?type=${type}`);
                if (res.data.status?.toLowerCase() === "success") {
                    setAuth(true);
                    setVillId(res.data.vill_id);
                    setLocations(res.data.results);
                } else {
                    setAuth(false);
                    setMessage(res.data.error || "Unauthorized access");
                }
            } catch (err) {
                console.log("Error fetching locations:", err);
                setMessage("Error connecting to server");
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
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
                    <div className="dashboard">
                        <h2>แผนที่แสดงจุดเก็บขยะ</h2>

                        {/* ตัวเลือกการกรอง */}
                        <div className="my-3 d-flex gap-3">
                            <select onChange={e => setType(e.target.value)} value={type} className="form-select w-auto">
                                <option value="village">หมู่บ้าน</option>
                                <option value="agency">หน่วยงาน</option>
                                <option value="all">ทั้งหมด</option>
                            </select>

                            <select onChange={e => setMode(e.target.value)} value={mode} className="form-select w-auto">
                                <option value="day">รายวัน</option>
                                <option value="month">รายเดือน</option>
                                <option value="year">รายปี</option>
                            </select>

                            <input
                                type={mode === 'day' ? 'date' : mode === 'month' ? 'month' : 'number'}
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="form-control w-auto"
                                min={mode === 'year' ? '2000' : undefined}
                                max={mode === 'year' ? dayjs().year() : undefined}
                            />
                        </div>

                        {/* แผนที่ */}
                        <MapView locations={locations} onSelect={fetchWaste} />

                        {/* กราฟวงกลม */}
                        {wasteData.length > 0 && (
                            <WasteChart
                                data={wasteData}
                                options={{
                                    plugins: {
                                        tooltip: {
                                            callbacks: {
                                                label: function (context) {
                                                    const value = context.raw;
                                                    const total = context.chart._metasets[context.datasetIndex].total;
                                                    const percentage = ((value / total) * 100).toFixed(2);
                                                    return `${context.label}: ${value.toLocaleString()} กก. (${percentage}%)`;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        )}

                        {/* ถ้าไม่มีข้อมูลขยะ */}
                        {wasteData.length === 0 && (
                            <p className="text-muted text-center mt-4">ไม่มีข้อมูลขยะสำหรับช่วงเวลานี้</p>
                        )}

                        {/* Table List */}
                        <ul className="text-sm mt-3">
                            {wasteData.map(item => (
                                <li key={item.wasteType_name}>
                                    {item.wasteType_name} ... {parseFloat(item.total).toLocaleString()} กก.
                                </li>
                            ))}
                        </ul>
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

export default HomeVillager;