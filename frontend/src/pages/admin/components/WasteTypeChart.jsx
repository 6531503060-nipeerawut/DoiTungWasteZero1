import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const defaultColorList = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8",
  "#A2D729", "#00ACC1", "#8D6E63", "#B0BEC5", "#4DB6AC", "#FF66CC"
];

const wasteColorMap = {
  "ขยะอันตราย": "#FF0000",
  "ขยะชิ้นใหญ่": "#0088FE",
  "ขยะรีไซเคิล": "#00C49F",
  "ขยะเปียก": "#FFBB28",
  "ขยะทั่วไป": "#FF8042",
  "ขยะอิเล็กทรอนิกส์": "#8884d8",
  "ขยะอินทรีย์": "#A2D729",
  "ขยะพลาสติก": "#00ACC1",
  "ขยะกระดาษ": "#8D6E63",
  "ขยะโลหะ": "#B0BEC5",
  "ขยะแก้ว": "#4DB6AC"
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

          // ✅ คำนวณ total และเพิ่ม % ในแต่ละหมวด
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

            return { ...item, weight, percent, label };
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

  // ✅ กำหนดให้ tooltip แสดงเฉพาะที่ต้องการ
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { label, weight, percent } = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p>
            <strong>{label}</strong>
          </p>
          <p>น้ำหนัก: {weight} กก.</p>
          <p>คิดเป็น: {percent}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl mb-2">ประเภทขยะรวมทั้งหมด</h2>
      <p className="mt-2">
            <strong>น้ำหนักรวม:</strong> {totalWeight.toFixed(2)} กก.
          </p>

      {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : data.length === 0 ? (
        <p>ไม่มีข้อมูลสำหรับพื้นที่นี้</p>
      ) : (
        <>
          <PieChart width={1000} height={400}>
            <Pie
              data={data}
              dataKey="weight"
              nameKey="waste_type"
              cx="50%"
              cy="50%"
              outerRadius={100}
              labelLine={false}
              label={({ payload }) => `${payload.label} (${payload.percent}%)`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={wasteColorMap[entry.wasteType] || defaultColorList[index % defaultColorList.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </>
      )}
    </div>
  );
};

export default WasteTypeChart;
