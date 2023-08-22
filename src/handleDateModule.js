import { ListAPI } from "./api"

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

// 맨 처음 딱 한번만 호출하는 coinList
export const fetchData = async (setCoinList, setStartDateInput, setEndDateInput, setStartTimeInput, setEndTimeInput) => {
    try {
        const data1 = await ListAPI()
        setCoinList(data1)

        const start = data1[0].e - 100
        const end = data1[0].e

        inputDate(start, end, setStartDateInput, setEndDateInput, setStartTimeInput, setEndTimeInput)

    } catch (error) {
        console.log(error)
    }
}

// 날짜, 시간 input 데이터 함수
export const inputDate = (startDate, endDate, setStartDateInput, setEndDateInput, setStartTimeInput, setEndTimeInput) => {
    
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

    setStartDateInput(`${startYear}-${startMonth < 10 ? '0' + startMonth : startMonth}-${startDay < 10 ? '0' + startDay : startDay}`)
    setEndDateInput(`${endYear}-${endMonth < 10 ? '0' + endMonth : endMonth}-${endDay < 10 ? '0' + endDay : endDay}`)

    setStartTimeInput(`${startHour < 10 ? '0' + startHour : startHour}:${startMin < 10 ? '0' + startMin : startMin}`)
    setEndTimeInput(`${endHour < 10 ? '0' + endHour : endHour}:${endMin < 10 ? '0' + endMin : endMin}`)
}

// 시간 00:00 고정 함수
export const fixTime = (setStartTimeInput, setEndTimeInput) => {
    setStartTimeInput('00:00')
    setEndTimeInput('00:00')
}

// Input 포맷 자르는 함수
export const sliceDatefunc = (value) => {
    return value.slice(0, 4) + value.slice(5, 7) + value.slice(8, 10)
}

export const toString = (string) => {
    return string.toISOString().slice(0, 10)
}

//input type이 time일 때 자르는 함수
export const sliceTimeFunc = (value) => {
    return value.slice(0, 2) + value.slice(3, 5)
}

// 한시간을 밀리세컨트로 나타냄
const hour = 60 * 60 * 1000
// 하루를 밀리세컨드로 나타냄
const day = 24 * 60 * 60 * 1000
// 일주일
const week = day * 7

// start Date를 input 눌러 선택할 때
export const handleDateStart = (btn, value, setStartDateInput, setEndDateInput, endDate, startTime, endTime) => {
        const start = new Date(value)

        const endDay = new Date(start.getTime() + day)

        const endWeek = new Date(start.getTime() + week)

        const endMonth = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate())

        if (btn === "min" || "hour") {
            if (Number(`${sliceDatefunc(value)}${startTime}`) < Number(`${endDate}${endTime}`)) {
                setStartDateInput(value)
            } else {
                alert(`시작날짜는 종료날짜보다 클 수 없습니다.`)
            }

        }

        if (btn === "date") {
            setStartDateInput(value)
            setEndDateInput(toString(endDay))
        }

        if (btn === "week") {
            setStartDateInput(value)
            setEndDateInput(toString(endWeek))
        }

        if (btn === "month") {
            setStartDateInput(value)
            setEndDateInput(toString(endMonth))
        }
    }

// end Date를 input 눌러 선택할 때
export const handleDateEnd = (btn, value, setStartDateInput, setEndDateInput, startDate, startTime, endTime) => {
        const end = new Date(value)

        const prevDay = new Date(end.getTime() - day)

        const prevWeek = new Date(end.getTime() - week)

        const prevMonth = new Date(end.getFullYear(), end.getMonth() - 1, end.getDate())

        if (btn === "min" || "hour") {
            if (Number(`${startDate}${startTime}`) < Number(`${sliceDatefunc(value)}${endTime}`)) {
                setEndDateInput(value)
            } else {
                alert(`시작날짜는 종료날짜보다 클 수 없습니다.`)
            }

        }
        if (btn === "date") {
            setStartDateInput(toString(prevDay))
            setEndDateInput(value)
        }
        if (btn === "week") {
            setStartDateInput(toString(prevWeek))
            setEndDateInput(value)
        }
        if (btn === "month") {
            setStartDateInput(toString(prevMonth))
            setEndDateInput(value)
        }
    }

