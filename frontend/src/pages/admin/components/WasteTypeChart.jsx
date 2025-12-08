// WasteTypeChart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";
// Import MUI
import { Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { DonutLarge as DonutIcon } from '@mui/icons-material';

const defaultColorList = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8",
    "#A2D729", "#00ACC1", "#8D6E63", "#B0BEC5", "#4DB6AC", "#FF66CC"
];

// 🎨 ใช้สีมาตรฐานสำหรับประเภทขยะหลัก
const wasteColorMap = {
    "ขยะเปื้อน": "#8d6e63", // Brown
    "ขยะห้องน้ำ": "#4DB6AC", // Teal
    "ขยะพลังงาน": "#FFBB28", // Yellow
    "ขยะอันตราย": "#FF0000", // Red
    "วัสดุรีไซเคิล": "#00C49F", // Green-Cyan
    "ขยะย่อยสลาย": "#A2D729", // Light Green
    "ขยะชิ้นใหญ่": "#0088FE", // Blue
};

const WasteTypeChart = ({ locationIds }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalWeight, setTotalWeight] = useState(0);

    useEffect(() => {
        const fetchChartData = async () => {
            if (!locationIds) return;

            try {
                setLoading(true);
                const res = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/admin/waste-by-type/${locationIds}`
                );
                if (res.data.status?.toLowerCase() === "success") {
                    const rawData = res.data.results;

                    const total = rawData.reduce(
                        (sum, item) => sum + parseFloat(item.weight),
                        0
                    );
                    
                    const withPercent = rawData.map((item) => {
                        const weight = parseFloat(item.weight);
                        const percent = ((weight / total) * 100).toFixed(2);
                        const label = item.sub_waste_type
                            ? `${item.waste_type} - ${item.sub_waste_type}`
                            : item.waste_type;

                        return { ...item, weight, percent, label, wasteType: label };
                    });

                    setData(withPercent);
                    setTotalWeight(total);
                } else {
                    setData([]);
                }
            } catch (err) {
                console.error("Error fetching waste type data:", err);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [locationIds]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { label, weight, percent } = payload[0].payload;
            return (
                <Box sx={{ backgroundColor: 'white', p: 1, border: '1px solid #ccc', borderRadius: 1, boxShadow: 1 }}>
                    <Typography variant="body2"><strong>{label}</strong></Typography>
                    <Typography variant="body2">น้ำหนัก: {weight.toFixed(2)} กก.</Typography>
                    <Typography variant="body2">คิดเป็น: {percent}%</Typography>
                </Box>
            );
        }
        return null;
    };

    // Render Label outside pie chart
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }) => {
        if (percent * 100 < 4) return null; // ไม่แสดง Label ถ้า % น้อยกว่า 4%
        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 30;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="#333" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                {`${payload.label} (${(percent * 100).toFixed(1)}%)`}
            </text>
        );
    };

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#333', display: 'flex', alignItems: 'center' }}>
                <DonutIcon sx={{ mr: 1, color: '#0F766E' }} /> สัดส่วนประเภทขยะรวมทั้งหมด
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                <strong>น้ำหนักรวม:</strong> {totalWeight.toFixed(2)} กก.
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                    <CircularProgress />
                    <Typography ml={2}>กำลังโหลดข้อมูล...</Typography>
                </Box>
            ) : data.length === 0 ? (
                <Alert severity="info">ไม่มีข้อมูลการจัดเก็บขยะในพื้นที่นี้</Alert>
            ) : (
                <Box height={400} display="flex" justifyContent="center">
                    {/* ResponsiveContainer ครอบ PieChart */}
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="weight"
                                nameKey="label"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={120}
                                fill="#8884d8"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                paddingAngle={5}
                            >
                                {data.map((entry, index) => {
                                    // ใช้สีจาก wasteColorMap ถ้าเป็นประเภทหลัก หรือใช้ defaultColorList
                                    const color = wasteColorMap[entry.waste_type] || defaultColorList[index % defaultColorList.length];
                                    return <Cell key={`cell-${index}`} fill={color} />;
                                })}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            {/* Legend สำหรับแสดงรายการและสี */}
                            <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ paddingLeft: '20px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Paper>
    );
};

export default WasteTypeChart;