//binance 좌표 생성 함수
export const binanceXAxis = (x, y) => {
    let result = []
    const binanceLength = x.length

    for (let i = 0; i < binanceLength; i++) {
        result.push({ x: x[i], y: y[i] })
    }

    return result
}

//upbit 좌표 생성 함수
export const upbitXAxis = (x, y) => {
    let result = []
    const upbitLength = x.length

    for (let i = 0; i < upbitLength; i++) {
        result.push({ x: x[i], y: y[i] })
    }

    return result
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

export const transArray = (dataArray1, dataArray2, change, setArray) => {
    const timeCheck = new Date()
    if (change) {
        const [binancePrice, binanceVolume, binanceAxis] = sepLists(dataArray1, true, null)
        const [upbitPrice, upbitVolume, upbitAxis] = sepLists(dataArray2, true, null);

        setArray({
            b: {
                price: binancePrice,
                volume: binanceVolume,
                axis: binanceAxis
            },
            u: {
                price: upbitPrice,
                volume: upbitVolume,
                axis: upbitAxis
            }
        })

    } else {
        const [binancePrice, binanceVolume, binanceAxis] = sepLists(dataArray1, false, 1300);
        const [upbitPrice, upbitVolume, upbitAxis] = sepLists(dataArray2, false, 1);

        setArray({
            b: {
                price: binancePrice,
                volume: binanceVolume,
                axis: binanceAxis
            },
            u: {
                price: upbitPrice,
                volume: upbitVolume,
                axis: upbitAxis
            }
        })

    }
    console.log(`trans runTime: ${new Date() - timeCheck}`)
}

export const handleChangeBtn = (coin, change, setArray) => {
    if (change) {
        transArray(coin.b, coin.u, change, setArray)
    } else {
        transArray(groupedArray(coin.b), groupedArray(coin.u), change, setArray)
    }
}

// export const handleChangeBtn = (coin, setArray) => {
//     if (change === false) {
//         const [binancePrice, binanceVolume, binanceAxis] = sepLists(groupedArray(coin.b), true, null)
//         const [upbitPrice, upbitVolume, upbitAxis] = sepLists(groupedArray(coin.u), true, null);
//         setArray({
//             b: {
//                 price: binancePrice,
//                 volume: binanceVolume,
//                 axis: binanceAxis
//             },
//             u: {
//                 price: upbitPrice,
//                 volume: upbitVolume,
//                 axis: upbitAxis
//             }
//         })

//         setChange(!change)
//     }

//     if (change === true) {
//         const [binancePrice, binanceVolume, binanceAxis] = sepLists(coin.b, false, 1300);
//         const [upbitPrice, upbitVolume, upbitAxis] = sepLists(coin.u, false, 1);
//         setArray({
//             b: {
//                 price: binancePrice,
//                 volume: binanceVolume,
//                 axis: binanceAxis
//             },
//             u: {
//                 price: upbitPrice,
//                 volume: upbitVolume,
//                 axis: upbitAxis
//             }
//         })

//         setChange(!change)
//     }
// }