import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Footer from './components/Footer';
import Header from './components/Header';
import UnauthorizedMessage from '../../components/UnauthorizedMessage';

function AddingWasteVillager() {
    document.title = "DoiTung Zero-Waste";
    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [villId, setVillId] = useState(null);

    const formatThaiDate = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear() + 543;
        return `${day}-${month}-${year}`;
    };

    const today = new Date();
    today.setHours(today.getHours() + 7);

    const [formData, setFormData] = useState({
        vaw_date: formatThaiDate(today),
        vaw_wasteType: '',
        vaw_subWasteType: '',
        vaw_wasteTotal: '',
        vaw_description: ''
    });

    useEffect(() => {
        const formattedDate = formatThaiDate(new Date());
        setFormData(prevData => ({ ...prevData, vaw_date: formattedDate }));
    
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/v/addingwastevillager`, { withCredentials: true })
            .then(res => {
                if (res.data.status === 'success') {
                    setAuth(true);
                    setVillId(res.data.vill_id);
                } else {
                    setMessage(res.data.error || 'Unauthorized');
                }
            })
            .catch(err => console.error('Auth check failed:', err));
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
    
        if (name === 'vaw_wasteType') {
            setFormData(prev => ({
                ...prev,
                vaw_wasteType: value,
                vaw_subWasteType: value === '5' ? prev.vaw_subWasteType : '',
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const formatForDB = (date) => {
        const [day, month, year] = date.split("-");
        return `${parseInt(year) - 543}-${month}-${day}`;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    
        const dataToSend = {
            ...formData,
            vaw_date: formatForDB(formData.vaw_date),
            vaw_subWasteType: formData.vaw_wasteType === '5' ? formData.vaw_subWasteType : null
        };
    
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/v/addingwastevillager`, dataToSend, { withCredentials: true })
            .then(res => {
                if (res.data.status === "success") {
                    alert("Adding Waste Weights successful!");
                    navigate('/v/wastedatavillager');
                    setVillId(res.data.vill_id);
                } else {
                    alert(res.data.error || 'Unknown error occurred.');
                }
            })
            .catch(err => {
                console.error("Error adding weight: ", err);
                alert("Failed to add weight. Please try again.");
            });
    };

    const resetForm = () => {
        const today = new Date();
        today.setHours(today.getHours() + 7);
        setFormData({
            vaw_date: formatThaiDate(today),
            vaw_wasteType: '',
            vaw_subWasteType: '',
            vaw_wasteTotal: '',
            vaw_description: ''
        });
    };

    return (
        <div className='container-fluid d-flex flex-column min-vh-100'>
            {auth ? (
                <>
                    {/* Header */}
                    <Header villId={villId} />

                    <div className="container mt-4">
                        <div className="card shadow-lg">
                            <div className="card-body">
                            <h2 className="text-center mb-4">เพิ่มรายการน้ำหนักขยะ</h2>
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

                                {/* ประเภทขยะ */}
                                <div className="mb-3">
                                <label className="form-label">ประเภทขยะ*</label>
                                <select
                                    name="vaw_wasteType"
                                    value={formData.vaw_wasteType}
                                    onChange={handleChange}
                                    required
                                    className="form-select"
                                >
                                    <option value="">เลือกประเภทขยะ</option>
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
                                {formData.vaw_wasteType === "5" && (
                                    <div className="mb-3">
                                        <label className="form-label">ประเภทขยะ (ย่อย)*</label>
                                        <select
                                            name="vaw_subWasteType"
                                            value={formData.vaw_subWasteType}
                                            onChange={handleChange}
                                            required
                                            className="form-select"
                                        >
                                            <option value="">เลือกประเภทขยะย่อย</option>
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
                                    name="vaw_wasteTotal"
                                    value={formData.vaw_wasteTotal}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                                </div>

                                {/* รายละเอียดอื่น ๆ */}
                                <div className="mb-3">
                                <label className="form-label">รายละเอียดอื่น ๆ</label>
                                <textarea
                                    name="vaw_description"
                                    value={formData.vaw_description}
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

export default AddingWasteVillager;