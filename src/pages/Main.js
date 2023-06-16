import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Ticks from "./Ticks";
import { ListAPI, binanceCandlesAPI, binanceListAPI, upbitCandlesAPI, upbitListAPI } from "../api";

const DateInput = styled.input`
    width:100px;
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
    width: 124px;
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
    const [dateBtn, setDateBtn] = useState(false)
    const [weekBtn, setWeekBtn] = useState(false)
    const [monthBtn, setMonthBtn] = useState(false)
    const [timeScope, setTimeScope] = useState(60)
    const [selectedTime, setSelectedTime] = useState(100)
    const [selected, setSelected] = useState(``)
    const [selectedIndex, setselectedIndex] = useState(0)
    const [selectList, setSelectList] = useState([])
    const [selectedStart, setSelectedStart] = useState(0)
    const [selectedEnd, setSelectedEnd] = useState(0)
    const [startDateInput, setStartDateInput] = useState(``)
    const [endDateInput, setEndDateInput] = useState(``)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data1 = await ListAPI()
                const tickerListArray = data1.map((ticker) => ticker.t.slice(4))
                setCoinList(data1)
                setSelectList(tickerListArray)
                setSelected(tickerListArray[selectedIndex])
                setSelectedStart(data1[selectedIndex].e - selectedTime)
                setSelectedEnd(data1[selectedIndex].e)

                const startDate = `${data1[selectedIndex].e - selectedTime}`
                const startDateString = startDate.slice(0, -4)
                const endDate = `${data1[selectedIndex].e}`
                const endDateString = endDate.slice(0, -4)
                setStartDateInput(`${startDateString.slice(0, 4)}-${startDateString.slice(4, 6)}-${startDateString.slice(6)}`)
                setEndDateInput(`${endDateString.slice(0, 4)}-${endDateString.slice(4, 6)}-${endDateString.slice(6)}`)
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()

    }, [])

    const transDateString = (selectedTime) => {
        const startDate = `${coinList[selectedIndex].e - selectedTime}`
        const startDateString = startDate.slice(0, -4)
        const endDate = `${coinList[selectedIndex].e}`
        const endDateString = endDate.slice(0, -4)
        setSelectedStart(coinList[selectedIndex].e - selectedTime)
        setSelectedEnd(coinList[selectedIndex].e)
        setStartDateInput(`${startDateString.slice(0, 4)}-${startDateString.slice(4, 6)}-${startDateString.slice(6)}`)
        setEndDateInput(`${endDateString.slice(0, 4)}-${endDateString.slice(4, 6)}-${endDateString.slice(6)}`)
        console.log(`${endDateString.slice(0, 4)}-${endDateString.slice(4, 6)}-${endDateString.slice(6)}`)
    
    }

    const handleMinBtn = () => {
        const selectedTime = 100
        setMinBtn(true)
        setDateBtn(false)
        setWeekBtn(false)
        setMonthBtn(false)
        setTimeScope(60)
        setSelectedTime(100)
        transDateString(selectedTime)
    }

    const handleDateBtn = () => {
        const selectedTime = 10000
        setMinBtn(false)
        setDateBtn(true)
        setWeekBtn(false)
        setMonthBtn(false)
        setTimeScope(1440)
        setSelectedTime(10000)
        transDateString(selectedTime)
    }
    const handleWeekBtn = () => {
        const selectedTime = 70000
        setMinBtn(false)
        setDateBtn(false)
        setWeekBtn(true)
        setMonthBtn(false)
        setTimeScope(10080)
        setSelectedTime(70000)
        transDateString(selectedTime)
    }
    const handleMonthBtn = () => {
        const selectedTime = 1000000
        setMinBtn(false)
        setDateBtn(false)
        setWeekBtn(false)
        setMonthBtn(true)
        setTimeScope(40320)
        setSelectedTime(1000000)
        transDateString(selectedTime)
    }

    const tickComponent = (
        <Ticks
            selected={selected}
            timeScope={timeScope}
            selectedStart={selectedStart}
            selectedEnd={selectedEnd}
        />
    );
    const handleSelectChange = (e) => {
        setSelected(e.target.value)
        setselectedIndex(e.target.selectedIndex)
        setSelectedStart(coinList[e.target.selectedIndex].e - timeScope)
        setSelectedEnd(coinList[e.target.selectedIndex].e)
    }

    const handleSelectStart = (e) => {
        const value = e.target.value
        setStartDateInput(value)
    }
    const handleselectEnd = (e) => {
        const value = e.target.value
        setEndDateInput(value)
    }

    return (
        <>
            <select onChange={handleSelectChange}>
                {selectList.map((option) => (
                    <option key={option}>{option}</option>
                ))}
            </select>
            <BtnContainer>
                <Btn active={minBtn} onClick={handleMinBtn}>분</Btn>
                <Btn active={dateBtn} onClick={handleDateBtn}>일</Btn>
                <Btn active={weekBtn} onClick={handleWeekBtn}>주</Btn>
                <Btn active={monthBtn} onClick={handleMonthBtn}>월</Btn>
            </BtnContainer>
            <Market>
                {selected}
            </Market>
            <DateInput defaultValue={startDateInput} onChange={handleSelectStart} type="date" readOnly />
            -
            <DateInput defaultValue={endDateInput} onChange={handleselectEnd} type="date" readOnly />
            {minBtn && tickComponent}
            {dateBtn && tickComponent}
            {weekBtn && tickComponent}
            {monthBtn && tickComponent}
        </>
    )
}

export default Main;