import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UnauthorizedMessage from '../../../components/UnauthorizedMessage';

axios.defaults.withCredentials = true;

function WasteCategoryVillager() {
    document.title = "DoiTung Zero-Waste";
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [villId, setVillId] = useState(null);

    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');

    const fetchCategories = async (searchQuery = '') => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v/categoryvillager`, { params: { search: searchQuery }, withCredentials: true });
            if (res.data.status?.toLowerCase() === "success") {
                setAuth(true);
                setVillId(res.data.vill_id);
                setCategories(res.data.results);
            } else {
                setAuth(false);
                setMessage(res.data.error || "Unauthorized access");
            }
        } catch (err) {
            console.log("Error fetching categories:", err);
            setMessage("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <h3>Loading...</h3>
            </div>
        );
    }

    const getCategoryInfo = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('ขยะเปื้อน')) {
            return { image: '/images/logo192.jpg', link: '/v/DirtyWasteVillager' };
        }
        if (lower.includes('วัสดุรีไซเคิล')) {
            return { image: '/images/recyclable.jpg', link: '/v/sellwastevillager' };
        }
        if (lower.includes('ขยะย่อยสลายได้')) {
            return { image: '/images/compostable.jpg', link: '/v/composablewastevillager' };
        }
        if (lower.includes('ขยะพลังงาน')) {
            return { image: '/images/energy.jpg', link: '/v/energyrdfwastevillager' };
        }
        if (lower.includes('ขยะอันตราย')) {
            return { image: '/images/hazardous.jpeg', link: '/v/hazardouswastevillager' };
        }
        if (lower.includes('ขยะห้องน้ำ')) {
            return { image: '/images/bathroom.jpg', link: '/v/bathroomwastevillager' };
        }
        if (lower.includes('ขยะชิ้นใหญ่')) {
            return { image: '/images/big.jpg', link: '/v/bigwastevillager' };
        }
        return { image: '/images/default.jpg', link: '#' };
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        fetchCategories(search);
    };

    return (
        <div className='d-flex flex-column min-vh-100'>
            {auth ? (
                <>
                    {/* Header */}
                    <Header type="menu" villId={villId} />

                    {/* Body */}
                    <div className="p-6 max-w-6xl mx-auto">
                        <h1 className="text-2xl font-bold mb-4">ประเภทขยะ</h1>

                        <form onSubmit={handleSearch} className="mb-6 flex gap-3">
                            <input
                            type="text"
                            placeholder="ค้นหา..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-4 py-2 rounded w-full"
                            />
                            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
                            ค้นหา
                            </button>
                        </form>

                        {loading ? (
                            <p>กำลังโหลด...</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {categories.map((cat) => {
                                const { image, link } = getCategoryInfo(cat.name);
                                return (
                                <div key={cat.id} className="border rounded-xl shadow hover:shadow-lg transition p-4">
                                    <h2 className="text-xl font-semibold mb-1">{cat.name}</h2>
                                    <Link to={link}>
                                    <img
                                        src={image}
                                        alt={cat.name}
                                        className="w-full h-48 object-cover rounded-md mb-3 cursor-pointer"
                                    />
                                    </Link>
                                    <p className="text-gray-600">{cat.description}</p>
                                </div>
                                );
                            })}
                            </div>
                        )}
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

export default WasteCategoryVillager;