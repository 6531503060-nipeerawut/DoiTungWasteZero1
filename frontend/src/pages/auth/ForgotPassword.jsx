import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import axios from "axios";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setMessage("");
    }, [step]);

    const requestOtp = async () => {
        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/request-otp`, { email });
            setMessage("OTP ถูกส่งไปที่อีเมลของคุณแล้ว");
            setStep(2);
        } catch (err) {
            setMessage(err.response?.data?.message || "เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/verify-otp`, { email, otp });
            setMessage("OTP ถูกต้อง โปรดตั้งรหัสผ่านใหม่");
            setStep(3);
        } catch (err) {
            setMessage(err.response?.data?.message || "OTP ไม่ถูกต้อง");
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async () => {
        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/reset-password`, { email, newPassword });
            setMessage("รีเซ็ตรหัสผ่านสำเร็จ 🎉");
            setStep(1);
            setEmail("");
            setOtp("");
            setNewPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (err) {
            setMessage(err.response?.data?.message || "เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">ลืมรหัสผ่าน</h2>
            {message && <p className="text-sm text-blue-600 mb-2">{message}</p>}

            {step === 1 && (
                <>
                    <input
                        type="email"
                        placeholder="อีเมล"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border mb-2"
                    />
                    <button
                        onClick={requestOtp}
                        disabled={loading}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        {loading ? "กำลังส่ง..." : "ขอ OTP"}
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <input
                        type="text"
                        placeholder="OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full p-2 border mb-2"
                    />
                    <button
                        onClick={verifyOtp}
                        disabled={loading}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {loading ? "กำลังตรวจสอบ..." : "ยืนยัน OTP"}
                    </button>
                </>
            )}

            {step === 3 && (
                <>
                    <div className="relative w-full mb-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="รหัสผ่านใหม่"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border pr-10 rounded"
                        />
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
                        </button>
                    </div>

                    <button
                        onClick={resetPassword}
                        disabled={loading}
                        className="bg-purple-600 text-white px-4 py-2 rounded w-full"
                    >
                        {loading ? "กำลังรีเซ็ต..." : "รีเซ็ตรหัสผ่าน"}
                    </button>
                </>
            )}
        </div>
    );
};

export default ForgotPassword;
