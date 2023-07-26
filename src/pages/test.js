// const open = groupedArray(onpeningPrice, i, size)
// const close = groupedArray(closePrice, i, size)
// const high = groupedArray(highPrice, i, size)
// const low = groupedArray(lowPrice, i, size)
// const vol = groupedArray(volume, i, size)
// const time = groupedArray(upTime, i, size)

// const data = {
//     openingPrice: open[0],
//     closePrice: close[close.length - 1],
//     highPrice: Math.max(...high),
//     lowPrice: Math.min(...low),
//     candleAccTradeVolume: vol.reduce((a, b) => a + b) / size,
//     dateTimeUtc: time[time.length - 1],
// }
// dataArray.push(data)

// const data = [1, 2, 6, 9, 11, 14, 15, 17, 18, 19];
// const result = [];
// let sliceSize = 5;
// let num = sliceSize
// let count = 2

// let sum = 0;

// for (let i = 0; i < data.length; i++) {

//     if(data[i] <= sliceSize ) {
//         sum += data[i]
//     }

//     if(sliceSize < data[i]){
//         result.push(sum)
//         sum = 0
//         sliceSize = num * count
//         count++
//         i--
//     }
// }
// if (sum > 0){
//     result.push(sum)
// }
// console.log(result, sum);



// const list = [1, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 19, 20];

// const n = 5;

// const resultList = compressList(n, list);
// console.log(resultList)

// // const resultList2 = compressList2(n, list);
// // console.log(resultList2)

// function compressList(limit, list) {
//     const resultList = [];

//     const start = 0; // list[0] 의 시작 기준값

//     let t = start + limit; // 시간 관련 함수로 바꿀부분
//     let sum = 0;
//     let len = list.length;
//     for (let i = 0; i < len; i++) {
//         if (list[i] <= t) {
//             sum += list[i]; // Point merge 함수 들어가야하는 부분
//         } else {
//             resultList.push(sum);
//             sum = 0; // push 후 초기화

//             t += limit; // 범위 증가, 시간 관련 함수로 바꿀부분
//             i--; // 현재 list[i] 값 계산 안했으니 뒤로 Back
//         }
//     }
//     resultList.push(sum);
//     return resultList;
// }

// function compressList2(limit, list) {
//     const resultList = [];

//     const start = 0; // list[0] 의 시작 기준값

//     let t = start + limit; // 시간 관련 함수로 바꿀부분
//     let idx = 0;
//     let len = list.length;
//     for (let i = 0; i < len; i++) {
//         if (list[i] <= t) {
//             if (!resultList[idx]) resultList[idx] = 0;
//             resultList[idx] += list[i]; // Point merge 함수 들어가야하는 부분
//         } else {
//             idx++; // resultList 다음 칸으로 이동

//             t += limit; // 범위 증가, 시간 관련 함수로 바꿀부분
//             i--; // 현재 list[i] 값 계산 안했으니 뒤로 Back
//         }
//     }
//     return resultList;
// }