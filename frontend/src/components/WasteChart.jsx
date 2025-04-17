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

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const WasteChart = ({ data = [], options = {} }) => {
    const safeData = Array.isArray(data) ? data : [];

    const chartData = {
        labels: safeData.map(item => item.wasteType_name),
        datasets: [
            {
                data: safeData.map(item => item.total),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#FF9F40',
                    '#FFCD56',
                    '#36A2EB'
                ],
            },
        ],
    };

    // ไม่แสดงกราฟถ้าไม่มีข้อมูลเลย
    if (safeData.length === 0) {
        return <p className="text-muted">ไม่มีข้อมูลสำหรับแสดงกราฟ</p>;
    }

    return (
        <div>
            <h3>ประเภทขยะ</h3>
            <Pie
                data={chartData}
                options={options}
                style={{ maxWidth: '400px', margin: '0 auto' }}
            />
        </div>
    );
};

export default WasteChart;