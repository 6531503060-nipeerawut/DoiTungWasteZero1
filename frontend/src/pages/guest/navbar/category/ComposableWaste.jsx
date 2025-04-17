import React, { useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function ComposableWaste() {
    document.title = "DoiTung Zero-Waste";

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/composablewaste`)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
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

    return (
        <div className='container-fluid d-flex flex-column min-vh-100'>
            <>
                {/* Header */}
                <Header type="menu" />

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
        </div>
    );
}

export default ComposableWaste;