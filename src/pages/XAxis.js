import React, { useEffect, useState } from "react"
import styled from "styled-components"
import LineChart from "./LineChart";
import { useRecoilState, useRecoilValue } from "recoil";
import { loading, selectedValue } from "../atom";

const VolumeContainer = styled.div`
  width: 100vh;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`

const XAxis = ({ selected, start, end }) => {
    const [xAxis, setXAxis] = useState([])
    const [rerendering, setRerendering] = useState([])
    const value = useRecoilValue(selectedValue)
    const [loader, setLoader] = useRecoilState(loading)

    // yyyymmddhhmmss 형태로 만듬.

    useEffect(() => {
        createXAxis(start, end);
    }, [selected, start, end])

    useEffect(() => {
        rerenderingXAxis(start, end)
    }, [value])

    function createXAxis(start, end) {
        const runTime = new Date();

        // year, month, day, hour, min 으로 쪼갬
        const st = parseNumberTime(start);
        const et = parseNumberTime(end);

        // date 객체로 만듬.
        const startDate = new Date(st.year, st.month - 1, st.day, st.hour, st.min);
        const endDate = new Date(et.year, et.month - 1, et.day, et.hour, et.min);

        // 기간의 전체 분을 구함
        const totalMinute = (endDate - startDate) / (60 * 1000);

        // 그래프상 점과 점 사이의 간격을 구함.
        // 단위는 분.
        // 1보다 작지 않도록 조정
        // 시작점과 끝점을 강제로 넣기 때문에 value 에서 1을 빼줌
        const interval = Math.max(totalMinute / (value - 1), 1);
        // console.log(`totalMinute:${totalMinute}, value:${value}, interval:${interval}`)

        const xAxisSet = new Set();
        xAxisSet.add(start); // 시작점 추가

        let tempMinute = 0;
        let tempDate = startDate;
        while (tempDate < endDate) {
            tempDate = new Date(startDate.getTime());
            tempDate.setMinutes(startDate.getMinutes() + Math.ceil(tempMinute += interval));

            const tempNumberDate = dateToNumberDate(tempDate);
            if (tempNumberDate < end) {
                xAxisSet.add(tempNumberDate);
            }
        }

        xAxisSet.add(end); // 끝점 추가
        setXAxis(Array.from(xAxisSet));
        setRerendering(Array.from(xAxisSet))
        console.log(`create xAxis Time:${new Date() - runTime}, Size:${xAxisSet.size}`)
    }

    //createXAxis를 이용해 x축만 바꿔주는 함수
    function rerenderingXAxis(start, end) {
        const runTime = new Date();

        const st = parseNumberTime(start);
        const et = parseNumberTime(end);

        const startDate = new Date(st.year, st.month - 1, st.day, st.hour, st.min);
        const endDate = new Date(et.year, et.month - 1, et.day, et.hour, et.min);

        const totalMinute = (endDate - startDate) / (60 * 1000);

        const interval = Math.max(totalMinute / (value - 1), 1);

        const xAxisSet = new Set();
        xAxisSet.add(start);

        let tempMinute = 0;
        let tempDate = startDate;
        while (tempDate < endDate) {
            tempDate = new Date(startDate.getTime());
            tempDate.setMinutes(startDate.getMinutes() + Math.ceil(tempMinute += interval));

            const tempNumberDate = dateToNumberDate(tempDate);
            if (tempNumberDate < end) {
                xAxisSet.add(tempNumberDate);
            }
        }

        xAxisSet.add(end);
        setRerendering(Array.from(xAxisSet))
        console.log(`rerendering xAxis Time:${new Date() - runTime}, Size:${xAxisSet.size}`)
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
                <LineChart
                    start={start}
                    end={end}
                    selected={selected}
                    xAxis={xAxis}
                    rerendering={rerendering}
                />
            </VolumeContainer>
        </>
    )
}

export default React.memo(XAxis);