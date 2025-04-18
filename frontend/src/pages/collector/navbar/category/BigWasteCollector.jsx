import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

axios.defaults.withCredentials = true;

function BigGarbage() {
  document.title = "DoiTung Zero-Waste";

  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [collId, setcollId] = useState(null);

  // Fetch authentication status
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/BigGarbage`, { withCredentials: true });

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

  const wasteItems = [
    "ฟูกที่นอน",
    "เก้าอี้",
    "เฟอร์นิเจอร์เก่า"
  ];

  return (
    <div className='container-fluid d-flex flex-column min-vh-100'>
      {auth ? (
        <>
          {/* Header */}
          <Header type="menu" collId={collId} />

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
      ) : (
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
          <h3>{message}</h3>
          <h3>Login Now</h3>
          <Link to="/login" className='btn btn-primary'>Login</Link>
        </div>
      )}
    </div>
  );
}

export default BigGarbage;
