import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import UnauthorizedMessage from '../../../../components/UnauthorizedMessage';

axios.defaults.withCredentials = true;

function ComposableWasteVillager() {
    document.title = "DoiTung Zero-Waste";
    
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [villId, setVillId] = useState(null);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v/composablegarbagevillager`);
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

    const wasteItems = [
        "เศษอาหาร/เศษผัก/เศษผลไม้",
        "มะพร้าว",
        "เศษใบไม้",
        "น้ำแกง",
        "เปลือกไข่",
        "กากกาแฟ",
        "วัสดุปลูก",
        "ไขมัน"
    ];

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <h3>Loading...</h3>
            </div>
        );
    }

    return (
        <div className='d-flex flex-column min-vh-100'>
            {auth ? (
                <>
                    {/* Header */}
                    <Header type="menu" villId={villId} />

                     {/* Body */}
                    <div className="p-4 bg-orange-100 rounded-2xl shadow-md my-4 mx-auto" style={{ maxWidth: "600px" }}>
                        <h1 className="text-xl font-bold text-center border-bottom pb-2 mb-4">ขยะย่อยสลายได้</h1>
                        <p className="text-sm text-dark mb-4">
                            ขยะย่อยสลายได้ คือ ขยะประเภทที่ย่อยสลายได้ เช่น เศษอาหาร ใบไม้ หรือวัสดุบรรจุภัณฑ์ที่มีสัญลักษณ์ย่อยสลายได้
                        </p>
                        <h2 className="text-danger font-weight-semibold mb-2">ตัวอย่างชนิดขยะย่อยสลายได้</h2>
                        <ul className="list-group list-group-flush">
                            {wasteItems.map((item, index) => (
                                <li key={index} className="list-group-item">{item}</li>
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

export default ComposableWasteVillager;
