import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Ticks from "./Ticks";
import { binanceListAPI, upbitListAPI } from "../api";

const BtnContainer = styled.div`
    
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
    const [selectList, setSelectList] = useState([])
    const [selected, setSelected] = useState(``)
    const [timeScope, setTimeScope] = useState(60)
    const [selectedCoin, setSelectedCoin] = useState(0)
    const [selectedTime, setSelectedTime] = useState(100)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data1 = await upbitListAPI()
                const dataList = data1.map((data) => data)
                const upbitSymbol = data1.map((title) => title.t.slice(4, title.t.length))

                const data2 = await binanceListAPI()
                const binanceSymbol = data2.map((title) => title.t.slice(0, title.t.length - 4))

                let tickerListArray = []
                let coinListArray = []
                for (let i = 0; i < upbitSymbol.length; i++) {
                    for (let j = 0; j < binanceSymbol.length; j++) {
                        if (upbitSymbol[i] === binanceSymbol[j]) {
                            tickerListArray = [...tickerListArray, upbitSymbol[i]]
                            coinListArray = [...coinListArray, dataList[i]]
                        }
                    }
                }
                setSelectList(tickerListArray)
                setSelected(tickerListArray[0])
                setCoinList(coinListArray)
                setSelectedCoin(coinListArray[0])
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [])

    const handleMinBtn = () => {
        setMinBtn(true)
        setDateBtn(false)
        setWeekBtn(false)
        setMonthBtn(false)
        setTimeScope(60)
        setSelectedTime(100)
    }

    const handleDateBtn = () => {
        setMinBtn(false)
        setDateBtn(true)
        setWeekBtn(false)
        setMonthBtn(false)
        setTimeScope(1440)
        setSelectedTime(10000)
    }
    const handleWeekBtn = () => {
        setMinBtn(false)
        setDateBtn(false)
        setWeekBtn(true)
        setMonthBtn(false)
        setTimeScope(10080)
        setSelectedTime(70000)
    }
    const handleMonthBtn = () => {
        setMinBtn(false)
        setDateBtn(false)
        setWeekBtn(false)
        setMonthBtn(true)
        setTimeScope(40320)
        setSelectedTime(1000000)
    }

    const handleSelectChange = (e) => {
        setSelected(e.target.value)
        setSelectedCoin(coinList[e.target.selectedIndex])
        console.log(coinList[e.target.selectedIndex])
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
            {minBtn && <Ticks selected={selected} selectedCoin={selectedCoin} timeScope={timeScope} selectedTime={selectedTime} />}
            {dateBtn && <Ticks selected={selected} selectedCoin={selectedCoin} timeScope={timeScope} selectedTime={selectedTime} />}
            {weekBtn && <Ticks selected={selected} selectedCoin={selectedCoin} timeScope={timeScope} selectedTime={selectedTime} />}
            {monthBtn && <Ticks selected={selected} selectedCoin={selectedCoin} timeScope={timeScope} selectedTime={selectedTime} />}
        </>
    )
}

export default Main;