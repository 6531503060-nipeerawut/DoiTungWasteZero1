// components/WasteChart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale
} from 'chart.js';
import { Box, Typography } from '@mui/material'; // ใช้ MUI แทน Bootstrap

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const WasteChart = ({ data = [], options = {} }) => {
    const safeData = Array.isArray(data) ? data : [];

    // --- ชุดสีธีมธรรมชาติ (Earth Tones & MFLF Theme) ---
    const earthTonePalette = [
        '#2E5D4B', // Forest Green (สีหลัก)
        '#D4AF37', // Gold (สีรอง)
        '#8D6E63', // Earth Brown (สีดิน)
        '#558B2F', // Leaf Green (สีใบไม้)
        '#F57F17', // Autumn Orange (สีส้มอิฐ)
        '#455A64', // Slate Grey (สีหิน)
        '#00695C', // Teal (เขียวน้ำทะเลลึก)
        '#795548', // Dark Brown
        '#C0CA33'  // Lime
    ];

    const chartData = {
        labels: safeData.map(item => item.wasteType_name),
        datasets: [
            {
                data: safeData.map(item => item.total),
                backgroundColor: earthTonePalette, // ใช้สีธีมใหม่
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 10
            },
        ],
    };

    // กรณีไม่มีข้อมูล
    if (safeData.length === 0) {
        return (
            <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="center" 
                height="100%" 
                color="text.secondary"
            >
                <Typography variant="body1" sx={{ fontFamily: 'Sarabun' }}>
                    ไม่มีข้อมูลสำหรับแสดงกราฟ
                </Typography>
            </Box>
        );
    }

    return (
        /* คืนค่า Pie Chart เพียวๆ ตามที่ต้องการ 
           เพื่อให้ Parent Component (Box ใน Dashboard) ควบคุมขนาดได้ 100% 
        */
        <Pie data={chartData} options={options} />
    );
};

export default WasteChart;