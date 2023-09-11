import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { useRecoilValue } from "recoil";
import {
  ChangeBtn,
  blackMode,
  selectedValue,
} from "../atom";
import groupedArray from "../components/groupedCoin/groupedArray";
import { sortXAxis } from "../components/axis/sortXAxis";
import transArray from "../components/groupedCoin/transArray";
import Slider from "../components/Slider";
Chart.register(zoomPlugin);

const LineChart = ({ coin, xAxis }) => {
  const [array, setArray] = useState({
    b: {
      price: [],
      volume: [],
      axis: [],
    },
    u: {
      price: [],
      volume: [],
      axis: [],
    },
  });
  const [change, setChange] = useState(true);
  const value = useRecoilValue(selectedValue);
  const mode = useRecoilValue(blackMode);
  Chart.defaults.color = `${mode ? "#ddd" : "#333"}`;


  //호출된 api가 저장됐을 때 실행 or x축만 변경되었을 때 실행
  useEffect(() => {
    organizedData(coin);
  }, [coin, xAxis, change]);

  const organizedData = (coin) => {
    const dataArray2 = groupedArray(coin.u, xAxis);
    const dataArray1 = groupedArray(coin.b, xAxis);

    //세 가지 값 리턴
    setArray(transArray(dataArray1, dataArray2, change));
  };

  const toFixedArray = (array) => {
    return array.map((fix) => fix.toFixed(0));
  };

  const lineChart = {
    labels: xAxis,
    datasets: [
      {
        label: `Upbit`,
        data: sortXAxis(array.u.axis, array.u.price),
        fill: false,
        borderColor: "#005ca7",
        backgroundColor: "#005ca7",
        tension: 0,
        yAxisID: "left-axis",
      },
      {
        label: `Binance`,
        data: sortXAxis(array.b.axis, array.b.price),
        fill: false,
        borderColor: "#fcd905",
        backgroundColor: "#fcd905",
        tension: 0,
        yAxisID: "left-axis",
      },
      {
        label: `Binance Volume`,
        data: sortXAxis(array.b.axis, toFixedArray(array.b.volume)),
        fill: false,
        backgroundColor: "rgba(252, 217, 5, 0.5)",
        tension: 0.1,
        type: "bar",
      },
      {
        label: `Upbit Volume`,
        data: sortXAxis(array.u.axis, toFixedArray(array.u.volume)),
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

  const handleChangeBtn = (coin) => {
    setArray(
      transArray(
        groupedArray(coin.b, xAxis),
        groupedArray(coin.u, xAxis),
        change
      )
    );
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
