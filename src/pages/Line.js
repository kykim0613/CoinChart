import { Chart } from "chart.js";
import { useEffect, useRef, useState } from "react";

const ChartComponent = () => {
    const chartRef = useRef(null)
    const [chartInstance, setChartInstance] = useState(null)

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        const newChartInstance = new Chart(ctx, {
            type: 'line',
            data: initialData,
            options: {}
        });
        setChartInstance(newChartInstance)

        return() => {
            if(chartInstance) {
                chartInstance.destroy();
            }
        }
    }, [initialData])

    const updateChartData = (newData) => {
        if(chartInstance) {
            chartInstance.data = newData
            chartInstance.update()
        }
    }

    return(
        <canvas ref={chartRef}></canvas>
    )  
}
export default ChartComponent;