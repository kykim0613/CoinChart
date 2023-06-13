import { useEffect, useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import styled from "styled-components"
import { binanceAPI, binanceCandlesAPI, binanceListAPI, rateAPI, upbitCandlesAPI, upbitListAPI, upbitTicksAPI } from "../api"
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Market } from "../atom";
Chart.register(zoomPlugin)

const VolumeContainer = styled.div`
    width: 100%;
    color: white;
`

const Ticks = ({selected}) => {
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
                const dataList1 = await upbitListAPI()
                const dateStart = dataList1[11].s
                const dateEnd = dataList1[11].e

                const dataList2 = await binanceListAPI()

                const data1 = await upbitCandlesAPI(selected, dateEnd-10000, dateEnd)
                setUpbitCoins(data1.slice(0, 60))

                const data2 = await binanceCandlesAPI(selected, dateEnd-10000, dateEnd)
                setBinanceCoins(data2.slice(0, 60))

            } catch (error) {
                console.log(error)
            }
        }

        fetchData()

    }, [selected])

    useEffect(() => {
        const upbitArray = upbitCoins.map((coin) => coin.closePrice)
        const binanceArray = binanceCoins.map((coin) => coin.closePrice)
        const time = upbitCoins.map((kst) => kst.dateTimeKst)
        const upVolume = upbitCoins.map((vol) => vol.candleAccTradeVolume)
        const bnbVolume = binanceCoins.map((vol) => vol.candleAccTradeVolume)
        setUpBitPriceArray(upbitArray)
        setBinancePriceArray(binanceArray)
        setTime(time.sort((a, b) => a-b))
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
                type: 'linear',
                min: (binancePriceArray[binancePriceArray.length]+upbitPriceArray[upbitPriceArray.length])/2 - 500000,
                max: (binancePriceArray[binancePriceArray.length]+upbitPriceArray[upbitPriceArray.length])/2 + 500000,
                position: 'left',
                grid: {
                    display: false
                }
            },
            x: {
                min: binancePriceArray[binancePriceArray.length]
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

    const handleRateSubmit = (e) => {
        e.preventDefault()
    }

    const handleRateInput = (e) => {
        setRate(e.target.value)
    }
    return (
        <>
        <Market>
        {selected}
        </Market>
        <VolumeContainer>
            <Line data={lineChart} options={LineOptions} />
            <form onSubmit={handleRateSubmit}>
                <input type="number" placeholder="환율" onChange={handleRateInput} defaultValue={1300} />
            </form>
            <Bar data={barChart} options={barOptions} />
        </VolumeContainer>
        </>
    )
}

export default Ticks;