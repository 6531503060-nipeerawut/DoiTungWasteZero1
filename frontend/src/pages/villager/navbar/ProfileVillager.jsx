import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UnauthorizedMessage from '../../../components/UnauthorizedMessage';

axios.defaults.withCredentials = true;

const ProfileVillager = () => {
    document.title = "DoiTung Zero-Waste";
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [villId, setVillId] = useState(null);

    const [profile, setProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        descriptionRole: '',
        phone: '',
        profileImage: null
    });

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v/profile-villager/${villId}`, { withCredentials: true })
                if (res.data.status?.toLowerCase() === "success"){
                    setAuth(true);
                    console.log("Profile Data:", res.data.data);
                    setProfile(res.data.data);
                    setVillId(res.data.vill_id);
                    setFormData({
                        fullName: res.data.data.vill_fullName,
                        descriptionRole: res.data.data.vill_descriptionRole,
                        phone: res.data.data.phone,
                        profileImage: null,
                        role: res.data.data.role_name
                    });
                } else {
                    setAuth(false);
                    setMessage(res.data.error || "Unauthorized access");
                }
            } catch (err) {
                console.error("Axios Error:", err.response ? err.response.data : err.message);
                setMessage("Error connecting to server");
            } finally {
                setLoading(false);
            }
        };
        fetchAuthStatus();
    }, [villId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            profileImage: e.target.files[0]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedData = new FormData();

        updatedData.append('fullName', formData.fullName);
        updatedData.append('descriptionRole', formData.descriptionRole);
        updatedData.append('phone', formData.phone);

        const roleMap = {
            'เจ้าหน้าที่เก็บขยะ': 1,
            'ตัวแทนหน่วยงานราชการ': 2,
            'ตัวแทนหมู่บ้าน': 3
        };
        const roleId = roleMap[profile.role_name] || null;
        updatedData.append('role', roleId);

        if (formData.profileImage) {
            updatedData.append('profileImage', formData.profileImage);
        }

        axios.put(`${process.env.REACT_APP_BACKEND_URL}/v/update-profile-villager/${villId}`, updatedData, { withCredentials: true })
        .then(res => {
            console.log('Profile updated successfully');
            setShowModal(false);
            setProfile({
                ...profile,
                vill_fullName: formData.fullName,
                vill_descriptionRole: formData.descriptionRole,
                phone: formData.phone,
                vill_profileImage: formData.profileImage ? formData.profileImage.name : profile.vill_profileImage
            });
        })
        .catch(err => {
            console.error('Error updating profile:', err.response ? err.response.data : err.message);
        });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <h3>Loading...</h3>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
        {auth ? (
            <>
                <Header type="menu" villId={villId} />

                {/* Centered Content */}
                <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                    <div className="card shadow-sm border-0 p-4 bg-white rounded" style={{ maxWidth: '600px', width: '100%' }}>
                        <h1 className="text-center fw-bold mb-4">บัญชีผู้ใช้</h1>
                        <div className="text-center mb-4">
                            <img
                                src={`${process.env.REACT_APP_BACKEND_URL}/images/` + profile.vill_profileImage}
                                alt="Profile"
                                className="img-fluid mb-3 mx-auto d-block"
                                style={{
                                  width: '150px',
                                  height: '150px',
                                  objectFit: 'cover',
                                  borderRadius: '50%',
                                  border: '2px solid #ccc'
                                }}
                              />

                            <p><strong>ชื่อ - นามสกุล:</strong> {profile.vill_fullName}</p>
                            <p><strong>สถานะบัญชีผู้ใช้:</strong> {profile.role_name}</p>
                            <p><strong>ชื่อหมู่บ้าน/ชื่อหน่วยงาน:</strong> {profile.vill_descriptionRole}</p>
                            <p><strong>เบอร์โทรศัพท์:</strong> {`0${profile.phone}`}</p>
                            <button onClick={() => setShowModal(true)} className="btn btn-primary">แก้ไขข้อมูล</button>
                        </div>
                    </div>
                </div>

                        {/* Modal for editing profile */}
                        {showModal && (
                            <div className="modal show" style={{ display: 'block' }} onClick={() => setShowModal(false)}>
                                <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">แก้ไขข้อมูล</h5>
                                            <button type="button" className="close" onClick={() => setShowModal(false)}>&times;</button>
                                        </div>
                                        <div className="modal-body">
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-group">
                                                <div className="form-group">
                                                    <label>รูปโปรไฟล์</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        onChange={handleFileChange}
                                                    />
                                                </div>
                                                    <label>ชื่อ - นามสกุล</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                        placeholder="Enter full name"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>สถานะบัญชีผู้ใช้</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.role}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>ชื่อหมู่บ้าน/ชื่อหน่วยงาน</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="descriptionRole"
                                                        value={formData.descriptionRole}
                                                        onChange={handleChange}
                                                        placeholder="Enter description"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Phone</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="phone"
                                                        value={`0${String(formData.phone).replace(/^0/, '')}`}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                phone: e.target.value.replace(/^0/, '')
                                                            })
                                                        }
                                                        placeholder="Enter phone number"
                                                    />
                                                </div>
                                                <button type="submit" className="btn btn-success">Save Changes</button>
                                            </form>
                                            </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <Footer />
                </>
            ) : (
                <UnauthorizedMessage message={message} />
            )}
        </div>
    );
};

export default ProfileVillager;