import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ListAPI } from "../api";
import LineChart from "./LineChart";
import XAxis from "./XAxis";
import { useRecoilState } from "recoil";
import { Loader, loading } from "../atom";

const DateInput = styled.input`
    width:120px;
    height:20px;
    margin: 0 auto;
`
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
`
const Btn = styled.button`
    width: 30px;
    height: 30px;
    border:none;
    border-radius: 30px;
    ${(props) => props.active && `border: 1px solid black`};
    background: white;
    margin-left: 1px;
`

const Main = () => {
    const [coinList, setCoinList] = useState([])
    const [minBtn, setMinBtn] = useState(true)
    const [hourBtn, setHourBtn] = useState(false)
    const [dateBtn, setDateBtn] = useState(false)
    const [weekBtn, setWeekBtn] = useState(false)
    const [monthBtn, setMonthBtn] = useState(false)
    const [selected, setSelected] = useState(``)
    const [selectedIndex, setselectedIndex] = useState(0)
    const [selectList, setSelectList] = useState([])
    const [selectedStart, setSelectedStart] = useState(0)
    const [selectedEnd, setSelectedEnd] = useState(0)
    const [startDateInput, setStartDateInput] = useState(``)
    const [endDateInput, setEndDateInput] = useState(``)
    const [startTime, setStartTime] = useState(``)
    const [endTime, setEndTime] = useState(``)
    const [startTimeInput, setStartTimeInput] = useState(``)
    const [endTimeInput, setEndTimeInput] = useState(``)
    const [selectedTime, setSelectedTime] = useState(100)

    // const [hourInput, setHourInput] = useState(1)

    const [loader, setLoader] = useRecoilState(loading)

    let timeCheck = Date.now()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data1 = await ListAPI()
                const tickerListArray = data1.map((ticker) => ticker.t.slice(4))
                setCoinList(data1)
                setSelectList(tickerListArray)
                setSelected(tickerListArray[selectedIndex])
                setSelectedStart((data1[selectedIndex].e - selectedTime) / 10000 | 0)
                setSelectedEnd((data1[selectedIndex].e) / 10000 | 0)

                const startDate = data1[selectedIndex].e - selectedTime
                const endDate = data1[selectedIndex].e

                inputDate(startDate, endDate)

            } catch (error) {
                console.log(error)
            }
        }
        fetchData()

    }, [])


    // 날짜, 시간 input 데이터 함수
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

        setSelectedStart(start)
        setSelectedEnd(end)

        setStartDateInput(`${startYear}-${startMonth < 10 ? '0' + startMonth : startMonth}-${startDay < 10 ? '0' + startDay : startDay}`)
        setEndDateInput(`${endYear}-${endMonth < 10 ? '0' + endMonth : endMonth}-${endDay < 10 ? '0' + endDay : endDay}`)

        setStartTimeInput(`${startHour < 10 ? '0' + startHour : startHour}:${startMin < 10 ? '0' + startMin : startMin}`)
        setEndTimeInput(`${endHour < 10 ? '0' + endHour : endHour}:${endMin < 10 ? '0' + endMin : endMin}`)
        setStartTime(Number(`${startHour < 10 ? '0' + startHour : startHour}${startMin < 10 ? '0' + startMin : startMin}`))
        setEndTime(Number(`${endHour < 10 ? '0' + endHour : endHour}${endMin < 10 ? '0' + endMin : endMin}`))
    }

    const fixTime = () => {
        setStartTime('0000')
        setStartTimeInput('00:00')
        setEndTime('0000')
        setEndTimeInput('00:00')
    }

    const handleMinBtn = () => {
        const selectedTime = 100
        setMinBtn(true)
        setHourBtn(false)
        setDateBtn(false)
        setWeekBtn(false)
        setMonthBtn(false)
        setSelectedTime(100)
        inputDate(coinList[selectedIndex].e - selectedTime, coinList[selectedIndex].e)
        timeCheck = Date.now()
        setLoader(true)
    }
    const handleHourBtn = () => {
        const selectedTime = 100
        setMinBtn(false)
        setHourBtn(true)
        setDateBtn(false)
        setWeekBtn(false)
        setMonthBtn(false)
        setSelectedTime(100)
        inputDate(coinList[selectedIndex].e - selectedTime, coinList[selectedIndex].e)
        timeCheck = Date.now()
        setLoader(true)
    }
    const handleDateBtn = () => {
        const selectedTime = 10000
        setMinBtn(false)
        setHourBtn(false)
        setDateBtn(true)
        setWeekBtn(false)
        setMonthBtn(false)
        setSelectedTime(10000)
        inputDate(coinList[selectedIndex].e - selectedTime, coinList[selectedIndex].e)
        fixTime()
        timeCheck = Date.now()
        setLoader(true)
    }
    const handleWeekBtn = () => {
        const selectedTime = 70000
        setMinBtn(false)
        setHourBtn(false)
        setDateBtn(false)
        setWeekBtn(true)
        setMonthBtn(false)
        setSelectedTime(70000)
        inputDate(coinList[selectedIndex].e - selectedTime, coinList[selectedIndex].e)
        fixTime()
        timeCheck = Date.now()
        setLoader(true)
    }
    const handleMonthBtn = () => {
        const selectedTime = 1000000
        setMinBtn(false)
        setHourBtn(false)
        setDateBtn(false)
        setWeekBtn(false)
        setMonthBtn(true)
        setSelectedTime(1000000)
        inputDate(coinList[selectedIndex].e - selectedTime, coinList[selectedIndex].e)
        fixTime()
        timeCheck = Date.now()
        setLoader(true)
    }

    // 코인 옵션
    const handleSelectChange = (e) => {
        setSelected(e.target.value)
        setselectedIndex(e.target.selectedIndex)
        setSelectedStart((coinList[e.target.selectedIndex].e - selectedTime) / 10000 | 0)
        setSelectedEnd((coinList[e.target.selectedIndex].e) / 10000 | 0)

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
        const value = e.target.value
        const start = new Date(value)

        const endDate = new Date(start.getTime() + day)
        const endDateString = toString(endDate)

        const endWeek = new Date(start.getTime() + week)
        const endWeekString = toString(endWeek)

        const endMonth = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate())
        const endMonthString = toString(endMonth)

        if (minBtn === true || hourBtn === true) {
            if (Number(`${sliceDatefunc(value)}${startTime}`) < Number(`${selectedEnd}${endTime}`)) {
                setSelectedStart(sliceDatefunc(value))
                setStartDateInput(value)
            } else {
                alert(`시작날짜는 종료날짜보다 클 수 없습니다.`)
            }
            setLoader(true)
        }

        if (dateBtn === true) {
            setSelectedStart(sliceDatefunc(value))
            setStartDateInput(value)
            setSelectedEnd(sliceDatefunc(endDateString))
            setEndDateInput(endDateString)
            setLoader(true)
        }

        if (weekBtn === true) {
            setSelectedStart(sliceDatefunc(value))
            setStartDateInput(value)
            setSelectedEnd(sliceDatefunc(endWeekString))
            setEndDateInput(endWeekString)
            setLoader(true)
        }
        if (monthBtn === true) {
            setSelectedStart(sliceDatefunc(value))
            setStartDateInput(value)
            setSelectedEnd(sliceDatefunc(endMonthString))
            setEndDateInput(endMonthString)
            setLoader(true)
        }
    }
    const handleDateEnd = (e) => {
        const value = e.target.value
        const end = new Date(value)

        const prevDate = new Date(end.getTime() - (day))
        const prevDateString = toString(prevDate)

        const prevWeek = new Date(end.getTime() - week)
        const prevWeekString = toString(prevWeek)

        const prevMonth = new Date(end.getFullYear(), end.getMonth() - 1, end.getDate())
        const prevMonthString = toString(prevMonth)

        if (minBtn === true || hourBtn === true) {
            if (Number(`${selectedStart}${startTime}`) < Number(`${sliceDatefunc(value)}${endTime}`)) {
                setSelectedEnd(sliceDatefunc(value))
                setEndDateInput(value)
            } else {
                alert(`시작날짜는 종료날짜보다 클 수 없습니다.`)
            }
            setLoader(true)
        }
        if (dateBtn === true) {
            setSelectedStart(sliceDatefunc(prevDateString))
            setStartDateInput(prevDateString)
            setSelectedEnd(sliceDatefunc(value))
            setEndDateInput(value)
            setLoader(true)
        }
        if (weekBtn === true) {
            setSelectedStart(sliceDatefunc(prevWeekString))
            setStartDateInput(prevWeekString)
            setSelectedEnd(sliceDatefunc(value))
            setEndDateInput(value)
            setLoader(true)
        }
        if (monthBtn === true) {
            setSelectedStart(sliceDatefunc(prevMonthString))
            setStartDateInput(prevMonthString)
            setSelectedEnd(sliceDatefunc(value))
            setEndDateInput(value)
            setLoader(true)
        }
    }
    
    // 누르면 일, 주, 월만큼 추가되는 버튼
    const handlePlusBtn = () => {
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

        if (hourBtn === true) {
            setEndTimeInput(time)
            setEndTime(numTime)
            if (hourObj === 0) {
                setSelectedEnd(sliceDatefunc(translateDate))
                setEndDateInput(translateDate)
            }
            setLoader(true)
        }

        if (dateBtn === true) {
            setSelectedStart(selectedEnd)
            setStartDateInput(endDateInput)
            setSelectedEnd(sliceDatefunc(translateDate))
            setEndDateInput(translateDate)
            setLoader(true)
        }

        if (weekBtn === true) {
            setSelectedStart(selectedEnd)
            setStartDateInput(endDateInput)
            setSelectedEnd(sliceDatefunc(translateWeek))
            setEndDateInput(translateWeek)
            setLoader(true)
        }

        if (monthBtn === true) {
            setSelectedStart(selectedEnd)
            setStartDateInput(endDateInput)
            setSelectedEnd(sliceDatefunc(translateMonth))
            setEndDateInput(translateMonth)
            setLoader(true)
        }
    }

    // 누르면 일, 주, 월만큼 빼는 버튼
    const handleMinusBtn = () => {
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

        if (hourBtn === true) {
            setStartTimeInput(time)
            setStartTime(numTime)
            if (hourObj === 0) {
                setSelectedStart(sliceDatefunc(translateDate))
                setStartDateInput(translateDate)
            }
            setLoader(true)
        }

        if (dateBtn === true) {
            setSelectedStart(sliceDatefunc(translateDate))
            setStartDateInput(translateDate)
            setSelectedEnd(selectedStart)
            setEndDateInput(startDateInput)
            setLoader(true)
        }

        if (weekBtn === true) {
            setSelectedStart(sliceDatefunc(translateWeek))
            setStartDateInput(translateWeek)
            setSelectedEnd(selectedStart)
            setEndDateInput(startDateInput)
            setLoader(true)
        }

        if (monthBtn === true) {
            setSelectedStart(sliceDatefunc(translateMonth))
            setStartDateInput(translateMonth)
            setSelectedEnd(selectedStart)
            setEndDateInput(startDateInput)
            setLoader(true)
        }
    }

    // hh:mm input
    const handleTimeStart = (e) => {
        const value = e.target.value
        const start = value.slice(0, 2) + value.slice(3, 5)
        if (Number(`${selectedStart}${start}`) < Number(`${selectedEnd}${endTime}`)) {
            setStartTime(start)
            setStartTimeInput(value)
        } else {
            alert(`종료시간은 시작시간보다 작을 수 없습니다.`)
        }
        setLoader(true)
    }

    const handleTimeEnd = (e) => {
        const value = e.target.value
        const end = value.slice(0, 2) + value.slice(3, 5)
        if (Number(`${selectedStart}${startTime}`) < Number(`${selectedEnd}${end}`)) {
            setEndTime(end)
            setEndTimeInput(value)
        } else {
            alert(`종료시간은 시작시간보다 작을 수 없습니다.`)
        }
        setLoader(true)
    }

    const handleHourInput = (e) => {
        if(e.target.value < 10){
            setHourInput(e.target.value)
        } else {
            alert("10 미만을 입력해주세요.")
        }
    }

    const tickComponent = (
        <XAxis
            selected={selected}
            selectedStart={selectedStart}
            selectedEnd={selectedEnd}
            startTime={startTime}
            endTime={endTime}
            timeCheck={timeCheck}
            minBtn={minBtn}
        />
    );

    return (
        <>
            {loader && <Loader />}
            <select onChange={handleSelectChange}>
                {selectList.map((option) => (
                    <option key={option}>{option}</option>
                ))}
            </select>
            <BtnContainer>
                <Btn active={minBtn} onClick={handleMinBtn}>분</Btn>
                <Btn active={hourBtn} onClick={handleHourBtn}>시</Btn>
                <Btn active={dateBtn} onClick={handleDateBtn}>일</Btn>
                <Btn active={weekBtn} onClick={handleWeekBtn}>주</Btn>
                <Btn active={monthBtn} onClick={handleMonthBtn}>월</Btn>
            </BtnContainer>
            <Market>
                {selected}
            </Market>
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
                disabled={dateBtn || weekBtn || monthBtn}
            />
            -
            <DateInput
                value={endTimeInput}
                onChange={handleTimeEnd}
                type="time"
                disabled={dateBtn || weekBtn || monthBtn}
            />
            <br />
             
            {
            //1시간뿐만 아니라 사용자가 시간을 지정하고 그 시간만큼 뒤로 가고 앞으로 가는 버튼 제작
            /* <DateInput
            type="number"
            onChange={handleHourInput}
            value={hourInput}
            disabled={minBtn || dateBtn || weekBtn || monthBtn}
            /> */}
            <button
                disabled={minBtn}
                onClick={handleMinusBtn}
            >
                ◀
            </button>
            <button
                disabled={minBtn}
                onClick={handlePlusBtn}
            >
                ▶
            </button>
            <br />
            {minBtn && tickComponent}
            {hourBtn && tickComponent}
            {dateBtn && tickComponent}
            {weekBtn && tickComponent}
            {monthBtn && tickComponent}
        </>
    )
}

export default Main;