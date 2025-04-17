import React, { useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function EnergyRDFWaste() {
    document.title = "DoiTung Zero-Waste";

    const wasteItems = [
        "ถุงขนม/ซองมาม่า/ซองกาแฟ/สติกเกอร์/เทปใสสีน้ำตาลสีดำ",
        "กล่องนม/น้ำผลไม้",
        "แก้วกาแฟไม่กรอบ(เหนียว)",
        "ถ้วยกระดาษกาแฟ",
        "ภาชนะใส่อาหารย่อยสลายได้",
        "ตะเกียบ/ไม้จิ้มฟัน/ไม้เสียบลูกชิ้น/ไม้อื่นๆ",
        "เศษผ้า/เศษด้าย/เศษพรม",
        "เสื้อผ้าเก่า",
        "รองเท้าผ้าใบ/รองเท้าแตะ",
        "กระดาษสา, ขวดพลาสติกสีอื่นๆ",
        "ถุงพลาสติกใส(แข็งขายไม่ได้)"
    ];

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/energyrdfwaste`)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className='container-fluid d-flex flex-column min-vh-100'>
                <>
                    {/* Header */}
                    <Header type="menu" />

                     {/* Body */}
                    <div className="p-4 max-w-md mx-auto bg-warning-subtle rounded-2xl shadow-sm">
                        <h1 className="text-center border-bottom border-dark pb-2 mb-3 fs-4 fw-bold">ขยะพลังงาน RDF</h1>
                        <p className="text-muted mb-3">
                            ขยะพลังงานอันตราย คือวัสดุที่ไม่ใช้แล้ว ผลิตภัณฑ์เสื่อมสภาพ หรือภาชนะบรรจุต่างๆ
                            ที่มีองค์ประกอบหรือปนเปื้อนวัตถุสารเคมีอันตรายชนิดต่างๆ ที่มีลักษณะเป็นสารพิษ
                            สารไวไฟ สารเคมีที่กัดกร่อนได้ สารกัมมันตรังสี และเชื้อโรคต่างๆ ที่ทำให้เกิดอันตรายแก่บุคคล
                            สัตว์ พืช ทรัพย์สิน หรือสิ่งแวดล้อม
                        </p>
                        <h2 className="text-danger fw-semibold mb-2">ตัวอย่างขยะพลังงาน RDF</h2>
                        <ul className="list-group">
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

export default EnergyRDFWaste;