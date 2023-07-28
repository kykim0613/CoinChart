import React, { useEffect, useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import { binanceCandlesAPI, upbitCandlesAPI } from "../api"
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useRecoilState } from "recoil";
import { binanceCoinsArray, loading, upbitCoinsArray } from "../atom";
import styled from "styled-components";
Chart.register(zoomPlugin)

const ChangeBtn = styled.button`
    width: 130px;
    height: 40px;
    border: none;
    border-radius: 30px;
    background-color: #333;
    color: white;
    :active {
        background-color: #555
    }
`


const LineChart = ({ selectedStart, selectedEnd, selected, startTime, endTime, xAxis, minBtn }) => {

    const [binancePriceArray, setBinancePriceArray] = useState([])
    const [binanceVolumeArray, setBinanceVolumeArray] = useState([])
    const [upbitPriceArray, setUpBitPriceArray] = useState([])
    const [upbitVolumeArray, setUpbitVolumeArray] = useState([])
    const [upbitAxisArray, setUpbitAxisArray] = useState([])
    const [binanceAxisArray, setBinanceAxisArray] = useState([])
    const [change, setChange] = useState(false)

    const [upbitCoins, setUpbitCoins] = useRecoilState(upbitCoinsArray)
    const [binanceCoins, setBinanceCoins] = useRecoilState(binanceCoinsArray)
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

                if (change === true) {
                    const [binancePrice, binanceVolume, binanceAxis] = sepLists(dataArray1, true, null)
                    const [upbitPrice, upbitVolume, upbitAxis] = sepLists(dataArray2, true, null);
                    setBinancePriceArray(binancePrice)
                    setBinanceVolumeArray(binanceVolume)
                    setBinanceAxisArray(binanceAxis)
        
                    setUpBitPriceArray(upbitPrice)
                    setUpbitVolumeArray(upbitVolume)
                    setUpbitAxisArray(upbitAxis)
                }
        
                if (change === false) {
                    const [binancePrice, binanceVolume, binanceAxis] = sepLists(dataArray1, false, 1300);
                    const [upbitPrice, upbitVolume, upbitAxis] = sepLists(dataArray2, false, 1);
                    setBinancePriceArray(binancePrice)
                    setBinanceVolumeArray(binanceVolume)
                    setBinanceAxisArray(binanceAxis)
        
                    setUpBitPriceArray(upbitPrice)
                    setUpbitVolumeArray(upbitVolume)
                    setUpbitAxisArray(upbitAxis)
                }

                setLoader(false)

            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [xAxis])

    /**
     *
     * @param data 데이터 Array
     * @param isRate true=상승률, false=원화
     * @param exchangeRate 환율 적용할 금액. ex) 한화=1, 달러=1300 등
     * @returns {[*[가격List],*[거래량List],*[x축]]}
     */
    const sepLists = (data, isRate, exchangeRate) => {
        const priceList = [] // 가격 데이터
        const volumeList = [] // 거래량 데이터
        const axisList = [] // 시간축 데이터

        const firstPrice = data.map((price) => price.cp)[0]; // 기준점이 될 첫번째 값.
        let len = data.length;
        // for 내부에서 if 실행시
        // 코드는 간결해질 수 있으나 for 반복 개수만큼 if 실행됨.
        // 중복코드가 있고 코드가 길어지더라도
        // 불필요한 리소스 낭비를 막기 위해 for 외부에 if 실행.
        if (isRate) {
            for (let i = 0; i < len; i++) {
                const node = data[i];
                // 현재값 / 기준점값 통해 기준점 값 대비 몇% 상승 혹은 하락인지 표기
                priceList.push(Math.round(((node.cp / firstPrice) - 1) * 10000) / 100);
                volumeList.push(node.tv);
                axisList.push(node.t);
            }
        } else {
            for (let i = 0; i < len; i++) {
                const node = data[i];
                // 환율 곱해준 후 소수점 제거
                priceList.push(node.cp * exchangeRate | 0);
                volumeList.push(node.tv);
                axisList.push(node.t);
            }
        }
        return [priceList, volumeList, axisList];
    }

    const groupedArray = (data) => {
        const array = []
        const dataLength = data.length

        const closeTime = data.map((utc) => utc.t)

        let count = 1
        let timeRange = xAxis[count]
        let groupedArray = [];

        Array.prototype.max = function () {
            return Math.max.apply(null, this)
        }

        Array.prototype.min = function () {
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

    const length = xAxis.length
    const upbitLength = upbitAxisArray.length

    const makeAxis = (x, y) => {
        let result = []

        for (let i = 0; i < length; i++) {
            result.push({ x: x[i], y: y[i] })
        }
        return result
    }
    const sortXaxis = () => {
        let result = []
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < upbitLength; j++) {
                if (xAxis[i] === upbitAxisArray[j]) {
                    result.push(xAxis[i])
                    break
                }
            }
        }
        return result
    }

    const toFixedArray = (array) => {
        return array.map((fix) => fix.toFixed(0))
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
            },
            {
                label: `Binance`,
                data: makeAxis(binanceAxisArray, binancePriceArray),
                fill: false,
                borderColor: '#fcd905',
                backgroundColor: '#fcd905',
                tension: 0.1,
                yAxisID: 'left-axis',
            },
            {
                label: `Binance Volume`,
                data: makeAxis(binanceAxisArray, toFixedArray(binanceVolumeArray)),
                fill: false,
                backgroundColor: 'rgba(252, 217, 5, 0.3)',
                tension: 0.1,
                type: 'bar',
            },
            {
                label: `Upbit Volume`,
                data: makeAxis(minBtn ? sortXaxis() : xAxis, toFixedArray(upbitVolumeArray)),
                fill: false,
                backgroundColor: 'rgba(0, 92, 167, 0.3)',
                tension: 0.1,
                type: 'bar',
            },
        ],
    }

    const LineOptions = {
        scales: {
            y: {
                min: ((binancePriceArray[binancePriceArray.length] + upbitPriceArray[upbitPriceArray.length]) / 2) * 0.7,
                max: ((binancePriceArray[binancePriceArray.length] + upbitPriceArray[upbitPriceArray.length]) / 2) * 1.3,
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
                backgroundColor: `#333`,
                callbacks: {
                    label: function (context) {
                        if (change === true) {
                            if (context.dataset.label === 'Upbit' || context.dataset.label === 'Binance') {
                                return context.dataset.label + ': ' + context.parsed.y + '%';
                            }
                        }
                    }
                }
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

    const handleChangeBtn = () => {
        if (change === false) {
            const [binancePrice, binanceVolume, binanceAxis] = sepLists(binanceCoins, true, null)
            const [upbitPrice, upbitVolume, upbitAxis] = sepLists(upbitCoins, true, null);
            setBinancePriceArray(binancePrice)
            setBinanceVolumeArray(binanceVolume)
            setBinanceAxisArray(binanceAxis)

            setUpBitPriceArray(upbitPrice)
            setUpbitVolumeArray(upbitVolume)
            setUpbitAxisArray(upbitAxis)

            setChange(!change)

        }

        if (change === true) {
            const [binancePrice, binanceVolume, binanceAxis] = sepLists(binanceCoins, false, 1300);
            const [upbitPrice, upbitVolume, upbitAxis] = sepLists(upbitCoins, false, 1);
            setBinancePriceArray(binancePrice)
            setBinanceVolumeArray(binanceVolume)
            setBinanceAxisArray(binanceAxis)

            setUpBitPriceArray(upbitPrice)
            setUpbitVolumeArray(upbitVolume)
            setUpbitAxisArray(upbitAxis)

            setChange(!change)
        }
    }

    return (
        <>
            <Line data={lineChart} options={LineOptions} />
            <ChangeBtn onClick={handleChangeBtn}>{change ? "원화로 보기" : "등락률로 보기"}</ChangeBtn>
        </>
    )
}

export default LineChart;
