import React, { useEffect, useMemo, useRef, useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import { binanceCandlesAPI, upbitCandlesAPI } from "../api"
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useRecoilState, useRecoilValue } from "recoil";
import { binanceCoins, blackMode, loading, selectedValue, upbitCoins } from "../atom";
import styled from "styled-components";
Chart.register(zoomPlugin)

const ChangeBtn = styled.button`
    width: 130px;
    height: 40px;
    border: none;
    border-radius: 30px;
    color: ${(props) => props.active ? "#333" : "#fff"};
    background-color: ${(props) => props.active ? "#eee" : "#333"};
    cursor: pointer;
    :hover {
        background-color: ${(props) => props.active ? "#ccc" : "#555"};
    }
`

const SliderBar = styled.input`
    width: 200px;
    height: 10px;
    appearance: none;
    border-radius: 5px;
    background: ${(props) => props.active ? "#ccc" : "#555"};
    cursor: pointer;
    &::-webkit-slider-thumb {
        appearance: none;
        width: 20px; /* 버튼 크기 조정 */
        height: 20px; /* 버튼 크기 조정 */
        background: ${(props) => props.active ? "#eee" : "#333"};
        border-radius: 50%;
        border: none;
        cursor: pointer;
      }
`


const LineChart = ({ start, end, selected, xAxis, rerendering, btn }) => {
    const [binancePriceArray, setBinancePriceArray] = useState([])
    const [binanceVolumeArray, setBinanceVolumeArray] = useState([])
    const [upbitPriceArray, setUpBitPriceArray] = useState([])
    const [upbitVolumeArray, setUpbitVolumeArray] = useState([])
    const [upbitAxisArray, setUpbitAxisArray] = useState([])
    const [binanceAxisArray, setBinanceAxisArray] = useState([])
    const [change, setChange] = useState(true)

    const [binance, setBinance] = useState([])
    const [upbit, setUpbit] = useState([])
    const [loader, setLoader] = useRecoilState(loading)
    const [value, setValue] = useRecoilState(selectedValue)
    const mode = useRecoilValue(blackMode)
    let check = new Date()

    Chart.defaults.color = `${mode ? "#ddd" : "#333"}`

    //api 호출
    useEffect(() => {
        fetchData(selected, start, end)
    }, [xAxis])

    //호출된 api가 저장됐을 때 실행 or x축만 변경되었을 때 실행
    useEffect(() => {
        dataRerendering(binance, upbit)
    }, [upbit, binance, rerendering])

    const fetchData = async (selected, start, end) => {
        try {
            const [data1, data2] = await Promise.all([
                binanceCandlesAPI(selected, start, end),
                upbitCandlesAPI(selected, start, end)
            ])

            setBinance(data1)
            setUpbit(data2)
        } catch (error) {
            console.log(error)
        }
    }

    const dataRerendering = (binance, upbit) => {
        const timeCheck = new Date()
            const dataArray1 = groupedArray(binance)
            const dataArray2 = groupedArray(upbit)

            //세 가지 값 리턴
            transArray(dataArray1, dataArray2)
            setLoader(false)
            console.log(`dataRendering runTime: ${new Date() - timeCheck}`)
    }

    const transArray = (dataArray1, dataArray2) => {
        const timeCheck = new Date()
        if (change) {
            const [binancePrice, binanceVolume, binanceAxis] = sepLists(dataArray1, true, null)
            const [upbitPrice, upbitVolume, upbitAxis] = sepLists(dataArray2, true, null);
            setBinancePriceArray(binancePrice)
            setBinanceVolumeArray(binanceVolume)
            setBinanceAxisArray(binanceAxis)

            setUpBitPriceArray(upbitPrice)
            setUpbitVolumeArray(upbitVolume)
            setUpbitAxisArray(upbitAxis)
        } else {
            const [binancePrice, binanceVolume, binanceAxis] = sepLists(dataArray1, false, 1300);
            const [upbitPrice, upbitVolume, upbitAxis] = sepLists(dataArray2, false, 1);
            setBinancePriceArray(binancePrice)
            setBinanceVolumeArray(binanceVolume)
            setBinanceAxisArray(binanceAxis)

            setUpBitPriceArray(upbitPrice)
            setUpbitVolumeArray(upbitVolume)
            setUpbitAxisArray(upbitAxis)
        }
        console.log(`trans runTime: ${new Date() - timeCheck}`)
        setLoader(false)
    }

    /**
     *
     * @param data 데이터 Array
     * @param isRate true=상승률, false=원화
     * @param exchangeRate 환율 적용할 금액. ex) 한화=1, 달러=1300 등
     * @returns {[*[가격List],*[거래량List],*[x축]]}
     */
    const sepLists = (data, isRate, exchangeRate) => {
        const timeCheck = new Date()
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
        console.log(`sep runTime: ${new Date() - timeCheck}`)
        return [priceList, volumeList, axisList];
    }

    /**
     * 점 두개를 하나로 합치는 함수.
     *
     * @param m1 merge 할 데이터1
     * 원본 객체로 들어오면 데이터가 변형되므로, clone 된 객체가 들어와야함.
     * @param m2 merge 할 데이터2
     * 원본 데이터가 들어와도 괜찮음. 참조만 함.
     * @returns {*} merge 된 결과 return.
     */
    const merge = (m1, m2) => {
        if (m1.t < m2.t) {
            m1.cp = m2.cp
        } else {
            m1.op = m2.op
        }
        m1.hp = Math.max(m1.hp, m2.hp)
        m1.lp = Math.min(m1.lp, m2.lp)
        m1.tv += m2.tv
        m1.tp += m2.tp
        m1.groupedCount++
        return m1;
    }

    // data를 merge할 때 x축 기준으로 순서대로 푸시하는데 60분에 좌표가 45개라서 문제가 발생. (06분~50분)
    // 따라서 분과 시의 경우에는 if else로 나눠 따로 처리해줌
    const groupedArray = (dataList) => {
        const runTime = new Date();
        const result = []
        try {
            if (!dataList || dataList.length <= 0) {
                // dataList 빈껍질이면 빈 배열 return
                return []
            }

            const len = dataList.length
            let p = Object.assign({}, dataList[0]) // 얕은 복사
            p.t = rerendering[0]
            p.groupedCount = 1;
            let xAxisIdx = 1;

            //버그 수정중
            const timeList = dataList.map((time) => time.t)
            const list = rerendering.filter((element) => timeList.includes(element))

            // dataList roof 돌면서 시간 확인하여 merge 작업.
            if (btn === "min" || "hour") {
                for (let i = 1; i < len; i++) {
                    const time = dataList[i].t
                    if (time < rerendering[xAxisIdx]) {
                        p = merge(p, dataList[i])
                    } else {
                        result.push(p)
                        p = Object.assign({}, dataList[i]) // 얕은 복사
                        p.t = list[xAxisIdx]
                        p.groupedCount = 1;
                        xAxisIdx++
                    }
                }
            } else {
                for (let i = 1; i < len; i++) {
                    const time = dataList[i].t
                    if (time < rerendering[xAxisIdx]) {
                        p = merge(p, dataList[i])
                    } else {
                        result.push(p)
                        p = Object.assign({}, dataList[i]) // 얕은 복사
                        p.t = rerendering[xAxisIdx]
                        p.groupedCount = 1;
                        xAxisIdx++
                    }
                }
            }
            // 마지막 값 result 에 push
            result.push(p)

            // volume 값 평균 계산
            for (let i = 0; i < result.length; i++) {
                result[i].tv /= result[i].groupedCount;
                result[i].tp /= result[i].groupedCount;
            }
            return result
        } finally {
            console.log(`GroupedArray | originLen: ${dataList.length} -> resultLen:${result.length}, Time:${new Date() - runTime}`)
        }
    }

    const upbitLength = upbitAxisArray.length
    const binanceLength = binanceAxisArray.length
    //upbit 좌표 생성 함수
    const upbitXAxis = (x, y) => {
        let result = []

        for (let i = 0; i < upbitLength; i++) {
            result.push({ x: x[i], y: y[i] })
        }

        return result
    }
    //binance 좌표 생성 함수
    const binanceXAxis = (x, y) => {
        let result = []

        for (let i = 0; i < binanceLength; i++) {
            result.push({ x: x[i], y: y[i] })
        }

        return result
    }

    const toFixedArray = (array) => {
        return array.map((fix) => fix.toFixed(0))
    }

    const lineChart = {
        labels: rerendering,
        datasets: [
            {
                label: `Upbit`,
                data: upbitXAxis(upbitAxisArray, upbitPriceArray),
                fill: false,
                borderColor: '#005ca7',
                backgroundColor: '#005ca7',
                tension: 0,
                yAxisID: 'left-axis',
            },
            {
                label: `Binance`,
                data: binanceXAxis(binanceAxisArray, binancePriceArray),
                fill: false,
                borderColor: '#fcd905',
                backgroundColor: '#fcd905',
                tension: 0,
                yAxisID: 'left-axis',
            },
            {
                label: `Binance Volume`,
                data: binanceXAxis(binanceAxisArray, toFixedArray(binanceVolumeArray)),
                fill: false,
                backgroundColor: 'rgba(252, 217, 5, 0.5)',
                tension: 0.1,
                type: 'bar',
            },
            {
                label: `Upbit Volume`,
                data: upbitXAxis(upbitAxisArray, toFixedArray(upbitVolumeArray)),
                fill: false,
                backgroundColor: 'rgba(0, 92, 167, 0.5)',
                tension: 0.1,
                type: 'bar',
            },
        ],
    }

    const binancePriceLength = binancePriceArray.length
    const upbitPriceLength = upbitPriceArray.length

    const LineOptions = {
        scales: {
            y: {
                min: ((binancePriceArray[binancePriceLength] + upbitPriceArray[upbitPriceLength]) / 2) * 0.7,
                max: ((binancePriceArray[binancePriceLength] + upbitPriceArray[upbitPriceLength]) / 2) * 1.3,
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
        elements: {
            line: {
                tension: 0
            }
        },
        animation: {
            duration: 0
        },
        hover: {
            animationDuration: 0
        },
        responsiveAnimationDuration: 0,
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
            const [binancePrice, binanceVolume, binanceAxis] = sepLists(groupedArray(binance), true, null)
            const [upbitPrice, upbitVolume, upbitAxis] = sepLists(groupedArray(upbit), true, null);
            setBinancePriceArray(binancePrice)
            setBinanceVolumeArray(binanceVolume)
            setBinanceAxisArray(binanceAxis)

            setUpBitPriceArray(upbitPrice)
            setUpbitVolumeArray(upbitVolume)
            setUpbitAxisArray(upbitAxis)

            setChange(!change)
        }

        if (change === true) {
            const [binancePrice, binanceVolume, binanceAxis] = sepLists(binance, false, 1300);
            const [upbitPrice, upbitVolume, upbitAxis] = sepLists(upbit, false, 1);
            setBinancePriceArray(binancePrice)
            setBinanceVolumeArray(binanceVolume)
            setBinanceAxisArray(binanceAxis)

            setUpBitPriceArray(upbitPrice)
            setUpbitVolumeArray(upbitVolume)
            setUpbitAxisArray(upbitAxis)

            setChange(!change)
        }
    }

    const handleSliderBar = (e) => {
        check = new Date()
        setLoader(true)
        setValue(e.target.value)
    }


    return (
        <>
            <SliderBar
                active={mode}
                type="range"
                min="2"
                max="300"
                step="1"
                value={value}
                onChange={handleSliderBar}
            />
            {value}
            <Line data={lineChart} options={LineOptions} />
            <ChangeBtn active={mode} onClick={handleChangeBtn}>{change ? "원화로 보기" : "등락률로 보기"}</ChangeBtn>
            {console.log(`runTime: ${new Date() - check}`)}
        </>
    )
}

export default React.memo(LineChart);
