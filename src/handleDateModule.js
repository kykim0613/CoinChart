// 한시간을 밀리세컨트로 나타냄
const hour = 60 * 60 * 1000
// 하루를 밀리세컨드로 나타냄
const day = 24 * 60 * 60 * 1000
// 일주일
const week = day * 7

export const handleMinBtn = (setBtn) => {
    setBtn("min")
}
export const handleHourBtn = (setBtn) => {
    setBtn("hour")
}
export const handleDateBtn = (setBtn) => {
    setBtn("date")
}
export const handleWeekBtn = (setBtn) => {
    setBtn("week")
}
export const handleMonthBtn = (setBtn) => {
    setBtn("month")
}


// Input 포맷 자르는 함수
export const sliceDatefunc = (value) => {
    return value.slice(0, 4) + value.slice(5, 7) + value.slice(8, 10)
}

//input type이 time일 때 자르는 함수
export const sliceTimeFunc = (value) => {
    return value.slice(16, 18) + value.slice(19, 21)
}

//데이터를 yyyyMMddhhmm 포맷으로 바꿔주는 함수
const transFormat = (value) => {
    const str = `${value}`
    return Number(value.slice(0, 4) + value.slice(5, 7) + value.slice(8, 10) + value.slice(11, 13) + value.slice(14, 16))
}

// startInput을 눌러서 날짜가 변경되는걸 반영해주는 함수
export const handleDateStart = (value, setInputRange, end, e) => {

    if (transFormat(value) < end) {
        setInputRange({s: value, e: e})
    } else {
        alert(`시작날짜는 종료날짜보다 클 수 없습니다.`)
    }
}

// endInput을 눌러서 날짜가 변경되는걸 반영해주는 함수
export const handleDateEnd = (value, setInputRange, start, s) => {

    if (start < transFormat(value)) {
        setInputRange({s: s, e: value})
    } else {
        alert(`시작날짜는 종료날짜보다 클 수 없습니다.`)
    }
}

// -공사중-
//두 인풋에 동일하게 더하는 버튼
export const handlePlus = (setInputRange, inputRange, btn) => {
    const startDate = btn === "hour" ? new Date(inputRange.s) : new Date(inputRange.s.slice(0, 10))
    const endDate = btn === "hour" ? new Date(inputRange.e) : new Date(inputRange.e.slice(0, 10))

    const startTime = new Date(startDate.getTime() + hour).getHours()
    const endTime = new Date(endDate.getTime() + hour).getHours()

    const range = btn === "date" ? day : btn === "week" ? week : null

    const plusStart = new Date(startDate.getTime() + range)
    const plustEnd = new Date(endDate.getTime() + range)

    const s = plusStart.toISOString().slice(0,10) + (btn === "hour" ? (startTime < 10 ? `T0${startTime}:00` : 'T'+startTime+':00') : `T00:00`)
    const e = plustEnd.toISOString().slice(0,10) + (btn === "hour" ? (endTime < 10 ? `T0${endTime}:00` : 'T'+endTime+':00') : `T00:00`)

    // const monthObj = new Date(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate())

    setInputRange({s: s, e: e})
    console.log(s, endTime)
}

//두 인풋에 동일하게 빼는 버튼
export const handleMinus = (setInputRange, inputRange, btn) => {
    const startDate = btn === "hour" ? new Date(inputRange.s) : new Date(inputRange.s.slice(0, 10))
    const endDate = btn === "hour" ? new Date(inputRange.e) : new Date(inputRange.e.slice(0, 10))

    const range = btn === "date" ? day : btn === "week" ? week : null

    const startTime = new Date(startDate.getTime() - hour).getHours()
    const endTime = new Date(endDate.getTime() - hour).getHours()

    const minusStart = new Date(startDate.getTime() - range)
    const minusEnd = new Date(endDate.getTime() - range)

    const s = minusStart.toISOString().slice(0,10) + (btn === "hour" ? (startTime < 10 ? `T0${startTime}:00` : 'T'+startTime+':00') : `T00:00`)
    const e = minusEnd.toISOString().slice(0,10) + (btn === "hour" ? (endTime < 10 ? `T0${endTime}:00` : 'T'+endTime+':00') : `T00:00`)

    setInputRange({s: s, e: e})
}