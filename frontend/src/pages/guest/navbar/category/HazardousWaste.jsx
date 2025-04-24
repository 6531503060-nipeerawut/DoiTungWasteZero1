import React, { useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function HazardousWaste() {
    document.title = "DoiTung Zero-Waste";

    const wasteItems = [
        "แบตเตอรี่(โทรศัพท์/ยานยนต์)",
        "ถ่านไฟฉาย",
        "หมึกปริ้น",
        "กระป๋องสี/กระป๋องสารเคมี",
        "หลอดไฟฟ้า",
        "ปากกา/น้ำยาลบคำผิด"
    ];

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/hazardouswaste`)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className='d-flex flex-column min-vh-100'>
            <>
                {/* Header */}
                <Header type="menu" />

                {/* Body */}
                <div className="bg-warning bg-opacity-25 p-4 mx-auto my-4 rounded-4 shadow" style={{ maxWidth: "600px" }}>
                    <h1 className="text-center border-bottom border-dark pb-2 mb-3 fw-bold">ขยะอันตราย</h1>
                    <p className="text-muted mb-3">
                        ขยะพลังงานอันตราย คือวัสดุที่ไม่ใช้แล้ว ผลิตภัณฑ์เสื่อมสภาพ หรือภาชนะบรรจุต่างๆ
                        ที่มีองค์ประกอบหรือปนเปื้อนวัตถุสารเคมีอันตรายชนิดต่างๆ
                        ที่มีลักษณะเป็นสารพิษ สารไวไฟ สารเคมีที่กัดกร่อนได้
                        สารกัมมันตรังสี และเชื้อโรคต่างๆ ที่ทำให้เกิดอันตรายแก่บุคคล สัตว์ พืช ทรัพย์สิน หรือสิ่งแวดล้อม
                    </p>
                    <h5 className="text-danger fw-semibold">ตัวอย่างชนิดขยะอันตราย</h5>
                    <ul className="ps-3">
                        {wasteItems.map((item, index) => (
                            <li key={index} className="text-dark">{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Footer */}
                <Footer />
            </>
        </div>
    );
}

export default HazardousWaste;