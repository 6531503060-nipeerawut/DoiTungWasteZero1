import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

axios.defaults.withCredentials = true;

function BathroomGarbage() {
    document.title = "DoiTung Zero-Waste";

    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [collId, setcollId] = useState(null);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/BathroomGarbage`);
                if (res.data.status?.toLowerCase() === "success") {
                    setAuth(true);
                    setcollId(res.data.coll_id);
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
        <div className="container-fluid d-flex flex-column min-vh-100">
            {auth ? (
                <>
                    {/* Header */}
                    <Header type="menu" collId={collId} />

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
                <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
                    <h3>{message}</h3>
                    <h3>Login Now</h3>
                    <Link to="/login" className="btn btn-primary">Login</Link>
                </div>
            )}
        </div>
    );
}

export default BathroomGarbage;
