import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import UnauthorizedMessage from '../../../../components/UnauthorizedMessage';

axios.defaults.withCredentials = true;

function BathroomWasteVillager() {
    document.title = "DoiTung Zero-Waste";

    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [villId, setVillId] = useState(null);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v/bathroomwastevillager`);
                if (res.data.status?.toLowerCase() === "success") {
                    setAuth(true);
                    setVillId(res.data.vill_id);
                } else {
                    setAuth(false);
                    setMessage(res.data.error || "Unauthorized access");
                }
            } catch (err) {
                console.error("Error fetching auth status:", err);
                setMessage("Error connecting to server");
            } finally {
                setLoading(false);
            }
        };
        fetchAuthStatus();
    }, []);

    const wasteItems = [
        "ผ้าอนามัย",
        "ผ้าอ้อมเด็ก/แพมเพิส",
        "กระดาษชำระเปื้อน",
        "หน้ากากอนามัย",
        "ชุดตรวจATK"
    ];

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <h3>Loading...</h3>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            {auth ? (
                <>
                    {/* Header */}
                    <Header type="menu" villId={villId} />

                    {/* body */}
                    <div className="p-4 max-w-md mx-auto bg-warning rounded-4 shadow my-4">
                        <h1 className="fs-4 fw-bold text-center border-bottom border-dark pb-2 mb-3">ขยะห้องน้ำ/ปนเปื้อน</h1>
                        <p className="text-muted mb-3">
                            ขยะห้องน้ำ/ปนเปื้อน คือ ขยะที่ใช้ชำระกิจในห้องน้ำหรือขยะที่มีการปนเปื้อนสารคัดหลัง หรือปฏิกูลต่างๆ
                        </p>
                        <h2 className="text-danger fw-semibold mb-2">ตัวอย่างชนิดขยะห้องน้ำ/ปนเปื้อน</h2>
                        <ul className="list-group">
                            {wasteItems.map((item, index) => (
                                <li key={index} className="list-group-item">
                                    {item}
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

export default BathroomWasteVillager;
