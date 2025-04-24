import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Footer from './components/Footer';
import Header from './components/Header';
import UnauthorizedMessage from '../../components/UnauthorizedMessage';

axios.defaults.withCredentials = true;
const WasteDataCollector = () => {
    document.title = "DoiTung Zero-Waste";
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [collId, setCollId] = useState(null);

    const [type, setType] = useState('หมู่บ้าน');
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [options, setOptions] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            let url = `${process.env.REACT_APP_BACKEND_URL}/c/wastedatacollector`;
            if (search) {
                url += `?type=${type}&search=${search}`;
            }
            const response = await axios.get(url, { withCredentials: true });
            setData(response.data.data);
            setName(response.data.name);
            setCollId(response.data.coll_id);
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
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/waste-options?type=${type}`, { withCredentials: true });
                if (response.status === 200) {
                    const opt = response.data.options || [];
                    if (opt.length > 0) {
                        setOptions(opt);
                        setAuth(true);
                        setMessage('');
                        setCollId(response.data.coll_id);

                        if (!search || !opt.includes(search)) {
                            if (search !== opt[0]) {
                                setSearch(opt[0]);
                            }
                        }
                    } else {
                        setOptions([]);
                        setAuth(false);
                        setMessage('No options found');
                    }
                }
            } catch (err) {
                if (err.response) {
                    if (err.response.status === 401 || err.response.status === 403) {
                        setAuth(false);
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
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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
        <div className="d-flex flex-column min-vh-100 bg-light">
            {auth ? (
                <>
                    {/* Header */}
                    <Header collId={collId} />

                    {/* Body */}
                    <main className="container my-4 flex-grow-1">
                        <div className="card shadow-sm border-0 p-4 bg-white rounded">
                            <h2 className="text-center fw-bold mb-4">ปริมาณขยะที่ต้องการทิ้ง</h2>

                            <div className="d-flex justify-content-center gap-4 mb-3">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" value="หมู่บ้าน" checked={type === 'หมู่บ้าน'} onChange={() => setType('หมู่บ้าน')} />
                                    <label className="form-check-label">หมู่บ้าน</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" value="หน่วยงาน" checked={type === 'หน่วยงาน'} onChange={() => setType('หน่วยงาน')} />
                                    <label className="form-check-label">หน่วยงาน</label>
                                </div>
                            </div>

                            <form onSubmit={handleSearchSubmit} className="row g-3 justify-content-center">
                                <div className="col-md-6">
                                    <select className="form-select" value={search} onChange={(e) => setSearch(e.target.value)}>
                                        {options.length > 0 ? (
                                            options.map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                            ))
                                        ) : (
                                            <option>ไม่มีข้อมูลขยะ</option>
                                        )}
                                    </select>
                                    </div>
                                <div className="col-auto">
                                    <button type="submit" className="btn btn-success px-4 rounded-pill fw-bold shadow">ค้นหา</button>
                                </div>
                            </form>

                        {message && <div className="alert alert-warning text-center">{message}</div>}
                        {error && <div className="text-danger text-center mb-4">{error}</div>}
                        {name && <p className="text-center mb-4">{name}</p>}

                        <div className="table-responsive mt-4">
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
                </main>

                    {/* Footer */}
                    <Footer />
                </>
            ) : (
                <UnauthorizedMessage message={message} />
            )}
        </div>
    );
};

export default WasteDataCollector;
