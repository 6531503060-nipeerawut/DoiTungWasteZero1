import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

// นำเข้า MUI Components 
import { 
    Box, 
    Typography, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    CircularProgress, 
    Alert,
    Grid
} from '@mui/material';
import { 
    Dashboard as DashboardIcon,
    
} from '@mui/icons-material';

// **ปรับ Path ของ Components ให้ถูกต้องตามโครงสร้างโปรเจกต์ของคุณ**
import Footer from "./components/Footer";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import WasteTypeChart from "./components/WasteTypeChart";
import WeightByDateChart from "./components/WeightByDateChart";
import UnauthorizedMessage from "../../components/UnauthorizedMessage";

axios.defaults.withCredentials = true;

function HomeDashboardAdmin() {
    document.title = "ภาพรวมผู้ดูแลระบบ - DoiTung Zero-Waste";

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
                    setMessage(res.data.error || "ไม่ได้รับอนุญาตให้เข้าถึงข้อมูลนี้");
                }
            } catch (err) {
                console.error("Error fetching locations:", err);
                setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, [filterType]);

    // ✅ Close sidebar when clicking outside (on mobile only)
    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedSidebar = sidebarRef.current?.contains(e.target);
            
            if (isMobile && !clickedSidebar && sidebarOpen) {
                // สำหรับมือถือ หากคลิกภายนอก sidebar ให้ปิด sidebar
                // (ในโค้ดนี้ปล่อยให้ handleSidebarToggle ใน Header จัดการ)
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isMobile, sidebarOpen]); 

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };


    if (loading) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="100vh" 
                flexDirection="column"
            >
                <CircularProgress color="primary" sx={{ mb: 2 }}/>
                <Typography variant="h6">กำลังโหลดข้อมูลแดชบอร์ด...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F4F6F8' }}>
            {auth ? (
                <>
                    <Header adminId={adminId} toggleSidebar={handleSidebarToggle} />
                    
                    <Box sx={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
                        
                        {/* ✅ Sidebar Component */}
                        <Box
                            ref={sidebarRef}
                            sx={{
                                // Responsive Sidebar
                                width: sidebarOpen ? '250px' : '0',
                                minWidth: sidebarOpen ? '250px' : '0',
                                overflowX: 'hidden',
                                transition: 'width 0.3s',
                                borderRight: '1px solid #E0E0E0',
                                backgroundColor: '#FFFFFF',
                                position: isMobile ? 'fixed' : 'relative',
                                zIndex: isMobile ? 1000 : 1,
                                height: isMobile ? 'calc(100vh - 64px)' : 'auto', // 64px คือ Header Height
                                top: isMobile ? '64px' : 'auto',
                                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                                '&.MuiBox-root': {
                                    // บน desktop ให้แสดงอยู่เสมอ (หากไม่ได้มีการปรับ width/minWidth ใน Box)
                                    // หากต้องการให้แสดงเสมอใน desktop โดยไม่มีการย่อ ให้ตั้งค่า width/minWidth เป็น '250px' 
                                    // และจัดการให้ isMobile เป็น false สำหรับ desktop
                                    transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
                                }
                            }}
                        >
                            <Sidebar />
                        </Box>


                        {/* ✅ Main Content Area */}
                        <Box component="main" sx={{ 
                            flexGrow: 1, 
                            p: 3, 
                            transition: 'margin-left 0.3s',
                            ml: 0, // ไม่มีการดันพื้นที่จากปุ่ม
                            width: '100%',
                        }}>
                            
                            {/* ❌ ส่วนของปุ่มย่อ/ขยาย sidebar เฉพาะบน desktop ถูกลบออกที่นี่ */}

                            <Typography 
                                variant="h4" 
                                component="h1" 
                                gutterBottom 
                                sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#0F766E', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    mb: 4 
                                }}
                            >
                                <DashboardIcon sx={{ mr: 1, fontSize: 36 }} /> แดชบอร์ดภาพรวมการจัดการขยะ
                            </Typography>

                            {/* --- Filter Section --- */}
                            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 4 }}>
                                {/* ✅ Filter Type */}
                                <FormControl sx={{ minWidth: 200 }}>
                                    <InputLabel>ประเภทพื้นที่</InputLabel>
                                    <Select
                                        value={filterType}
                                        label="ประเภทพื้นที่"
                                        onChange={(e) => setFilterType(e.target.value)}
                                    >
                                        <MenuItem value="all">ทั้งหมด (ตำบลแม่ฟ้าหลวง)</MenuItem>
                                        <MenuItem value="village">หมู่บ้าน</MenuItem>
                                        <MenuItem value="agency">หน่วยงาน</MenuItem>
                                    </Select>
                                </FormControl>

                                {/* ✅ พื้นที่ย่อย */}
                                {filterType !== "all" && locations.length > 0 && (
                                    <FormControl sx={{ minWidth: 250 }}>
                                        <InputLabel>เลือกพื้นที่</InputLabel>
                                        <Select
                                            value={selectedVillage?.location_ids || ""}
                                            label="เลือกพื้นที่"
                                            onChange={(e) => {
                                                const selected = locations.find(
                                                    (l) => l.location_ids === e.target.value
                                                );
                                                setSelectedVillage(selected);
                                            }}
                                        >
                                            {locations.map((loc, index) => (
                                                <MenuItem key={index} value={loc.location_ids}>
                                                    {loc.village_name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                                {filterType !== "all" && locations.length === 0 && (
                                    <Alert severity="warning">ไม่พบพื้นที่ย่อยในประเภทนี้</Alert>
                                )}
                            </Box>
                            
                            {/* --- Chart Section --- */}
                            {(filterType === "all" || selectedVillage) && (
                                <Grid container spacing={4}>
                                    {/* กราฟรวมประเภทขยะ (Pie Chart) */}
                                    <Grid item xs={12} lg={6}>
                                        <WasteTypeChart
                                            locationIds={
                                                filterType === "all"
                                                    ? locations.map((loc) => loc.location_ids).join(",")
                                                    : selectedVillage?.location_ids
                                            }
                                        />
                                    </Grid>

                                    {/* กราฟตามวันที่ (Line Chart) */}
                                    <Grid item xs={12} lg={6}>
                                        <WeightByDateChart
                                            locationId={
                                                filterType === "all"
                                                    ? locations.map((loc) => loc.location_ids).join(",")
                                                    : selectedVillage?.location_ids
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            )}

                        </Box>
                    </Box>
                    <Footer />
                </>
            ) : (
                <UnauthorizedMessage message={message} />
            )}
        </Box>
    );
}

export default HomeDashboardAdmin;