// WeightByDateChart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer,
} from "recharts";
// Import MUI
import { Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { Timeline as TimelineIcon } from '@mui/icons-material';

// 🎨 สีของประเภทขยะแต่ละชนิด (คงเดิม)
const wasteTypeColors = {
    ขยะเปื้อน: "#8884d8",
    ขยะห้องน้ำ: "#82ca9d",
    ขยะพลังงาน: "#ffc658",
    ขยะอันตราย: "#ff7300",
    ขยะย่อยสลาย: "#bada55",
    ขยะชิ้นใหญ่: "#00c49f",
    "วัสดุรีไซเคิล - ขวดแก้ว": "#ff8042",
    "วัสดุรีไซเคิล - ขวดพลาสติกใส": "#a28bd4",
    "วัสดุรีไซเคิล - เหล็ก/โลหะ/สังกะสี/กระป๋องอลูมิเนียม": "#8d6e63",
    "วัสดุรีไซเคิล - กระดาษ": "#8d6e65",
    // ... เพิ่มสีอื่น ๆ หากมี
};

const WeightByDateChart = ({ locationId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    // ... (logic fetchChartData คงเดิม)

    useEffect(() => {
        const fetchChartData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/weight-by-date/${locationId}`);
                const raw = res.data.results;

                const grouped = {};

                raw.forEach(({ date, waste_type, sub_waste_type, weight }) => {
                    const formattedDate = dayjs(date).format("DD/MM/YYYY");

                    if (!grouped[formattedDate]) {
                        grouped[formattedDate] = { date: formattedDate, total: 0 };
                    }

                    let displayType = waste_type;
                    if (waste_type === "วัสดุรีไซเคิล" && sub_waste_type) {
                        displayType = `${waste_type} - ${sub_waste_type}`;
                    }

                    grouped[formattedDate][displayType] = weight;
                    grouped[formattedDate].total += weight;
                });

                const transformed = Object.values(grouped).sort((a, b) => new Date(dayjs(a.date, "DD/MM/YYYY").format("YYYY-MM-DD")) - new Date(dayjs(b.date, "DD/MM/YYYY").format("YYYY-MM-DD"))); // เรียงตามวันที่
                // const transformed = Object.values(grouped).sort((a, b) => b.total - a.total); // เรียงตาม total (โค้ดเดิม)

                setData(transformed);
            } catch (err) {
                console.error(err);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        if (locationId) {
            fetchChartData();
        }
    }, [locationId]);

    const availableWasteTypes = [
        ...new Set(
            data.flatMap((d) => Object.keys(d).filter((key) => key !== "date" && key !== "total"))
        ),
    ].sort(); // เรียงประเภทขยะ

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#333', display: 'flex', alignItems: 'center' }}>
                <TimelineIcon sx={{ mr: 1, color: '#0F766E' }} /> แนวโน้มปริมาณขยะตามวัน
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                    <CircularProgress />
                    <Typography ml={2}>กำลังโหลดข้อมูล...</Typography>
                </Box>
            ) : data.length === 0 ? (
                <Alert severity="info">ไม่มีข้อมูลการบันทึกขยะตามช่วงเวลาที่กำหนด</Alert>
            ) : (
                <Box height={400}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="date" />
                            <YAxis label={{ value: 'น้ำหนัก (กก.)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip
                                formatter={(value, name) => ([`${value} กก.`, name])}
                                itemSorter={(item) => -item.value}
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            {availableWasteTypes.map((type) => (
                                <Line
                                    key={type}
                                    type="monotone"
                                    dataKey={type}
                                    stroke={wasteTypeColors[type] || "#000"}
                                    name={type}
                                    connectNulls
                                    strokeWidth={2}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Paper>
    );
};

export default WeightByDateChart;