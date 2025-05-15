import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import WasteTypeChart from "./components/WasteTypeChart";
import WeightByDateChart from "./components/WeightByDateChart";
import UnauthorizedMessage from "../../components/UnauthorizedMessage";

axios.defaults.withCredentials = true;

function HomeDashboardAdmin() {
  document.title = "DoiTung Zero-Waste";

  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [adminId, setAdminId] = useState(null);

  const [filterType, setFilterType] = useState("all");
  const [locations, setLocations] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // ✅ Resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Fetch location data
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        let url = `${process.env.REACT_APP_BACKEND_URL}/admin/all-waste-records`;
        if (filterType !== "all") {
          url += `?type=${filterType}`;
        }

        const res = await axios.get(url);
        if (res.data.status?.toLowerCase() === "success") {
          setAuth(true);
          setAdminId(res.data.admin_id);
          setLocations(res.data.results);
          setSelectedVillage(
            res.data.results.length > 0 ? res.data.results[0] : null
          );
        } else {
          setAuth(false);
          setMessage(res.data.error || "Unauthorized access");
        }
      } catch (err) {
        console.log("Error fetching locations:", err);
        setMessage("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [filterType]);

  // ✅ Close sidebar when clicking outside (on mobile only)
  useEffect(() => {
    const handleClickOutside = (e) => {
      const toggleBtn = document.querySelector("#hamburger-toggle");
      const clickedSidebar = sidebarRef.current?.contains(e.target);
      const clickedToggle = toggleBtn?.contains(e.target);

      if (!clickedSidebar && !clickedToggle && isMobile) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobile]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {auth ? (
        <>
          <div className="flex flex-col h-screen">
            <Header
              adminId={adminId}
              toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className="flex flex-1 relative">
              {/* ✅ Sidebar */}
              <div
                ref={sidebarRef}
                className={`
    fixed z-40 inset-y-0 left-0 w-64 bg-white border-r shadow-lg
    transform transition-transform duration-300 ease-in-out
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:relative md:z-0 md:shadow-none md:border-r md:translate-x-0
    ${!sidebarOpen && "md:w-0 md:overflow-hidden"}
  `}
              >
                <Sidebar />
              </div>

              <main className="flex-1 p-4 overflow-auto">
                {/* ✅ ปุ่มย่อ/ขยาย sidebar เฉพาะบน desktop */}
                <div className="hidden md:flex justify-start mb-4">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition"
                  >
                    {sidebarOpen ? "ซ่อนเมนู" : "แสดงเมนู"}
                  </button>
                </div>
                <h1 className="text-2xl font-semibold mb-4">
                  แดชบอร์ดภาพรวมของขยะ
                </h1>

                {/* ✅ Filter Type */}
                <div className="mb-3">
                  <label className="form-label">เลือกประเภทพื้นที่:</label>
                  <select
                    className="form-select"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">ตำบลแม่ฟ้าหลวงทั้งหมด</option>
                    <option value="village">หมู่บ้าน</option>
                    <option value="agency">หน่วยงาน</option>
                  </select>
                </div>

                {/* ✅ พื้นที่ย่อย */}
                {filterType !== "all" && (
                  <div className="mb-4">
                    <label className="form-label">เลือกพื้นที่:</label>
                    <select
                      className="form-select"
                      value={selectedVillage?.location_ids || ""}
                      onChange={(e) => {
                        const selected = locations.find(
                          (l) => l.location_ids === e.target.value
                        );
                        setSelectedVillage(selected);
                      }}
                    >
                      {locations.map((loc, index) => (
                        <option key={index} value={loc.location_ids}>
                          {loc.village_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* ✅ กราฟรวมประเภทขยะ */}
                <WasteTypeChart
                  locationIds={
                    filterType === "all"
                      ? locations.map((loc) => loc.location_ids).join(",")
                      : selectedVillage?.location_ids
                  }
                />

                {/* ✅ กราฟตามวันที่ */}
                {(filterType === "all" || selectedVillage) && (
                  <WeightByDateChart
                    locationId={
                      filterType === "all"
                        ? locations.map((loc) => loc.location_ids).join(",")
                        : selectedVillage?.location_ids
                    }
                  />
                )}
              </main>
            </div>
            <Footer />
          </div>
        </>
      ) : (
        <UnauthorizedMessage message={message} />
      )}
    </div>
  );
}

export default HomeDashboardAdmin;
