import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import MapView from '../../components/MapView';
import WasteChart from '../../components/WasteChart';
import { formatDateForAPI } from '../../utils/formatDate';
import Footer from './components/Footer';
import Header from './components/Header';

function Home() {
    document.title = "DoiTung Zero-Waste";
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
            locationId: locationId,
            mode: mode,
            date: formatDateForAPI(date, mode)
        });

        axios.get(`${process.env.REACT_APP_BACKEND_URL}/?${query.toString()}`)
            .then(res => setWasteData(res.data.results))
            .catch(err => console.error(err));
    }, [type, date, mode]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/home-locations?type=${type}`)
            .then(res => setLocations(res.data.results))
            .catch(err => console.error(err));
    }, [type]);

    useEffect(() => {
        if (selectedLocation) {
            fetchWaste(selectedLocation);
        }
    }, [fetchWaste, selectedLocation]);

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />

            <div className="dashboard">
                <h2>แผนที่แสดงจุดเก็บขยะ</h2>

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

                <MapView locations={locations} onSelect={fetchWaste} />

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

            {wasteData.length === 0 && (
                <p className="text-muted text-center">ไม่มีข้อมูลขยะสำหรับช่วงเวลานี้</p>
            )}

            <ul className="text-sm">
                {wasteData.map(item => (
                    <li key={item.wasteType_name}>
                        {item.wasteType_name} ... {parseFloat(item.total).toLocaleString()} กก.
                    </li>
                ))}
            </ul>

            <Footer />
        </div>
    );
}

export default Home;