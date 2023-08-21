import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js/auto";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ListAPI } from "../api";
import XAxis from "./XAxis";
import { useRecoilState, useRecoilValue } from "recoil";
import { DateBtn, Loader, blackMode, loading } from "../atom";
import ModeBtn from "../components/ModeBtn";
import { fixTime, handleDateBtn, handleHourBtn, handleMinBtn, handleMonthBtn, handleWeekBtn, inputDate } from "../handleDateModule";

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

const DateContainer = styled.div`
    width: 100%;
    text-align:center;
`
const DateInput = styled.input`
    width:130px;
    height:30px;
    font-size: 16px;
`

const Controller = styled.button`
    width: 60px;
    height: 35px;
    border: 1px solid #000;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 6px 0 5px;
    font-size: 16px;
`

const Main = () => {
    const [coinList, setCoinList] = useState([])
    const [btn, setBtn] = useState("min")
    const [selected, setSelected] = useState(``)
    const [selectedIndex, setselectedIndex] = useState(0)
    const [selectList, setSelectList] = useState([])
    const [startDate, setStartDate] = useState(0)
    const [endDate, setEndDate] = useState(0)
    const [startDateInput, setStartDateInput] = useState(``)
    const [endDateInput, setEndDateInput] = useState(``)
    const [startTime, setStartTime] = useState(0)
    const [endTime, setEndTime] = useState(0)
    const [startTimeInput, setStartTimeInput] = useState(``)
    const [endTimeInput, setEndTimeInput] = useState(``)
    const [selectedTime, setSelectedTime] = useState(100)

    const [loader, setLoader] = useRecoilState(loading)
    const mode = useRecoilValue(blackMode)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const data1 = await ListAPI()
            const tickerListArray = data1.map((ticker) => ticker.t.slice(4))
            setCoinList(data1)
            setSelectList(tickerListArray)
            setSelected(tickerListArray[selectedIndex])
            setStartDate((data1[selectedIndex].e - selectedTime) / 10000 | 0)
            setEndDate((data1[selectedIndex].e) / 10000 | 0)

            const startDate = data1[selectedIndex].e - selectedTime
            const endDate = data1[selectedIndex].e

            inputDate(startDate, endDate)

        } catch (error) {
            console.log(error)
        }
    }

    // 코인 옵션
    const handleSelectChange = (e) => {
        setSelected(e.target.value)
        setselectedIndex(e.target.selectedIndex)
        setStartDate((coinList[e.target.selectedIndex].e - selectedTime) / 10000 | 0)
        setEndDate((coinList[e.target.selectedIndex].e) / 10000 | 0)
    }

    // yyyy-mm-dd input
    const sliceDatefunc = (value) => {
        return Number(value.slice(0, 4) + value.slice(5, 7) + value.slice(8, 10))
    }

    const hour = 60 * 60 * 1000
    const day = 24 * 60 * 60 * 1000
    const week = day * 7

    const toString = (string) => {
        return string.toISOString().slice(0, 10)
    }

    const handleDateStart = (e) => {
        setLoader(true)
        const value = e.target.value
        const start = new Date(value)

        const endDay = new Date(start.getTime() + day)
        const endDayString = toString(endDay)

        const endWeek = new Date(start.getTime() + week)
        const endWeekString = toString(endWeek)

        const endMonth = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate())
        const endMonthString = toString(endMonth)

        console.log(endDate, endTime)


        if (btn === "min" || "hour") {
            if (Number(`${sliceDatefunc(value)}${startTime}`) < Number(`${endDate}${endTime}`)) {
                setStartDate(sliceDatefunc(value))
                setStartDateInput(value)
            } else {
                alert(`시작날짜는 종료날짜보다 클 수 없습니다.`)
                setLoader(false)
            }

        }

        if (btn === "date") {
            setStartDate(sliceDatefunc(value))
            setStartDateInput(value)
            setEndDate(sliceDatefunc(endDayString))
            setEndDateInput(endDayString)
        }

        if (btn === "week") {
            setStartDate(sliceDatefunc(value))
            setStartDateInput(value)
            setEndDate(sliceDatefunc(endWeekString))
            setEndDateInput(endWeekString)
        }

        if (btn === "month") {
            setStartDate(sliceDatefunc(value))
            setStartDateInput(value)
            setEndDate(sliceDatefunc(endMonthString))
            setEndDateInput(endMonthString)
        }
    }

    const handleDateEnd = (e) => {
        setLoader(true)
        const value = e.target.value
        const end = new Date(value)

        const prevDay = new Date(end.getTime() - (day))
        const prevDayString = toString(prevDay)

        const prevWeek = new Date(end.getTime() - week)
        const prevWeekString = toString(prevWeek)

        const prevMonth = new Date(end.getFullYear(), end.getMonth() - 1, end.getDate())
        const prevMonthString = toString(prevMonth)

        if (btn === "min" || "hour") {
            if (Number(`${startDate}${startTime}`) < Number(`${sliceDatefunc(value)}${endTime}`)) {
                setEndDate(sliceDatefunc(value))
                setEndDateInput(value)
            } else {
                alert(`시작날짜는 종료날짜보다 클 수 없습니다.`)
                setLoader(false)
            }

        }
        if (btn === "date") {
            setStartDate(sliceDatefunc(prevDayString))
            setStartDateInput(prevDayString)
            setEndDate(sliceDatefunc(value))
            setEndDateInput(value)
        }
        if (btn === "week") {
            setStartDate(sliceDatefunc(prevWeekString))
            setStartDateInput(prevWeekString)
            setEndDate(sliceDatefunc(value))
            setEndDateInput(value)
        }
        if (btn === "month") {
            setStartDate(sliceDatefunc(prevMonthString))
            setStartDateInput(prevMonthString)
            setEndDate(sliceDatefunc(value))
            setEndDateInput(value)
        }
    }

    // 누르면 일, 주, 월만큼 추가되는 버튼
    const handleStartPlusBtn = () => {
        setLoader(true)
        const obj = new Date(startDateInput)
        const hours = startTimeInput.slice(0, 2)
        const mins = startTimeInput.slice(3)

        const currentDate = new Date()
        currentDate.setHours(hours)
        currentDate.setMinutes(mins)

        const timeObj = new Date(currentDate.getTime() + hour)
        const hourObj = timeObj.getHours()
        const minObj = timeObj.getMinutes()
        const time = `${hourObj < 10 ? `0${hourObj}` : hourObj}:${minObj < 10 ? `0${minObj}` : minObj}`
        const numTime = `${hourObj < 10 ? `0${hourObj}` : hourObj}${minObj < 10 ? `0${minObj}` : minObj}`

        const dateObj = new Date(obj.getTime() + day)
        const translateDate = toString(dateObj)

        const weekObj = new Date(obj.getTime() + week)
        const translateWeek = toString(weekObj)

        const monthObj = new Date(obj.getFullYear(), obj.getMonth() + 1, obj.getDate())
        const translateMonth = toString(monthObj)

        if (btn === "hour") {
            if (Number(`${startDate}${numTime}`) < Number(`${endDate}${endTime}`)) {
                setStartTimeInput(time)
                setStartTime(numTime)
                // 시간이 0시를 지나갈 때 날짜 변경하는 부분
                if (hourObj === 0) {
                    setStartDate(sliceDatefunc(translateDate))
                    setStartDateInput(translateDate)
                }
            } else {
                alert("startTime은 endTime보다 클 수 없습니다.")
                setLoader(false)
            }
        }

        if (btn === "date") {
            if (sliceDatefunc(translateDate) < endDate) {
                setStartDate(sliceDatefunc(translateDate))
                setStartDateInput(translateDate)

            } else {
                alert("startDate은 endDate보다 클 수 없습니다.")
                setLoader(false)
            }
        }

        if (btn === "week") {
            if (sliceDatefunc(translateWeek) < endDate) {
                setStartDate(sliceDatefunc(translateWeek))
                setStartDateInput(translateWeek)

            } else {
                alert("startDate은 endDate보다 클 수 없습니다.")
                setLoader(false)
            }
        }

        if (btn === "month") {
            if (sliceDatefunc(translateMonth) < endDate) {
                setStartDate(sliceDatefunc(translateMonth))
                setStartDateInput(translateMonth)
            } else {
                alert("startDate은 endDate보다 클 수 없습니다.")
                setLoader(false)
            }
        }
    }

    // 누르면 일, 주, 월만큼 빼는 버튼
    const handleStartMinusBtn = () => {
        setLoader(true)
        const object = new Date(startDateInput)

        const hours = startTimeInput.slice(0, 2)
        const mins = startTimeInput.slice(3)

        const currentDate = new Date()
        currentDate.setHours(hours)
        currentDate.setMinutes(mins)

        const timeObj = new Date(currentDate.getTime() - hour)
        const hourObj = timeObj.getHours()
        const minObj = timeObj.getMinutes()
        const time = `${hourObj < 10 ? `0${hourObj}` : hourObj}:${minObj < 10 ? `0${minObj}` : minObj}`
        const numTime = `${hourObj < 10 ? `0${hourObj}` : hourObj}${minObj < 10 ? `0${minObj}` : minObj}`

        const dateObj = new Date(object.getTime() - day)
        const translateDate = toString(dateObj)

        const weekObj = new Date(object.getTime() - week)
        const translateWeek = toString(weekObj)

        const monthObj = new Date(object.getFullYear(), object.getMonth() - 1, object.getDate())
        const translateMonth = toString(monthObj)

        if (btn === "hour") {
            setStartTimeInput(time)
            setStartTime(numTime)
            // 시간이 23시를 지나갈 때 날짜 변경하는 부분
            if (hourObj === 23) {
                setStartDate(sliceDatefunc(translateDate))
                setStartDateInput(translateDate)
            }

        }

        if (btn === "date") {
            setStartDate(sliceDatefunc(translateDate))
            setStartDateInput(translateDate)
        }

        if (btn === "week") {
            setStartDate(sliceDatefunc(translateWeek))
            setStartDateInput(translateWeek)
        }

        if (btn === "month") {
            setStartDate(sliceDatefunc(translateMonth))
            setStartDateInput(translateMonth)
        }
    }

    const handleEndPlusBtn = () => {
        setLoader(true)
        const obj = new Date(endDateInput)
        const hours = endTimeInput.slice(0, 2)
        const mins = endTimeInput.slice(3)

        const currentDate = new Date()
        currentDate.setHours(hours)
        currentDate.setMinutes(mins)

        const timeObj = new Date(currentDate.getTime() + hour)
        const hourObj = timeObj.getHours()
        const minObj = timeObj.getMinutes()
        const time = `${hourObj < 10 ? `0${hourObj}` : hourObj}:${minObj < 10 ? `0${minObj}` : minObj}`
        const numTime = `${hourObj < 10 ? `0${hourObj}` : hourObj}${minObj < 10 ? `0${minObj}` : minObj}`

        const dateObj = new Date(obj.getTime() + day)
        const translateDate = toString(dateObj)

        const weekObj = new Date(obj.getTime() + week)
        const translateWeek = toString(weekObj)

        const monthObj = new Date(obj.getFullYear(), obj.getMonth() + 1, obj.getDate())
        const translateMonth = toString(monthObj)

        if (btn === "hour") {
            setEndTimeInput(time)
            setEndTime(numTime)
            if (hourObj === 0) {
                setEndDate(sliceDatefunc(translateDate))
                setEndDateInput(translateDate)
            }

        }

        if (btn === "date") {
            setEndDate(sliceDatefunc(translateDate))
            setEndDateInput(translateDate)
        }

        if (btn === "week") {
            setEndDate(sliceDatefunc(translateWeek))
            setEndDateInput(translateWeek)
        }

        if (btn === "month") {
            setEndDate(sliceDatefunc(translateMonth))
            setEndDateInput(translateMonth)
        }
    }

    const handleEndMinusBtn = () => {
        setLoader(true)
        const object = new Date(endDateInput)

        const hours = endTimeInput.slice(0, 2)
        const mins = endTimeInput.slice(3)

        const currentDate = new Date()
        currentDate.setHours(hours)
        currentDate.setMinutes(mins)

        const timeObj = new Date(currentDate.getTime() - hour)
        const hourObj = timeObj.getHours()
        const minObj = timeObj.getMinutes()
        const time = `${hourObj < 10 ? `0${hourObj}` : hourObj}:${minObj < 10 ? `0${minObj}` : minObj}`
        const numTime = `${hourObj < 10 ? `0${hourObj}` : hourObj}${minObj < 10 ? `0${minObj}` : minObj}`

        const dateObj = new Date(object.getTime() - day)
        const translateDate = toString(dateObj)

        const weekObj = new Date(object.getTime() - week)
        const translateWeek = toString(weekObj)

        const monthObj = new Date(object.getFullYear(), object.getMonth() - 1, object.getDate())
        const translateMonth = toString(monthObj)

        if (btn === "hour") {
            if (Number(`${startDate}${startTime}`) < Number(`${endDate}${numTime}`)) {
                setEndTimeInput(time)
                setEndTime(numTime)
                if (hourObj === 23) {
                    setEndDate(sliceDatefunc(translateDate))
                    setEndDateInput(translateDate)
                }
            } else {
                alert("endTime은 startTime보다 작을 수 없습니다.")
                setLoader(false)
            }
        }

        if (btn === "date") {
            if (startDate < sliceDatefunc(translateDate)) {
                setEndDate(sliceDatefunc(translateDate))
                setEndDateInput(translateDate)
            } else {
                alert("endDate는 startDate보다 작을 수 없습니다.")
                setLoader(false)
            }
        }

        if (btn === "week") {
            if (startDate < sliceDatefunc(translateWeek)) {
                setEndDate(sliceDatefunc(translateWeek))
                setEndDateInput(translateWeek)
            } else {
                alert("endDate는 startDate보다 작을 수 없습니다.")
                setLoader(false)
            }
        }

        if (btn === "month") {
            if (startDate < sliceDatefunc(translateMonth)) {
                setEndDate(sliceDatefunc(translateMonth))
                setEndDateInput(translateMonth)
            } else {
                alert("endDate는 startDate보다 작을 수 없습니다.")
                setLoader(false)
            }
        }
    }

    const handlePlus = () => {
        setLoader(true)
        const object = new Date(endDateInput)

        const hours = endTimeInput.slice(0, 2)
        const mins = endTimeInput.slice(3)

        const currentDate = new Date()
        currentDate.setHours(hours)
        currentDate.setMinutes(mins)

        const timeObj = new Date(currentDate.getTime() + hour)
        const hourObj = timeObj.getHours()
        const minObj = timeObj.getMinutes()
        const time = `${hourObj < 10 ? `0${hourObj}` : hourObj}:${minObj < 10 ? `0${minObj}` : minObj}`
        const numTime = `${hourObj < 10 ? `0${hourObj}` : hourObj}${minObj < 10 ? `0${minObj}` : minObj}`

        const dateObj = new Date(object.getTime() + day)
        const translateDate = toString(dateObj)

        const weekObj = new Date(object.getTime() + week)
        const translateWeek = toString(weekObj)

        const monthObj = new Date(object.getFullYear(), object.getMonth() + 1, object.getDate())
        const translateMonth = toString(monthObj)

        if (btn === "hour") {
                setStartTimeInput(endTimeInput)
                setStartTime(endTime)
                setEndTimeInput(time)
                setEndTime(numTime)
                setStartDateInput(endDateInput)
                setStartDate(endDate)
                if (hourObj === 0) {
                    setStartDate(endDate)
                    setStartDateInput(endDateInput)
                    setEndDate(sliceDatefunc(translateDate))
                    setEndDateInput(translateDate)
            }
        }

        if (btn === "date") {
                setStartDate(endDate)
                setStartDateInput(endDateInput)
                setEndDate(sliceDatefunc(translateDate))
                setEndDateInput(translateDate)
        }

        if (btn === "week") {
            setStartDate(endDate)
            setStartDateInput(endDateInput)
            setEndDate(sliceDatefunc(translateWeek))
            setEndDateInput(translateWeek)
        }

        if (btn === "month") {
            setStartDate(endDate)
            setStartDateInput(endDateInput)
            setEndDate(sliceDatefunc(translateMonth))
            setEndDateInput(translateMonth)
        }
    }

    const handleMinus = () => {
        setLoader(true)
        const object = new Date(startDateInput)

        const hours = startTimeInput.slice(0, 2)
        const mins = startTimeInput.slice(3)
        
        const currentDate = new Date()
        currentDate.setHours(hours)
        currentDate.setMinutes(mins)

        const timeObj = new Date(currentDate.getTime() - hour)
        const hourObj = timeObj.getHours()
        const minObj = timeObj.getMinutes()
        const time = `${hourObj < 10 ? `0${hourObj}` : hourObj}:${minObj < 10 ? `0${minObj}` : minObj}`
        const numTime = `${hourObj < 10 ? `0${hourObj}` : hourObj}${minObj < 10 ? `0${minObj}` : minObj}`

        const dateObj = new Date(object.getTime() - day)
        const translateDate = toString(dateObj)

        const weekObj = new Date(object.getTime() - week)
        const translateWeek = toString(weekObj)

        const monthObj = new Date(object.getFullYear(), object.getMonth() - 1, object.getDate())
        const translateMonth = toString(monthObj)

        if (btn === "hour") {
                setStartTimeInput(time)
                setStartTime(numTime)
                setEndTimeInput(startTimeInput)
                setEndTime(startTime)
                setEndDateInput(startDateInput)
                setEndDate(startDate)
                if (hourObj === 23) {
                    setStartDate(sliceDatefunc(translateDate))
                    setStartDateInput(translateDate)
            }
        }

        if (btn === "date") {
                setStartDate(sliceDatefunc(translateDate))
                setStartDateInput(translateDate)
                setEndDate(startDate)
                setEndDateInput(startDateInput)
        }

        if (btn === "week") {
            setStartDate(sliceDatefunc(translateWeek))
            setStartDateInput(translateWeek)
            setEndDate(startDate)
            setEndDateInput(startDateInput)
        }

        if (btn === "month") {
            setStartDate(sliceDatefunc(translateMonth))
            setStartDateInput(translateMonth)
            setEndDate(startDate)
            setEndDateInput(startDateInput)
        }
    }

    // hh:mm input
    const handleTimeStart = (e) => {
        setLoader(true)
        const value = e.target.value
        const start = value.slice(0, 2) + value.slice(3, 5)
        if (Number(`${startDate}${start}`) < Number(`${endDate}${endTime}`)) {
            setStartTime(start)
            setStartTimeInput(value)
        } else {
            alert(`종료시간은 시작시간보다 작을 수 없습니다.`)
        }

    }

    const handleTimeEnd = (e) => {
        setLoader(true)
        const value = e.target.value
        const end = value.slice(0, 2) + value.slice(3, 5)
        if (Number(`${startDate}${startTime}`) < Number(`${endDate}${end}`)) {
            setEndTime(end)
            setEndTimeInput(value)
        } else {
            alert(`종료시간은 시작시간보다 작을 수 없습니다.`)
        }

    }
    const start = Number(startDate) * 10000 + Number(startTime);
    const end = Number(endDate) * 10000 + Number(endTime);

    const XAxisComponent = (
        <XAxis
            selected={selected}
            start={start}
            end={end}
            btn = {btn}
        />
    );

    const inputDate = (startDate, endDate) => {
        const start = startDate / 10000 | 0
        const end = endDate / 10000 | 0
    
        const startYear = startDate / 100000000 | 0
        const startMonth = startDate / 1000000 % 100 | 0
        const startDay = startDate / 10000 % 100 | 0
        const startHour = startDate / 100 % 100 | 0
        const startMin = startDate % 100 | 0
    
        const endYear = endDate / 100000000 | 0
        const endMonth = endDate / 1000000 % 100 | 0
        const endDay = endDate / 10000 % 100 | 0
        const endHour = endDate / 100 % 100 | 0
        const endMin = endDate % 100 | 0
    
        setStartDate(start)
        setEndDate(end)
    
        setStartDateInput(`${startYear}-${startMonth < 10 ? '0' + startMonth : startMonth}-${startDay < 10 ? '0' + startDay : startDay}`)
        setEndDateInput(`${endYear}-${endMonth < 10 ? '0' + endMonth : endMonth}-${endDay < 10 ? '0' + endDay : endDay}`)
    
        setStartTimeInput(`${startHour < 10 ? '0' + startHour : startHour}:${startMin < 10 ? '0' + startMin : startMin}`)
        setEndTimeInput(`${endHour < 10 ? '0' + endHour : endHour}:${endMin < 10 ? '0' + endMin : endMin}`)
        setStartTime(Number(`${startHour < 10 ? '0' + startHour : startHour}${startMin < 10 ? '0' + startMin : startMin}`))
        setEndTime(Number(`${endHour < 10 ? '0' + endHour : endHour}${endMin < 10 ? '0' + endMin : endMin}`))
    }

    const deductedTime = btn === "min" || "hour" ? 100 : btn === "date" ? 10000 : btn === "week" ? 70000 : btn === "month" ? 1000000 : 0

    return (
        <>
            {loader && <Loader />}
            <select onChange={handleSelectChange}>
                {selectList.map((option) => (
                    <option key={option}>{option}</option>
                ))}
            </select>
            <BtnContainer>
                <DateBtn active={btn === "min"} onClick={() => handleMinBtn(setBtn, setSelectedTime, inputDate(coinList[selectedIndex].e - 100, coinList[selectedIndex].e))}>분</DateBtn>
                <DateBtn active={btn === "hour"} onClick={() => handleHourBtn(setBtn, setSelectedTime, inputDate(coinList[selectedIndex].e - 100, coinList[selectedIndex].e))}>시</DateBtn>
                <DateBtn active={btn === "date"} onClick={() => handleDateBtn(setBtn, setSelectedTime, inputDate(coinList[selectedIndex].e - 10000, coinList[selectedIndex].e), fixTime(setStartTime, setStartTimeInput, setEndTime, setEndTimeInput))}>일</DateBtn>
                <DateBtn active={btn === "week"} onClick={() => handleWeekBtn(setBtn, setSelectedTime, inputDate(coinList[selectedIndex].e - 70000, coinList[selectedIndex].e), fixTime(setStartTime, setStartTimeInput, setEndTime, setEndTimeInput))}>주</DateBtn>
                <DateBtn active={btn === "month"} onClick={() => handleMonthBtn(setBtn, setSelectedTime, inputDate(coinList[selectedIndex].e - 1000000, coinList[selectedIndex].e), fixTime(setStartTime, setStartTimeInput, setEndTime, setEndTimeInput))}>월</DateBtn>
            </BtnContainer>
            <Market>
                {selected}
            </Market>
        
            <DateContainer>
                <DateInput
                    value={startDateInput}
                    onChange={handleDateStart}
                    type="date"
                />
                -
                <DateInput
                    value={endDateInput}
                    onChange={handleDateEnd}
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
                    onClick={handleStartMinusBtn}
                    disabled={btn === "min"}
                >
                    ◀
                </Controller>
                <Controller
                    active={mode}
                    onClick={handleStartPlusBtn}
                    disabled={btn === "min"}
                >
                    ▶
                </Controller>
                <Controller
                    active={mode}
                    onClick={handleEndMinusBtn}
                    disabled={btn === "min"}
                >
                    ◀
                </Controller>
                <Controller
                    active={mode}
                    onClick={handleEndPlusBtn}
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
                    onClick={handleMinus}
                    disabled={btn === "min"}
                >
                    ◀◀
                </Controller><Controller
                    active={mode}
                    onClick={handlePlus}
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