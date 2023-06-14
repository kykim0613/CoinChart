import { useEffect, useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import styled from "styled-components"
import { binanceCandlesAPI, upbitCandlesAPI } from "../api"
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(zoomPlugin)

const Market = styled.h1`
    width: 100px;
    height: 50px;
    margin: 0 auto;
    text-align:center;
`
const Date = styled.div`
    widht:100px;
    height:20px;
    margin: 0 auto;
    text-align:center;
`

const VolumeContainer = styled.div`
    width: 100%;
    color: white;
`

const Ticks = ({selected, selectedCoin, timeScope, selectedTime}) => {
    const [upbitCoins, setUpbitCoins] = useState([])
    const [upbitPriceArray, setUpBitPriceArray] = useState([])
    const [time, setTime] = useState([])
    const [upbitVolume, setUpbitVolume] = useState([])
    const [binanceVolume, setBinanceVolume] = useState([])
    const [binanceCoins, setBinanceCoins] = useState([])
    const [binancePriceArray, setBinancePriceArray] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dateEnd = selectedCoin.e
                const data1 = await upbitCandlesAPI(selected, dateEnd-selectedTime, dateEnd)
                setUpbitCoins(data1.slice(0, timeScope))

                const data2 = await binanceCandlesAPI(selected, dateEnd-selectedTime, dateEnd)
                setBinanceCoins(data2.slice(0, timeScope))

            } catch (error) {
                console.log(error)
            }
        }

        fetchData()

    }, [selected, selectedCoin, timeScope])

    useEffect(() => {
        const upbitArray = upbitCoins.map((coin) => coin.closePrice)
        const binanceArray = binanceCoins.map((coin) => coin.closePrice)
        const time = upbitCoins.map((kst) => kst.dateTimeKst.toString())
        const upVolume = upbitCoins.map((vol) => vol.candleAccTradeVolume)
        const bnbVolume = binanceCoins.map((vol) => vol.candleAccTradeVolume)
        setUpBitPriceArray(upbitArray)
        setBinancePriceArray(binanceArray)
        setTime(time)
        setUpbitVolume(upVolume)
        setBinanceVolume(bnbVolume)
    }, [upbitCoins, binanceCoins])

    const stringTime = time.map((date) => date.slice(-4,-2)+':'+date.slice(-2))

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
                min: (binancePriceArray[binancePriceArray.length]+upbitPriceArray[upbitPriceArray.length])/2 - 500000,
                max: (binancePriceArray[binancePriceArray.length]+upbitPriceArray[upbitPriceArray.length])/2 + 500000,
                position: 'left',
                grid: {
                    display: false
                }
            },
            x: {
                min: binancePriceArray[binancePriceArray.length],
                max: 300
            }
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
                    darg: {
                        enabled: true,
                    },
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
                    darg: {
                        enabled: true,
                    },
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

    const date = `${selectedCoin.e}`
    const dateString = date.slice(4, -4)
    const dateSplice = [...dateString.slice(0, 2), '/', ...dateString.slice(2)]

    return (
        <>
        <Date>
        {dateSplice}
        </Date>
        <Market>
        {selected}
        </Market>
        <VolumeContainer>
            <Line data={lineChart} options={LineOptions} />
            <Bar data={barChart} options={barOptions} />
        </VolumeContainer>
        </>
    )
}

export default Ticks;