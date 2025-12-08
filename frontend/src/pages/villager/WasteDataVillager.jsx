import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Footer from './components/Footer';
import Header from './components/Header';
import UnauthorizedMessage from '../../components/UnauthorizedMessage';

// MUI Components
import { 
    Container, Paper, Typography, Box, Grid, FormControl, InputLabel, 
    Select, MenuItem, Button, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Chip, Alert, CircularProgress, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { 
    Search as SearchIcon, 
    Business as BusinessIcon, 
    HomeWork as HomeWorkIcon,
    Inbox as InboxIcon,
    FilterAlt as FilterAltIcon
} from '@mui/icons-material';

// --- Theme Constants ---
const themeColors = {
    primary: '#2E5D4B',    
    secondary: '#8D6E63',  
    accent: '#D4AF37',     
    bg: '#F7F9F6',         
    textHeader: '#1A3C34'  
};

axios.defaults.withCredentials = true;

const WasteDataVillager = () => {
    document.title = "ข้อมูลรายการขยะ (เจ้าหน้าที่) - DoiTung Zero-Waste";
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [collId, setCollId] = useState(null);

    const [type, setType] = useState('หมู่บ้าน');
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [options, setOptions] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            let url = `${process.env.REACT_APP_BACKEND_URL}/v/wastedatavillager`;
            if (search) {
                url += `?type=${type}&search=${search}`;
            }
            const response = await axios.get(url, { withCredentials: true });
            setData(response.data.data);
            setName(response.data.name);
            setCollId(response.data.coll_id);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'ไม่สามารถดึงข้อมูลได้');
            setData([]);
            setName('');
        }
    }, [search, type]);

    useEffect(() => {
        const fetchOptions = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v/waste-options?type=${type}`, { withCredentials: true });
                if (response.status === 200) {
                    const opt = response.data.options || [];
                    if (opt.length > 0) {
                        setOptions(opt);
                        setAuth(true);
                        setMessage('');
                        setCollId(response.data.coll_id);

                        if (!search || !opt.includes(search)) {
                            if (search !== opt[0]) {
                                setSearch(opt[0]);
                            }
                        }
                    } else {
                        setOptions([]);
                        setAuth(false);
                        setMessage('ไม่พบตัวเลือกข้อมูล');
                    }
                }
            } catch (err) {
                if (err.response) {
                    if (err.response.status === 401 || err.response.status === 403) {
                        setAuth(false);
                        setMessage('ไม่มีสิทธิ์เข้าถึงข้อมูล');
                    } else {
                        setMessage(err.response.data.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
                    }
                } else {
                    setMessage('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
                }
                setOptions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, [type, search]); // Added search dependency to handle initial load logic if needed.

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        fetchData();
    };

    const handleTypeChange = (event, newType) => {
        if (newType !== null) {
            setType(newType);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatTime = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
            {auth ? (
                <>
                    <Header collId={collId} />

                    <Container maxWidth="lg" sx={{ mt: 4, mb: 10, flexGrow: 1 }}>
                                                        
                    <Box mb={4} sx={{ borderLeft: `5px solid ${themeColors.accent}`, pl: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: themeColors.textHeader, display: 'flex', alignItems: 'center', gap: 1 }}>
                                ข้อมูลขยะขาเข้า
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                            ตรวจสอบประวัติและปริมาณขยะที่บันทึก
                        </Typography>
                    </Box>
    
                    <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid #E0E0E0', backgroundColor: '#fff' }}>
                        <form onSubmit={handleSearchSubmit}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <FilterAltIcon sx={{ color: themeColors.secondary, mr: 1 }} />
                                <Typography variant="subtitle1" fontWeight="bold" color={themeColors.textHeader}>
                                    ตัวกรองการค้นหา
                                </Typography>
                            </Box>
    
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={4}>
                                    <ToggleButtonGroup
                                        value={type}
                                        exclusive
                                        onChange={handleTypeChange}
                                        fullWidth
                                        sx={{ 
                                            height: '45px',
                                            '& .MuiToggleButton-root': { 
                                                borderColor: themeColors.primary,
                                                color: themeColors.primary,
                                                fontFamily: 'Sarabun',
                                                '&.Mui-selected': {
                                                    backgroundColor: themeColors.primary,
                                                    color: 'white',
                                                    '&:hover': { backgroundColor: '#1A3C34' }
                                                }
                                            } 
                                        }}
                                    >
                                        <ToggleButton value="หมู่บ้าน">
                                            <HomeWorkIcon sx={{ mr: 1, fontSize: 20 }} /> หมู่บ้าน
                                        </ToggleButton>
                                        <ToggleButton value="หน่วยงาน">
                                            <BusinessIcon sx={{ mr: 1, fontSize: 20 }} /> หน่วยงาน
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Grid>
    
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>เลือกสถานที่ / ชื่อ</InputLabel>
                                        <Select
                                            value={search}
                                            label="เลือกสถานที่ / ชื่อ"
                                            onChange={(e) => setSearch(e.target.value)}
                                            disabled={loading || options.length === 0}
                                            sx={{ fontFamily: 'Sarabun' }}
                                        >
                                            {options.length > 0 ? (
                                                options.map((option, idx) => (
                                                    <MenuItem key={idx} value={option} sx={{ fontFamily: 'Sarabun' }}>{option}</MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem disabled>ไม่มีข้อมูล</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>
    
                                <Grid item xs={12} md={2}>
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        fullWidth 
                                        size="medium"
                                        startIcon={<SearchIcon />}
                                        sx={{ 
                                            height: '40px',
                                            borderRadius: 2, 
                                            textTransform: 'none', 
                                            fontWeight: 'bold', 
                                            backgroundColor: themeColors.accent,
                                            color: '#fff',
                                            fontFamily: 'Sarabun',
                                            '&:hover': { backgroundColor: '#BFA130' }
                                        }}
                                    >
                                        ค้นหา
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
    
                        {message && <Alert severity="info" sx={{ mt: 2, fontFamily: 'Sarabun' }}>{message}</Alert>}
                        {error && <Alert severity="error" sx={{ mt: 2, fontFamily: 'Sarabun' }}>{error}</Alert>}
                    </Paper>
    
                    {loading && (
                        <Box display="flex" justifyContent="center" my={5}>
                            <CircularProgress sx={{ color: themeColors.primary }} />
                        </Box>
                    )}
    
                    {!loading && (
                        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            {name && (
                                <Box sx={{ bgcolor: themeColors.primary, p: 2, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Sarabun' }}>
                                        {name}
                                    </Typography>
                                    <Chip label="ประวัติรายการ" size="small" sx={{ bgcolor: 'white', color: themeColors.primary, fontWeight: 'bold' }} />
                                </Box>
                            )}
    
                            <TableContainer sx={{ maxHeight: 600 }}>
                                <Table stickyHeader aria-label="waste data table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" sx={{ backgroundColor: '#EFEFEF', color: themeColors.textHeader, fontWeight: 'bold', fontFamily: 'Sarabun' }}>วันที่</TableCell>
                                            <TableCell align="center" sx={{ backgroundColor: '#EFEFEF', color: themeColors.textHeader, fontWeight: 'bold', fontFamily: 'Sarabun' }}>เวลา</TableCell>
                                            <TableCell align="left" sx={{ backgroundColor: '#EFEFEF', color: themeColors.textHeader, fontWeight: 'bold', fontFamily: 'Sarabun' }}>ประเภทขยะ</TableCell>
                                            <TableCell align="left" sx={{ backgroundColor: '#EFEFEF', color: themeColors.textHeader, fontWeight: 'bold', fontFamily: 'Sarabun' }}>ประเภทย่อย</TableCell>
                                            <TableCell align="right" sx={{ backgroundColor: '#EFEFEF', color: themeColors.textHeader, fontWeight: 'bold', fontFamily: 'Sarabun' }}>น้ำหนัก (กก.)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 20 }}>
                                                    <Box display="flex" flexDirection="column" alignItems="center" color="text.secondary">
                                                        <InboxIcon sx={{ fontSize: 60, opacity: 0.2, mb: 1 }} />
                                                        <Typography sx={{ fontFamily: 'Sarabun' }}>ไม่พบข้อมูลในช่วงเวลานี้</Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            data.map((item, idx) => (
                                                <TableRow 
                                                    key={idx}
                                                    hover
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="center" sx={{ fontFamily: 'Sarabun' }}>{formatDate(item.vaw_date)}</TableCell>
                                                    <TableCell align="center" sx={{ color: 'text.secondary', fontFamily: 'Sarabun' }}>{formatTime(item.vaw_time)}</TableCell>
                                                    <TableCell align="left" sx={{ fontFamily: 'Sarabun' }}>
                                                        <Chip 
                                                            label={item.wasteType_name} 
                                                            size="small" 
                                                            sx={{ 
                                                                bgcolor: '#E8F5E9', 
                                                                color: '#2E7D32', 
                                                                fontWeight: 500,
                                                                fontFamily: 'Sarabun'
                                                            }} 
                                                        />
                                                    </TableCell>
                                                    <TableCell align="left" sx={{ fontFamily: 'Sarabun' }}>{item.subWasteType_name || '-'}</TableCell>
                                                    <TableCell align="right">
                                                        <Typography fontWeight="bold" sx={{ color: themeColors.primary, fontFamily: 'Sarabun' }}>
                                                            {parseFloat(item.vaw_wasteTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}
    
                </Container>

                    <Footer />
                </>
            ) : (
                <UnauthorizedMessage message={message} />
            )}
        </div>
    );
};

export default WasteDataVillager;