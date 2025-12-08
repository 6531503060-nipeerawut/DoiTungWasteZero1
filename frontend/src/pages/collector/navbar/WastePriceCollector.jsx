import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

// MUI Components
import { 
    Container, Paper, Typography, Box, Button, Alert, LinearProgress 
} from '@mui/material';
import { 
    CurrencyExchange as CurrencyIcon, 
    OpenInNew as OpenInNewIcon,
    Info as InfoIcon
} from '@mui/icons-material';

function WastePriceCollector() {
    document.title = "ราคารับซื้อขยะ - DoiTung Zero-Waste";
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ยังคง Logic เดิมของคุณไว้ (เผื่อมีการเก็บ Log การเข้าชม)
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/waste-price`)
            .then(res => console.log("Access Log:", res.data))
            .catch(err => console.log(err));
            
        // Simulate iframe loading time
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
            {/* Header */}
            <Header type="menu" />

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 6, flexGrow: 1 }}>
                
                {/* 1. Page Title */}
                <Box mb={4} textAlign="center">
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <CurrencyIcon fontSize="large" color="success" /> ราคารับซื้อขยะกลาง
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" mt={1}>
                        อ้างอิงข้อมูลราคากลางจาก วงษ์พาณิชย์ (Wongpanit)
                    </Typography>
                </Box>

                {/* 2. Disclaimer / Info Alert */}
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                    <Box display="flex" alignItems="center">
                        <InfoIcon sx={{ mr: 1 }} />
                        <Typography variant="body2">
                            <strong>หมายเหตุ:</strong> ราคาที่แสดงเป็นราคากลางจากตลาดรับซื้อรายใหญ่ อาจแตกต่างจากราคาหน้าจุดรับซื้อจริง 
                            ขึ้นอยู่กับค่าขนส่ง ความสะอาดของขยะ และกลไกตลาดในแต่ละพื้นที่
                        </Typography>
                    </Box>
                </Alert>

                {/* 3. Iframe Container */}
                <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', position: 'relative', border: '1px solid #E2E8F0' }}>
                    
                    {/* Toolbar เหนือ Iframe */}
                    <Box sx={{ p: 2, bgcolor: '#F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
                        <Typography variant="body2" color="text.secondary">
                            แหล่งที่มา: wongpanit.com
                        </Typography>
                        <Button 
                            variant="outlined" 
                            size="small" 
                            endIcon={<OpenInNewIcon />} 
                            href="https://wongpanit.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            เปิดเว็บไซต์เต็ม
                        </Button>
                    </Box>

                    {/* Loading Bar */}
                    {loading && <LinearProgress color="success" />}

                    {/* The Iframe */}
                    <Box sx={{ height: '700px', width: '100%', bgcolor: 'white' }}>
                        <iframe
                            src="https://wongpanit.com/"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            title="Wongpanit Website"
                            style={{ display: 'block' }}
                            onLoad={() => setLoading(false)}
                        ></iframe>
                    </Box>
                </Paper>

            </Container>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default WastePriceCollector;