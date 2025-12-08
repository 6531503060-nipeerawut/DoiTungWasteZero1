// src/pages/collector/GarbageTruckScheduleCollector.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

// MUI Components
import {
    Container, Grid, Paper, Typography, Box, CircularProgress,
    Card, CardActionArea, CardContent, Chip
} from '@mui/material';

// MUI Icons
import {
    LocalShipping as TruckIcon,
    ChevronRight as ArrowIcon,
    CalendarMonth as CalendarIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    Phone as PhoneIcon,
    HelpOutline as HelpIcon
} from '@mui/icons-material';

// ใช้ Bootstrap Icons สำหรับไอคอนที่มาจาก Database
import 'bootstrap-icons/font/bootstrap-icons.css';

axios.defaults.withCredentials = true;

// --- Theme Constants ---
const themeColors = {
    primary: '#2E5D4B',    // เขียวแม่ฟ้าหลวง
    secondary: '#8D6E63',  // น้ำตาลดิน
    accent: '#D4AF37',     // ทอง
    bg: '#F7F9F6',         // พื้นหลัง
    textHeader: '#1A3C34'  // เขียวเข้มหัวข้อ
};

function GarbageTruckScheduleCollector() {
    document.title = "ตารางรถเก็บขยะ - DoiTung Zero-Waste";

    const [scheduleData, setScheduleData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Data
    useEffect(() => {
        // ⚠️ ต้องตรวจสอบให้แน่ใจว่า URL นี้ถูกต้องสำหรับ Backend ของคุณ
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/c/garbagetruckschedulecollector`)
          .then(res => {
              if (res.data.status === 'success' && res.data.data) {
                  setScheduleData(res.data.data);
              } else {
                  setError("ไม่พบข้อมูลตารางเวลา หรือคุณไม่ได้รับอนุญาตให้เข้าถึง");
              }
          })
          .catch(err => {
              console.error(err);
              setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
          })
          .finally(() => {
              setLoading(false);
          });
    }, []);

    const scheduleDays = Object.keys(scheduleData);

    const dayMap = {
        Monday: 'วันจันทร์', Tuesday: 'วันอังคาร', Wednesday: 'วันพุธ',
        Thursday: 'วันพฤหัสบดี', Friday: 'วันศุกร์', Saturday: 'วันเสาร์', Sunday: 'วันอาทิตย์'
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor={themeColors.bg}>
                <CircularProgress sx={{ color: themeColors.primary }} size={60} thickness={4} />
            </Box>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: themeColors.bg, fontFamily: 'Sarabun, sans-serif' }}>
            <Header type="menu" />

            <Container maxWidth="lg" sx={{ mt: 4, mb: 8, flexGrow: 1 }}>
                            
                {/* --- 1. Title Box (กล่องหัวข้อ) --- */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3, 
                        mb: 2, // เว้นระยะห่างเล็กน้อยให้ดูเชื่อมโยงกับกล่องล่าง
                        borderRadius: 4, 
                        textAlign: 'center', 
                        position: 'relative', 
                        overflow: 'hidden',
                        bgcolor: 'white',
                        border: '1px solid #E0E0E0'
                    }}
                >
                    {/* แถบสีตกแต่งด้านบน */}
                    <Box sx={{ 
                        position: 'absolute', top: 0, left: 0, right: 0, 
                        height: '8px', 
                        background: `linear-gradient(90deg, ${themeColors.primary} 0%, ${themeColors.accent} 100%)` 
                    }} />

                    {/* Title + Icon Row */}
                    <Box display="flex" alignItems="center" justifyContent="center" gap={4} pt={1}>
                        
                            <TruckIcon sx={{ fontSize: 60, color: themeColors.primary }} />
                    

                        <Typography variant="h4" fontWeight="bold" color={themeColors.textHeader} sx={{ fontFamily: 'Sarabun', lineHeight: 1 }}>
                            ตารางเก็บขยะ
                        </Typography>
                    </Box>
                </Paper>

                {/* --- 2. Description Box (กล่องคำอธิบาย) --- */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 2, 
                        mb: 5, 
                        borderRadius: 3, 
                        bgcolor: '#F5F7F6', 
                        border: '1px dashed #B0BEC5',
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1
                        // ลบ maxWidth ออกเพื่อให้ยาวเต็มจอเท่ากล่องบน
                    }}
                >
                    <InfoIcon color="action" fontSize="small" />
                    <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'Sarabun' }}>
                        ตรวจสอบรอบเวลาและประเภทขยะที่รถจะเข้าจัดเก็บในแต่ละวัน เพื่อการคัดแยกที่ถูกต้องและเป็นระเบียบ
                    </Typography>
                </Paper>

                {/* --- 3. Error Handling --- */}
                {error ? (
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, bgcolor: '#FFF4F4' }}>
                        <WarningIcon color="error" sx={{ fontSize: 50, mb: 2 }} />
                        <Typography color="error" variant="h6" fontFamily="Sarabun">{error}</Typography>
                    </Paper>
                ) : (
                    // --- 4. Schedule Grid (Card มีขอบสีตามวัน) ---
                    <Grid container spacing={3} justifyContent="center">
                        {scheduleDays.map((dayKey) => {
                            const data = scheduleData[dayKey];
                            const cardColor = data.themeColor || themeColors.primary; 
                            
                            return (
                                <Grid item xs={12} md={6} key={dayKey}>
                                    <Card 
                                        sx={{ 
                                            borderRadius: 4,
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                                            border: `2px solid ${cardColor}`, // ✅ เส้นขอบสีตามวัน
                                            background: `linear-gradient(135deg, #ffffff 40%, ${cardColor}10 100%)`, // พื้นหลังไล่สีจางๆ
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                            overflow: 'visible', 
                                            '&:hover': { 
                                                transform: 'translateY(-6px)', 
                                                boxShadow: `0 12px 24px -5px ${cardColor}40`, 
                                                borderWidth: '2px', // คงความหนาขอบไว้
                                                borderColor: cardColor // สีขอบชัดเจน
                                            }
                                        }}
                                    >
                                        <CardActionArea 
                                            component={Link} 
                                            to={data.link || `/${dayKey.toLowerCase()}`} 
                                            sx={{ height: '100%', p: 1 }}
                                        >
                                            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                                
                                                {/* Icon Container (เพิ่มขอบให้ไอคอนด้วย) */}
                                                <Box 
                                                    sx={{ 
                                                        width: 75, height: 75, 
                                                        bgcolor: `${cardColor}15`, 
                                                        color: cardColor,
                                                        borderRadius: '18px', 
                                                        border: `1px solid ${cardColor}40`, 
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mr: 3,
                                                        fontSize: '2rem',
                                                        boxShadow: `0 4px 10px ${cardColor}20`
                                                    }}
                                                >
                                                    <i className={`bi ${data.icon || 'bi-truck'}`}></i>
                                                </Box>

                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                                        <Typography variant="h6" fontWeight="800" color="#333" sx={{ fontFamily: 'Sarabun' }}>
                                                            {data.dayName || dayMap[dayKey] || dayKey}
                                                        </Typography>
                                                        
                                                        {data.specialTag && (
                                                            <Chip 
                                                                label={data.specialTag} 
                                                                size="small" 
                                                                sx={{ 
                                                                    bgcolor: '#FFEBEE', 
                                                                    color: '#C62828', 
                                                                    fontWeight: 'bold', 
                                                                    height: 22, 
                                                                    fontSize: '0.7rem', 
                                                                    fontFamily: 'Sarabun',
                                                                    border: '1px solid #FFCDD2'
                                                                }} 
                                                            />
                                                        )}
                                                    </Box>
                                                    
                                                    <Typography 
                                                        variant="body1" 
                                                        sx={{ 
                                                            color: cardColor, 
                                                            fontWeight: 'bold', 
                                                            fontFamily: 'Sarabun', 
                                                            fontSize: '1.05rem',
                                                            lineHeight: 1.3 
                                                        }}
                                                    >
                                                        {data.type}
                                                    </Typography>

                                                    <Box display="flex" alignItems="center" mt={0.5}>
                                                        <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                                                        <Typography variant="caption" color="text.secondary" fontFamily="Sarabun">
                                                            ดูรายชื่อขยะที่ทิ้งได้
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* ลูกศร */}
                                                <Box 
                                                    sx={{ 
                                                        bgcolor: '#F5F5F5', 
                                                        borderRadius: '50%', 
                                                        p: 1,
                                                        transition: '0.3s',
                                                        '.MuiCardActionArea-root:hover &': {
                                                            bgcolor: cardColor,
                                                            color: 'white'
                                                        }
                                                    }}
                                                >
                                                    <ArrowIcon />
                                                </Box>

                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}

                {/* --- 5. Bottom Info Section --- */}
                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#E3F2FD', border: '1px dashed #90CAF9', display: 'flex', alignItems: 'center' }}>
                            <HelpIcon color="primary" sx={{ fontSize: 40, mr: 2, opacity: 0.8 }} />
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ fontFamily: 'Sarabun' }}>มีข้อสงสัย?</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Sarabun' }}>
                                    หากไม่แน่ใจประเภทขยะ หรือรถไม่มาตามเวลา
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#FFF3E0', border: '1px dashed #FFCC80', display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon color="warning" sx={{ fontSize: 40, mr: 2, opacity: 0.8 }} />
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ fontFamily: 'Sarabun' }}>ติดต่อเจ้าหน้าที่</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Sarabun' }}>
                                    เบอร์โทร : xxx-xxx-xxx
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

            </Container>
            <Footer />
        </div>
    );
}

export default GarbageTruckScheduleCollector;