import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Footer from "./components/Footer";
import Header from "./components/Header";
import UnauthorizedMessage from "../../components/UnauthorizedMessage";

axios.defaults.withCredentials = true;

function AddingWasteCollector() {
  document.title = "DoiTung Zero-Waste";
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [collId, setCollId] = useState(null);

  const formatThaiDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear(); // + 543 ถ้าอยากใช้ พ.ศ.
    return `${day}/${month}/${year}`;
  };

  const today = new Date();
  today.setHours(today.getHours() + 7);

  const [displayDate, setDisplayDate] = useState(formatThaiDate(today));

  const formatDateForMySQL = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    caw_date: formatDateForMySQL(today),
    caw_wasteType: "",
    caw_subWasteType: "",
    caw_wasteTotal: "",
    caw_description: "",
    caw_location: "",
  });

  const [locations, setLocations] = useState([]);
  const [isVillage, setIsVillage] = useState(true);
  const [error, setError] = useState("");

  // Excel upload popup state
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [excelFile, setExcelFile] = useState(null);

  useEffect(() => {
    const t = new Date();
    t.setHours(t.getHours() + 7);
    setFormData((prev) => ({
      ...prev,
      caw_date: formatDateForMySQL(t),
    }));
    setDisplayDate(formatThaiDate(t));
  }, [isVillage]);

  const fetchLocations = useCallback(async () => {
    const formattedDate = formatDateForMySQL(new Date());
    setFormData((prevData) => ({ ...prevData, caw_date: formattedDate }));
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/c/locations?village=${isVillage}`,
        { withCredentials: true }
      );
      if (response.data.status === "success") {
        setLocations(response.data.rows);
        setCollId(response.data.coll_id);
        setAuth(true);
      } else {
        setAuth(false);
        setMessage(response.data.error || "Unauthorized access");
      }
    } catch (err) {
      console.error("Error fetching locations:", err);
      setError("Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  }, [isVillage]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "caw_wasteType") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        caw_subWasteType: value === "5" ? prevData.caw_subWasteType : "",
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const dataToSend = {
      ...formData,
      caw_subWasteType:
        formData.caw_wasteType === "5" ? formData.caw_subWasteType : null,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/c/addingwastecollector`,
        dataToSend,
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        alert("Data added successfully from collector");
        navigate("/c/dashboard");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.response?.data?.error || "Failed to add waste data");
    }
  };

  // อัปโหลด Excel: แทนที่ข้อมูลทุกเดือนที่อยู่ในไฟล์นี้เลย
  const uploadExcel = async () => {
    try {
      if (!excelFile) {
        alert("กรุณาเลือกไฟล์ Excel");
        return;
      }

      const form = new FormData();
      form.append("file", excelFile);

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/c/upload-excel`,
        form,
        { withCredentials: true }
      );

      alert("อัปโหลดไฟล์ Excel สำเร็จ");
      setShowUploadPopup(false);
      setExcelFile(null);
      navigate("/c/dashboard");
    } catch (err) {
      console.error("Upload error:", err);
      alert(
        err.response?.data?.error ||
          "อัปโหลดไม่สำเร็จ กรุณาตรวจสอบไฟล์อีกครั้ง"
      );
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <h3>Loading...</h3>
      </div>
    );
  }

  const resetForm = () => {
    setFormData({
      caw_date: formatDateForMySQL(today),
      caw_wasteType: "",
      caw_subWasteType: "",
      caw_wasteTotal: "",
      caw_description: "",
      caw_location: "",
    });
    setError("");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {auth ? (
        <>
          {/* Header */}
          <Header collId={collId} />

          {/* Body */}
          <div className="container mt-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="text-center fw-bold mb-4">
                  เพิ่มรายการน้ำหนักขยะ
                </h2>

                {/* ปุ่มบวกสำหรับอัปโหลด Excel */}
                <div className="d-flex justify-content-end mb-3">
                  <button
                    type="button"
                    className="btn btn-success rounded-circle"
                    style={{
                      width: "50px",
                      height: "50px",
                      fontSize: "28px",
                      padding: 0,
                    }}
                    onClick={() => setShowUploadPopup(true)}
                    title="อัปโหลดไฟล์ Excel (แทนที่ข้อมูลทั้งเดือน)"
                  >
                    +
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  {/* วันที่ทิ้งขยะ */}
                  <div className="mb-3">
                    <label className="form-label">วันที่ทิ้งขยะ*</label>
                    <input
                      type="text"
                      name="vaw_date"
                      value={displayDate}
                      readOnly
                      required
                      className="form-control"
                    />
                  </div>

                  {/* สถานที่ */}
                  <div className="mb-3">
                    <label className="form-label">สถานที่</label>
                    <select
                      onChange={(e) =>
                        setIsVillage(e.target.value === "village")
                      }
                      className="form-select mb-2"
                    >
                      <option value="village">หมู่บ้าน</option>
                      <option value="agency">หน่วยงาน</option>
                    </select>

                    <select
                      name="caw_location"
                      value={formData.caw_location}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="" disabled>
                        เลือกสถานที่
                      </option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ประเภทขยะ */}
                  <div className="mb-3">
                    <label className="form-label">ประเภทขยะ*</label>
                    <select
                      name="caw_wasteType"
                      value={formData.caw_wasteType}
                      onChange={handleChange}
                      required
                      className="form-select"
                    >
                      <option value="" disabled>
                        เลือกประเภทขยะ
                      </option>
                      <option value="1">01 ขยะเปื้อน</option>
                      <option value="2">02 ขยะห้องน้ำ</option>
                      <option value="3">03 ขยะพลังงาน</option>
                      <option value="4">04 ขยะอันตราย</option>
                      <option value="5">05 วัสดุรีไซเคิล</option>
                      <option value="6">06 ขยะย่อยสลาย</option>
                      <option value="7">07 ขยะชิ้นใหญ่</option>
                    </select>
                  </div>

                  {/* ประเภทขยะ (ย่อย) */}
                  {formData.caw_wasteType === "5" && (
                    <div className="mb-3">
                      <label className="form-label">ประเภทขยะ (ย่อย)*</label>
                      <select
                        name="caw_subWasteType"
                        value={formData.caw_subWasteType}
                        onChange={handleChange}
                        required
                        className="form-select"
                      >
                        <option value="" disabled>
                          เลือกประเภทขยะย่อย
                        </option>
                        <option value="1">01 ขวดแก้ว</option>
                        <option value="2">02 ขวดพลาสติกใส</option>
                        <option value="3">
                          03 เหล็ก/โลหะ/สังกะสี/กระป๋องอลูมิเนียม
                        </option>
                        <option value="4">04 กระดาษ</option>
                      </select>
                    </div>
                  )}

                  {/* น้ำหนักขยะ */}
                  <div className="mb-3">
                    <label className="form-label">น้ำหนักขยะ (กก.)*</label>
                    <input
                      type="number"
                      name="caw_wasteTotal"
                      value={formData.caw_wasteTotal}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*(\.\d{0,2})?$/.test(value)) {
                          handleChange(e);
                        }
                      }}
                      required
                      className="form-control"
                      step="0.01"
                    />
                  </div>

                  {/* รายละเอียดอื่น ๆ */}
                  <div className="mb-3">
                    <label className="form-label">รายละเอียดอื่น ๆ</label>
                    <textarea
                      name="caw_description"
                      value={formData.caw_description}
                      onChange={handleChange}
                      className="form-control"
                      rows="3"
                    ></textarea>
                  </div>

                  {/* ปุ่มกด */}
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={resetForm}
                    >
                      ยกเลิก
                    </button>
                    <button type="submit" className="btn btn-primary">
                      ยืนยัน
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Popup อัปโหลดไฟล์ Excel */}
          {showUploadPopup && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
              style={{ background: "rgba(0,0,0,0.5)", zIndex: 9999 }}
            >
              <div className="bg-white p-4 rounded shadow" style={{ width: 360 }}>
                <h5 className="fw-bold mb-3">อัปโหลดไฟล์ Excel</h5>
                <p className="mb-2">
                  ระบบจะอ่านทุกแผ่น (sheet) ในไฟล์ และแทนที่ข้อมูลของแต่ละเดือนทั้งหมด
                </p>

                <div className="mb-3">
                  <label className="form-label">เลือกไฟล์ Excel</label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".xlsx,.xls"
                    onChange={(e) => setExcelFile(e.target.files[0])}
                  />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowUploadPopup(false);
                      setExcelFile(null);
                    }}
                  >
                    ยกเลิก
                  </button>
                  <button className="btn btn-success" onClick={uploadExcel}>
                    อัปโหลด
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <Footer />
        </>
      ) : (
        <UnauthorizedMessage message={message} />
      )}
    </div>
  );
}

export default AddingWasteCollector;
