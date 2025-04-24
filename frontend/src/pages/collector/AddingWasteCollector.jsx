import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Footer from './components/Footer';
import Header from './components/Header';
import UnauthorizedMessage from '../../components/UnauthorizedMessage';

axios.defaults.withCredentials = true;

function AddingWasteCollector() {
    document.title = "DoiTung Zero-Waste";
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [collId, setCollId] = useState(null);

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
        const { name, value } = e.target;
    
        if (name === 'caw_wasteType') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
                caw_subWasteType: value === '5' ? prevData.caw_subWasteType : '',
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const dataToSend = {
            ...formData,
            caw_subWasteType: formData.caw_wasteType === '5' ? formData.caw_subWasteType : null,
        };
    
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/c/addingwastecollector`,
                dataToSend,
                { withCredentials: true }
            );
    
            if (response.data.status === 'success') {
                alert('Data added successfully from collector');
                navigate('/c/dashboard');
            }
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.response?.data?.error || 'Failed to add waste data');
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
        <div className='d-flex flex-column min-vh-100'>
            {auth ? (
                <>
                    {/* Header */}
                    <Header collId={collId} />

                    {/* Body */}
                    <div className="container mt-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                            <h2 className="text-center fw-bold mb-4">เพิ่มรายการน้ำหนักขยะ</h2>
                            <form onSubmit={handleSubmit}>
                                {/* วันที่ทิ้งขยะ */}
                                <div className="mb-3">
                                <label className="form-label">วันที่ทิ้งขยะ*</label>
                                <input
                                    type="text"
                                    name="vaw_date"
                                    value={formData.vaw_date}
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
                                    <option value="5">05 วัสดุรีไซเคิล</option>
                                    <option value="6">06 ขยะย่อยสลาย</option>
                                    <option value="7">07 ขยะชิ้นใหญ่</option>
                                </select>
                            </div>
                            
                            {/* ประเภทขยะ (ย่อย) */}
                            {formData.caw_wasteType === '5' && (
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
                            )}

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
                    </div>
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

export default AddingWasteCollector;