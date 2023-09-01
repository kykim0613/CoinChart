import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js/auto";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import XAxis from "./XAxis";
import { useRecoilValue } from "recoil";
import { Controller, DateBtn, DateContainer, DateInput, blackMode } from "../atom";
import ModeBtn from "../components/ModeBtn";
import { handleDateBtn, handleDateEnd, handleDateStart, handleHourBtn, handleMinBtn, handleMinus, handleMonthBtn, handlePlus, handleStartMinusBtn, handleStartPlusBtn, handleWeekBtn } from "../handleDateModule";
import { ListAPI } from "../api";

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
    const [btn, setBtn] = useState("date")
    const [selectedIndex, setselectedIndex] = useState(0)
    const [inputRange, setInputRange] = useState({s:"", e:""})

    const mode = useRecoilValue(blackMode)

    const startString = `${inputRange.s}`
    const endString = `${inputRange.e}`
    const start = Number(startString.slice(0, 4) + startString.slice(5, 7) + startString.slice(8, 10) + startString.slice(11, 13) + startString.slice(14, 16))
    const end = Number(endString.slice(0, 4) + endString.slice(5, 7) + endString.slice(8, 10) + endString.slice(11, 13) + endString.slice(14, 16))

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const data1 = await ListAPI()

            setCoinList(data1)

            inputDate(data1[0].e, btn)

        } catch (error) {
            console.log(error)
            alert("서버 연결 오류")
        }
    }

    const inputDate = (value, state) => {
        // 한시간을 밀리세컨트로 나타냄
        const hour = 60 * 60 * 1000
        // 하루를 밀리세컨드로 나타냄
        const day = 24 * 60 * 60 * 1000
        // 일주일
        const week = day * 7

        const stringValue = `${value}`

        const end = `${stringValue.slice(0, 4)}-${stringValue.slice(4, 6)}-${stringValue.slice(6, 8)}T${state === "hour" ? stringValue.slice(8, 10) : '00'}:00`
        const date = new Date(end)

        const start =
        state === "hour" ? new Date(date.getTime() - hour) :
        state === "date" ? new Date(date.getTime() - day) :
        state === "week" ? new Date(date.getTime() - week) :
        alert("에러 발생")

        const startYear = start.getFullYear()
        const startMonth = new Date(start).getMonth() + 1
        const startDay = new Date(start).getDate()
        const startTime = new Date(start).getHours()

        const startInput = `${startYear}-${startMonth < 10 ? '0' + startMonth : startMonth}-${startDay < 10 ? '0' + startDay : startDay}T${state === "hour" ? `${startTime < 10 ? `0${startTime}` : startTime}:00` : `00:00`}`

        setInputRange({s: startInput, e: end})
    }

    // 코인 리스트에서 코인 선택
    const handleSelectChange = (e) => {
        setselectedIndex(e.target.selectedIndex)
    }

    const tickerListArray = coinList.map((ticker) => ticker.t.slice(4))

    const XAxisComponent = (
        <XAxis
            selected={tickerListArray[selectedIndex]}
            start={start}
            end={end}
            btn={btn}
        />
    );

    const handleHour = () => {
        const state = "hour"
        handleHourBtn(setBtn)
        inputDate(coinList[selectedIndex].e, state)
    }
    const handleDate = () => {
        const state = "date"
        handleDateBtn(setBtn)
        inputDate(coinList[selectedIndex].e, state)
    }
    const handleWeek = () => {
        const state = "week"
        handleWeekBtn(setBtn)
        inputDate(coinList[selectedIndex].e, state)
    }
    const handleMonth = () => {
        const state = "month"
        handleMonthBtn(setBtn)
        inputDate(coinList[selectedIndex].e, state)
    }

    // start Date를 input 눌러 선택할 때
    const handlestartDate = (e) => {
        const value = e.target.value
        handleDateStart(value, setInputRange, end, inputRange.e)
    }
    // end Date를 input 눌러 선택할 때
    const hanldeEndDate = (e) => {
        const value = e.target.value
        handleDateEnd(value, setInputRange, start, inputRange.s)
    }


    //두 인풋에 동일하게 빼는 버튼
    const handleAllMinus = () => {
        handleMinus(setInputRange, inputRange, btn)
    }
    //두 인풋에 동일하게 더하는 버튼
    const handleAllPlus = () => {
        handlePlus(setInputRange, inputRange, btn)
    }

    return (
        <>
            <select onChange={handleSelectChange}>
                {tickerListArray.map((option) => (
                    <option key={option}>{option}</option>
                ))}
            </select>
            <BtnContainer>
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
                    value={inputRange.s}
                    onChange={handlestartDate}
                    type="datetime-local"
                />
                -
                <DateInput
                    value={inputRange.e}
                    onChange={hanldeEndDate}
                    type="datetime-local"
                />
                <br />
                <br />
                <Controller
                    active={mode}
                    onClick={handleAllMinus}
                >
                    ◀
                </Controller>
                <Controller
                    active={mode}
                    onClick={handleAllPlus}
                >
                    ▶
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