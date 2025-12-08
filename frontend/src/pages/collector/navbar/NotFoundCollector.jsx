import React from 'react';
import BackToHomeButton from '../../../components/BackToHomeButton';
import 'bootstrap-icons/font/bootstrap-icons.css'; // นำเข้า Bi Icons

const CarbonFootprintCalculatorPlaceholderCollector = () => {
    return (
        <div 
            className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center p-4"
            style={{ backgroundColor: '#F8F9FA' }} // เพิ่มพื้นหลังสีอ่อน
        >
            <div className="p-5 bg-white shadow-lg rounded" style={{ maxWidth: '800px' }}>
                {/* Icon สื่อถึงการคำนวณหรือการพัฒนา */}
                <i className="bi bi-hammer display-1 mb-4 text-warning"></i>
                
                {/* หัวข้อหลักที่เป็นทางการ */}
                <h1 className="fw-bold mb-3 text-dark">
                    เครื่องมือคำนวณคาร์บอนฟุตพริ้นท์
                </h1>
                
                {/* ข้อความอธิบายสถานะการพัฒนาที่เป็นทางการ */}
                <p className="lead text-muted mb-4">
                    ขณะนี้ หน้านี้อยู่ระหว่างการพัฒนาและจัดทำขึ้นเพื่อนำเสนอในโอกาสต่อไป 
                    ท่านสามารถติดตามความคืบหน้าของเครื่องมือนี้ได้ในอนาคตอันใกล้
                </p>
                <BackToHomeButton />
            </div>
        </div>
    );
};

export default CarbonFootprintCalculatorPlaceholderCollector;
