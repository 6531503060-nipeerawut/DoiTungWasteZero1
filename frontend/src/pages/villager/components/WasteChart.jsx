import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const WasteChart = ({ data, options }) => {
    const chartData = {
        labels: data.map(item => item.wasteType_name),
        datasets: [
            {
                data: data.map(item => item.total),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
            },
        ],
    };

    return (
        <div>
            <h3>ประเภทขยะ</h3>
            <Pie data={chartData}
                options={options}
                style={{ width: '5px', height: '5px' }} />
        </div>
    );
};

export default WasteChart;