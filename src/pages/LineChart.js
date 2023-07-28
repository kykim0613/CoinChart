import React, { useEffect, useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import { binanceCandlesAPI, upbitCandlesAPI } from "../api"
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useRecoilState } from "recoil";
import { loading } from "../atom";
Chart.register(zoomPlugin)


const LineChart = ({ selectedStart, selectedEnd, selected, startTime, endTime, xAxis, minBtn }) => {

    const [upbitCoins, setUpbitCoins] = useState([])
    const [binanceCoins, setBinanceCoins] = useState([])
    const [binancePriceArray, setBinancePriceArray] = useState([])
    const [binanceVolumeArray, setBinanceVolumeArray] = useState([])
    const [upbitPriceArray, setUpBitPriceArray] = useState([])
    const [upbitVolumeArray, setUpbitVolumeArray] = useState([])
    const [upbitAxisArray, setUpbitAxisArray] = useState([])
    const [binanceAxisArray, setBinanceAxisArray] = useState([])

    const [loader, setLoader] = useRecoilState(loading)

    useEffect(() => {
        const fetchData = async () => {
            try {

                const [data1, data2] = await Promise.all([
                    binanceCandlesAPI(selected, selectedStart, selectedEnd, startTime, endTime),
                    upbitCandlesAPI(selected, selectedStart, selectedEnd, startTime, endTime)
                ])

                const dataArray1 = groupedArray(data1)
                const dataArray2 = groupedArray(data2)

                setBinanceCoins(dataArray1)
                setUpbitCoins(dataArray2)

                const binancePrice = dataArray1.map((price) => price.cp * 1300 | 0)
                const binanceVolume = dataArray1.map((volume) => volume.tv)
                const binanceAxis = dataArray1.map((axis) => axis.t) 

                const upbitPrice = dataArray2.map((price) => price.cp)
                const upbitVolume = dataArray2.map((volume) => volume.tv)
                const upbitAxis = dataArray2.map((axis) => axis.t) 

                setBinancePriceArray(binancePrice)
                setBinanceVolumeArray(binanceVolume)
                setBinanceAxisArray(binanceAxis)

                setUpBitPriceArray(upbitPrice)
                setUpbitVolumeArray(upbitVolume)
                setUpbitAxisArray(upbitAxis)

                setLoader(false)

            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [xAxis])

    const groupedArray = (data) => {
        const array = []
        const dataLength = data.length

        const closeTime = data.map((utc) => utc.t)

        let count = 1
        let timeRange = xAxis[count]
        let groupedArray = [];

        Array.prototype.max = function() {
            return Math.max.apply(null, this)
        }
    
        Array.prototype.min = function() {
            return Math.min.apply(null, this)
        }

        for (let i = 0; i < dataLength; i++) {
            const time = closeTime[i]

            if (time < timeRange) {
                groupedArray.push(data[i])
            }

            if (timeRange <= time) {
                array.push(groupedArray)
                groupedArray = [data[i]]
                if (i < dataLength) {
                    timeRange = xAxis[count++]
                }

                if (i + 1 === dataLength) {
                    timeRange = xAxis[i]
                }
            }
        }
        if (groupedArray.length > 0) {
            array.push(groupedArray)
        }

        // 압축된 array안의 배열을 하나의 틱(객체)로 변환하는 for문
        let result = []
        const arrayLength = array.length

        for (let i = 0; i < arrayLength; i++) {
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
                hp: hp.max(),
                lp: lp.min(),
                tv: tv.reduce((a, b) => a + b, 0) / tv.length,
                t: t[0]
            }
            result.push(tick)
        }

        return result

    }

    const axis = Array.from(new Set([...xAxis, ...upbitAxisArray, ...binanceAxisArray])).sort((a,b) => a - b)

    const length = xAxis.length
    const upbitLength = upbitAxisArray.length

    const makeAxis = (x, y) => {
        let result = []

        for (let i = 0; i < length; i++) {
            result.push({ x: x[i], y: y[i] })
        }
        return result
    }
    const sortXaxis = () =>{
        let result = []
        for(let i = 0; i < length; i++){
            for(let j = 0; j < upbitLength; j++){
                if(xAxis[i] === upbitAxisArray[j]){
                    result.push(xAxis[i])
                    break
                }
            }
        }
        return result
    }

    const lineChart = {
        labels: xAxis,
        datasets: [
            {
                label: `Upbit`,
                data: makeAxis(minBtn ? sortXaxis() : xAxis, upbitPriceArray),
                fill: false,
                borderColor: '#005ca7',
                backgroundColor: '#005ca7',
                tension: 0.1,
                yAxisID: 'left-axis',
                // xAxisID: 'x-axis-2',
            },
            {
                label: `Binance`,
                data: makeAxis(binanceAxisArray, binancePriceArray),
                fill: false,
                borderColor: '#fcd905',
                backgroundColor: '#fcd905',
                tension: 0.1,
                yAxisID: 'left-axis',
                // xAxisID: 'x-axis-1',
            },
            {
                label: `Binance Volume`,
                data: makeAxis(binanceAxisArray, binanceVolumeArray),
                fill: false,
                backgroundColor: 'rgba(252, 217, 5, 0.3)',
                tension: 0.1,
                type: 'bar',
                yAxisID: 'right-axis',

            },
            {
                label: `Upbit Volume`,
                data: makeAxis(minBtn ? sortXaxis() : xAxis, upbitVolumeArray),
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
            <Line data={lineChart} options={LineOptions} />
        </>
    )
}

export default LineChart;
