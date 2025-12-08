// AddingWasteVillager.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./components/Footer";
import Header from "./components/Header";
import UnauthorizedMessage from "../../components/UnauthorizedMessage";

// MUI Components
import {
  Container, Typography, Box, TextField, MenuItem, Button,
  Grid, InputAdornment, CircularProgress, Snackbar, Alert, Divider,
  Card, CardContent
} from "@mui/material";

// MUI Icons
import {
  Save as SaveIcon,
  DeleteSweep as WasteIcon,
  Scale as ScaleIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  RestartAlt as ResetIcon,
  Info as InfoIcon,
  Category as CategoryIcon,
  Recycling as RecycleIcon
} from "@mui/icons-material";

axios.defaults.withCredentials = true;

// --- Theme Colors (Mae Fah Luang Foundation Theme) ---
const themeColors = {
  primary: "#2E5D4B",    // เขียวแม่ฟ้าหลวง (Main Action)
  secondary: "#8D6E63",  // น้ำตาลดิน (Secondary)
  accent: "#D4AF37",     // ทอง (Highlight)
  bg: "#F7F9F6",         // พื้นหลัง (Soft Greenish White)
  textHeader: "#1A3C34", // เขียวเข้ม (Text)
  cardHeader: "linear-gradient(135deg, #2E5D4B 0%, #1B3A30 100%)" // Gradient Header
};

// Waste Types Data
const WASTE_TYPES = [
  { id: "1", name: "01 ขยะเปื้อน" },
  { id: "2", name: "02 ขยะห้องน้ำ" },
  { id: "3", name: "03 ขยะพลังงาน" },
  { id: "4", name: "04 ขยะอันตราย" },
  { id: "5", name: "05 วัสดุรีไซเคิล" },
  { id: "6", name: "06 ขยะย่อยสลาย" },
  { id: "7", name: "07 ขยะชิ้นใหญ่" },
];

// Sub Types Data
const SUB_WASTE_TYPES = [
  { id: "1", name: "01 ขวดแก้ว" },
  { id: "2", name: "02 ขวดพลาสติกใส" },
  { id: "3", name: "03 เหล็ก/โลหะ/สังกะสี" },
  { id: "4", name: "04 กระดาษ" },
];

