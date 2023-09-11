import { sepLists } from "./sepLists";

export const transArray = (dataArray1, dataArray2, change) => {
    if (change) {
        const [binancePrice, binanceVolume, binanceAxis] = sepLists(dataArray1, true, null)
        const [upbitPrice, upbitVolume, upbitAxis] = sepLists(dataArray2, true, null);

        return {
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
        }

    } else {
        const [binancePrice, binanceVolume, binanceAxis] = sepLists(dataArray1, false, 1300);
        const [upbitPrice, upbitVolume, upbitAxis] = sepLists(dataArray2, false, 1);

        return {
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
        }

    }
}

export default transArray;