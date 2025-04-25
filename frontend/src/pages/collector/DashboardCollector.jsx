import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';

import WasteChart from '../../components/WasteChart';
import Footer from './components/Footer';
import Header from './components/Header';
import UnauthorizedMessage from '../../components/UnauthorizedMessage';

dayjs.extend(buddhistEra);

axios.defaults.withCredentials = true;

function DashboardCollector() {
    document.title = "DoiTung Zero-Waste";
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [collId, setCollId] = useState(null);

    const [dataSet, setDataSet] = useState('all');
    const [locationId, setLocationId] = useState('');
    const [locations, setLocations] = useState([]);

    const [mode, setMode] = useState('day');
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

    const [wasteData, setWasteData] = useState([]);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/verify`, {
                    withCredentials: true
                });
                if (res.data.status === "success") {
                    setAuth(true);
                    setCollId(res.data.coll_id);
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
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/dashboard-locations`, {
                        params: { type: dataSet },
                        withCredentials: true
                    });
    
                    if (response.data.status === 'success') {
                        setLocations(response.data.results);
                        setCollId(response.data.coll_id);
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
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/dashboard`, {
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

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <h3>Loading...</h3>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            {auth ? (
                <>
                    {/* Header */}
                    <Header collId={collId} />

                    {/* Body */}
                    <main className="container my-4 flex-grow-1">
                        <div className="card shadow-sm border-0 p-4 bg-white rounded">
                            <h2 className="text-center fw-bold mb-4">ปริมาณน้ำหนักขยะรวมตามแหล่งที่จัดเก็บ</h2>

                            {/* Data Set Selector */}
                            <div className="mb-4">
                                <label className="block font-medium mb-1">เลือกชุดข้อมูล:</label>
                                <select
                                    value={dataSet}
                                    onChange={e => setDataSet(e.target.value)}
                                    className="border rounded px-3 py-2 w-full"
                                >
                                    <option value="all">ตำบลแม่ฟ้าหลวงทั้งหมด</option>
                                    <option value="village">หมู่บ้าน</option>
                                    <option value="agency">หน่วยงาน</option>
                                </select>
                            </div>

                            {/* Location Selector */}
                            {dataSet !== 'all' && (
                                <div className="mb-4">
                                    <label className="block font-medium mb-1">ชื่อ{dataSet === 'village' ? 'หมู่บ้าน' : 'หน่วยงาน'}:</label>
                                    <select
                                        value={locationId}
                                        onChange={e => setLocationId(e.target.value)}
                                        className="border rounded px-3 py-2 w-full"
                                    >
                                        <option value="" disabled>-- เลือก --</option>
                                        {locations.map(loc => (
                                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Mode & Date */}
                            <div className="mb-4 flex gap-2 items-center justify-center">
                                <label className="block font-medium">ดูราย:</label>
                                <select
                                    value={mode}
                                    onChange={e => setMode(e.target.value)}
                                    className="border rounded px-3 py-2"
                                >
                                    <option value="day">วัน</option>
                                    <option value="month">เดือน</option>
                                    <option value="year">ปี</option>
                                </select>

                                {mode === 'day' || mode === 'month' ? (
                                    <input
                                        type={mode === 'day' ? 'date' : 'month'}
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        className="border rounded px-3 py-2"
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
                                        className="border rounded px-3 py-2"
                                    />
                                )}
                            </div>

                            {/* WasteChart */}
                            <div className="my-6">
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
                            </div>

                            {/* ถ้าไม่มีข้อมูลขยะ */}
                            {wasteData.length === 0 && (
                                <p className="text-gray-500 text-center">ไม่มีข้อมูลขยะสำหรับช่วงเวลานี้</p>
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
                    </main>

                    {/* Footer */}
                    <Footer />
                </>
            ) : (
                <UnauthorizedMessage message={message} />
            )}
        </div>
    );
}


export default DashboardCollector;