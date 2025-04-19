import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const WasteData = () => {
    document.title = "DoiTung Zero-Waste";
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const [type, setType] = useState('หมู่บ้าน');
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [options, setOptions] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            let url = `${process.env.REACT_APP_BACKEND_URL}/wastedata`;
            if (search) {
                url += `?type=${type}&search=${search}`;
            }
            const response = await axios.get(url);
            setData(response.data.data);
            setName(response.data.name);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching data');
            setData([]);
            setName('');
        }
    }, [search, type]);

    useEffect(() => {
        const fetchOptions = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/waste-options?type=${type}`);
                if (response.status === 200) {
                    const opt = response.data.options || [];
                    if (opt.length > 0) {
                        setOptions(opt);
                        setMessage('');

                        if (!search || !opt.includes(search)) {
                            if (search !== opt[0]) {
                                setSearch(opt[0]);
                            }
                        }
                    } else {
                        setOptions([]);
                        setMessage('No options found');
                    }
                }
            } catch (err) {
                if (err.response) {
                    if (err.response.status === 401 || err.response.status === 403) {
                        setMessage('Unauthorized access');
                    } else {
                        setMessage(err.response.data.message || 'Error fetching options');
                    }
                } else {
                    setMessage('Error connecting to server');
                }
                setOptions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, [type, search]);

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        fetchData();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    };

    const formatTime = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit'
        });
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
            {/* Header */}
            <Header />

            {/* Body */}
            <div className="p-4">
                <h1 className="text-xl font-bold mb-4 text-center">ปริมาณขยะที่ต้องการทิ้ง</h1>

                <div className="flex items-center justify-center space-x-4 mb-4">
                    <label className="flex items-center space-x-2">
                        <input type="radio" value="หมู่บ้าน" checked={type === 'หมู่บ้าน'} onChange={() => setType('หมู่บ้าน')} />
                        <span>หมู่บ้าน</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" value="หน่วยงาน" checked={type === 'หน่วยงาน'} onChange={() => setType('หน่วยงาน')} />
                        <span>หน่วยงาน</span>
                    </label>
                </div>

                <form onSubmit={handleSearchSubmit} className="flex flex-col space-y-1 mb-3">
                    <div className="flex items-center space-x-2 mb-4">
                        <select value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2">
                            {options.length > 0 ? (
                                options.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))
                            ) : (
                                <option>ไม่มีข้อมูลขยะ</option>
                            )}
                        </select>
                    </div>
                    <input type="submit" value="ค้นหา" className="btn btn-primary btn-sm rounded-pill shadow-sm px-3 fw-bold mt-2 self-start" />
                </form>

                {message && <div className="alert alert-warning text-center">{message}</div>}
                {error && <div className="text-danger text-center mb-4">{error}</div>}
                {name && <p className="text-center mb-4">{name}</p>}

                <div className="flex justify-center items-center min-h-screen">
                    <table className="w-3/4 bg-white border border-gray-300 mx-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 border">วันที่</th>
                                <th className="px-4 py-2 border">เวลา</th>
                                <th className="px-4 py-2 border">ประเภทขยะ</th>
                                <th className="px-4 py-2 border">ประเภทขยะ (ย่อย)</th>
                                <th className="px-4 py-2 border">น้ำหนักขยะ (กก.)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-4">ไม่มีข้อมูล</td></tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr key={index} className="text-center border-t">
                                        <td className="px-4 py-2 border">{formatDate(item.vaw_date)}</td>
                                        <td className="px-4 py-2 border">{formatTime(item.vaw_time)}</td>
                                        <td className="px-4 py-2 border">{item.wasteType_name}</td>
                                        <td className="px-4 py-2 border">{item.subWasteType_name || ''}</td>
                                        <td className="px-4 py-2 border">{item.vaw_wasteTotal}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default WasteData;