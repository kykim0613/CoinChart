import React, { useEffect, useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import styled from "styled-components"
import { binanceCandlesAPI, upbitCandlesAPI } from "../api"
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(zoomPlugin)

const VolumeContainer = styled.div`
  width: 100vh;
  position: absolute;
  left: 50%;
  transform: translateX(-50%)
`

const graphPointCount = 100;

const Ticks = ({ selected, selectedStart, selectedEnd, startTime, endTime, timeCheck }) => {
    const [xAxis, setXAxis] = useState([])
    const [upbitCoins, setUpbitCoins] = useState([])
    const [binanceCoins, setBinanceCoins] = useState([])
    const [upbitPriceArray, setUpBitPriceArray] = useState([])
    const [upbitVolume, setUpbitVolume] = useState([])
    const [binanceVolume, setBinanceVolume] = useState([])
    const [binancePriceArray, setBinancePriceArray] = useState([])

    useEffect(() => {
        createXAxis();
    }, [selectedStart, selectedEnd, startTime, endTime])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await binanceCandlesAPI(selected, selectedStart, selectedEnd, startTime, endTime)

                setBinanceCoins(groupedArray(data))

            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [selectedStart, selectedEnd, selected, startTime, endTime])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await upbitCandlesAPI(selected, selectedStart, selectedEnd, startTime, endTime)

                setUpbitCoins(groupedArray(data))

            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [selectedStart, selectedEnd, selected, startTime, endTime])

    function createXAxis() {
        const runTime = new Date();

        // yyyymmddhhmmss 형태로 만듬.
        const startDateTime = Number(selectedStart) * 10000 + Number(startTime);
        const endDateTime = Number(selectedEnd) * 10000 + Number(endTime);

        // year, month, day, hour, min 으로 쪼갬
        const st = parseNumberTime(startDateTime);
        const et = parseNumberTime(endDateTime);

        // date 객체로 만듬.
        const startDate = new Date(st.year, st.month - 1, st.day, st.hour, st.min);
        const endDate = new Date(et.year, et.month - 1, et.day, et.hour, et.min);

        // 기간의 전체 분을 구함
        const totalMinute = (endDate - startDate) / (60 * 1000);

        // 그래프상 점과 점 사이의 간격을 구함.
        // 단위는 분.
        // 1보다 작지 않도록 조정
        // 시작점과 끝점을 강제로 넣기 때문에 graphPointCount 에서 1을 빼줌
        const interval = Math.max(totalMinute / (graphPointCount - 1), 1);
        console.log(`totalMinute:${totalMinute}, graphPointCount:${graphPointCount}, interval:${interval}`)

        const xAxisSet = new Set();
        xAxisSet.add(startDateTime); // 시작점 추가

        let tempMinute = 0;
        let tempDate = startDate;
        while (tempDate < endDate) {
            tempDate = new Date(startDate.getTime());
            tempDate.setMinutes(startDate.getMinutes() + Math.ceil(tempMinute += interval));

            const tempNumberDate = dateToNumberDate(tempDate);
            if (tempNumberDate < endDateTime) {
                xAxisSet.add(tempNumberDate);
            }
        }

        xAxisSet.add(endDateTime); // 끝점 추가
        setXAxis(Array.from(xAxisSet));
        console.log('xAxis')
        console.log(xAxisSet)
        console.log(`create xAxis Time:${new Date() - runTime}`)
    }

    const parseNumberTime = (numberTime) => {
        const year = numberTime / 100000000 | 0
        const month = numberTime / 1000000 % 100 | 0
        const day = numberTime / 10000 % 100 | 0
        const hour = numberTime / 100 % 100 | 0
        const min = numberTime % 100 | 0
        return {year: year, month: month, day: day, hour: hour, min: min}
    }

    function dateToNumberDate(tempDate) {
        return tempDate.getFullYear() * 100000000
            + (tempDate.getMonth() + 1) * 1000000
            + tempDate.getDate() * 10000
            + tempDate.getHours() * 100
            + tempDate.getMinutes();
    }

    const groupedArray = (data) => {
        const array = []
        const dataLength = data.length
        const size = Math.ceil(dataLength / 300)

        const closeTime = data.map((utc) => utc.t)

        let timeRange = closeTime[0] + size
        let groupedArray = [];

        for (let i = 0; i < dataLength; i++) {
            const time = closeTime[i]

            if (time < timeRange) {
                groupedArray.push(data[i])
            }

            if (timeRange <= time) {
                array.push(groupedArray)
                groupedArray = [data[i]]
                if (i < dataLength) {
                    timeRange = closeTime[i] + size
                }

                if (i + 1 === dataLength) {
                    timeRange = closeTime[i]
                }
            }
        }
        if (groupedArray.length > 0) {
            array.push(groupedArray)
        }

        // 압축된 array안의 배열을 하나의 틱(객체)로 변환하는 for문
        let result = []

        for (let i = 0; i < array.length; i++) {
            const m = array[0].map((markets) => markets.m)
            const op = array[i].map((onpeningPrice) => onpeningPrice.op)
            const cp = array[i].map((closePrice) => closePrice.cp)
            const hp = array[i].map((highPrice) => highPrice.hp)
            const lp = array[i].map((lowPrice) => lowPrice.lp)
            const tv = array[i].map((volume) => volume.tv)
            const t = array[i].map((time) => time.t)

            const tick = {
                m: m[0],
                op: op[0],
                cp: cp[cp.length - 1],
                hp: Math.max(...hp),
                lp: Math.min(...lp),
                tv: tv.reduce((a, b) => a + b) / tv.length,
                t: t[t.length - 1]
            }
            result.push(tick)
        }

        return result

    }

    const processedData = (coins) => {
        const price = coins.map((coin) => coin.cp)
        const volume = coins.map((vol) => vol.tv)

        return {
            price,
            volume
        }
    }

    useEffect(() => {
        const { volume } = processedData(binanceCoins)
        const price = binanceCoins.map((coin) => coin.cp * 1300 | 0)

        setBinancePriceArray(price)
        setBinanceVolume(volume)

    }, [binanceCoins])

    useEffect(() => {
        const { price, volume } = processedData(upbitCoins)

        setUpBitPriceArray(price)
        setUpbitVolume(volume)

    }, [upbitCoins])

    const makeAxis = (x, y) => {
        let result = []
        const xLength = x.length
        const yLength = y.length
        for (let i = 0; i < Math.max(xLength, yLength); i++) {
            result.push({ x: x[i], y: y[i] })
        }
        return result
    }

    const lineChart = {
        labels: xAxis,
        datasets: [
            {
                label: `Binance`,
                data: makeAxis(xAxis, binancePriceArray),
                fill: false,
                borderColor: '#fcd905',
                backgroundColor: '#fcd905',
                tension: 0.1,
                yAxisID: 'left-axis',
                // xAxisID: 'x-axis-1',
            },
            {
                label: `Upbit`,
                data: makeAxis(xAxis, upbitPriceArray),
                fill: false,
                borderColor: '#005ca7',
                backgroundColor: '#005ca7',
                tension: 0.1,
                yAxisID: 'left-axis',
                // xAxisID: 'x-axis-2',
            },
            {
                label: `Binance Volume`,
                data: makeAxis(xAxis, binanceVolume),
                fill: false,
                backgroundColor: 'rgba(252, 217, 5, 0.3)',
                tension: 0.1,
                type: 'bar',
                yAxisID: 'right-axis',

            },
            {
                label: `Upbit Volume`,
                data: makeAxis(xAxis, upbitVolume),
                fill: false,
                backgroundColor: 'rgba(0, 92, 167, 0.3)',
                tension: 0.1,
                type: 'bar',
                yAxisID: 'right-axis',
            },
        ],
    }

    const LineOptions = {
        scales: {
            y: {
                min: ((binancePriceArray[binancePriceArray.length] + upbitPriceArray[upbitPriceArray.length]) / 2) * 0.8,
                max: ((binancePriceArray[binancePriceArray.length] + upbitPriceArray[upbitPriceArray.length]) / 2) * 1.2,
                display: false,
                position: 'left',
                grid: {
                    display: false
                },
            },
            x: {
                grid: {
                    display: false
                },
            },
        },
        animation: {
            duration: 0
        },
        interaction: {
            intersect: false,
            mode: 'index'
        },
        plugins: {
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x'
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: 'x',
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: `#333`
            },
            legend: {
                labels: {
                    filter: function (legendItem) {
                        return legendItem.text !== 'Binance Volume' && legendItem.text !== 'Upbit Volume'
                    }
                }
            }
        }
    }

    return (
        <>
            <VolumeContainer>
                <Line data={lineChart} options={LineOptions} onChange={console.log('run time:' + (Date.now() - timeCheck))} />
            </VolumeContainer>
        </>
    )
}

export default Ticks;