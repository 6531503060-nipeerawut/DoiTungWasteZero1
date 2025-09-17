import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from '../components/Header';
import Footer from '../components/Footer';

axios.defaults.withCredentials = true;

function GarbageTruckScheduleCollector() {
  document.title = "DoiTung Zero-Waste";
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/garbagetruckschedulecollector`)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }, []);

  const garbageData = {
    Monday: {
      type: 'ขยะเปื้อน เปียกน้ำ',
      color: '#FEF9C3', // Yellow - bg-yellow-200
      headerColor: '#FACC15', // Yellow - bg-yellow-400
      title: 'ทุกวันจันทร์',
      heading: '📌ประเภทขยะเปื้อน เปียกน้ำ',
      examples: [
        'พลาสติก',
        'กระดาษ',
        'โฟม ฟองน้ำ',
        'กระดาษฉัน เทฟใต',
        'ผงซักฟอกพิษ',
        'น้ำอัดลม',
        'จานชามพลาสติก',
        'ขวดพลาสติก'
      ],
      images: ['/img/waste/wet-waste-1.jpg', '/img/waste/wet-waste-2.jpg', '/img/waste/wet-waste-3.jpg', '/img/waste/wet-waste-4.jpg']
    },
    Tuesday: {
      type: 'ขยะเชื้อเพลิง พลังงาน',
      color: '#FBCFE8', // Pink - bg-pink-200
      headerColor: '#EC4899', // Pink - bg-pink-500
      title: 'ทุกวันอังคาร',
      heading: '📌ประเภทขยะเชื้อเพลิง พลังงาน',
      examples: [
        'ถุงขนม ถุงพลาสติก ๆ',
        'เสื้อผ้าเก่า',
        'รองเท้าเก่าเก่าเกิน',
        'พลาสติก',
        'กระดาษ'
      ],
      images: ['/img/waste/fuel-waste-1.jpg', '/img/waste/fuel-waste-2.jpg', '/img/waste/fuel-waste-3.jpg']
    },
    Wednesday: {
      type: 'ขยะห้องน้ำ',
      color: '#DCFCE7', // Green - bg-green-100
      headerColor: '#16A34A', // Green - bg-green-600
      title: 'ทุกวันพุธ',
      heading: '📌ประเภทขยะห้องน้ำ',
      examples: [
        'ผ้าอนามัย',
        'หน้ากากอนามัย',
        'ผ้าอนามัย',
        'ยางลบ',
        'แพมเพิส'
      ],
      images: ['/img/waste/general-waste-1.jpg', '/img/waste/general-waste-2.jpg', '/img/waste/general-waste-3.jpg', '/img/waste/general-waste-4.jpg']
    },
    Friday: {
      type: 'ขยะอันตราย',
      color: '#DBEAFE', // Blue - bg-blue-100
      headerColor: '#3B82F6', // Blue - bg-blue-500
      title: 'ทุกวันศุกร์',
      heading: '📌ประเภทขยะอันตราย',
      examples: [
        'หลอดไฟ, ถ่านไฟฉาย',
        'แบตเตอรี่มือถือเก่า',
        'ยาหมดอายุ ขวดสารเคมีพิษ',
        'กระป๋องสเปรย์ทุกชนิดอันตราย',
        'กระป๋องสีพ่นทุกชนิดอันตราย',
        'ขวดยาฆ่าแมลงหรือใช้ในพืช',
        'อื่น ๆ ที่มีสัญลักษณ์อันตราย'
      ],
      images: ['/img/waste/hazardous-waste-1.jpg', '/img/waste/hazardous-waste-2.jpg', '/img/waste/hazardous-waste-3.jpg']
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
      <Header type="menu" />
      {showDetail ? renderDetailScreen() : renderMainScreen()}
      <Footer />
    </div>
  );
}
 
    export default GarbageTruckScheduleCollector;