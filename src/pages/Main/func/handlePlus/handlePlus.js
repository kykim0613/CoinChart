// 한시간을 밀리세컨트로 나타냄
const hour = 60 * 60 * 1000
// 하루를 밀리세컨드로 나타냄
const day = 24 * 60 * 60 * 1000
// 일주일
const week = day * 7

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