// start Input만 더하는 버튼 컨트롤러
export const handleStartPlusBtn = (btn, startDateInput, startTimeInput, setStartTimeInput, setStartDateInput, endDate, endTime) => {
    const obj = new Date(startDateInput)
    const hours = startTimeInput.slice(0, 2)
    const mins = startTimeInput.slice(3)

    const currentDate = new Date()
    currentDate.setHours(hours)
    currentDate.setMinutes(mins)

    const timeObj = new Date(currentDate.getTime() + hour)
    const hourObj = timeObj.getHours()
    const minObj = timeObj.getMinutes()
    const time = `${hourObj < 10 ? `0${hourObj}` : hourObj}:${minObj < 10 ? `0${minObj}` : minObj}`
    const numTime = `${hourObj < 10 ? `0${hourObj}` : hourObj}${minObj < 10 ? `0${minObj}` : minObj}`

    const dateObj = new Date(obj.getTime() + day)

    const weekObj = new Date(obj.getTime() + week)

    const monthObj = new Date(obj.getFullYear(), obj.getMonth() + 1, obj.getDate())

    if (btn === "hour") {
        if (Number(`${startDate}${numTime}`) < Number(`${endDate}${endTime}`)) {
            setStartTimeInput(time)
            // 시간이 0시를 지나갈 때 날짜 변경하는 부분
            if (hourObj === 0) {
                setStartDateInput(toString(dateObj))
            }
        } else {
            alert("startTime은 endTime보다 클 수 없습니다.")
        }
    }

    if (btn === "date") {
        if (sliceDatefunc(toString(dateObj)) < endDate) {
            setStartDateInput(toString(dateObj))

        } else {
            alert("startDate은 endDate보다 클 수 없습니다.")
        }
    }

    if (btn === "week") {
        if (sliceDatefunc(toString(weekObj)) < endDate) {
            setStartDateInput(toString(weekObj))

        } else {
            alert("startDate은 endDate보다 클 수 없습니다.")
        }
    }

    if (btn === "month") {
        if (sliceDatefunc(toString(monthObj)) < endDate) {

            setStartDateInput(toString(monthObj))
        } else {
            alert("startDate은 endDate보다 클 수 없습니다.")
        }
    }
}

// start Input만 빼는 버튼 컨트롤러
export const handleStartMinusBtn = (btn, startDateInput, startTimeInput, setStartTimeInput, setStartDateInput) => {
    const object = new Date(startDateInput)

    const hours = startTimeInput.slice(0, 2)
    const mins = startTimeInput.slice(3)

    const currentDate = new Date()
    currentDate.setHours(hours)
    currentDate.setMinutes(mins)

    const timeObj = new Date(currentDate.getTime() - hour)
    const hourObj = timeObj.getHours()
    const minObj = timeObj.getMinutes()
    const time = `${hourObj < 10 ? `0${hourObj}` : hourObj}:${minObj < 10 ? `0${minObj}` : minObj}`

    const dateObj = new Date(object.getTime() - day)

    const weekObj = new Date(object.getTime() - week)

    const monthObj = new Date(object.getFullYear(), object.getMonth() - 1, object.getDate())

    if (btn === "hour") {
        setStartTimeInput(time)
        // 시간이 23시를 지나갈 때 날짜 변경하는 부분
        if (hourObj === 23) {
            setStartDateInput(toString(dateObj))
        }

    }

    if (btn === "date") {
        setStartDateInput(toString(dateObj))
    }

    if (btn === "week") {
        setStartDateInput(toString(weekObj))
    }

    if (btn === "month") {
        setStartDateInput(toString(monthObj))
    }
}

// end Input만 더하는 버튼 컨트롤러
export const handleEndPlusBtn = (btn, endDateInput, endTimeInput, setEndDateInput, setEndTimeInput) => {
    const obj = new Date(endDateInput)
    const hours = endTimeInput.slice(0, 2)
    const mins = endTimeInput.slice(3)

    const currentDate = new Date()
    currentDate.setHours(hours)
    currentDate.setMinutes(mins)

    const timeObj = new Date(currentDate.getTime() + hour)
    const hourObj = timeObj.getHours()
    const minObj = timeObj.getMinutes()
    const time = `${hourObj < 10 ? `0${hourObj}` : hourObj}:${minObj < 10 ? `0${minObj}` : minObj}`

    const dateObj = new Date(obj.getTime() + day)
    const translateDate = toString(dateObj)

    const weekObj = new Date(obj.getTime() + week)
    const translateWeek = toString(weekObj)

    const monthObj = new Date(obj.getFullYear(), obj.getMonth() + 1, obj.getDate())
    const translateMonth = toString(monthObj)

    if (btn === "hour") {
        setEndTimeInput(time)
        if (hourObj === 0) {
            setEndDateInput(translateDate)
        }

    }

    if (btn === "date") {
        setEndDateInput(translateDate)
    }

    if (btn === "week") {
        setEndDateInput(translateWeek)
    }

    if (btn === "month") {
        setEndDateInput(translateMonth)
    }
}