function AddingWasteVillager() {
  document.title = "บันทึกขยะขาเข้า - DoiTung Zero-Waste";

  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [villId, setVillId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Format Date for Display (Thai format)
  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear() + 543}`;
  };

  const [displayDate, setDisplayDate] = useState("");

  const [formData, setFormData] = useState({
    vaw_date: new Date().toISOString().split("T")[0],
    vaw_wasteType: "",
    vaw_subWasteType: "",
    vaw_wasteTotal: "",
    vaw_description: "",
  });

  useEffect(() => {
    setDisplayDate(formatDate(new Date()));

    // Check Auth
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v/addingwastevillager`)
      .then((res) => {
        if (res.data.status === "success") {
          setAuth(true);
          setVillId(res.data.vill_id);
        } else {
          setAuth(false);
          setMessage(res.data.error || "Unauthorized");
        }
      })
      .catch(() => setMessage("Error connecting to server"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "vaw_wasteType") {
      setFormData((prev) => ({
        ...prev,
        vaw_wasteType: value,
        // Reset sub-type if not Recyclable (ID '5')
        vaw_subWasteType: value === "5" ? prev.vaw_subWasteType : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);

    const dataToSend = {
      ...formData,
      vaw_subWasteType:
        formData.vaw_wasteType === "5"
          ? formData.vaw_subWasteType || null
          : null,
    };

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/v/addingwastevillager`, dataToSend)
      .then((res) => {
        if (res.data.status === "success") {
          setOpenSnackbar(true);
          // Redirect to the 'Waste Data' page (Input List) instead of Dashboard
          setTimeout(() => navigate("/v/wastedatavillager"), 1500);
        } else {
          alert(res.data.error || "เกิดข้อผิดพลาดในการบันทึก");
          setSubmitting(false);
        }
      })
      .catch(() => {
        alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
        setSubmitting(false);
      });
  };

  const resetForm = () => {
    setFormData({
      vaw_date: new Date().toISOString().split("T")[0],
      vaw_wasteType: "",
      vaw_subWasteType: "",
      vaw_wasteTotal: "",
      vaw_description: "",
    });
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: themeColors.bg }}>
        <CircularProgress sx={{ color: themeColors.primary }} />
      </Box>
    );

  if (!auth) return <UnauthorizedMessage message={message} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: themeColors.bg, fontFamily: 'Sarabun, sans-serif' }}>
      <Header villId={villId} />

      <Container maxWidth="md" sx={{ mt: 4, mb: 8, flexGrow: 1 }}>
        
        {/* Header Box & Info */}
        <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography variant="h4" fontWeight="bold" color={themeColors.textHeader} gutterBottom>
                บันทึกขยะขาเข้า
            </Typography>
            <Typography variant="body1" color="text.secondary">
                กรุณากรอกข้อมูลขยะที่ท่านต้องการส่งมอบเพื่อรอการจัดเก็บ
            </Typography>
        </Box>

        {/* Main Form Card */}
        <Card sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflow: "visible" }}>
            
            {/* Card Header Stripe */}
            <Box sx={{ 
                background: themeColors.cardHeader, 
                py: 2, px: 3, 
                borderTopLeftRadius: 16, borderTopRightRadius: 16,
                color: "white", display: "flex", alignItems: "center", gap: 1,
                borderRadius:1
            }}>
                <WasteIcon />
                <Typography variant="h6" fontWeight="bold" fontFamily="Sarabun">
                    แบบฟอร์มบันทึกข้อมูล
                </Typography>
            </Box>

            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                
                {/* Information Alert */}
                <Alert severity="info" sx={{ mb: 4, borderRadius: 2, backgroundColor: "#E3F2FD", color: "#0D47A1" }} icon={<InfoIcon fontSize="inherit" />}>
                    <Typography variant="body2" fontFamily="Sarabun">
                        <strong>หมายเหตุ:</strong> ข้อมูลที่บันทึกในหน้านี้จะถูกส่งไปยัง <u>รายการขยะรอการจัดเก็บ</u> เพื่อให้เจ้าหน้าที่ตรวจสอบก่อนนำเข้าระบบ
                    </Typography>
                </Alert>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        
                        {/* 1. Date (Read Only) */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="วันที่บันทึก"
                                value={displayDate}
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarIcon sx={{ color: themeColors.primary }} />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                sx={{ backgroundColor: "#F5F5F5" }}
                            />
                        </Grid>

                        {/* 2. Waste Type */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                required
                                fullWidth
                                label="ประเภทขยะหลัก"
                                name="vaw_wasteType"
                                value={formData.vaw_wasteType}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CategoryIcon sx={{ color: themeColors.secondary }} />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                {WASTE_TYPES.map((w) => (
                                    <MenuItem key={w.id} value={w.id} sx={{ fontFamily: 'Sarabun' }}>
                                        {w.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* 3. Sub Waste Type (Conditional) */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                required={formData.vaw_wasteType === "5"} // Required only if Recycle
                                fullWidth
                                label="ประเภทวัสดุรีไซเคิล"
                                name="vaw_subWasteType"
                                value={formData.vaw_subWasteType}
                                onChange={handleChange}
                                disabled={formData.vaw_wasteType !== "5"}
                                sx={{ 
                                    backgroundColor: formData.vaw_wasteType === "5" ? "#E8F5E9" : "#FAFAFA" 
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <RecycleIcon sx={{ color: formData.vaw_wasteType === "5" ? themeColors.primary : 'grey.400' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                <MenuItem value="" disabled>
                                    <em>{formData.vaw_wasteType === "5" ? "-- เลือกประเภท --" : "-- ไม่ระบุ --"}</em>
                                </MenuItem>
                                {SUB_WASTE_TYPES.map((s) => (
                                    <MenuItem key={s.id} value={s.id} sx={{ fontFamily: 'Sarabun' }}>
                                        {s.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* 4. Weight */}
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="ปริมาณขยะ (กิโลกรัม)"
                                name="vaw_wasteTotal"
                                type="number"
                                placeholder="เช่น 1.5"
                                inputProps={{ step: "0.01", min: "0" }}
                                value={formData.vaw_wasteTotal}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ScaleIcon sx={{ color: themeColors.accent }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: <InputAdornment position="end">กก.</InputAdornment>,
                                }}
                            />
                        </Grid>

                        {/* 5. Description */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="รายละเอียดเพิ่มเติม (ถ้ามี)"
                                name="vaw_description"
                                placeholder="เช่น ฝากวางไว้หน้าบ้าน, ใส่ถุงดำมัดปากถุงแล้ว"
                                value={formData.vaw_description}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DescriptionIcon sx={{ color: 'grey.500', mt: -2.5 }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Buttons */}
                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<ResetIcon />}
                                    onClick={resetForm}
                                    sx={{ borderRadius: 2, textTransform: 'none', fontFamily: 'Sarabun' }}
                                >
                                    ล้างข้อมูล
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                    disabled={submitting}
                                    sx={{
                                        px: 4,
                                        py: 1,
                                        borderRadius: 2,
                                        backgroundColor: themeColors.primary,
                                        color: "white",
                                        fontWeight: "bold",
                                        fontFamily: 'Sarabun',
                                        textTransform: 'none',
                                        "&:hover": { backgroundColor: "#1B3A30" },
                                    }}
                                >
                                    {submitting ? "กำลังบันทึก..." : "ยืนยันการบันทึก"}
                                </Button>
                            </Box>
                        </Grid>

                    </Grid>
                </form>
            </CardContent>
        </Card>

      </Container>

      <Footer />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%', fontFamily: 'Sarabun', boxShadow: 3 }}>
            บันทึกข้อมูลสำเร็จ! กำลังไปยังหน้ารายการ...
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AddingWasteVillager;