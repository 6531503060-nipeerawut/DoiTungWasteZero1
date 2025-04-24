import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UnauthorizedMessage from '../../../components/UnauthorizedMessage';

axios.defaults.withCredentials = true;

function GarbageTruckScheduleVillager() {
    document.title = "DoiTung Zero-Waste";
    const [selectedDay, setSelectedDay] = useState(null);

    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [villId, setVillId] = useState(null);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v/garbagetruckschedulevillager`, { withCredentials: true });

                if (res.data.status?.toLowerCase() === "success") {
                    setAuth(true);
                    setVillId(res.data.vill_id);
                } else {
                    setAuth(false);
                    setMessage(res.data.error || "Unauthorized access");
                }
            } catch (err) {
                console.log("Error fetching auth status:", err);
                setMessage("Error connecting to server");
            } finally {
                setLoading(false);
            }
        };
        fetchAuthStatus();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <h3>Loading...</h3>
            </div>
        );
    }

    const garbageData = {
        Monday: {
            type: 'ขยะเปียก เปียกน้ำ',
            examples: ['พลาสติก', 'กระดาษ', 'โฟม ฟองน้ำ', 'ถ้วยน้ำมัน', 'รองเท้า'],
        },
        Tuesday: {
            type: 'ขยะเชื้อเพลิง พลังงาน',
            examples: ['ถุงขนม', 'เสื้อผ้าเก่า', 'กล่องนม'],
        },
        Wednesday: {
            type: 'ขยะห้องน้ำ',
            examples: ['ผ้าอนามัย', 'หน้ากากอนามัย', 'แพมเพิส'],
        },
        Friday: {
            type: 'ขยะอันตราย (เฉพาะวันศุกร์แรกของเดือน)',
            examples: ['หลอดไฟ', 'แบตเตอรี่', 'สารเคมี', 'สเปรย์'],
        },
    };

    const handleClick = (day) => {
        setSelectedDay(day);
    };

    return (
        <div className='d-flex flex-column min-vh-100'>
            {auth ? (
                <>
                    {/* Header */}
                    <Header type="menu" villId={villId} />

                    {/* Garbage Schedule */}
                    <div className="container my-4">
                        <h2 className="mb-4">📅 ตารางรถเก็บขยะ</h2>
                        <div className="d-flex flex-wrap gap-2 mb-4">
                            <button className="btn btn-outline-primary" onClick={() => handleClick('Monday')}>วันจันทร์</button>
                            <button className="btn btn-outline-primary" onClick={() => handleClick('Tuesday')}>วันอังคาร</button>
                            <button className="btn btn-outline-primary" onClick={() => handleClick('Wednesday')}>วันพุธ</button>
                            <button className="btn btn-outline-primary" onClick={() => handleClick('Friday')}>วันศุกร์</button>
                        </div>

                        {selectedDay && (
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">📌 ข้อมูลวัน{{
                                        Monday: 'จันทร์',
                                        Tuesday: 'อังคาร',
                                        Wednesday: 'พุธ',
                                        Friday: 'ศุกร์'
                                    }[selectedDay]}</h5>
                                    <p><strong>ประเภทขยะ:</strong> {garbageData[selectedDay].type}</p>
                                    <p><strong>ตัวอย่างขยะ:</strong></p>
                                    <ul>
                                        {garbageData[selectedDay].examples.map((item, index) => (
                                            <li key={index}>- {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
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

export default GarbageTruckScheduleVillager;