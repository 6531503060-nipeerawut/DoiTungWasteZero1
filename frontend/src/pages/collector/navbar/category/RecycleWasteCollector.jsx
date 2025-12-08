import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'; // ตรวจสอบว่ามี icon แล้ว

// Styles สำหรับธีม Professional Recycle
const styles = {
  pageContainer: {
    backgroundColor: '#F8F9FA',
    minHeight: '100vh',
    fontFamily: '"Sarabun", "Prompt", sans-serif',
  },
  headerSection: {
    background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)', // สีเขียวอมฟ้า (Teal) ดูเป็นทางการ
    color: 'white',
    borderRadius: '0 0 20px 20px',
    padding: '3rem 0',
    marginBottom: '2rem',
    boxShadow: '0 4px 20px rgba(15, 118, 110, 0.2)'
  },
  card: {
    border: 'none',
    borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    height: '100%',
    cursor: 'pointer',
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  cardHover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
    borderColor: '#0F766E'
  },
  iconWrapper: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#F0FDFA',
    color: '#0F766E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem auto',
    fontSize: '2.5rem'
  },
  imagePlaceholder: {
    height: '250px',
    width: '100%',
    backgroundColor: '#e9ecef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6c757d',
    fontSize: '1rem',
    flexDirection: 'column'
  }
};

