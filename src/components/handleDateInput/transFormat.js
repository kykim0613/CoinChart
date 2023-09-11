//데이터를 yyyyMMddhhmm 포맷으로 바꿔주는 함수
const transFormat = (value) => {
    // const str = `${value}`
    return Number(value.slice(0, 4) + value.slice(5, 7) + value.slice(8, 10) + value.slice(11, 13) + value.slice(14, 16))
}

export default transFormat;