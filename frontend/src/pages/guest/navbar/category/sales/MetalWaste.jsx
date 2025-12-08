// MetalWaste.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Box, Typography, Paper, TextField, InputAdornment, 
    CircularProgress, Chip, Button, Grid, Card, CardActionArea, 
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import { 
    Construction as MetalIcon, // ใช้ไอคอนเครื่องมือ/โลหะ
    ArrowBackIos, 
    Close as CloseIcon,
    Scale as ScaleIcon
} from '@mui/icons-material';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

const themeColor = '#607D8B'; // สีเทาเข้ม (Blue Grey)

function MetalWaste() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // State สำหรับ Modal
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [weight, setWeight] = useState('');

    // Image Mapping
    const getMetalImage = (name) => {
        if (!name) return '/images/assets/glass-default.png';
        if (name.includes('อลูมิเนียม')) return '/images/assets/MetalWaste-1.png';
        if (name.includes('กระป๋องเหล็ก')) return '/images/assets/MetalWaste-2.png';
        if (name.includes('ทองแดง')) return '/images/assets/MetalWaste-3.png';
        if (name.includes('สแตนเลส')) return '/images/assets/MetalWaste-4.png';
        if (name.includes('เศษเหล็ก')) return '/images/assets/MetalWaste-5.png';
        if (name.includes('สังกะสี')) return '/images/assets/MetalWaste-6.png';
        if (name.includes('เหล็กหนา')) return '/images/assets/MetalWaste-7.png';
        return '/images/assets/glass-default.png';
    };

    const handleBack = () => navigate('/sellwaste');

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sellwaste/metal`);
                if (res.data.status === 'success') {
                    setItems(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Open Modal
    const handleItemClick = (item) => {
        setSelectedItem(item);
        setWeight('');
        setOpenDialog(true);
    };

    // Close Modal
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedItem(null);
    };

    // Handle Weight Input (Prevent Negative)
    const handleWeightChange = (e) => {
        const val = e.target.value;
        if (val === '' || (parseFloat(val) >= 0)) {
            setWeight(val);
        }
    };

    // Calculate Total Price
    const calculateTotal = () => {
        if (!selectedItem || !weight || isNaN(weight)) return "0.00";
        return (selectedItem.price_per_kg * parseFloat(weight)).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header type="menu" />

            {/* Header Banner */}
            <Box sx={{ bgcolor: themeColor, color: 'white', py: 5, textAlign: 'center', mb: 4, boxShadow: 3, borderRadius: '0 0 24px 24px' }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                        <MetalIcon fontSize="large" /> คำนวณราคาโลหะ
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                        เลือกประเภทโลหะเพื่อคำนวณราคารับซื้อ
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ flexGrow: 1, mb: 8 }}>
                
                {/* Back Button */}
                <Box sx={{ mb: 4 }}>
                    <Button 
                        startIcon={<ArrowBackIos />} 
                        onClick={handleBack} 
                        sx={{ color: '#555', fontWeight: 'bold', '&:hover': { bgcolor: '#E0E0E0' } }}
                    >
                        กลับไปหน้ารับซื้อ
                    </Button>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" py={10}><CircularProgress sx={{ color: themeColor }} /></Box>
                ) : (
                    <Grid container spacing={3}>
                        {items.length === 0 ? (
                            <Grid item xs={12} textAlign="center" py={5}>
                                <Typography color="text.secondary">ไม่พบรายการรับซื้อ</Typography>
                            </Grid>
                        ) : (
                            items.map((item) => (
                                <Grid item xs={6} sm={4} md={3} key={item.item_id}>
                                    <Card 
                                        elevation={3} 
                                        sx={{ 
                                            borderRadius: 4, 
                                            transition: '0.3s', 
                                            '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 } 
                                        }}
                                    >
                                        <CardActionArea onClick={() => handleItemClick(item)} sx={{ p: 2, textAlign: 'center' }}>
                                            {/* ✅ 1. เพิ่มความสูงของ Box รูปภาพ (จาก 140 -> 180) */}
                                            <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                                <img 
                                                    src={getMetalImage(item.item_name)} 
                                                    alt={item.item_name} 
                                                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                                    onError={(e) => e.target.src = '/images/assets/errorimage.jpg'}
                                                />
                                            </Box>
                                            <Typography variant="body1" fontWeight="bold" noWrap>
                                                {item.item_name}
                                            </Typography>
                                            <Chip 
                                                label={`${item.price_per_kg} บ./กก.`} 
                                                size="small" 
                                                sx={{ mt: 1, bgcolor: `${themeColor}15`, color: themeColor, fontWeight: 'bold' }} 
                                            />
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
                )}
            </Container>

            {/* Calculation Modal */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ bgcolor: themeColor, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">คำนวณราคา</Typography>
                    <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}><CloseIcon /></IconButton>
                </DialogTitle>

                <DialogContent sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
                    {selectedItem && (
                        <>
                            {/* ✅ 2. เพิ่มความสูงรูปใน Modal (จาก 120 -> 200) */}
                            <Box sx={{ height: 200, display: 'flex', justifyContent: 'center', mb: 2, mt: 2 }}>
                                <img 
                                    src={getMetalImage(selectedItem.item_name)} 
                                    alt={selectedItem.item_name} 
                                    style={{ maxHeight: '100%', width: 'auto', objectFit: 'contain' }}
                                />
                            </Box>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {selectedItem.item_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                ราคารับซื้อ: <strong>{selectedItem.price_per_kg}</strong> บาท/กิโลกรัม
                            </Typography>

                            <TextField
                                autoFocus
                                fullWidth
                                label="ระบุน้ำหนัก (กิโลกรัม)"
                                type="number"
                                value={weight}
                                onChange={handleWeightChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><ScaleIcon color="action" /></InputAdornment>,
                                    endAdornment: <InputAdornment position="end">กก.</InputAdornment>,
                                }}
                                placeholder="0.00"
                                sx={{ mb: 3 }}
                            />

                            <Paper elevation={0} sx={{ bgcolor: '#ECEFF1', p: 2, borderRadius: 3, border: `1px dashed ${themeColor}` }}>
                                <Typography variant="body2" color="text.secondary" mb={0.5}>จำนวนเงินโดยประมาณ</Typography>
                                <Typography variant="h3" fontWeight="bold" color={themeColor}>
                                    {calculateTotal()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">บาท</Typography>
                            </Paper>
                        </>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                    <Button onClick={handleCloseDialog} variant="contained" fullWidth sx={{ bgcolor: themeColor, borderRadius: 2, py: 1.2, fontSize: '1rem', '&:hover': { bgcolor: '#455A64' } }}>
                        เสร็จสิ้น
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer />
        </div>
    );
}

export default MetalWaste;