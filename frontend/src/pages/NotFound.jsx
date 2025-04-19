import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center">
            <h1 className="display-1">404</h1>
            <h3 className="mb-3">ขออภัย ไม่พบหน้าที่คุณต้องการ</h3>
            <Link to="/" className="btn btn-primary">กลับหน้าหลัก</Link>
        </div>
    );
};

export default NotFound;