import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MapView from '../../components/MapView';
import WasteChart from '../../components/WasteChart';
import { formatDateForAPI } from '../../utils/formatDate';
import Footer from './components/Footer';
import Header from './components/Header';
import UnauthorizedMessage from '../../components/UnauthorizedMessage';
import dayjs from 'dayjs';

axios.defaults.withCredentials = true;

function HomeCollector() {
    document.title = "DoiTung Zero-Waste";

    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [collId, setCollId] = useState(null);

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
            locationId: locationId,
            mode: mode,
            date: formatDateForAPI(date, mode)
        });

        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/homecollector?${query.toString()}`);
            if (res.data.status?.toLowerCase() === "success") {
                setAuth(true);
                setCollId(res.data.coll_id);
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
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/home-locations?type=${type}`);
                if (res.data.status?.toLowerCase() === "success") {
                    setAuth(true);
                    setCollId(res.data.coll_id);
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
                    {/* Header */}
                    <Header collId={collId} />

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
                                value={
                                    mode === 'day'
                                        ? date
                                        : mode === 'month'
                                            ? dayjs(date).format('YYYY-MM')
                                            : dayjs(date).format('YYYY')
                                }
                                onChange={e => {
                                    let newDate = e.target.value;
                                    if (mode === 'month') {
                                        newDate += '-01';
                                    } else if (mode === 'year') {
                                        newDate += '-01-01';
                                    }
                                    setDate(newDate);
                                }}
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
                    <Footer />
                </>
            ) : (
                <UnauthorizedMessage message={message} />
            )}
        </div>
    );
}

export default HomeCollector;