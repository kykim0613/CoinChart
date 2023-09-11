import merge from "./merge";

// 그룹화 함수
const groupedArray = (dataList, xAxis) => {
    const runTime = new Date();
    const result = []
    try {
        if (!dataList || dataList.length <= 0) {
            // dataList 빈껍질이면 빈 배열 return
            return []
        }

        let xAxisIdx = 0;
        const len = dataList.length
        const xAxisLength = xAxis.length

        for (let i = 0; i < len; i++) {
            if (xAxisIdx + 1 >= xAxisLength) {
                break;
            }
            const time = dataList[i].t
            if (xAxis[xAxisIdx] <= time && time < xAxis[xAxisIdx + 1]) {
                if (result[xAxisIdx]) {
                    merge(result[xAxisIdx], dataList[i])
                } else {
                    result[xAxisIdx] = Object.assign({}, dataList[i])
                    result[xAxisIdx].t = xAxis[xAxisIdx];
                    result[xAxisIdx].groupedCount = 1;
                }
            } else {
                xAxisIdx++
                i--;
            }
        }

        // volume 값 평균 계산
        const t = [];
        for (let i = 0; i < result.length; i++) {
            if (!result[i]) {
                continue;
            }
            result[i].tv /= result[i].groupedCount;
            result[i].tp /= result[i].groupedCount;
            t.push(result[i]);
        }
        return t
    } finally {
        console.log(`GroupedArray | originLen: ${dataList.length} -> resultLen:${result.length}, Time:${new Date() - runTime}`)
    }
}

export default groupedArray;