import { sepLists } from "../sepLists/sepLists";

const transArray = (dataArray1, dataArray2, change, setArray) => {
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
        const [binancePrice, binanceVolume, binanceAxis] = sepLists(dataArray1, false, 1000);
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

export default transArray;