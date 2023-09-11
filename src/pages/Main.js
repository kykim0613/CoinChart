import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js/auto";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import XAxis from "./XAxis";
import { useRecoilValue } from "recoil";
import {
  Controller,
  DateBtn,
  DateContainer,
  DateInput,
  blackMode,
} from "../atom";
import ModeBtn from "../components/ModeBtn";
import { ListAPI } from "../api";
import inputDate from "../components/handleDateInput/inputDate";
import handleDateStart from "../components/handleDateInput/handleDateStart";
import handleDateEnd from "../components/handleDateInput/handleDateEnd";
import handleMinus from "../components/handleDateBtn/handleMinus";
import handlePlus from "../components/handleDateBtn/handlePlus";

const Market = styled.h1`
  width: 100px;
  height: 50px;
  margin: 0 auto;
  text-align: center;
`;
const BtnContainer = styled.div`
  width: 155px;
  height: 30px;
  border: 1px solid black;
  border-radius: 30px;
  text-align: center;
  line-height: 30px;
  background-color: white;
`;

const Main = () => {
  const [coinList, setCoinList] = useState([]);
  const [btn, setBtn] = useState("date");
  const [selectedIndex, setselectedIndex] = useState(0);
  const [inputRange, setInputRange] = useState({ s: "", e: "" });

  const mode = useRecoilValue(blackMode);

  const startString = `${inputRange.s}`;
  const endString = `${inputRange.e}`;
  const start = Number(
    startString.slice(0, 4) +
      startString.slice(5, 7) +
      startString.slice(8, 10) +
      startString.slice(11, 13) +
      startString.slice(14, 16)
  );
  const end = Number(
    endString.slice(0, 4) +
      endString.slice(5, 7) +
      endString.slice(8, 10) +
      endString.slice(11, 13) +
      endString.slice(14, 16)
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data1 = await ListAPI();

      setCoinList(data1);

      setInputRange(inputDate(data1[0].e, btn));
    } catch (error) {
      console.log(error);
      alert("서버 연결 오류");
    }
  };

  // 코인 리스트에서 코인 선택
  const handleSelectChange = (e) => {
    setselectedIndex(e.target.selectedIndex);
  };

  const tickerListArray = coinList.map((ticker) => ticker.t.slice(4));

  const XAxisComponent = (
    <XAxis
      selected={tickerListArray[selectedIndex]}
      start={start}
      end={end}
    />
  );

  const handleHour = () => {
    const state = "hour";
    setBtn(state);
    setInputRange(inputDate(coinList[selectedIndex].e, state));
  };
  const handleDate = () => {
    const state = "date";
    setBtn(state);
    setInputRange(inputDate(coinList[selectedIndex].e, state));
  };
  const handleWeek = () => {
    const state = "week";
    setBtn(state);
    setInputRange(inputDate(coinList[selectedIndex].e, state));
  };
  const handleMonth = () => {
    const state = "month";
    setBtn(state);
    setInputRange(inputDate(coinList[selectedIndex].e, state));
  };

  // start Date를 input 눌러 선택할 때
  const handlestartDate = (e) => {
    const value = e.target.value;
    setInputRange(handleDateStart(value, end, inputRange));
  };
  // end Date를 input 눌러 선택할 때
  const hanldeEndDate = (e) => {
    const value = e.target.value;
    setInputRange(handleDateEnd(value, start, inputRange));
  };

  //두 인풋에 동일하게 빼는 버튼
  const handleAllMinus = () => {
    setInputRange(handleMinus(inputRange, btn));
  };
  //두 인풋에 동일하게 더하는 버튼
  const handleAllPlus = () => {
    setInputRange(handlePlus(inputRange, btn));
  };

  return (
    <>
      <select onChange={handleSelectChange}>
        {tickerListArray.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <BtnContainer>
        <DateBtn active={btn === "hour"} onClick={handleHour}>
          시
        </DateBtn>
        <DateBtn active={btn === "date"} onClick={handleDate}>
          일
        </DateBtn>
        <DateBtn active={btn === "week"} onClick={handleWeek}>
          주
        </DateBtn>
        <DateBtn active={btn === "month"} onClick={handleMonth}>
          월
        </DateBtn>
      </BtnContainer>
      <Market>{tickerListArray[selectedIndex]}</Market>
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
        <Controller active={mode} onClick={handleAllMinus}>
          ◀
        </Controller>
        <Controller active={mode} onClick={handleAllPlus}>
          ▶
        </Controller>
      </DateContainer>
      <br />
      {XAxisComponent}
      <br />
      <ModeBtn />
    </>
  );
};

export default React.memo(Main);
