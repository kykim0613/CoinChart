export const handleMinBtn = (setBtn, setSelectedTime) => {
    setBtn("min")
    setSelectedTime(100)
    // setLoader(true)
}
export const handleHourBtn = (setBtn, setSelectedTime) => {
    setBtn("hour")
    setSelectedTime(100)
    // setLoader(true)
}
export const handleDateBtn = (setBtn, setSelectedTime) => {
    setBtn("date")
    setSelectedTime(10000)
    // setLoader(true)
}
export const handleWeekBtn = (setBtn, setSelectedTime) => {
    setBtn("week")
    setSelectedTime(70000)
    // setLoader(true)
}
export const handleMonthBtn = (setBtn, setSelectedTime) => {
    setBtn("month")
    setSelectedTime(1000000)
    // setLoader(true)
}

// 날짜, 시간 input 데이터 함수
export const inputDate = (startDate, endDate) => {
    const start = startDate / 10000 | 0
    const end = endDate / 10000 | 0

    const startYear = startDate / 100000000 | 0
    const startMonth = startDate / 1000000 % 100 | 0
    const startDay = startDate / 10000 % 100 | 0
    const startHour = startDate / 100 % 100 | 0
    const startMin = startDate % 100 | 0

    const endYear = endDate / 100000000 | 0
    const endMonth = endDate / 1000000 % 100 | 0
    const endDay = endDate / 10000 % 100 | 0
    const endHour = endDate / 100 % 100 | 0
    const endMin = endDate % 100 | 0

    setStartDate(start)
    setEndDate(end)

    setStartDateInput(`${startYear}-${startMonth < 10 ? '0' + startMonth : startMonth}-${startDay < 10 ? '0' + startDay : startDay}`)
    setEndDateInput(`${endYear}-${endMonth < 10 ? '0' + endMonth : endMonth}-${endDay < 10 ? '0' + endDay : endDay}`)

    setStartTimeInput(`${startHour < 10 ? '0' + startHour : startHour}:${startMin < 10 ? '0' + startMin : startMin}`)
    setEndTimeInput(`${endHour < 10 ? '0' + endHour : endHour}:${endMin < 10 ? '0' + endMin : endMin}`)
    setStartTime(Number(`${startHour < 10 ? '0' + startHour : startHour}${startMin < 10 ? '0' + startMin : startMin}`))
    setEndTime(Number(`${endHour < 10 ? '0' + endHour : endHour}${endMin < 10 ? '0' + endMin : endMin}`))
}

export const fixTime = (setStartTime, setStartTimeInput, setEndTime, setEndTimeInput) => {
    setStartTime('0000')
    setStartTimeInput('00:00')
    setEndTime('0000')
    setEndTimeInput('00:00')
}