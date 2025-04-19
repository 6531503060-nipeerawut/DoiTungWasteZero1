import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UnauthorizedMessage from '../../../components/UnauthorizedMessage';

axios.defaults.withCredentials = true;

function WastePriceCollector() {
    document.title = "DoiTung Zero-Waste";
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [collId, setcollId] = useState(null);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/wastepricecollector`, { withCredentials: true });

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

    return (
        <div className='container-fluid d-flex flex-column min-vh-100'>
            {auth ? (
                <>
                    {/* Header */}
                    <Header type="menu" collId={collId} />

                    {/* Body */}
                    <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-start">
                        <h1 className="mb-3" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>ราคารับซื้อ</h1>
                        <p>ดูข้อมูลได้ที่นี่ <a href="https://wongpanit.com/" target="_blank" rel="noopener noreferrer">https://wongpanit.com/</a></p>
                    </div>
        
                    {/* Footer */}
                    <Footer />
                </>
            ) : (
                <UnauthorizedMessage message={message} />
            )}
        </div>
    );
}

export default WastePriceCollector;