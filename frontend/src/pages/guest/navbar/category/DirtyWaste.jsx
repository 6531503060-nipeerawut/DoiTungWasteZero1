import React, { useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function DirtyWaste() {
  document.title = "DoiTung Zero-Waste";

  const wasteItems = [
    "ถ้วยอาหารกึ่งสำเร็จรูป",
    "ถุงแกงเปื้อน",
    "ถุงน้ำจิ้ม",
    "กล่องใส่อาหารที่เปื้อน",
    "แก้วเครื่องดื่ม",
    "แก้วกาแฟ",
    "ผ้าเปียก",
    "ถุงพลาสติกเปื้อน"
  ];

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/dirtywaste`)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
}, []);

  return (
    <div className='container-fluid d-flex flex-column min-vh-100'>
        <>
          {/* Header */}
          <Header type="menu" />

           {/* Body */}
          <div className="p-4 max-w-md mx-auto bg-warning-subtle rounded-3 shadow-sm mt-4">
            <h1 className="text-center fw-bold border-bottom pb-2 mb-3">ขยะเปื้อน</h1>
            <p className="text-muted mb-3">
              ขยะเปื้อน คือ ขยะทุกชนิดที่เปื้อนสกปรกหรือเปียกน้ำมากๆ มักยากที่จะทำความสะอาดได้
            </p>
            <h5 className="text-danger fw-semibold mb-2">ตัวอย่างชนิดขยะเปื้อน</h5>
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

export default DirtyWaste;