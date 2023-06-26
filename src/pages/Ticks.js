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

const Ticks = ({ selected, timeScope, selectedStart, selectedEnd, startTime, endTime, timeCheck }) => {
    const [upbitCoins, setUpbitCoins] = useState([])
    const [binanceCoins, setBinanceCoins] = useState([])
    const [upbitPriceArray, setUpBitPriceArray] = useState([])
    const [time, setTime] = useState([])
    const [upbitVolume, setUpbitVolume] = useState([])
    const [binanceVolume, setBinanceVolume] = useState([])
    const [binancePriceArray, setBinancePriceArray] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await upbitCandlesAPI(selected, selectedStart, selectedEnd, startTime, endTime)
                setUpbitCoins(data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [selectedStart, selectedEnd, selected, timeScope, startTime, endTime])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await binanceCandlesAPI(selected, selectedStart, selectedEnd, startTime, endTime)
                setBinanceCoins(data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [selectedStart, selectedEnd, selected, timeScope, startTime, endTime])

    // useEffect(() => {
    //     const upbitMarket = upbitCoins.map((market) => market.market)
    //     const upbitOpenPrice = upbitCoins.map((open) => open.openingPrice)
    //     const upbitClosePrice = upbitCoins.map((market) => market.closePrice)
    //     const upbitHighPrice = upbitCoins.map((high) => high.highPrice)
    //     const upbitLowPrice = upbitCoins.map((low) => low.lowPrice)
    //     const dateCandle = {
    //         market: upbitMarket[0],
    //         openingPrice: upbitOpenPrice[0],
    //         closePrice: upbitClosePrice[upbitClosePrice.length-1],
    //         highPrice: Math.max(...upbitHighPrice),
    //         lowPrice: Math.min(...upbitLowPrice)
    //     }
    //     console.log(dateCandle)
    // }, [upbitCoins, binanceCoins])


    const grahpX = (timeList) => {
        let x = []
        for (let i = 0; i < timeList.length; i++) {
            const hour = timeList[i] / 100 % 100 | 0
            const min = timeList[i] % 100
            x.push(`${hour < 10 ? `0` + hour : hour}:${min < 10 ? `0` + min : min}`)
        }
        return x
    }

    useEffect(() => {
        // let timeArray = []
        const upbitArray = upbitCoins.map((coin) => coin.closePrice)
        const binanceArray = binanceCoins.map((coin) => coin.closePrice)
        const upbitTime = upbitCoins.map((utc) => utc.dateTimeUtc)
        const binanceTime = binanceCoins.map((utc) => utc.closeTime)
        const upVolume = upbitCoins.map((vol) => vol.candleAccTradeVolume)
        const bnbVolume = binanceCoins.map((vol) => vol.candleAccTradeVolume)


        const timeList = Array.from(new Set([...upbitTime, ...binanceTime]))

        setUpBitPriceArray(upbitArray)
        setBinancePriceArray(binanceArray)
        setTime(grahpX(timeList.sort((a, b) => a - b)))
        setUpbitVolume(upVolume)
        setBinanceVolume(bnbVolume)
    }, [upbitCoins, binanceCoins])


    const lineChart = {
        labels: time,
        datasets: [
            {
                label: `Binance`,
                data: binancePriceArray.map((price) => price * 1300),
                fill: false,
                borderColor: '#fcd905',
                backgroundColor: '#fcd905',
                tension: 0.1,
            },
            {
                label: `Upbit`,
                data: upbitPriceArray,
                fill: false,
                borderColor: '#005ca7',
                backgroundColor: '#005ca7',
                tension: 0.1,
            },
        ],
    }

    const LineOptions = {
        scales: {
            y: {
                min: ((binancePriceArray[binancePriceArray.length] + upbitPriceArray[upbitPriceArray.length]) / 2) * 0.8,
                max: ((binancePriceArray[binancePriceArray.length] + upbitPriceArray[upbitPriceArray.length]) / 2) * 1.2,
                position: 'left',
            },
            x: {
                grid: {
                    display: false
                }
            }
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
        }
    }

    const barChart = {
        labels: time,
        datasets: [
            {
                label: `Binance`,
                data: binanceVolume,
                fill: false,
                backgroundColor: '#fcd905',
                tension: 0.1,
            },
            {
                label: `Upbit`,
                data: upbitVolume,
                fill: false,
                backgroundColor: '#005ca7',
                tension: 0.1,
            },
        ],
    }

    const barOptions = {
        scales: {
            y: {
                position: 'right',
                grid: {
                    display: false
                }
            },
            x: {
                display: false,
                grid: {
                    display: false
                }
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
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor: `#333`
            },
        },
    }

    return (
        <>
            <VolumeContainer>
                <Line data={lineChart} options={LineOptions} />
                <Bar data={barChart} options={barOptions} onChange={console.log('run time:' + (Date.now() - timeCheck))} />
            </VolumeContainer>
        </>
    )
}

export default Ticks;