import React, { useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function BigWaste() {
  document.title = "DoiTung Zero-Waste";

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/bigwaste`)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
}, []);

  const wasteItems = [
    "ฟูกที่นอน",
    "เก้าอี้",
    "เฟอร์นิเจอร์เก่า"
  ];

  return (
    <div className='container-fluid d-flex flex-column min-vh-100'>
      <>
        {/* Header */}
        <Header type="menu" />

          {/* Body */}
        <div className="p-4 max-w-md mx-auto bg-orange-100 rounded-2xl shadow-md">
          <h1 className="text-xl font-bold text-center border-b-4 border-black pb-2 mb-4">ขยะชิ้นใหญ่</h1>
          <p className="text-sm text-gray-700 mb-4">
            คือ ขยะที่มีขนาดใหญ่ เช่น ฟูกที่นอน เก้าอี้ เศษ ไม้ขนาดใหญ่ เฟอร์นิเจอร์ต่างๆ
          </p>
          <h2 className="text-red-600 font-semibold mb-2">ตัวอย่างชนิดขยะชิ้นใหญ่</h2>
          <ul className="list-disc list-inside space-y-1">
            {wasteItems.map((item, index) => (
              <li key={index} className="text-gray-800">{item}</li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <Footer />
      </>
    </div>
  );
}

export default BigWaste;