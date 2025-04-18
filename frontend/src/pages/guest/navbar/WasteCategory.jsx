import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function WasteCategory() {
    document.title = "DoiTung Zero-Waste";

    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');

    const fetchCategories = async (searchQuery = '') => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/category`, {
                params: { search: searchQuery },
                withCredentials: true
            });
            if (res.data.status?.toLowerCase() === "success") {
                setCategories(res.data.results);
            }
        } catch (err) {
            console.log("Error fetching categories:", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const getCategoryInfo = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('ขยะเปื้อน')) {
            return { image: '/images/logo192.png', link: '/dirtywaste' };
        }
        if (lower.includes('วัสดุรีไซเคิล')) {
            return { image: '/images/recyclable.jpg', link: '/sellwaste' };
        }
        if (lower.includes('ย่อยสลาย')) {
            return { image: '/images/compostable.jpg', link: '/composablewaste' };
        }
        if (lower.includes('พลังงาน')) {
            return { image: '/images/energy.jpg', link: '/energyrdfwaste' };
        }
        if (lower.includes('อันตราย')) {
            return { image: '/images/hazardous.jpg', link: '/hazardouswaste' };
        }
        if (lower.includes('ห้องน้ำ') || lower.includes('ปนเปื้อน')) {
            return { image: '/images/bathroom.jpg', link: '/bathroomwaste' };
        }
        if (lower.includes('ชิ้นใหญ่')) {
            return { image: '/images/big.jpg', link: '/bigwaste' };
        }

        // 👇 เพิ่มชนิดย่อยของขยะขายได้
        if (lower.includes('พลาสติก')) {
            return { image: '/images/plastic.jpg', link: '/sellwaste/plastic' };
        }
        if (lower.includes('กระดาษ')) {
            return { image: '/images/paper.jpg', link: '/sellwaste/paper' };
        }
        if (lower.includes('ขวดแก้ว')) {
            return { image: '/images/glass.jpg', link: '/sellwaste/glass' };
        }
        if (lower.includes('โลหะ')) {
            return { image: '/images/metal.jpg', link: '/sellwaste/metal' };
        }

        return { image: '/images/default.jpg', link: '#' };
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCategories(search);
    };

    return (
        <div className='container-fluid d-flex flex-column min-vh-100'>
            <>
                {/* Header */}
                <Header type="menu" />

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {categories.map((cat) => {
                            const { image, link } = getCategoryInfo(cat.name);
                            return (
                                <div key={cat.category_id} className="border rounded-xl shadow hover:shadow-lg transition p-4">
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
                </div>

                {/* Footer */}
                <Footer />
            </>
        </div>
    );
}

export default WasteCategory;
