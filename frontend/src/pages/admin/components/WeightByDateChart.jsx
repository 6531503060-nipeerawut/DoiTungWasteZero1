import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 🎨 สีของประเภทขยะแต่ละชนิด
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
};

const WeightByDateChart = ({ locationId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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

          // ✅ ใช้ชื่อรวม waste_type + sub_waste_type ถ้าเป็นวัสดุรีไซเคิล
          let displayType = waste_type;
          if (waste_type === "วัสดุรีไซเคิล" && sub_waste_type) {
            displayType = `${waste_type} - ${sub_waste_type}`;
          }

          grouped[formattedDate][displayType] = weight;
          grouped[formattedDate].total += weight;
        });

        const transformed = Object.values(grouped).sort((a, b) => b.total - a.total);

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

  // 🔍 หาเฉพาะประเภทขยะที่มีข้อมูลจริง
  const availableWasteTypes = [
    ...new Set(
      data.flatMap((d) => Object.keys(d).filter((key) => key !== "date"))
    ),
  ];

  return (
    <div className="mb-6">
      <h2 className="text-xl mb-2">ปริมาณขยะแต่ละวัน</h2>

      {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : data.length === 0 ? (
        <p>ไม่มีข้อมูลสำหรับพื้นที่นี้</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
          >
            <CartesianGrid stroke="#ccc" />
            <XAxis
              dataKey="date"
              padding={{ left: 50, right: 50 }}
            />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [`${value} กก.`, name]}
              itemSorter={(item) => -item.value}
            />
            <Legend />
            {availableWasteTypes.map((type) => (
              <Line
                key={type}
                type="monotone"
                dataKey={type}
                stroke={wasteTypeColors[type] || "#000"}
                name={type}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default WeightByDateChart;