function RecycleWaste() {
  document.title = "ขยะรีไซเคิลขายได้ - DoiTung Zero-Waste";

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  // ข้อมูลประเภทขยะ (ตามที่คุณให้มา)
  const categories = [
    {
      id: 'plastic',
      name: 'พลาสติก',
      icon: 'bi-box-seam',
      image: '/images/sellwaste/sellwaste01.png', // แก้ path รูปตามจริง
      items: [
        'ขวดพลาสติก PET ใส', 'ขวดพลาสติกขุ่น', 'ช้อนไฟเบอร์', 'พลาสติกดำ',
        'พลาสติกเนื้อไฟเบอร์', 'พลาสติกรวม', 'ช้อนส้อมพลาสติกอ่อน', 'ถุงพลาสติกสะอาด',
        'ช้อน/พลาสติกกรอบ/ถ้วยกาแฟ', 'เสื่อน้ำมัน', 'เชือกพลาสติกแพ็คกล่อง',
        'กระสอบฟาง', 'ท่อ PVC', 'สายไฟฟ้า'
      ]
    },
    {
      id: 'glass',
      name: 'ขวดแก้ว',
      icon: 'bi-cup-straw',
      image: '/images/sellwaste/sellwaste02.png',
      items: [
        'ขวดใส (ขวดเหล้า, ขวดสปอนเซอร์)', 'ขวดสีเขียว (สไปร์ท, เบียร์ช้าง)',
        'ขวดสีน้ำตาล (เอ็ม 150, เบียร์)', 'ขวดแก้วแตก',
        'ขวดพลาสติก PET ใส (ปน)', 'ขวดรวม'
      ]
    },
    {
      id: 'paper',
      name: 'กระดาษ',
      icon: 'bi-journal-text',
      image: '/images/sellwaste/sellwaste03.jpg',
      items: [
        'กระดาษแข็งสีน้ำตาล (กระดาษลูกฟูก)', 'กระดาษย่อย ขาว/ดำ', 'กระดาษย่อยรวม (เศษกระดาษ)'
      ]
    },
    {
      id: 'metal',
      name: 'โลหะ',
      icon: 'bi-tools',
      image: '/images/sellwaste/sellwaste04.png',
      items: [
        'กระป๋องอลูมิเนียม', 'กระป๋องเหล็ก', 'เหล็กย่อย', 'เหล็กหนา',
        'ทองแดง', 'ทองเหลือง', 'สแตนเลส'
      ]
    },
  ];

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/sellwastecollector`)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="d-flex flex-column" style={styles.pageContainer}>
      <Header type="menu" />
      
      {selectedCategory ? (
        <CategoryDetail
          category={categories.find(cat => cat.id === selectedCategory)}
          onBackClick={() => setSelectedCategory(null)}
        />
      ) : (
        <MainScreen
          categoryData={categories}
          onCategoryClick={setSelectedCategory}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
        />
      )}

      <Footer />
    </div>
  );
}

// หน้าจอหลัก (Main Menu)
function MainScreen({ categoryData, onCategoryClick, hoveredId, setHoveredId }) {
  return (
    <div className="flex-grow-1 pb-5">
      {/* Header Section */}
      <div style={styles.headerSection} className="text-center">
        <div className="container">
            <h1 className="fw-bold display-6 mb-2">
               <i className="bi bi-currency-exchange me-2"></i>
               ขยะรีไซเคิลขายได้
            </h1>
            <p className="lead opacity-75 mb-0">
               เปลี่ยนขยะให้เป็นมูลค่า เลือกประเภทวัสดุเพื่อดูรายละเอียดการรับซื้อ
            </p>
        </div>
      </div>

      <div className="container">
         {/* Info Alert */}
         <div className="alert alert-light border shadow-sm rounded-3 mb-5 d-flex align-items-center">
             <i className="bi bi-info-circle-fill text-primary fs-4 me-3"></i>
             <div>
                 <strong>คำแนะนำ:</strong> ขยะขายได้ คือ ขยะที่สามารถนำกลับมาแปรรูปได้ 
                 กรุณาทำความสะอาดเบื้องต้นและแยกประเภทก่อนนำมาขายเพื่อให้ได้ราคาดีที่สุด
             </div>
         </div>

         {/* Categories Grid */}
         <div className="row g-4 justify-content-center">
           {categoryData.map(category => (
             <div className="col-12 col-md-6 col-lg-3" key={category.id}>
               <div
                 style={{
                    ...styles.card,
                    ...(hoveredId === category.id ? styles.cardHover : {})
                 }}
                 onMouseEnter={() => setHoveredId(category.id)}
                 onMouseLeave={() => setHoveredId(null)}
                 onClick={() => onCategoryClick(category.id)}
                 className="p-4 text-center d-flex flex-column align-items-center justify-content-center"
               >
                  {/* Icon แทนรูปชั่วคราว หรือจะใช้รูปก็ได้ถ้ามี */}
                  <div style={styles.iconWrapper}>
                     <i className={`bi ${category.icon}`}></i>
                  </div>
                  
                  <h4 className="fw-bold text-dark mb-2">{category.name}</h4>
                  <span className="text-muted small">ดูรายการรับซื้อ <i className="bi bi-arrow-right"></i></span>
               </div>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}

// หน้าจอรายละเอียด (Detail Screen)
function CategoryDetail({ category, onBackClick }) {
  return (
    <div className="flex-grow-1 py-5 container">
        <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
                <div className="card border-0 shadow-lg overflow-hidden rounded-4">
                    {/* Image Header */}
                    <div className="position-relative">
                        {/* ตรวจสอบว่ามีรูปจริงหรือไม่ ถ้าไม่มีใช้ Placeholder */}
                        <img 
                           src={category.image} 
                           alt={category.name} 
                           className="w-100"
                           style={{height: '250px', objectFit: 'cover'}}
                           onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                           }}
                        />
                        <div style={{...styles.imagePlaceholder, display: 'none'}}>
                            <i className={`bi ${category.icon} display-1 mb-3 opacity-50`}></i>
                            <span>{category.name} Image</span>
                        </div>
                        
                        {/* Overlay Title */}
                        <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'}}>
                             <h2 className="text-white fw-bold m-0">{category.name}</h2>
                        </div>
                        
                        {/* Back Button Floating */}
                        <button 
                            onClick={onBackClick}
                            className="btn btn-light rounded-circle shadow position-absolute top-0 start-0 m-3"
                            style={{width: '40px', height: '40px', padding: 0}}
                        >
                            <i className="bi bi-arrow-left text-dark"></i>
                        </button>
                    </div>

                    <div className="card-body p-5">
                        <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                            <i className="bi bi-list-check fs-3 text-success me-3"></i>
                            <h4 className="fw-bold m-0">ประเภทของ {category.name} ที่รับซื้อ</h4>
                        </div>

                        {/* List Items */}
                        <div className="row g-3">
                             {category.items.map((item, index) => (
                                 <div className="col-12 col-md-6" key={index}>
                                     <div className="d-flex align-items-start">
                                         <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
                                         <span className="text-dark">{item}</span>
                                     </div>
                                 </div>
                             ))}
                        </div>

                        {/* Pricing Notice */}
                        <div className="mt-5 p-4 bg-warning bg-opacity-10 rounded-3 border border-warning">
                            <div className="d-flex">
                                <i className="bi bi-exclamation-circle-fill text-warning fs-4 me-3"></i>
                                <div>
                                    <h6 className="fw-bold text-dark">หมายเหตุเรื่องราคา</h6>
                                    <p className="text-muted small mb-0">
                                        ราคารับซื้ออาจมีการเปลี่ยนแปลงตามกลไกตลาด และขึ้นอยู่กับความสะอาดของวัสดุ 
                                        กรุณาติดต่อจุดรับซื้อเพื่อสอบถามราคาปัจจุบัน
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default RecycleWaste;