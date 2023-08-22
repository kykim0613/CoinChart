import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js/auto";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import XAxis from "./XAxis";
import { useRecoilState, useRecoilValue } from "recoil";
import { Controller, DateBtn, DateContainer, DateInput, Loader, blackMode, loading } from "../atom";
import ModeBtn from "../components/ModeBtn";
import { fetchData, fixTime, handleDateBtn, handleDateEnd, handleDateStart, handleEndMinusBtn, handleEndPlusBtn, handleHourBtn, handleMinBtn, handleMinus, handleMonthBtn, handlePlus, handleStartMinusBtn, handleStartPlusBtn, handleWeekBtn, inputDate, sliceDatefunc, sliceTimeFunc, toString } from "../handleDateModule";

const Market = styled.h1`
    width: 100px;
    height: 50px;
    margin: 0 auto;
    text-align:center;
`
const BtnContainer = styled.div`
    width: 155px;
    height:30px;
    border: 1px solid black;
    border-radius: 30px;
    text-align:center;
    line-height:30px;
    background-color:white;
`

const Main = () => {
    const [coinList, setCoinList] = useState([])
    const [btn, setBtn] = useState("min")
    const [selectedIndex, setselectedIndex] = useState(0)
    const [startDateInput, setStartDateInput] = useState(0)
    const [endDateInput, setEndDateInput] = useState(0)
    const [startTimeInput, setStartTimeInput] = useState(``)
    const [endTimeInput, setEndTimeInput] = useState(``)

    const [loader, setLoader] = useRecoilState(loading)
    const mode = useRecoilValue(blackMode)

    const startDate = sliceDatefunc(toString(new Date(startDateInput)))
    const endDate = sliceDatefunc(toString(new Date(endDateInput)))
    const startTime = sliceTimeFunc(startTimeInput)
    const endTime = sliceTimeFunc(endTimeInput)

    useEffect(() => {
        fetchData(setCoinList, setStartDateInput, setEndDateInput, setStartTimeInput, setEndTimeInput)
    }, [])

    // 코인 리스트에서 코인 선택
    const handleSelectChange = (e) => {
        setselectedIndex(e.target.selectedIndex)
    }

    // hh:mm input
    const handleTimeStart = (e) => {
        setLoader(true)
        const value = e.target.value

        if (Number(`${startDate}${sliceTimeFunc(value)}`) < Number(`${endDate}${endTime}`)) {
            setStartTimeInput(value)
        } else {
            alert(`종료시간은 시작시간보다 작을 수 없습니다.`)
        }

    }

    const handleTimeEnd = (e) => {
        setLoader(true)
        const value = e.target.value

        if (Number(`${startDate}${startTime}`) < Number(`${endDate}${sliceTimeFunc(end)}`)) {
            setEndTimeInput(value)
        } else {
            alert(`종료시간은 시작시간보다 작을 수 없습니다.`)
        }

    }

    const start = Number(`${startDate}${startTime}`)
    const end = Number(`${endDate}${endTime}`)
    const tickerListArray = coinList.map((ticker) => ticker.t.slice(4))

    const XAxisComponent = (
        <XAxis
            selected={tickerListArray[selectedIndex]}
            start={start}
            end={end}
            btn = {btn}
        />
    );

const handleMin = () => {
    handleMinBtn(setBtn, inputDate(coinList[selectedIndex].e - 100, coinList[selectedIndex].e, setStartDateInput, setEndDateInput, setStartTimeInput, setEndTimeInput))
}
const handleHour = () => {
    handleHourBtn(setBtn, inputDate(coinList[selectedIndex].e - 100, coinList[selectedIndex].e, setStartDateInput, setEndDateInput, setStartTimeInput, setEndTimeInput))
}
const handleDate = () => {
    handleDateBtn(setBtn, inputDate(coinList[selectedIndex].e - 10000, coinList[selectedIndex].e, setStartDateInput, setEndDateInput, setStartTimeInput, setEndTimeInput), fixTime(setStartTimeInput, setEndTimeInput))
}
const handleWeek = () => {
    handleWeekBtn(setBtn, inputDate(coinList[selectedIndex].e - 70000, coinList[selectedIndex].e, setStartDateInput, setEndDateInput, setStartTimeInput, setEndTimeInput), fixTime(setStartTimeInput, setEndTimeInput))
}
const handleMonth = () => {
    handleMonthBtn(setBtn, inputDate(coinList[selectedIndex].e - 1000000, coinList[selectedIndex].e, setStartDateInput, setEndDateInput, setStartTimeInput, setEndTimeInput), fixTime(setStartTimeInput, setEndTimeInput))
}

// start Date를 input 눌러 선택할 때
    const handlestartDate = (e) => {
        const value = e.target.value
        handleDateStart(btn, value, setStartDateInput, setEndDateInput, endDate, startTime, endTime)
    }
// end Date를 input 눌러 선택할 때
    const hanldeEndDate = (e) => {
        const value = e.target.value
        handleDateEnd(btn, value, setStartDateInput, setEndDateInput, startDate, startTime, endTime)
    }
// start Input만 빼는 버튼 컨트롤러
    const handleStartMinus = () => {
        handleStartMinusBtn(btn, startDateInput, startTimeInput, setStartTimeInput, setStartDateInput)
    }
// start Input만 더하는 버튼 컨트롤러
    const handleStartPlus = () => {
        handleStartPlusBtn(btn, startDateInput, startTimeInput, setStartTimeInput, setStartDateInput, endDate, endTime)
    }
// end Input만 빼는 버튼 컨트롤러
    const handleEndMinus =() => {
        handleEndMinusBtn(btn, endDateInput, endTimeInput, setEndDateInput, setEndTimeInput, startDate, startTime)
    }
// end Input만 더하는 버튼 컨트롤러
    const handleEndPlus = () => {
        handleEndPlusBtn(btn, endDateInput, endTimeInput, setEndDateInput, setEndTimeInput)
    }
//두 인풋에 동일하게 빼는 버튼
    const handleAllMinus = () => {
        handleMinus(btn, startDateInput, startTimeInput, setStartTimeInput, setEndTimeInput, setStartDateInput, setEndDateInput)
    }
//두 인풋에 동일하게 더하는 버튼
    const handleAllPlus = () => {
        handlePlus(btn, endDateInput, endTimeInput, setStartDateInput, setEndDateInput, setStartTimeInput, setEndTimeInput)
    }
    return (
        <>
            {loader && <Loader />}
            <select onChange={handleSelectChange}>
                {tickerListArray.map((option) => (
                    <option key={option}>{option}</option>
                ))}
            </select>
            <BtnContainer>
                <DateBtn active={btn === "min"} onClick={handleMin}>분</DateBtn>
                <DateBtn active={btn === "hour"} onClick={handleHour}>시</DateBtn>
                <DateBtn active={btn === "date"} onClick={handleDate}>일</DateBtn>
                <DateBtn active={btn === "week"} onClick={handleWeek}>주</DateBtn>
                <DateBtn active={btn === "month"} onClick={handleMonth}>월</DateBtn>
            </BtnContainer>
            <Market>
                {tickerListArray[selectedIndex]}
            </Market>
            <DateContainer>
                <DateInput
                    value={startDateInput}
                    onChange={handlestartDate}
                    type="date"
                />
                -
                <DateInput
                    value={endDateInput}
                    onChange={hanldeEndDate}
                    type="date"
                />
                <br />
                <DateInput
                    value={startTimeInput}
                    onChange={handleTimeStart}
                    type="time"
                />
                -
                <DateInput
                    value={endTimeInput}
                    onChange={handleTimeEnd}
                    type="time"
                />
                <br />
                <br />
                {/* 방향으로 시, 일, 주, 월 만큼 움직이는 버튼 */}
                Start / End
                <br />
                <Controller
                    active={mode}
                    onClick={handleStartMinus}
                    disabled={btn === "min"}
                >
                    ◀
                </Controller>
                <Controller
                    active={mode}
                    onClick={handleStartPlus}
                    disabled={btn === "min"}
                >
                    ▶
                </Controller>
                <Controller
                    active={mode}
                    onClick={handleEndMinus}
                    disabled={btn === "min"}
                >
                    ◀
                </Controller>
                <Controller
                    active={mode}
                    onClick={handleEndPlus}
                    disabled={btn === "min"}
                >
                    ▶
                </Controller>
                <br />
                <br />
                {/* 시, 일, 주, 월 단위로 움직이는 버튼 */}
                Start + End
                <br />
                <Controller
                    active={mode}
                    onClick={handleAllMinus}
                    disabled={btn === "min"}
                >
                    ◀◀
                </Controller>
                <Controller
                    active={mode}
                    onClick={handleAllPlus}
                    disabled={btn === "min"}
                >
                    ▶▶
                </Controller>
            </DateContainer>
            <br />
            {XAxisComponent}
            <br />
            <ModeBtn />
        </>
    )
}

export default React.memo(Main);