// AddingWasteCollector.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Footer from "./components/Footer";
import Header from "./components/Header";
import UnauthorizedMessage from "../../components/UnauthorizedMessage";

// MUI Components
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Alert,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

// MUI Icons
import {
  Save as SaveIcon,
  Clear as ClearIcon,
  CalendarToday as CalendarIcon,
  Scale as ScaleIcon,
  Place as PlaceIcon,
  Description as DescriptionIcon,
  Business as BusinessIcon,
  HomeWork as HomeWorkIcon,
  UploadFile as UploadFileIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";

axios.defaults.withCredentials = true;

function AddingWasteCollector() {
  document.title = "บันทึกขยะ (เจ้าหน้าที่) - DoiTung Zero-Waste";

  const navigate = useNavigate();

  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [collId, setCollId] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // --- Excel Upload States ---
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);

  const [formData, setFormData] = useState({
    caw_date: new Date().toISOString().split("T")[0],
    caw_wasteType: "",
    caw_subWasteType: "",
    caw_wasteTotal: "",
    caw_description: "",
    caw_location: "",
  });

  const [locations, setLocations] = useState([]);
  const [locationType, setLocationType] = useState("village");
  const [error, setError] = useState("");

  const formatThaiDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const displayDate = formatThaiDate(formData.caw_date);

  // Fetch Locations
  const fetchLocations = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/c/locations?village=${
          locationType === "village"
        }`,
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
      console.error(err);
      setError("Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  }, [locationType]);

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
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationTypeChange = (event, newType) => {
    if (newType !== null) {
      setLocationType(newType);
      setFormData((prev) => ({ ...prev, caw_location: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

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
        setOpenSnackbar(true);
        setTimeout(() => navigate("/c/dashboard"), 1500);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      caw_date: new Date().toISOString().split("T")[0],
      caw_wasteType: "",
      caw_subWasteType: "",
      caw_wasteTotal: "",
      caw_description: "",
      caw_location: "",
    });
    setError("");
  };

  // --- Excel Upload Handlers ---
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setExcelFile(e.target.files[0]);
      setUploadMessage(null);
    }
  };

  const handleUploadConfirm = async () => {
  if (!excelFile) return;
  
  setUploading(true);
  setUploadMessage(null);

  const data = new FormData();
  data.append("file", excelFile);

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/c/upload-excel`,
      data,
      {
        withCredentials: true,
        // ❌ อย่าใส่ headers: { "Content-Type": "multipart/form-data" }
      }
    );

    setUploadMessage({
      type: 'success',
      text: `อัปโหลดสำเร็จ: ${response.data.message}`,
    });

    setTimeout(() => {
      setShowUploadPopup(false);
      setExcelFile(null);
      setUploadMessage(null);
    }, 2000);

  } catch (err) {
    console.error(err);
    const errorMsg =
      err.response?.data?.error ||
      "การอัปโหลดล้มเหลว กรุณาตรวจสอบไฟล์และลองใหม่อีกครั้ง";
    setUploadMessage({ type: "error", text: errorMsg });
  } finally {
    setUploading(false);
  }
};

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#F1F5F9",
      }}
    >
      {auth ? (
        <>
          <Header collId={collId} />

          <Container maxWidth="md" sx={{ mt: 4, mb: 12, flexGrow: 1 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Box mb={4} textAlign="center">
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "#0F766E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <ScaleIcon fontSize="large" /> บันทึกน้ำหนักขยะ
                </Typography>
                <Typography variant="body1" color="text.secondary" mt={1}>
                  กรอกข้อมูลขยะที่จัดเก็บได้จากจุดรับทิ้งต่างๆ
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Location & Date */}
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      color="text.primary"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <PlaceIcon sx={{ mr: 1, color: "#64748B" }} /> ข้อมูลสถานที่
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="วันที่บันทึก"
                      value={displayDate}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      sx={{ bgcolor: "#F8FAFC" }}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    display="flex"
                    justifyContent="center"
                  >
                    <ToggleButtonGroup
                      value={locationType}
                      exclusive
                      onChange={handleLocationTypeChange}
                      aria-label="location type"
                      fullWidth
                    >
                      <ToggleButton value="village">
                        <HomeWorkIcon sx={{ mr: 1 }} /> หมู่บ้าน
                      </ToggleButton>
                      <ToggleButton value="agency">
                        <BusinessIcon sx={{ mr: 1 }} /> หน่วยงาน
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>เลือกสถานที่จัดเก็บ</InputLabel>
                      <Select
                        name="caw_location"
                        value={formData.caw_location}
                        onChange={handleChange}
                        label="เลือกสถานที่จัดเก็บ"
                      >
                        {locations.map((loc) => (
                          <MenuItem key={loc.id} value={loc.id}>
                            {loc.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Waste Details */}
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography
                      variant="h6"
                      color="text.primary"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <ScaleIcon sx={{ mr: 1, color: "#64748B" }} />{" "}
                      รายละเอียดขยะ
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>ประเภทขยะหลัก</InputLabel>
                      <Select
                        name="caw_wasteType"
                        value={formData.caw_wasteType}
                        onChange={handleChange}
                        label="ประเภทขยะหลัก"
                      >
                        <MenuItem value="1">01 ขยะเปื้อน</MenuItem>
                        <MenuItem value="2">02 ขยะห้องน้ำ</MenuItem>
                        <MenuItem value="3">03 ขยะพลังงาน</MenuItem>
                        <MenuItem value="4">04 ขยะอันตราย</MenuItem>
                        <MenuItem value="5">05 วัสดุรีไซเคิล</MenuItem>
                        <MenuItem value="6">06 ขยะย่อยสลาย</MenuItem>
                        <MenuItem value="7">07 ขยะชิ้นใหญ่</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {formData.caw_wasteType === "5" && (
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>ประเภทขยะย่อย (รีไซเคิล)</InputLabel>
                        <Select
                          name="caw_subWasteType"
                          value={formData.caw_subWasteType}
                          onChange={handleChange}
                          label="ประเภทขยะย่อย (รีไซเคิล)"
                        >
                          <MenuItem value="1">01 ขวดแก้ว</MenuItem>
                          <MenuItem value="2">02 ขวดพลาสติกใส</MenuItem>
                          <MenuItem value="3">03 โลหะ/กระป๋อง</MenuItem>
                          <MenuItem value="4">04 กระดาษ</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  <Grid
                    item
                    xs={12}
                    md={formData.caw_wasteType === "5" ? 12 : 6}
                  >
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label="น้ำหนักขยะ (กิโลกรัม)"
                      name="caw_wasteTotal"
                      value={formData.caw_wasteTotal}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*(\.\d{0,2})?$/.test(value)) handleChange(e);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            กก.
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="รายละเอียดเพิ่มเติม / หมายเหตุ"
                      name="caw_description"
                      value={formData.caw_description}
                      onChange={handleChange}
                      placeholder="เช่น สภาพขยะ, ปัญหาที่พบ..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon
                              color="action"
                              sx={{ mt: -3 }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Action Buttons */}
                  <Grid
                    item
                    xs={12}
                    display="flex"
                    justifyContent="flex-end"
                    gap={2}
                    mt={2}
                  >
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={resetForm}
                      startIcon={<ClearIcon />}
                      size="large"
                    >
                      ล้างข้อมูล
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={submitting}
                      startIcon={
                        submitting ? (
                          <CircularProgress size={20} />
                        ) : (
                          <SaveIcon />
                        )
                      }
                    >
                      {submitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Container>

          {/* --- FAB Button to Open Upload Popup --- */}
          <Box
            sx={{
              position: "fixed",
              bottom: 100,
              right: 20,
              zIndex: 1000,
            }}
          >
            <Fab
              color="secondary"
              variant="extended"
              onClick={() => setShowUploadPopup(true)}
              sx={{
                bgcolor: "#D4AF37",
                color: "#1A3C34",
                fontWeight: "bold",
                boxShadow: 4,
                "&:hover": { bgcolor: "#C09E30" },
              }}
            >
              <UploadFileIcon sx={{ mr: 1 }} />
              นำเข้า Excel
            </Fab>
          </Box>

          {/* --- Upload Excel Popup Dialog --- */}
          <Dialog
            open={showUploadPopup}
            onClose={() => setShowUploadPopup(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle
              sx={{
                bgcolor: "#F1F5F9",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <Box display="flex" alignItems="center">
                <CloudUploadIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  อัปโหลดไฟล์ Excel
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                p={4}
                border="2px dashed #CBD5E1"
                borderRadius={2}
                bgcolor="#FAFAFA"
                mt={2}
              >
                <input
                  accept=".xlsx,.xls"
                  style={{ display: "none" }}
                  id="popup-upload-excel"
                  type="file"
                  onChange={handleFileSelect}
                />
                <label htmlFor="popup-upload-excel">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadFileIcon />}
                  >
                    เลือกไฟล์
                  </Button>
                </label>

                {excelFile && (
                  <Typography variant="body1" mt={2} fontWeight="bold">
                    ไฟล์ที่เลือก: {excelFile.name}
                  </Typography>
                )}

                {!excelFile && (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    รองรับไฟล์ .xlsx หรือ .xls (รูปแบบตารางตามกำหนด)
                  </Typography>
                )}
              </Box>

              {uploadMessage && (
                <Alert severity={uploadMessage.type} sx={{ mt: 2 }}>
                  {uploadMessage.text}
                </Alert>
              )}
            </DialogContent>
            <DialogActions
              sx={{ p: 2, borderTop: "1px solid #E2E8F0" }}
            >
              <Button
                onClick={() => setShowUploadPopup(false)}
                color="inherit"
              >
                ปิด
              </Button>
              <Button
                onClick={handleUploadConfirm}
                variant="contained"
                color="primary"
                disabled={!excelFile || uploading}
                startIcon={
                  uploading && (
                    <CircularProgress size={20} color="inherit" />
                  )
                }
              >
                {uploading ? "กำลังอัปโหลด..." : "ยืนยันการอัปโหลด"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={1500}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setOpenSnackbar(false)}
              severity="success"
              sx={{ width: "100%", boxShadow: 3 }}
            >
              การบันทึกข้อมูลเสร็จสมบูรณ์
            </Alert>
          </Snackbar>

          <Footer />
        </>
      ) : (
        <UnauthorizedMessage message={message} />
      )}
    </div>
  );
}

export default AddingWasteCollector;