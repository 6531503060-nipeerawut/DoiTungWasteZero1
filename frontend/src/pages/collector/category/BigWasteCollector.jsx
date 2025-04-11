import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTrash, FaPlus, FaTachometerAlt, FaBars } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

axios.defaults.withCredentials = true;

function BigGarbage() {
  document.title = "DoiTung Zero-Waste";

  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/logout`);
      setAuth(false);
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <h3>Loading...</h3>
      </div>
    );
  }

  // Waste items for BigGarbage page
  const wasteItems = [
    "ฟูกที่นอน", 
    "เก้าอี้", 
    "เฟอร์นิเจอร์เก่า"
  ];

  return (
    <div className='container-fluid d-flex flex-column min-vh-100'>
      {auth ? (
        <>
          {/* Navbar */}
          <nav className="navbar navbar-light bg-light d-flex justify-content-between p-3">
            <span className="navbar-brand font-weight-bold">Doitung Zero - Waste</span>
            <div className="dropdown" ref={dropdownRef}>
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                <FaBars />
              </button>
              <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`}>
                  <li><Link className="dropdown-item" to="/c/wastepricecollector">ราคารับซื้อ</Link></li>
                  <li><Link className="dropdown-item" to="/c/categorycollector">วิธีการแยกชนิดขยะ</Link></li>
                  <li><Link className="dropdown-item" to="/c/garbagetruckschedulecollector">ตารางรถเก็บขยะ</Link></li>
                  <li><Link className="dropdown-item" to="/carbons">คำนวณคาร์บอน</Link></li>
                  <li><Link className="dropdown-item" to={`/c/profile-collector/${collId}`}>บัญชีผู้ใช้</Link></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>ออกจากระบบ</button></li>
              </ul>
            </div>
          </nav>

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
          <footer className="bg-light py-3 d-flex justify-content-around border-top mt-auto">
            <Link to="/c/homecollector" className="text-dark text-decoration-none"><FaHome size={30} /></Link>
            <Link to="/c/wastedatacollector" className="text-dark text-decoration-none"><FaTrash size={30} /></Link>
            <Link to="/c/addingwastecollector" className="text-dark text-decoration-none"><FaPlus size={30} /></Link>
            <Link to="/c/DashboardCollector" className="text-dark text-decoration-none"><FaTachometerAlt size={30} /></Link>
          </footer>
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
