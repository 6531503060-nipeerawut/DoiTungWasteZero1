// HomeVillager.jsx
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import React, { useCallback, useEffect, useState } from 'react';

// Import Components
import MapView from '../../components/MapView';
import WasteChart from '../../components/WasteChart';
import { formatDateForAPI } from '../../utils/formatDate';
import Footer from './components/Footer';
import Header from './components/Header';
import CustomThaiDatePicker from './components/CustomThaiDatePicker';
import UnauthorizedMessage from '../../components/UnauthorizedMessage';

// MUI Components
import { 
    Container, Grid, Paper, Typography, Box, FormControl, InputLabel, 
    Select, MenuItem, Divider, CircularProgress, LinearProgress, Grow 
} from '@mui/material';

// MUI Icons
import { 
    Map as MapIcon, 
    BarChart as BarChartIcon, 
    FilterList as FilterIcon,
    PieChart as PieChartIcon, 
    LocationOn as LocationIcon 
} from '@mui/icons-material';

// --- Setup Dayjs Plugins ---
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(buddhistEra);
const TH_TIMEZONE = "Asia/Bangkok";

// --- Theme Constants ---
const themeColors = {
    primary: '#2E5D4B',    // เขียวแม่ฟ้าหลวง
    secondary: '#8D6E63',  // น้ำตาลดิน
    accent: '#D4AF37',     // ทอง
    bg: '#F7F9F6',         // พื้นหลังขาวอมเขียวอ่อน
    textHeader: '#1A3C34'  // เขียวเข้มหัวข้อ
};

