import React, { useEffect, useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import styled from "styled-components"
import { ListAPI, binanceCandlesAPI, upbitCandlesAPI } from "../api"
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(zoomPlugin)

const VolumeContainer = styled.div`
    width: 100vh;
    color: white;
`

const Ticks = ({selected, timeScope, selectedStart, selectedEnd}) => {
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
                const data = await upbitCandlesAPI(selected, selectedStart, selectedEnd)
                setUpbitCoins(data.slice(0, timeScope))
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [selectedStart, selectedEnd, selected, timeScope])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await binanceCandlesAPI(selected, selectedStart, selectedEnd)
                setBinanceCoins(data.slice(0, timeScope))
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    },[selectedStart, selectedEnd, selected, timeScope])

    useEffect(() => {
        // let timeArray = []
        const upbitArray = upbitCoins.map((coin) => coin.closePrice)
        const binanceArray = binanceCoins.map((coin) => coin.closePrice)
        const upbitTime = upbitCoins.map((utc) => utc.dateTimeUtc.toString())
        const binanceTime = binanceCoins.map((utc) => utc.closeTime.toString())
        const upVolume = upbitCoins.map((vol) => vol.candleAccTradeVolume)
        const bnbVolume = binanceCoins.map((vol) => vol.candleAccTradeVolume)
        // for (let i = 0; i < binanceTime.length; i++) {
        //     for (let j = 0; j < upbitTime.length; j++) {
        //         if (binanceTime[i] !== upbitTime[j]) {
        //             timeArray = [...upbitTime, binanceTime[i]]
        //         }
        //     }
        // }
        setUpBitPriceArray(upbitArray)
        setBinancePriceArray(binanceArray)
        setTime(upbitTime.sort((a, b) => a - b))
        setUpbitVolume(upVolume)
        setBinanceVolume(bnbVolume)
        console.log(upbitTime)
    }, [upbitCoins, binanceCoins])

    const stringTime = time.map((date) => date.slice(-4, -2) + ':' + date.slice(-2))

    const lineChart = {
        labels: stringTime,
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
                type: 'linear',
                min: ((binancePriceArray[binancePriceArray.length] + upbitPriceArray[upbitPriceArray.length]) / 2) * 0.8,
                max: ((binancePriceArray[binancePriceArray.length] + upbitPriceArray[upbitPriceArray.length]) / 2) * 1.2,
                position: 'left',
                grid: {
                    display: false
                }
            },
        },
        animation: {
            duration: 0
        },
        tooltips: {
            enabled: true,
            intersect: true,
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
            }
        }
    }

    const barChart = {
        labels: stringTime,
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
                type: 'linear',
                position: 'left',
                grid: {
                    display: false
                }
            },
        },
        animation: {
            duration: 0
        },
        tooltips: {
            enabled: true,
            intersect: true,
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
            }
        }
    }

    return (
        <>
            <VolumeContainer>
                <Line data={lineChart} options={LineOptions} />
                <Bar data={barChart} options={barOptions} />
            </VolumeContainer>
        </>
    )
}

export default Ticks;