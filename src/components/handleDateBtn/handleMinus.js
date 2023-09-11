// 한시간을 밀리세컨트로 나타냄
const hour = 60 * 60 * 1000
// 하루를 밀리세컨드로 나타냄
const day = 24 * 60 * 60 * 1000
// 일주일
const week = day * 7

//두 인풋에 동일하게 빼는 버튼
const handleMinus = (inputRange, btn) => {
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

    return {s: s, e: e}
}

export default handleMinus;