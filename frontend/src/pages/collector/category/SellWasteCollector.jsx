import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTrash, FaPlus, FaTachometerAlt, FaBars } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

axios.defaults.withCredentials = true;

function GarbageSell() {
  document.title = "DoiTung Zero-Waste";

  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [collId, setcollId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([
    {
      id: 'plastic',
      name: 'พลาสติก',
      image: '/images/plastic.jpg',
      items: ['ขวดพลาสติก PET ใส',
        'ขวดพลาสติกขุ่น',
        'ช้อนไฟเบอร์',
        'พลาสติกด',
        'พลาสติกเนื้อไฟเบอร์',
        'พลาสติกรวม',
        'ช้อนส้อมพลาสติกอ่อน',
        'ถุงพลาสติกสะอาด',
        'ช้อน/พลาสติกกรอบ/ถ้วยกาแฟ',
        'เสื่อนน้ำมัน',
        'เชือกพลาสจิกแพ็คกล่อง',
        'กระสอบฟาง',
        'ท่อ PVC',
        'สายไฟฟ้า'],
    },
    {
      id: 'glass',
      name: 'ขวดแก้ว',
      image: '/images/glass.jpg',
      items: ['ขวดใส (ขวดเหล้า, ขวดสปอนเซอร์)',
        'ขวดสีเขียว (สไปร์ท, เบียร์ช้าง)',
        'ขวดสีน้ำตาล (เอ็ม 150, เบียร์)',
        'ขวดแก้วแตก',
        'ขวดพลาสติก PET ใส',
        'ขวดรวม'],
    },
    {
      id: 'paper',
      name: 'กระดาษ',
      image: '/images/paper.jpg',
      items: [     'กระดาษแข็งสีน้ำตาล (กระดาษลูกฟูก)',
        'กระดาษย่อย ขาว/ดำ',
        'กระดาษย่อยรวม (เศษกระดาษ)'],
    },
    {
      id: 'metal',
      name: 'โลหะ',
      image: '/images/metal.jpg',
      items: [    'กระป๋องอลูมิเนียม',
        'กระป๋องเหล็ก',
        'เหล็กย่อย',
        'เหล็กหนา',
        'ทองแดง',
        'ทองเหลือง',
        'กระป๋องเหล็ก',
        'สแตนเลส'],
    },
  ]);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/GarbageSell`);
        if (res.data.status?.toLowerCase() === "success") {
          setAuth(true);
          if (Array.isArray(res.data.categories)) {
            setCategories(res.data.categories);
          }
          setcollId(res.data.coll_id);
        } else {
          setAuth(false);
          setMessage(res.data.error || "Unauthorized access");
        }
      } catch (err) {
        console.log("Error fetching auth status:", err);
        setMessage("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      } finally {
        setLoading(false);
      }
    };
    fetchAuthStatus();
  }, []);

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

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/logout`);
      setAuth(false);
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

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

          <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="max-w-md mx-auto bg-gray-300 rounded-xl overflow-hidden shadow-lg pb-6">
              <div className="w-full h-6 bg-gray-400 flex justify-center items-center">
                <div className="w-16 h-1 bg-white rounded-full"></div>
              </div>

              <div className="p-2">
                {selectedCategory ? (
                  <CategoryDetail
                    category={categories.find(cat => cat.id === selectedCategory)}
                    onBackClick={() => setSelectedCategory(null)}
                  />
                ) : (
                  <MainScreen
                    categoryData={categories}
                    onCategoryClick={setSelectedCategory}
                  />
                )}
              </div>

              <div className="mt-4 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-white"></div>
              </div>
            </div>
          </div>

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

function MainScreen({ categoryData, onCategoryClick }) {
  return (
    <div className="bg-orange-100 rounded-lg overflow-hidden">
      <div className="bg-yellow-400 text-center py-2 font-bold text-lg">ขยะขายได้</div>
      <div className="bg-orange-200 p-3 text-sm">
        <p>ขยะขายได้ คือ ขยะประเภทที่สามารถนำกลับมาแปรรูป และได้รับค่าตอบแทนจากการนำไปขาย</p>
        <p className="text-red-500 font-semibold mt-2">ท่านสามารถเลือกชนิดขยะได้</p>
        <p className="text-gray-700">ตามต้องการ ด้านล่างนี้</p>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        {categoryData && categoryData.map(category => (
          <div
            key={category.id}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onCategoryClick(category.id)}
          >
            <div className="rounded-full bg-white p-2 w-32 h-32 flex items-center justify-center">
              <img src={category.image} alt={category.name} className="w-24 h-24 object-cover rounded-full" />
            </div>
            <p className="text-center mt-2">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryDetail({ category, onBackClick }) {
  return (
    <div className="bg-orange-100 rounded-lg overflow-hidden">
      <div className="bg-yellow-400 text-center py-2 font-bold text-lg flex items-center">
        <button
          onClick={onBackClick}
          className="bg-blue-500 text-white rounded px-2 py-1 ml-2"
        >
          ย้อนกลับ
        </button>
        <span className="flex-grow">{category.name}</span>
      </div>
      <div className="p-4">
        <h3 className="font-bold mb-3">ประเภทของ {category.name} ที่รับซื้อ:</h3>
        <ul className="space-y-2">
          {(category.items || []).map((item, index) => (
            <li key={index} className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 bg-yellow-100 p-3 rounded-lg border border-yellow-400">
          <p className="text-sm">
            ราคารับซื้อขึ้นอยู่กับปริมาณและคุณภาพของวัสดุรีไซเคิล กรุณาติดต่อเจ้าหน้าที่เพื่อสอบถามราคาปัจจุบัน
          </p>
        </div>
      </div>
    </div>
  );
}

export default GarbageSell;
