import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { useRecoilValue } from "recoil";
import { ChangeBtn, blackMode, selectedValue } from "../atom";
import groupedArray from "../components/groupedCoin/groupedArray";
import { sortXAxis } from "../components/axis/sortXAxis";
import transArray from "../components/groupedCoin/transArray";
import Slider from "../components/Slider";
Chart.register(zoomPlugin);

const LineChart = ({ coin, xAxis }) => {
  const [change, setChange] = useState(true);
  const value = useRecoilValue(selectedValue);
  const mode = useRecoilValue(blackMode);
  Chart.defaults.color = `${mode ? "#ddd" : "#333"}`;

  const dataArray1 = groupedArray(coin.b, xAxis);
  const dataArray2 = groupedArray(coin.u, xAxis);
  const data = transArray(dataArray1, dataArray2, change);

  const toFixedArray = (array) => {
    return array.map((fix) => fix.toFixed(0));
  };

  const lineChart = {
    labels: xAxis,
    datasets: [
      {
        label: `Upbit`,
        data: sortXAxis(data.u.axis, data.u.price),
        fill: false,
        borderColor: "#005ca7",
        backgroundColor: "#005ca7",
        tension: 0,
        yAxisID: "left-axis",
      },
      {
        label: `Binance`,
        data: sortXAxis(data.b.axis, data.b.price),
        fill: false,
        borderColor: "#fcd905",
        backgroundColor: "#fcd905",
        tension: 0,
        yAxisID: "left-axis",
      },
      {
        label: `Binance Volume`,
        data: sortXAxis(data.b.axis, toFixedArray(data.b.volume)),
        fill: false,
        backgroundColor: "rgba(252, 217, 5, 0.5)",
        tension: 0.1,
        type: "bar",
      },
      {
        label: `Upbit Volume`,
        data: sortXAxis(data.u.axis, toFixedArray(data.u.volume)),
        fill: false,
        backgroundColor: "rgba(0, 92, 167, 0.5)",
        tension: 0.1,
        type: "bar",
      },
    ],
  };

  const LineOptions = {
    scales: {
      y: {
        display: false,
        position: "left",
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        tension: 0,
      },
    },
    animation: {
      duration: 0,
    },
    hover: {
      animationDuration: 0,
    },
    responsiveAnimationDuration: 0,
    interaction: {
      intersect: false,
      mode: "x",
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            if (change === true) {
              if (
                context.dataset.label === "Upbit" ||
                context.dataset.label === "Binance"
              ) {
                return context.dataset.label + ": " + context.parsed.y + "%";
              }
            }
          },
        },
      },
      legend: {
        labels: {
          filter: function (legendItem) {
            return (
              legendItem.text !== "Binance Volume" &&
              legendItem.text !== "Upbit Volume"
            );
          },
        },
      },
    },
  };

  const handleChangeBtn = () => {
    setChange(!change);
  };

  return (
    <>
      <Slider />
      {value}
      <Line data={lineChart} options={LineOptions} />
      <ChangeBtn active={mode} onClick={() => handleChangeBtn(coin)}>
        {change ? "원화로 보기" : "등락률로 보기"}
      </ChangeBtn>
    </>
  );
};

export default React.memo(LineChart);
