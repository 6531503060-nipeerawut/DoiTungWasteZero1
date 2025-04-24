import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Footer from './components/Footer';
import Header from './components/Header';
import EditWasteModal from './components/EditWasteModal';
import UnauthorizedMessage from '../../components/UnauthorizedMessage';

axios.defaults.withCredentials = true;

const WasteDataVillager = () => {
    document.title = "DoiTung Zero-Waste";

    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [villId, setVillId] = useState(null);
    const [type, setType] = useState('หมู่บ้าน');
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [options, setOptions] = useState([]);
    const [editData, setEditData] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            let url = `${process.env.REACT_APP_BACKEND_URL}/v/wastedatavillager`;
            if (search) {
                url += `?type=${type}&search=${search}`;
            }
            const response = await axios.get(url, { withCredentials: true });
            setData(response.data.data);
            setName(response.data.name);
            setVillId(response.data.vill_id);
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
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/v/waste-options?type=${type}`,
                    { withCredentials: true }
                );
                const opt = response.data.options || [];
                if (opt.length > 0) {
                    setOptions(opt);
                    setAuth(true);
                    setMessage('');
                    setVillId(response.data.vill_id);

                    if (!search || !opt.includes(search)) {
                        setSearch(opt[0]);
                    }
                } else {
                    setOptions([]);
                    setAuth(false);
                    setMessage('ไม่พบข้อมูล');
                }
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setAuth(false);
                    setMessage('Unauthorized access');
                } else {
                    setMessage(err.response?.data?.message || 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
                }
                setOptions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, [type, search]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

    const handleEdit = (item) => {
        const data = {
            vaw_id: item.vaw_id,
            vaw_wasteType: item.vaw_wasteType?.toString(),
            vaw_subWasteType: item.vaw_subWasteType?.toString() || '',
            vaw_wasteTotal: item.vaw_wasteTotal,
            vaw_date: item.vaw_date,
            vaw_time: item.vaw_time
        };
        setEditData(data);
    };

    const handleUpdate = async () => {
        if (
            !editData.vaw_id ||
            !villId ||
            !editData.vaw_wasteType ||
            editData.vaw_wasteTotal === '' ||
            isNaN(editData.vaw_wasteTotal)
        ) {
            alert("Missing required fields");
            return;
        }

        try {
            const payload = {
                vaw_id: editData.vaw_id,
                vill_id: villId,
                vaw_wasteType: editData.vaw_wasteType,
                vaw_subWasteType: editData.vaw_wasteType === '5' ? editData.vaw_subWasteType : null,
                vaw_wasteTotal: Number(editData.vaw_wasteTotal)
            };

            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/v/update-waste-villager`, payload, { withCredentials: true });
            alert('อัปเดตสำเร็จ');
            setEditData(null);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
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
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            {auth ? (
                <>
                    <Header villId={villId} />

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

                            {message && <div className="alert alert-warning text-center mt-3">{message}</div>}
                            {error && <div className="alert alert-danger text-center mt-3">{error}</div>}
                            {name && <p className="text-center mt-3 fw-semibold">{name}</p>}

                            <div className="table-responsive mt-4">
                                <table className="table table-bordered table-hover">
                                    <thead className="table-secondary text-center">
                                        <tr>
                                            <th>วันที่</th>
                                            <th>เวลา</th>
                                            <th>ประเภทขยะ</th>
                                            <th>ประเภทขยะ (ย่อย)</th>
                                            <th>น้ำหนัก (กก.)</th>
                                            <th>แก้ไข</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length === 0 ? (
                                            <tr><td colSpan="6" className="text-center py-4">ไม่มีข้อมูล</td></tr>
                                        ) : (
                                            data.map((item, index) => (
                                                <tr key={index} className="text-center">
                                                    <td>{formatDate(item.vaw_date)}</td>
                                                    <td>{formatTime(item.vaw_time)}</td>
                                                    <td>{item.wasteType_name}</td>
                                                    <td>{item.subWasteType_name || '-'}</td>
                                                    <td>{item.vaw_wasteTotal}</td>
                                                    <td>
                                                        {item.vill_id === villId && (
                                                            <button className="btn btn-sm btn-warning" onClick={() => handleEdit(item)}>
                                                                แก้ไข
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>

                    <Footer />

                    <EditWasteModal
                        editData={editData}
                        onClose={() => setEditData(null)}
                        onChange={setEditData}
                        onSave={handleUpdate}
                        formatDate={formatDate}
                        formatTime={formatTime}
                    />
                </>
            ) : (
                <UnauthorizedMessage message={message} />
            )}
        </div>
    );
};

export default WasteDataVillager;
