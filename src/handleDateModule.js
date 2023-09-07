// 한시간을 밀리세컨트로 나타냄
const hour = 60 * 60 * 1000
// 하루를 밀리세컨드로 나타냄
const day = 24 * 60 * 60 * 1000
// 일주일
const week = day * 7

const month = day * 30

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
export const handleDateStart = (value, setInputRange, end, inputRange) => {

    const now = new Date(inputRange.s)
    const next = new Date(now)
    next.setMonth(now.getMonth() + 1)

    const month = next - now

    const currentMonth = new Date(value)
    const nextMonth = new Date(inputRange.e)

    const compare = nextMonth - currentMonth

    if(compare < month){
        if (transFormat(value) < end) {
            setInputRange({s: value, e: inputRange.e})
        } else {
            alert(`시작날짜는 종료날짜보다 클 수 없습니다.`)
        }
    } else {
        alert(`한달 이내로만 선택이 가능합니다.`)
    }
}

// endInput을 눌러서 날짜가 변경되는걸 반영해주는 함수
export const handleDateEnd = (value, setInputRange, start, inputRange) => {

    const now = new Date(inputRange.e)
    const next = new Date(now)
    next.setMonth(now.getMonth() + 1)

    const month = next - now

    const currentMonth = new Date(inputRange.s)
    const nextMonth = new Date(value)

    const compare = nextMonth - currentMonth

    if(compare < month){
        if (start < transFormat(value)) {
            setInputRange({s: inputRange.s, e: value})
        } else {
            alert(`시작날짜는 종료날짜보다 클 수 없습니다.`)
        }
    } else {
        alert(`한달 이내로만 선택이 가능합니다.`)
    }
}

//두 인풋에 동일하게 더하는 버튼
export const handlePlus = (setInputRange, inputRange, btn) => {
    const start = new Date(inputRange.s)
    const end = new Date(inputRange.e)

    //말일 구하기
    const currentMonth = new Date(inputRange.s)
    currentMonth.setMonth(currentMonth.getMonth() + 1)
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(currentMonth.getMonth() + 1)
    const year = nextMonth.getFullYear()
    const month = nextMonth.getMonth() + 1
    const lastDayFormat = `${year}-${month < 10 ? `0${month}` : month}-01T00:00`
    const lastDay = new Date(new Date(lastDayFormat).getTime() - day).getDate()

    const plusStartTime = new Date(start.getTime() + (btn === "hour" ? hour : null))
    const plusEndTime = new Date(end.getTime() + (btn === "hour" ? hour : null))

    const plusStartDate = new Date(start.getTime() + (btn === "date" ? day : btn === "week" ? week : null))
    const plusEndDate = new Date(end.getTime() + (btn === "date" ? day : btn === "week" ? week : null))

    const startTime = btn === "hour" ? new Date(plusStartTime).getHours() : new Date(plusStartDate).getHours()
    const endTime = btn === "hour" ? new Date(plusEndTime).getHours() : new Date(plusEndDate).getHours()
    
    const startDate = btn === "hour" ? new Date(plusStartTime).getDate() : new Date(plusStartDate).getDate()
    const endDate = btn === "hour" ? new Date(plusEndTime).getDate() : new Date(plusEndDate).getDate()

    const startMonth = btn === "hour" ?  new Date(plusStartTime).getMonth() + 1 : btn === "month" ? new Date(currentMonth).getMonth() + 1 :  new Date(plusStartDate).getMonth() + 1
    const endMonth = btn === "hour" ? new Date(plusEndTime).getMonth() + 1 : btn === "month" ? new Date(currentMonth).getMonth() + 1 : new Date(plusEndDate).getMonth() + 1

    const startYear = btn === "hour" ? new Date(plusStartTime).getFullYear() : btn === "month" ? new Date(currentMonth).getFullYear() : new Date(plusStartDate).getFullYear()
    const endYear = btn === "hour" ? new Date(plusEndTime).getFullYear() : btn === "month" ? new Date(currentMonth).getFullYear() : new Date(plusEndDate).getFullYear()
    

    const s = `${startYear}-${startMonth < 10 ? `0${startMonth}` : startMonth}-${btn === "month" ? '01' : startDate < 10 ? `0${startDate}` : startDate}T${btn === "hour" ? (startTime < 10 ? `0${startTime}` : startTime) : `00`}:00`
    const e = `${endYear}-${endMonth < 10 ? `0${endMonth}` : endMonth}-${btn === "month" ? lastDay : endDate < 10 ? `0${endDate}` : endDate}T${btn === "hour" ? (endTime < 10 ? `0${endTime}` : endTime) : `00`}:00`

    setInputRange({s: s, e: e})
}

//두 인풋에 동일하게 빼는 버튼
export const handleMinus = (setInputRange, inputRange, btn) => {
    const start = new Date(inputRange.s)
    const end = new Date(inputRange.e)

    //말일 구하기
    const currentMonth = new Date(inputRange.s)
    const preMonth = new Date(currentMonth)
    preMonth.setMonth(currentMonth.getMonth() - 1)
    const year = preMonth.getFullYear()
    const month = currentMonth.getMonth() + 1
    const lastDayFormat = `${year}-${month < 10 ? `0${month}` : month}-01T00:00`
    const lastDay = new Date(new Date(lastDayFormat).getTime() - day).getDate()

    const minusStartTime = new Date(start.getTime() - (btn ==="hour" ? hour : null))
    const minusEndTime = new Date(end.getTime() - (btn ==="hour" ? hour : null))

    const minusStartDate = new Date(start.getTime() - (btn ==="date" ? day : btn === "week" ? week : null))
    const minusEndDate = new Date(end.getTime() - (btn ==="date" ? day : btn === "week" ? week : null))

    const startTime = btn === "hour" ? new Date(minusStartTime).getHours() : new Date(minusStartDate).getHours()
    const endTime = btn === "hour" ? new Date(minusEndTime).getHours() : new Date(minusEndDate).getHours()
    
    const startDate = btn === "hour" ? new Date(minusStartTime).getDate() : new Date(minusStartDate).getDate()
    const endDate = btn === "hour" ? new Date(minusEndTime).getDate() : new Date(minusEndDate).getDate()

    const startMonth = btn === "hour" ?  new Date(minusStartTime).getMonth() + 1 : btn === "month" ? new Date(preMonth).getMonth() + 1 :  new Date(minusStartDate).getMonth() + 1
    const endMonth = btn === "hour" ? new Date(minusEndTime).getMonth() + 1 : btn === "month" ? new Date(preMonth).getMonth() + 1 : new Date(minusEndDate).getMonth() + 1

    const startYear = btn === "hour" ? new Date(minusStartTime).getFullYear() : btn === "month" ? new Date(preMonth).getFullYear() : new Date(minusStartDate).getFullYear()
    const endYear = btn === "hour" ? new Date(minusEndTime).getFullYear() : btn === "month" ? new Date(preMonth).getFullYear() : new Date(minusEndDate).getFullYear()
    
    const s = `${startYear}-${startMonth < 10 ? `0${startMonth}` : startMonth}-${btn === "month" ? '01' : startDate < 10 ? `0${startDate}` : startDate}T${btn === "hour" ? (startTime < 10 ? `0${startTime}` : startTime) : `00`}:00`
    const e = `${endYear}-${endMonth < 10 ? `0${endMonth}` : endMonth}-${btn === "month" ? lastDay : endDate < 10 ? `0${endDate}` : endDate}T${btn === "hour" ? (endTime < 10 ? `0${endTime}` : endTime) : `00`}:00`

    setInputRange({s: s, e: e})
}