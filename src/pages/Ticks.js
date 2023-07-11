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

const Ticks = ({ selected, selectedStart, selectedEnd, startTime, endTime, timeCheck }) => {
    const [upbitCoins, setUpbitCoins] = useState([])
    const [binanceCoins, setBinanceCoins] = useState([])
    const [upbitPriceArray, setUpBitPriceArray] = useState([])
    const [upbitVolume, setUpbitVolume] = useState([])
    const [binanceVolume, setBinanceVolume] = useState([])
    const [binancePriceArray, setBinancePriceArray] = useState([])
    const [binanceTime, setBinanceTime] = useState([])
    const [upbitTime, setUpbitTime] = useState([])

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
        const time = binanceCoins.map((utc) => utc.t)
        setBinancePriceArray(price)
        setBinanceVolume(volume)
        setBinanceTime(time)

    }, [binanceCoins])

    useEffect(() => {

        const { price, volume } = processedData(upbitCoins)
        const time = upbitCoins.map((utc) => utc.t)

        setUpBitPriceArray(price)
        setUpbitVolume(volume)
        setUpbitTime(time)

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
    const grahpX = (time) => {
        let x = []
        for (let i = 0; i < time.length; i++) {
            const month = time[i] / 1000000 % 100 | 0
            const date = time[i] / 10000 % 100 | 0
            const hour = time[i] / 100 % 100 | 0
            const min = time[i] % 100

            x.push(`${month < 10 ? `0` + month : month}/${date < 10 ? `0` + date : date} ${hour < 10 ? `0` + hour : hour}:${min < 10 ? `0` + min : min}`)
        }
        return x
    }

    const time = Array.from(new Set([...binanceTime, ...upbitTime])).sort((a, b) => a - b)

    const binanceX = grahpX(binanceTime)
    const upbitX = grahpX(upbitTime)
    const lineChart = {
        labels: grahpX(time),
        datasets: [
            {
                label: `Binance`,
                data: makeAxis(binanceX, binancePriceArray),
                fill: false,
                borderColor: '#fcd905',
                backgroundColor: '#fcd905',
                tension: 0.1,
                yAxisID: 'left-axis',
                // xAxisID: 'x-axis-1',
            },
            {
                label: `Upbit`,
                data: makeAxis(upbitX, upbitPriceArray),
                fill: false,
                borderColor: '#005ca7',
                backgroundColor: '#005ca7',
                tension: 0.1,
                yAxisID: 'left-axis',
                // xAxisID: 'x-axis-2',
            },
            {
                label: `Binance Volume`,
                data: makeAxis(binanceX, binanceVolume),
                fill: false,
                backgroundColor: 'rgba(252, 217, 5, 0.3)',
                tension: 0.1,
                type: 'bar',
                yAxisID: 'right-axis',

            },
            {
                label: `Upbit Volume`,
                data: makeAxis(upbitX, upbitVolume),
                fill: false,
                backgroundColor: 'rgba(0, 92, 167, 0.3)',
                tension: 0.1,
                type: 'bar',
                yAxisID: 'right-axis',
            },
        ],
    }

    const array1 = [1, 4, 5, 8, 7]
    const array2 = [1, 2, 3, 4, 6, 7, 9, 10]
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