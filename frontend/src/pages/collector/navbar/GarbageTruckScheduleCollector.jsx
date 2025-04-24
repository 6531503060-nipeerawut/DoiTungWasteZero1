import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UnauthorizedMessage from '../../../components/UnauthorizedMessage';

axios.defaults.withCredentials = true;

function GarbageTruckScheduleCollector() {
    document.title = "DoiTung Zero-Waste";
    const [selectedDay, setSelectedDay] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [collId, setcollId] = useState(null);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/garbagetruckschedulecollector`, { withCredentials: true });

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

    const garbageData = {
        Monday: {
            type: 'ขยะเปียก เปียกน้ำ',
            examples: ['พลาสติก', 'กระดาษ', 'โฟม ฟองน้ำ', 'ถ้วยน้ำมัน', 'รองเท้า'],
        },
        Tuesday: {
            type: 'ขยะเชื้อเพลิง พลังงาน',
            examples: ['ถุงขนม', 'เสื้อผ้าเก่า', 'กล่องนม'],
        },
        Wednesday: {
            type: 'ขยะห้องน้ำ',
            examples: ['ผ้าอนามัย', 'หน้ากากอนามัย', 'แพมเพิส'],
        },
        Friday: {
            type: 'ขยะอันตราย (เฉพาะวันศุกร์แรกของเดือน)',
            examples: ['หลอดไฟ', 'แบตเตอรี่', 'สารเคมี', 'สเปรย์'],
        },
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
        setShowDetail(true);
      };
    
      const handleBackClick = () => {
        setShowDetail(false);
      };
    
      const renderMainScreen = () => {
        return (
          <div className="container my-4">
            <h2 className="mb-4">📅 ตารางรถเก็บขยะ</h2>
            
            <div className="row mb-4">
              <div className="col-6">
                <div className="card h-100" onClick={() => handleDayClick('Monday')} style={{ cursor: 'pointer' }}>
                  <div className="card-header text-center fw-bold" style={{ backgroundColor: garbageData.Monday.headerColor }}>วันจันทร์</div>
                  <div className="card-body text-center" style={{ backgroundColor: garbageData.Monday.color }}>
                    <p className="card-text">ขยะเปื้อน</p>
                    <p className="card-text">เปียกน้ำ</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card h-100" onClick={() => handleDayClick('Tuesday')} style={{ cursor: 'pointer' }}>
                  <div className="card-header text-center fw-bold fw-bold" style={{ backgroundColor: garbageData.Tuesday.headerColor }}>วันอังคาร</div>
                  <div className="card-body text-center" style={{ backgroundColor: garbageData.Tuesday.color }}>
                    <p className="card-text">ขยะเชื้อเพลิง</p>
                    <p className="card-text">พลังงาน</p>
                  </div>
                </div>
              </div>
            </div>
            
            
            <div className="row mb-4">
              <div className="col-6">
                <div className="card h-100" onClick={() => handleDayClick('Wednesday')} style={{ cursor: 'pointer' }}>
                  <div className="card-header text-center fw-bold fw-bold" style={{ backgroundColor: garbageData.Wednesday.headerColor }}>วันพุธ</div>
                  <div className="card-body text-center" style={{ backgroundColor: garbageData.Wednesday.color }}>
                    <p className="card-text">ขยะห้องน้ำ</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card h-100" onClick={() => handleDayClick('Friday')} style={{ cursor: 'pointer' }}>
                  <div className="card-header text-center fw-bold fw-bold" style={{ backgroundColor: garbageData.Friday.headerColor }}>วันศุกร์</div>
                  <div className="card-body text-center" style={{ backgroundColor: garbageData.Friday.color }}>
                    <p className="card-text text-danger fw-bold">ขยะอันตราย</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      };
    
      const renderDetailScreen = () => {
        const data = garbageData[selectedDay];
        return (
            <div className="container-fluid my-4">
            <div className="card h-100">
              
              <div className="card-body" style={{ backgroundColor: data.color }}>
                <h5 className="card-title text-center mb-3">{data.heading}</h5>
                <ul className="list-disc ps-4">
                  {data.examples.map((example, index) => (
                    <li key={index} className="mb-1">{example}</li>
                  ))}
                </ul>
                <div className="row g-2 mt-3">
                  {data.images.map((image, index) => (
                    <div key={index} className="col-12 col-md-6">
                      <img src={image} alt={`Example ${index + 1}`} className="img-fluid rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          
            <div className="d-flex justify-content-start mt-3">
              <button className="btn btn-outline-secondary" onClick={handleBackClick}>
                <i className="bi bi-arrow-left"></i> กลับ
              </button>
            </div>
          </div>
          
        );
      };
    
      return (
        <div className="d-flex flex-column min-vh-100">
            {auth ? (
                <>
          <Header type="menu" collId={collId} />
          {showDetail ? renderDetailScreen() : renderMainScreen()}
          <Footer />
          </>
            ) : (
                <UnauthorizedMessage message={message} />
            )}
        </div>
    );
};

    
    export default GarbageTruckScheduleCollector;