// end Input만 빼는 버튼 컨트롤러
export const handleEndMinusBtn = (btn, endDateInput, endTimeInput, setEndDateInput, setEndTimeInput, startDate, startTime) => {
    const object = new Date(endDateInput)

    const hours = endTimeInput.slice(0, 2)
    const mins = endTimeInput.slice(3)

    const currentDate = new Date()
    currentDate.setHours(hours)
    currentDate.setMinutes(mins)

    const timeObj = new Date(currentDate.getTime() - hour)
    const hourObj = timeObj.getHours()
    const minObj = timeObj.getMinutes()
    const time = `${hourObj < 10 ? `0${hourObj}` : hourObj}:${minObj < 10 ? `0${minObj}` : minObj}`
    const numTime = `${hourObj < 10 ? `0${hourObj}` : hourObj}${minObj < 10 ? `0${minObj}` : minObj}`

    const dateObj = new Date(object.getTime() - day)
    const translateDate = toString(dateObj)

    const weekObj = new Date(object.getTime() - week)
    const translateWeek = toString(weekObj)

    const monthObj = new Date(object.getFullYear(), object.getMonth() - 1, object.getDate())
    const translateMonth = toString(monthObj)

    if (btn === "hour") {
        if (Number(`${startDate}${startTime}`) < Number(`${endDate}${numTime}`)) {
            setEndTimeInput(time)
            if (hourObj === 23) {
                setEndDateInput(translateDate)
            }
        } else {
            alert("endTime은 startTime보다 작을 수 없습니다.")
        }
    }

    if (btn === "date") {
        if (startDate < sliceDatefunc(translateDate)) {
            setEndDateInput(translateDate)
        } else {
            alert("endDate는 startDate보다 작을 수 없습니다.")
        }
    }

    if (btn === "week") {
        if (startDate < sliceDatefunc(translateWeek)) {
            setEndDateInput(translateWeek)
        } else {
            alert("endDate는 startDate보다 작을 수 없습니다.")
        }
    }

    if (btn === "month") {
        if (startDate < sliceDatefunc(translateMonth)) {
            setEndDateInput(translateMonth)
        } else {
            alert("endDate는 startDate보다 작을 수 없습니다.")
        }
    }
}

//두 인풋에 동일하게 더하는 버튼
export const handlePlus = (btn, endDateInput, endTimeInput, setStartDateInput, setEndDateInput, setStartTimeInput, setEndTimeInput) => {
    const object = new Date(endDateInput)

    const hours = endTimeInput.slice(0, 2)
    const mins = endTimeInput.slice(3)

    const currentDate = new Date()
    currentDate.setHours(hours)
    currentDate.setMinutes(mins)

    const timeObj = new Date(currentDate.getTime() + hour)
    const hourObj = timeObj.getHours()
    const minObj = timeObj.getMinutes()
    const time = `${hourObj < 10 ? `0${hourObj}` : hourObj}:${minObj < 10 ? `0${minObj}` : minObj}`

    const dateObj = new Date(object.getTime() + day)

    const weekObj = new Date(object.getTime() + week)

    const monthObj = new Date(object.getFullYear(), object.getMonth() + 1, object.getDate())

    if (btn === "hour") {
            setStartTimeInput(endTimeInput)
            setEndTimeInput(time)
            setStartDateInput(endDateInput)
            if (hourObj === 0) {
                setStartDateInput(endDateInput)
                setEndDateInput(toString(dateObj))
        }
    }

    if (btn === "date") {
            setStartDateInput(endDateInput)
            setEndDateInput(toString(dateObj))
    }

    if (btn === "week") {
        setStartDateInput(endDateInput)
        setEndDateInput(toString(weekObj))
    }

    if (btn === "month") {
        setStartDateInput(endDateInput)
        setEndDateInput(toString(monthObj))
    }
}

//두 인풋에 동일하게 빼는 버튼
export const handleMinus = (btn, startDateInput, startTimeInput, setStartTimeInput, setEndTimeInput, setStartDateInput, setEndDateInput) => {
    const object = new Date(startDateInput)

    const hours = startTimeInput.slice(0, 2)
    const mins = startTimeInput.slice(3)
    
    const currentDate = new Date()
    currentDate.setHours(hours)
    currentDate.setMinutes(mins)

    const timeObj = new Date(currentDate.getTime() - hour)
    const hourObj = timeObj.getHours()
    const minObj = timeObj.getMinutes()
    const time = `${hourObj < 10 ? `0${hourObj}` : hourObj}:${minObj < 10 ? `0${minObj}` : minObj}`

    const dateObj = new Date(object.getTime() - day)

    const weekObj = new Date(object.getTime() - week)

    const monthObj = new Date(object.getFullYear(), object.getMonth() - 1, object.getDate())

    if (btn === "hour") {
            setStartTimeInput(time)
            setEndTimeInput(startTimeInput)
            setEndDateInput(startDateInput)
            if (hourObj === 23) {
                setStartDateInput(toString(dateObj))
        }
    }

    if (btn === "date") {
            setStartDateInput(toString(dateObj))
            setEndDateInput(startDateInput)
    }

    if (btn === "week") {
        setStartDateInput(toString(weekObj))
        setEndDateInput(startDateInput)
    }

    if (btn === "month") {
        setStartDateInput(toString(monthObj))
        setEndDateInput(startDateInput)
    }
}