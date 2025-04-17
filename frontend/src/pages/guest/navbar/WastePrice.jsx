import React, { useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function WastePrice() {
    document.title = "DoiTung Zero-Waste";

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/waste-price`)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Header */}
            <Header type="menu" />

            {/* Body */}
            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-start">
                <h1 className="mb-3" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>ราคารับซื้อ</h1>
                <p>ดูข้อมูลได้ที่นี่ <a href="https://wongpanit.com/" target="_blank" rel="noopener noreferrer">https://wongpanit.com/</a></p>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default WastePrice;
