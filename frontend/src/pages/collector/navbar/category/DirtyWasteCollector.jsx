import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import UnauthorizedMessage from '../../../../components/UnauthorizedMessage';

axios.defaults.withCredentials = true;

function DirtyGarbage() {
  document.title = "DoiTung Zero-Waste";
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [collId, setcollId] = useState(null);

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
    const fetchAuthStatus = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/DirtyGarbage`, { withCredentials: true });

        if (res.data.status?.toLowerCase() === "success") {
          setAuth(true);
          setcollId(res.data.coll_id);
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

  return (
    <div className='container-fluid d-flex flex-column min-vh-100'>
      {auth ? (
        <>
          {/* Header */}
          <Header type="menu" collId={collId} />

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
      ) : (
        <UnauthorizedMessage message={message} />
      )}
    </div>
  );
}

export default DirtyGarbage;