function HomeVillager() {
    document.title = "ชุมชนและหน่วยงาน - DoiTung Zero-Waste";

    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [villId, setVillId] = useState(null);

    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [wasteData, setWasteData] = useState([]);
    const [mode, setMode] = useState('day');
    const [type, setType] = useState('village');
    const [date, setDate] = useState(dayjs().tz(TH_TIMEZONE).format('YYYY-MM-DD'));

    // ✅ ฟังก์ชันหาชื่อสถานที่ที่ถูกเลือก
    const getSelectedLocationName = () => {
        if (!selectedLocation) return null;
        const loc = locations.find(l => l.id === selectedLocation || l.location_id === selectedLocation);
        return loc ? (loc.name || loc.location_name) : null;
    };

    const selectedLocationName = getSelectedLocationName(); 

    // --- Logic Fetch Data ---
    const fetchWaste = useCallback(async (locationId) => {
        setSelectedLocation(locationId);
        const query = new URLSearchParams({
            dataSet: type,
            locationId: locationId,
            mode: mode,
            date: formatDateForAPI(date, mode)
        });

        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v/homevillager?${query.toString()}`);
            if (res.data.status?.toLowerCase() === "success") {
                setAuth(true);
                setVillId(res.data.vill_id);
                setWasteData(res.data.results);
            } else {
                setAuth(false);
                setMessage(res.data.error || "Unauthorized access");
            }
        } catch (err) {
            console.error("Error fetching waste data:", err);
            setMessage("Error connecting to server");
        } finally {
            setLoading(false);
        }
    }, [type, date, mode]);

    useEffect(() => {
        const fetchLocations = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v/home-locations?type=${type}`);
                if (res.data.status?.toLowerCase() === "success") {
                    setAuth(true);
                    setVillId(res.data.vill_id);
                    setLocations(res.data.results);

                    // ✅ แก้ไข: ไม่เลือกสถานที่แรกอัตโนมัติ (Reset ค่าเมื่อโหลดใหม่หรือเปลี่ยนประเภท)
                    setSelectedLocation(null);
                    setWasteData([]); 
                    
                } else {
                    setAuth(false);
                    setMessage(res.data.error || "Unauthorized access");
                }
            } catch (err) {
                console.error("Error fetching locations:", err);
                setMessage("Error connecting to server");
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, [type]);

    useEffect(() => {
        if (selectedLocation) {
            fetchWaste(selectedLocation);
        }
    }, [fetchWaste, selectedLocation]);

    const totalWeight = wasteData.reduce((acc, curr) => acc + parseFloat(curr.total), 0);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor={themeColors.bg}>
                <CircularProgress sx={{ color: themeColors.primary }} size={60} thickness={4} />
            </Box>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: themeColors.bg, fontFamily: 'Sarabun, sans-serif' }}>
            {auth ? (
                <>
                    <Header villId={villId} />

                    <Container maxWidth="xl" sx={{ mt: 3, mb: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                
                        {/* Title Section */}
                        <Box mb={2} sx={{ borderLeft: `5px solid ${themeColors.accent}`, pl: 2 }}>
                            <Typography variant="h5" fontWeight="bold" color={themeColors.textHeader}>
                                ภาพรวมการจัดการขยะ
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                ระบบบริหารจัดการขยะแบบบูรณาการ โครงการพัฒนาดอยตุง
                            </Typography>
                        </Box>

                        {/* Filter Section */}
                        <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 2, border: '1px solid #E0E0E0', backgroundColor: '#fff' }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <FilterIcon sx={{ color: themeColors.secondary, mr: 1 }} />
                                <Typography variant="subtitle1" fontWeight="bold" color={themeColors.textHeader}>
                                    ตัวกรองข้อมูล
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>ประเภทพื้นที่</InputLabel>
                                        <Select value={type} label="ประเภทพื้นที่" onChange={e => setType(e.target.value)}>
                                            <MenuItem value="village">🏡 หมู่บ้าน</MenuItem>
                                            <MenuItem value="agency">🏢 หน่วยงาน</MenuItem>
                                            <MenuItem value="all">🌐 ทั้งหมด</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>ช่วงเวลา</InputLabel>
                                        <Select value={mode} label="ช่วงเวลา" onChange={e => setMode(e.target.value)}>
                                            <MenuItem value="day">📅 รายวัน</MenuItem>
                                            <MenuItem value="month">🗓 รายเดือน</MenuItem>
                                            <MenuItem value="year">📆 รายปี</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <CustomThaiDatePicker
                                        date={date}
                                        setDate={setDate}
                                        mode={mode}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Main Dashboard Content */}
                        <Box sx={{ flexGrow: 1, height: { lg: 'calc(100vh - 360px)', xs: 'auto' }, minHeight: { lg: '500px' } }}>
                            <Grid container spacing={2} sx={{ height: '100%' }}>
                                
                                {/* Left: Map */}
                                <Grid item xs={12} lg={7} sx={{ height: '100%' }}>
                                    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <Box display="flex" alignItems="center" mb={1} flexShrink={0}>
                                            <MapIcon sx={{ color: themeColors.primary, mr: 1 }} />
                                            <Typography variant="h6" fontWeight="bold" color={themeColors.textHeader}>พิกัดจุดเก็บขยะ</Typography>
                                        </Box>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box sx={{ flexGrow: 1, borderRadius: 2, overflow: 'hidden', border: '1px solid #eee', position: 'relative', minHeight: '300px' }}>
                                            <MapView locations={locations} onSelect={fetchWaste} />
                                        </Box>
                                    </Paper>
                                </Grid>

                                {/* Right: Stats & List */}
                                <Grid item xs={12} lg={5} sx={{ height: '100%' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
                                        
                                        {/* Chart Section */}
                                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                                            <Box display="flex" alignItems="center" mb={1} flexShrink={0}>
                                                <BarChartIcon sx={{ color: themeColors.primary, mr: 1 }} />
                                                <Typography variant="h6" fontWeight="bold" color={themeColors.textHeader}>
                                                    สถิติปริมาณขยะ
                                                </Typography>

                                                {/* ✅ แสดงชื่อสถานที่ (ถ้ามี) */}
                                                {selectedLocationName && (
                                                    <Grow in={true}>
                                                        <Box 
                                                            ml={2} 
                                                            px={1.5} py={0.2} 
                                                            borderRadius={1} 
                                                            bgcolor="#E8F5E9" 
                                                            color={themeColors.primary}
                                                            display="flex" 
                                                            alignItems="center"
                                                            border={`1px solid ${themeColors.primary}40`}
                                                        >
                                                            <LocationIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                            <Typography variant="body2" fontWeight="bold" noWrap>
                                                                {selectedLocationName}
                                                            </Typography>
                                                        </Box>
                                                    </Grow>
                                                )}
                                            </Box>
                                            <Divider sx={{ mb: 1 }} />
                                            
                                            <Grow in={true} timeout={800}>
                                                <Box sx={{ flexGrow: 1, position: 'relative', minHeight: 0 }}>
                                                    {wasteData.length > 0 ? (
                                                        <WasteChart 
                                                            data={wasteData} 
                                                            options={{ 
                                                                maintainAspectRatio: false, 
                                                                responsive: true,
                                                                animation: {
                                                                    duration: 1000,
                                                                    easing: 'easeOutQuart'
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <Box height="100%" display="flex" justifyContent="center" alignItems="center" color="text.secondary">
                                                            ไม่มีข้อมูล
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Grow>
                                        </Paper>

                                        {/* List Section */}
                                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} flexShrink={0}>
                                                <Box display="flex" alignItems="center">
                                                    <PieChartIcon sx={{ color: themeColors.accent, mr: 1 }} />
                                                    <Typography variant="h6" fontWeight="bold" color={themeColors.textHeader}>รายละเอียด</Typography>
                                                </Box>
                                                {wasteData.length > 0 && (
                                                    <Typography variant="subtitle2" color={themeColors.primary} fontWeight="bold">
                                                        รวม: {totalWeight.toLocaleString()} กก.
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Divider sx={{ mb: 1 }} />
                                            
                                            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                                                {wasteData.length > 0 ? (
                                                    wasteData.map((item, index) => {
                                                        const val = parseFloat(item.total);
                                                        const percent = totalWeight > 0 ? (val / totalWeight) * 100 : 0;
                                                        return (
                                                            <Grow 
                                                                in={true} 
                                                                key={index}
                                                                style={{ transformOrigin: '0 0 0' }}
                                                                {...(true ? { timeout: 500 + (index * 150) } : {})}
                                                            >
                                                                <Box mb={1.5}>
                                                                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                                        <Typography variant="body2" fontWeight="500">{item.wasteType_name}</Typography>
                                                                        <Typography variant="body2" fontWeight="bold" color={themeColors.primary}>
                                                                            {val.toLocaleString()} กก.
                                                                        </Typography>
                                                                    </Box>
                                                                    <Box display="flex" alignItems="center" gap={1}>
                                                                        <LinearProgress 
                                                                            variant="determinate" 
                                                                            value={percent} 
                                                                            sx={{ 
                                                                                flexGrow: 1, 
                                                                                height: 6, 
                                                                                borderRadius: 5,
                                                                                bgcolor: '#E0E0E0',
                                                                                '& .MuiLinearProgress-bar': { 
                                                                                    bgcolor: themeColors.primary,
                                                                                    transition: 'transform 1s ease-in-out'
                                                                                }
                                                                            }} 
                                                                        />
                                                                        <Typography variant="caption" sx={{ minWidth: 35, textAlign: 'right' }}>
                                                                            {percent.toFixed(0)}%
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grow>
                                                        );
                                                    })
                                                ) : (
                                                    <Box height="100%" display="flex" justifyContent="center" alignItems="center">
                                                        <Typography align="center" color="text.secondary">- ไม่มีรายการ -</Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Paper>

                                    </Box>
                                </Grid>

                            </Grid>
                        </Box>
                    </Container>
                    
                    <Footer />
                </>
            ) : (
                <UnauthorizedMessage message={message} />
            )}
        </div>
    );
}

export default HomeVillager;