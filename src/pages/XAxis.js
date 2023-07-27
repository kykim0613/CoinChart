import React, { useEffect, useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import styled from "styled-components"
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import LineChart from "./LineChart";
Chart.register(zoomPlugin)

const VolumeContainer = styled.div`
  width: 100vh;
  position: absolute;
  left: 50%;
  transform: translateX(-50%)
`

const graphPointCount = 100;

const XAxis = ({ selected, selectedStart, selectedEnd, startTime, endTime }) => {
    const [xAxis, setXAxis] = useState([])

    useEffect(() => {
        createXAxis();
    },[selected, selectedStart, selectedEnd, startTime, endTime])

    function createXAxis() {
        const runTime = new Date();

        // yyyymmddhhmmss 형태로 만듬.
        const startDateTime = Number(selectedStart) * 10000 + Number(startTime);
        const endDateTime = Number(selectedEnd) * 10000 + Number(endTime);

        // year, month, day, hour, min 으로 쪼갬
        const st = parseNumberTime(startDateTime);
        const et = parseNumberTime(endDateTime);

        // date 객체로 만듬.
        const startDate = new Date(st.year, st.month - 1, st.day, st.hour, st.min);
        const endDate = new Date(et.year, et.month - 1, et.day, et.hour, et.min);

        // 기간의 전체 분을 구함
        const totalMinute = (endDate - startDate) / (60 * 1000);

        // 그래프상 점과 점 사이의 간격을 구함.
        // 단위는 분.
        // 1보다 작지 않도록 조정
        // 시작점과 끝점을 강제로 넣기 때문에 graphPointCount 에서 1을 빼줌
        const interval = Math.max(totalMinute / (graphPointCount - 1), 1);
        // console.log(`totalMinute:${totalMinute}, graphPointCount:${graphPointCount}, interval:${interval}`)

        const xAxisSet = new Set();
        xAxisSet.add(startDateTime); // 시작점 추가

        let tempMinute = 0;
        let tempDate = startDate;
        while (tempDate < endDate) {
            tempDate = new Date(startDate.getTime());
            tempDate.setMinutes(startDate.getMinutes() + Math.ceil(tempMinute += interval));

            const tempNumberDate = dateToNumberDate(tempDate);
            if (tempNumberDate < endDateTime) {
                xAxisSet.add(tempNumberDate);
            }
        }

        xAxisSet.add(endDateTime); // 끝점 추가
        setXAxis(Array.from(xAxisSet));
        console.log(`create xAxis Time:${new Date() - runTime}`)
    }

    const parseNumberTime = (numberTime) => {
        const year = numberTime / 100000000 | 0
        const month = numberTime / 1000000 % 100 | 0
        const day = numberTime / 10000 % 100 | 0
        const hour = numberTime / 100 % 100 | 0
        const min = numberTime % 100 | 0
        return { year: year, month: month, day: day, hour: hour, min: min }
    }

    function dateToNumberDate(tempDate) {
        return tempDate.getFullYear() * 100000000
            + (tempDate.getMonth() + 1) * 1000000
            + tempDate.getDate() * 10000
            + tempDate.getHours() * 100
            + tempDate.getMinutes();
    }



    return (
        <>
            <VolumeContainer>
                <LineChart selectedStart={selectedStart} selectedEnd={selectedEnd} selected={selected} startTime={startTime} endTime={endTime} xAxis={xAxis} />
            </VolumeContainer>
        </>
    )
}

export default XAxis;