import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import { binanceCandlesAPI, upbitCandlesAPI } from "../api"
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useRecoilState, useRecoilValue } from "recoil";
import { ChangeBtn, Loader, SliderBar, blackMode, loading, selectedValue } from "../atom";
import { binanceXAxis, transArray, upbitXAxis } from "../handleChartFunc";
Chart.register(zoomPlugin)

const LineChart = ({ start, end, selected, xAxis, btn }) => {
    const [coin, setCoin] = useState({b: [], u: []})
    const [array, setArray] = useState(({
        b: {
            price: [],
            volume: [],
            axis: []
        },
        u: {
            price: [],
            volume: [],
            axis: []
        }
    }))
    const [change, setChange] = useState(true)

    const [loader, setLoader] = useRecoilState(loading)
    const [value, setValue] = useRecoilState(selectedValue)
    const mode = useRecoilValue(blackMode)
    console.log(loader)

    Chart.defaults.color = `${mode ? "#ddd" : "#333"}`

    //api 호출
    useEffect(() => {
        setLoader(true)
        fetchData(selected, start, end)
    }, [selected, start, end])

    //호출된 api가 저장됐을 때 실행 or x축만 변경되었을 때 실행
    useEffect(() => {
        dataOrganization(coin)
    }, [coin, xAxis, change])

    const fetchData = async (selected, start, end) => {
        try {
            const [data1, data2] = await Promise.all([
                binanceCandlesAPI(selected, start, end),
                upbitCandlesAPI(selected, start, end)
            ])

            setCoin({
                b: data1,
                u: data2
            })
            setLoader(false)
        } catch (error) {
            console.log(error)
            alert("서버 연결 오류")
        }
    }

    const dataOrganization = (coin) => {
        const timeCheck = new Date()
            const dataArray1 = groupedArray(coin.b)
            const dataArray2 = groupedArray(coin.u)

            //세 가지 값 리턴
            transArray(dataArray1, dataArray2, change, setArray)
            console.log(`dataRendering runTime: ${new Date() - timeCheck}`)
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
            p.t = xAxis[0]
            p.groupedCount = 1;
            let xAxisIdx = 1;

            // dataList roof 돌면서 시간 확인하여 merge 작업.
            if (btn === "hour") {
                for (let i = 1; i < len; i++) {
                    const time = dataList[i].t
                    if (time < xAxis[xAxisIdx]) {
                        p = merge(p, dataList[i])
                    } else {
                        result.push(p)
                        p = Object.assign({}, dataList[i]) // 얕은 복사
                        p.t = xAxis[xAxisIdx]
                        p.groupedCount = 1;
                        xAxisIdx++
                    }
                }
            } else {
                for (let i = 1; i < len; i++) {
                    const time = dataList[i].t
                    if (time < xAxis[xAxisIdx]) {
                        p = merge(p, dataList[i])
                    } else {
                        result.push(p)
                        p = Object.assign({}, dataList[i]) // 얕은 복사
                        p.t = xAxis[xAxisIdx]
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

    //수정된 그룹화함수
    // const groupedArray = (dataList) => {
    //     const runTime = new Date();
    //     const result = []
    //     try {
    //         if (!dataList || dataList.length <= 0) {
    //             // dataList 빈껍질이면 빈 배열 return
    //             return []
    //         }

    //         let xAxisIdx = 0;
    //         const len = dataList.length
    //         const xAxisLength = xAxis.length

    //         for (let i = 0; i < len; i++) {
    //             if (xAxisIdx + 1 >= xAxisLength) {
    //                 break;
    //             }
    //             const time = dataList[i].t
    //             if (xAxis[xAxisIdx] <= time && time < xAxis[xAxisIdx + 1]) {
    //                 if (result[xAxisIdx]) {
    //                     merge(result[xAxisIdx], dataList[i])
    //                 } else {
    //                     result[xAxisIdx] = Object.assign({}, dataList[i])
    //                     result[xAxisIdx].t = xAxis[xAxisIdx];
    //                     result[xAxisIdx].groupedCount = 1;
    //                 }
    //             } else {
    //                 xAxisIdx++
    //                 i--;
    //             }
    //         }

    //         // volume 값 평균 계산
    //         const t = [];
    //         for (let i = 0; i < result.length; i++) {
    //             if (!result[i]) {
    //                 continue;
    //             }
    //             result[i].tv /= result[i].groupedCount;
    //             result[i].tp /= result[i].groupedCount;
    //             t.push(result[i]);
    //         }
    //         return t
    //     } finally {
    //         console.log(`GroupedArray | originLen: ${dataList.length} -> resultLen:${result.length}, Time:${new Date() - runTime}`)
    //     }
    // }

    const toFixedArray = (array) => {
        return array.map((fix) => fix.toFixed(0))
    }

    const lineChart = {
        labels: xAxis,
        datasets: [
            {
                label: `Upbit`,
                data: upbitXAxis(array.u.axis, array.u.price),
                fill: false,
                borderColor: '#005ca7',
                backgroundColor: '#005ca7',
                tension: 0,
                yAxisID: 'left-axis',
            },
            {
                label: `Binance`,
                data: binanceXAxis(array.b.axis, array.b.price),
                fill: false,
                borderColor: '#fcd905',
                backgroundColor: '#fcd905',
                tension: 0,
                yAxisID: 'left-axis',
            },
            {
                label: `Binance Volume`,
                data: binanceXAxis(array.b.axis, toFixedArray(array.b.volume)),
                fill: false,
                backgroundColor: 'rgba(252, 217, 5, 0.5)',
                tension: 0.1,
                type: 'bar',
            },
            {
                label: `Upbit Volume`,
                data: upbitXAxis(array.u.axis, toFixedArray(array.u.volume)),
                fill: false,
                backgroundColor: 'rgba(0, 92, 167, 0.5)',
                tension: 0.1,
                type: 'bar',
            },
        ],
    }

    const binancePriceLength = array.b.price.length
    const upbitPriceLength = array.u.price.length

    const LineOptions = {
        scales: {
            y: {
                min: ((array.b.price[binancePriceLength] + array.u.price[upbitPriceLength]) / 2) * 0.7,
                max: ((array.b.price[binancePriceLength] + array.u.price[upbitPriceLength]) / 2) * 1.3,
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

    const handleChangeBtn = (coin, setArray) => {
        transArray(groupedArray(coin.b), groupedArray(coin.u), change, setArray)
        setChange(!change)
    }

    const handleSliderBar = (e) => {
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
            {loader && <Loader />}
            <Line data={lineChart} options={LineOptions} />
            <ChangeBtn active={mode} onClick={() => handleChangeBtn(coin, setArray)}>{change ? "원화로 보기" : "등락률로 보기"}</ChangeBtn>
        </>
    )
}

export default React.memo(LineChart);
