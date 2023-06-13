import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Ticks from "./Ticks";
import Date from "./Date";
import { binanceListAPI, upbitListAPI } from "../api";

const BtnContainer = styled.div`
    
`
const MinBtn = styled.button`
    width: 30px;
    height: 30px;
    border:none;
    border-radius: 30px;
    ${(props) => props.active && `border: 1px solid black`};
    background: white;
    margin-left: 1px;
`
const DateBtn = styled.button`
    width: 30px;
    height: 30px;
    border:none;
    border-radius: 30px;
    ${(props) => props.active && `border: 1px solid black`};
    background: white;
    margin-left: 1px;
`
const WeekBtn = styled.button`
    width: 30px;
    height: 30px;
    border:none;
    border-radius: 30px;
    ${(props) => props.active && `border: 1px solid black`};
    background: white;
    margin-left: 1px;
`
const MonthBtn = styled.button`
    width: 30px;
    height: 30px;
    border:none;
    border-radius: 30px;
    ${(props) => props.active && `border: 1px solid black`};
    background: white;
    margin-left: 1px;
`

const Main = () => {
    const [minBtn, setMinBtn] = useState(true)
    const [dateBtn, setDateBtn] = useState(false)
    const [weekBtn, setWeekBtn] = useState(false)
    const [monthBtn, setMonthBtn] = useState(false)
    const [selectList, setSelectList] = useState([])
    const [selected, setSelected] = useState(``)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data1 = await upbitListAPI()
                const upbitSymbol = data1.map((title) => title.t.slice(4, title.t.length))

                const data2 = await binanceListAPI()
                const binanceSymbol = data2.map((title) => title.t.slice(0, title.t.length - 4))

                let listArray = []
                for (let i = 0; i < upbitSymbol.length; i++) {
                    for (let j = 0; j < binanceSymbol.length; j++) {
                        if (upbitSymbol[i] === binanceSymbol[j]) {
                            listArray = [...listArray, upbitSymbol[i]]
                        }
                    }
                }
                setSelectList(listArray)
                setSelected(listArray[0])

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
    }

    const handleDateBtn = () => {
        setMinBtn(false)
        setDateBtn(true)
        setWeekBtn(false)
        setMonthBtn(false)
    }

    const handleSelectChange = (e) => {
        setSelected(e.target.value)
    }
    return (
        <>
        <select onChange={handleSelectChange}>
            {selectList.map((option) => (
                <option key={option}>{option}</option>
            ))}
        </select>
            <BtnContainer>
                <MinBtn active={minBtn} onClick={handleMinBtn}>분</MinBtn>
                <DateBtn active={dateBtn} onClick={handleDateBtn}>일</DateBtn>
                <WeekBtn active={weekBtn}>주</WeekBtn>
                <MonthBtn active={monthBtn}>월</MonthBtn>
            </BtnContainer>
            {minBtn && <Ticks selected={selected} />}
            {dateBtn && <Date selected={selected} />}
        </>
    )
}

export default Main;