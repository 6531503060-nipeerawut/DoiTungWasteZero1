// src/components/BackToHomeButton.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * @component BackToHomeButton
 * @description ปุ่มกลับหน้าหลักสำหรับ Guest / Villager / Collector
 */
const BackToHomeButton = ({ label = "กลับสู่หน้าหลัก" }) => {
    const location = useLocation();

    // ตรวจสอบ URL ปัจจุบัน
    let homePath = '/'; // Default Guest
    if (location.pathname.startsWith('/c')) {
        homePath = '/c/homecollector';
    } else if (location.pathname.startsWith('/v')) {
        homePath = '/v/homevillager';
    }

    return (
        <Link to={homePath} className="btn btn-primary btn-lg rounded-pill px-4">
            <i className="bi bi-house-door-fill me-2"></i> {label}
        </Link>
    );
};

export default BackToHomeButton;
