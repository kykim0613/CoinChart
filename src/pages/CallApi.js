import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Loader, loading } from "../atom";
import LineChart from "./LineChart";
import { binanceCandlesAPI, upbitCandlesAPI } from "../api";

const CallApi = ({ start, end, selected, xAxis }) => {
  const [coin, setCoin] = useState({ b: [], u: [] });
  const [loader, setLoader] = useRecoilState(loading);

  useEffect(() => {
    setLoader(true);
    debouncedFetch(selected, start, end);
  }, [selected, start, end]);

  const fetchData = async (selected, start, end) => {
    try {
      const [data1, data2] = await Promise.all([
        binanceCandlesAPI(selected, start, end),
        upbitCandlesAPI(selected, start, end),
      ]);
      setCoin({
        b: data1,
        u: data2,
      });
      setLoader(false);
    } catch (error) {
      console.log(error);
      alert("서버 연결 오류");
    }
  };

  const debouncedFetch = useCallback(debounce(fetchData, 500), []);

  return (
    <>
      {loader && <Loader />}
      <LineChart
        coin={coin}
        xAxis={xAxis}
      />
    </>
  );
};

export default React.memo(CallApi);
