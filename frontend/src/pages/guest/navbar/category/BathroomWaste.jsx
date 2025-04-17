import React, { useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function BathroomWaste() {
    document.title = "DoiTung Zero-Waste";

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/BathroomWaste`)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
    }, []);

    const wasteItems = [
        "ผ้าอนามัย",
        "ผ้าอ้อมเด็ก/แพมเพิส",
        "กระดาษชำระเปื้อน",
        "หน้ากากอนามัย",
        "ชุดตรวจATK"
    ];


    return (
        <div className="container-fluid d-flex flex-column min-vh-100">
            <>
                {/* Header */}
                <Header type="menu" />

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
        </div>
    );
}

export default BathroomWaste;
