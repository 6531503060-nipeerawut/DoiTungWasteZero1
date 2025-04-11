import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTrash,FaTachometerAlt, FaBars } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';


dayjs.extend(buddhistEra);

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
    document.title = "DoiTung Zero-Waste";
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const [dataSet, setDataSet] = useState('all');
    const [locationId, setLocationId] = useState('');
    const [locations, setLocations] = useState([]);

    const [mode, setMode] = useState('day');
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

    const [wasteData, setWasteData] = useState([]);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/verify`, {
                    withCredentials: true
                });
                if (res.data.status === "success") {
                    setAuth(true);
                } else {
                    setAuth(false);
                    navigate('/login');
                }
            } catch (error) {
                console.error("User not verified", error);
                setAuth(false);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        verifyUser();
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (dataSet === 'village' || dataSet === 'agency') {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/dashboard-locations`, {
                        params: { type: dataSet },
                        withCredentials: true
                    });
    
                    if (response.data.status === 'success') {
                        setLocations(response.data.results);
                        setAuth(true);
                        setLoading(false);
                        console.log(response)
                    } else {
                        setAuth(false);
                        setMessage(response.data.error || "Unauthorized access");
                        setLoading(false);
                    }
                } catch (error) {
                    setAuth(false);
                    setMessage("An error occurred while fetching the data.");
                    setLoading(false);
                    console.error(error);
                }
            } else {
                setLocations([]);
                setLocationId('');
                setLoading(false);
            }
        };
        fetchData();
    }, [dataSet]);

    const displayDate = () => {
        if (!date) return '';
        
        if (mode === 'day') {
            return dayjs(date).format('DD/MM/BBBB');
        } else if (mode === 'month') {
            return dayjs(date).format('MM/BBBB');
        } else if (mode === 'year') {
            return `${parseInt(date) + 543}`;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            let formattedDate = date;
            if (mode === 'month') {
                const d = dayjs(date);
                formattedDate = `${d.format('MM')}-${d.format('YYYY')}`;
            } else if (mode === 'year') {
                formattedDate = dayjs(date).format('YYYY');
            }
    
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/dashboard`, {
                    params: {
                        dataSet,
                        locationId,
                        mode,
                        date: formattedDate,
                    },
                    withCredentials: true,
                });
    
                setWasteData(response.data.results);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [dataSet, locationId, mode, date]);

    const pieChartData = {
        labels: wasteData.map(item => item.wasteType_name),
        datasets: [{
            data: wasteData.map(item => item.total),
            backgroundColor: ['#924d24', '#bc6c25', '#dda15e', '#606c38', '#283618', '#588157', '#344e41']
        }]
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
                                <li><Link className="dropdown-item" to="/waste-price">ราคารับซื้อ</Link></li>
                                <li><Link className="dropdown-item" to="/category">วิธีการแยกชนิดขยะ</Link></li>
                                <li><Link className="dropdown-item" to="/GarbageTruckSchedule">ตารางรถเก็บขยะ</Link></li>
                                <li><Link className="dropdown-item" to="/carbons">คำนวณคาร์บอน</Link></li>
                                <li><button className="dropdown-item text-danger" onClick={handleLogout}>ออกจากระบบ</button></li>
                            </ul>
                        </div>
                    </nav>

                    {/* Body */}
                    <div className="p-4 max-w-xl mx-auto">
                        <h2 className="text-xl font-bold mb-4">ปริมาณน้ำหนักขยะรวมตามแหล่งที่จัดเก็บ</h2>
                        <h5 className="text-muted mt-3">
                            ข้อมูลวันที่: {displayDate()}
                        </h5>

                        {/* Data Set Selector */}
                        <div className="mb-3">
                            <label>เลือกชุดข้อมูล:</label>
                            <select value={dataSet} onChange={e => setDataSet(e.target.value)} className="ml-2">
                            <option value="all">ตำบลแม่ฟ้าหลวงทั้งหมด</option>
                            <option value="village">ตามหมู่บ้าน</option>
                            <option value="agency">ตามหน่วยงาน</option>
                            </select>
                        </div>

                        {/* Location Selector */}
                        {dataSet !== 'all' && (
                            <div className="mb-3">
                                <label>ชื่อ{dataSet === 'village' ? 'หมู่บ้าน' : 'หน่วยงาน'}:</label>
                                <select value={locationId} onChange={e => setLocationId(e.target.value)} className="ml-2">
                                    <option value="" disabled>-- เลือก --</option>
                                    {locations.map(loc => (
                                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Mode & Date */}
                        <div className="mb-3 flex gap-2 items-center">
                            <label>ดูราย:</label>
                            <select value={mode} onChange={e => setMode(e.target.value)} className="ml-2">
                                <option value="day">วัน</option>
                                <option value="month">เดือน</option>
                                <option value="year">ปี</option>
                            </select>

                            {mode === 'day' || mode === 'month' ? (
                                <input
                                    type={mode === 'day' ? 'date' : 'month'}
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    className="ml-2"
                                />
                            ) : (
                                <input
                                    type="number"
                                    min="2560"
                                    max="2600"
                                    value={parseInt(date) + 543}
                                    onChange={e =>
                                        setDate((parseInt(e.target.value) - 543).toString())
                                    }
                                    className="ml-2"
                                />
                            )}
                        </div>

                        {/* Pie Chart */}
                        <div className="my-6">
                            <Pie data={pieChartData} options={{
                                plugins: {
                                    tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                        const value = context.parsed;
                                        const total = context.chart._metasets[context.datasetIndex].total;
                                        const percentage = ((value / total) * 100).toFixed(2);
                                        return `${context.label}: ${value.toLocaleString()} กก. (${percentage}%)`;
                                        }
                                    }
                                    }
                                }
                            }} />
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
                    </div>

                    {/* Footer */}
                    <footer className="bg-light py-3 d-flex justify-content-around border-top mt-auto">
                    <Link to="/" className="text-dark text-decoration-none"><FaHome size={30} /></Link>
                    <Link to="/wastedata" className="text-dark text-decoration-none"><FaTrash size={30} /></Link>
                    <Link to="/dashboard" className="text-dark text-decoration-none"><FaTachometerAlt size={30} /></Link>
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

export default Dashboard;