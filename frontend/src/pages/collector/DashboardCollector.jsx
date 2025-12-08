import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';

import WasteChart from '../../components/WasteChart';
import Footer from './components/Footer';
import Header from './components/Header';
import UnauthorizedMessage from '../../components/UnauthorizedMessage';
import CustomThaiDatePicker from './components/CustomThaiDatePicker';

// MUI Components
import { 
    Container, Grid, Paper, Typography, Box, FormControl, InputLabel, 
    Select, MenuItem, Divider, LinearProgress, CircularProgress, Card, CardContent 
} from '@mui/material';
import { 
    BarChart as BarChartIcon, 
    PieChart as PieChartIcon,
    FilterList as FilterIcon,
    Dashboard as DashboardIcon 
} from '@mui/icons-material';

dayjs.extend(buddhistEra);

axios.defaults.withCredentials = true;

function DashboardCollector() {
    document.title = "Dashboard (เจ้าหน้าที่) - DoiTung Zero-Waste";
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [collId, setCollId] = useState(null);

    const [dataSet, setDataSet] = useState('all');
    const [locationId, setLocationId] = useState('');
    const [locations, setLocations] = useState([]);

    const [mode, setMode] = useState('day');
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

    const [wasteData, setWasteData] = useState([]);

    // --- Verification Logic ---
    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/verify`, {
                    withCredentials: true
                });
                if (res.data.status === "success") {
                    setAuth(true);
                    setCollId(res.data.coll_id);
                } else {
                    setAuth(false);
                    navigate('/login');
                }
            } catch (error) {
                console.error("User not verified", error);
                setAuth(false);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        verifyUser();
    }, [navigate]);

    // --- Fetch Locations ---
    useEffect(() => {
        const fetchData = async () => {
            if (dataSet === 'village' || dataSet === 'agency') {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/dashboard-locations`, {
                        params: { type: dataSet },
                        withCredentials: true
                    });
    
                    if (response.data.status === 'success') {
                        setLocations(response.data.results);
                        setCollId(response.data.coll_id);
                        setAuth(true);
                    } else {
                        setAuth(false);
                        setMessage(response.data.error || "Unauthorized access");
                    }
                } catch (error) {
                    setAuth(false);
                    setMessage("An error occurred while fetching the data.");
                    console.error(error);
                }
            } else {
                setLocations([]);
                setLocationId('');
            }
        };
        fetchData();
    }, [dataSet]);

    // --- Fetch Waste Data ---
    useEffect(() => {
        const fetchData = async () => {
            let formattedDate = date;
            if (mode === 'month') {
                const d = dayjs(date);
                formattedDate = `${d.format('MM')}-${d.format('YYYY')}`;
            } else if (mode === 'year') {
                formattedDate = dayjs(date).format('YYYY');
            }
    
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/dashboard`, {
                    params: {
                        dataSet,
                        locationId,
                        mode,
                        date: formattedDate,
                    },
                    withCredentials: true,
                });
    
                setWasteData(response.data.results);
            } catch (err) {
                console.error(err);
            }
        };
    
        fetchData();
    }, [dataSet, locationId, mode, date]);

    // Calculate Total
    const totalWeight = wasteData.reduce((sum, item) => sum + parseFloat(item.total), 0);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#F8FAFC">
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F1F5F9' }}>
            {auth ? (
                <>
                    <Header collId={collId} />

                    <Container maxWidth="xl" sx={{ mt: 4, mb: 6, flexGrow: 1 }}>
                        
                {/* 1. Dashboard Title */}
                <Box mb={4} display="flex" alignItems="center">
                    <DashboardIcon sx={{ fontSize: 36, color: '#1E293B', mr: 2 }} />
                    <div>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1E293B' }}>
                            สรุปยอดจัดเก็บขยะ
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            รายงานสถิติปริมาณขยะแยกตามแหล่งที่มาและประเภท
                        </Typography>
                    </div>
                </Box>

                {/* 2. Filter Control Panel */}
                <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <FilterIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1" fontWeight="bold">ตัวกรองข้อมูล</Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>ชุดข้อมูล</InputLabel>
                                <Select
                                    value={dataSet}
                                    label="ชุดข้อมูล"
                                    onChange={e => setDataSet(e.target.value)}
                                >
                                    <MenuItem value="all">🌐 ทั้งหมด (ตำบล)</MenuItem>
                                    <MenuItem value="village">🏡 หมู่บ้าน</MenuItem>
                                    <MenuItem value="agency">🏢 หน่วยงาน</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth size="small" disabled={dataSet === 'all'}>
                                <InputLabel>เลือกพื้นที่</InputLabel>
                                <Select
                                    value={locationId}
                                    label="เลือกพื้นที่"
                                    onChange={e => setLocationId(e.target.value)}
                                >
                                    <MenuItem value="" disabled>-- เลือกสถานที่ --</MenuItem>
                                    {locations.map(loc => (
                                        <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>ช่วงเวลา</InputLabel>
                                <Select
                                    value={mode}
                                    label="ช่วงเวลา"
                                    onChange={e => setMode(e.target.value)}
                                >
                                    <MenuItem value="day">📅 รายวัน</MenuItem>
                                    <MenuItem value="month">🗓 รายเดือน</MenuItem>
                                    <MenuItem value="year">📆 รายปี</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <CustomThaiDatePicker
                                date={date}
                                setDate={setDate}
                                mode={mode}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* 3. Main Content Grid (Layout Updated) */}
                <Grid container spacing={3} alignItems="stretch"> {/* alignItems="stretch" ช่วยให้ Grid item สูงเท่ากัน */}
                    
                    {/* Left: Chart */}
                    {/* ✅ กำหนดความสูงคงที่สำหรับ Desktop (lg) */}
                    <Grid item xs={12} lg={8} sx={{ height: { lg: '500px', xs: 'auto' } }}>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box display="flex" alignItems="center" mb={2} flexShrink={0}>
                                <BarChartIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6" fontWeight="bold" color="primary">
                                    กราฟแสดงสัดส่วนขยะ
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />
                            
                            <Box sx={{ flexGrow: 1, position: 'relative', minHeight: 0 }}>
                                {wasteData.length > 0 ? (
                                    <WasteChart
                                        data={wasteData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { position: 'bottom' }
                                            }
                                        }}
                                    />
                                ) : (
                                    <Box height="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center" color="text.secondary">
                                        <Typography>ไม่พบข้อมูลสำหรับการแสดงผล</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right: Summary & Details */}
                    {/* ✅ กำหนดความสูงเท่ากับด้านซ้าย และใช้ Flexbox จัดการภายใน */}
                    <Grid item xs={12} lg={4} sx={{ height: { lg: '500px', xs: 'auto' } }}>
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                            
                            {/* Total Summary Card (ขนาดคงที่ตามเนื้อหา) */}
                            <Card elevation={2} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)', color: 'white', flexShrink: 0 }}>
                                <CardContent>
                                    <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>ปริมาณขยะรวมทั้งหมด</Typography>
                                    <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
                                        {totalWeight.toLocaleString()} <span style={{fontSize: '1.5rem'}}>กก.</span>
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        จาก {wasteData.length} ประเภทขยะ
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* Detail List (ยืดเต็มพื้นที่ที่เหลือ) */}
                            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                                <Box display="flex" alignItems="center" mb={2} flexShrink={0}>
                                    <PieChartIcon color="warning" sx={{ mr: 1 }} />
                                    <Typography variant="h6" fontWeight="bold" color="#1E293B">
                                        รายละเอียดแยกประเภท
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />

                                {/* Scrollable Area */}
                                <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                                    {wasteData.length > 0 ? (
                                        <Box display="flex" flexDirection="column" gap={2}>
                                            {wasteData.map((item, index) => {
                                                const val = parseFloat(item.total);
                                                const percent = totalWeight > 0 ? (val / totalWeight) * 100 : 0;
                                                
                                                return (
                                                    <Box key={index} sx={{ p: 1.5, borderRadius: 2, bgcolor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                                            <Typography variant="body2" fontWeight="bold" color="#334155">
                                                                {item.wasteType_name}
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight="bold" color="primary">
                                                                {val.toLocaleString()} กก.
                                                            </Typography>
                                                        </Box>
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <LinearProgress 
                                                                variant="determinate" 
                                                                value={percent} 
                                                                sx={{ flexGrow: 1, height: 6, borderRadius: 5 }} 
                                                            />
                                                            <Typography variant="caption" color="text.secondary" width="35px" textAlign="right">
                                                                {percent.toFixed(1)}%
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    ) : (
                                        <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                                            <Typography align="center" color="text.secondary">
                                                ไม่มีรายการข้อมูล
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>

            </Container>

                    <Footer />
                </>
            ) : (
                <UnauthorizedMessage message={message} />
            )}
        </div>
    );
}

export default DashboardCollector;