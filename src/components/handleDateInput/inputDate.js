const inputDate = (value, state) => {
    // 한시간을 밀리세컨트로 나타냄
    const hour = 60 * 60 * 1000
    // 하루를 밀리세컨드로 나타냄
    const day = 24 * 60 * 60 * 1000
    // 일주일
    const week = day * 7

    //날짜 객체로 바꾸기 위해 포맷 맞추기
    const stringValue = `${value}`
    const format = `${stringValue.slice(0, 4)}-${stringValue.slice(4, 6)}-${stringValue.slice(6, 8)}T${state === "hour" ? stringValue.slice(8, 10) : '00'}:00`
    
    //한달치 시간을 밀리세컨드로 구하는 식
    const currentMonth = new Date(format)
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(currentMonth.getMonth()+1)

    //"주" 버튼으로 볼 때 무조건 월요일이 되게 분기처리
    const count = new Date(format).getDay() === 0 ? -1 : new Date(format).getDay() - 1
    const end = 
    state === "week" ? new Date(new Date(format).getTime() - (day * count)) : new Date(format)

    const start =
    state === "hour" ? new Date(end.getTime() - hour) :
    state === "date" ? new Date(end.getTime() - day) :
    state === "week" ? new Date(end.getTime() - week) :
    state === "month" ? new Date(end.getTime()) :
    alert("에러 발생")


    const startTime = new Date(start).getHours()
    const startDay = new Date(start).getDate()
    const startMonth = new Date(start).getMonth() + 1
    const startYear = new Date(start).getFullYear()

    const endTime = new Date(end).getHours()
    const endDay = new Date(end).getDate()
    const endMonth = new Date(end).getMonth() + 1
    const endYear = new Date(end).getFullYear()

    const s = `${startYear}-${startMonth < 10 ? '0' + startMonth : startMonth}-${state === "month" ? '01' : startDay < 10 ? '0' + startDay : startDay}T${state === "hour" ? `${startTime < 10 ? `0${startTime}` : startTime}:00` : `00:00`}`
    const e = `${endYear}-${endMonth < 10 ? '0' + endMonth : endMonth}-${endDay < 10 ? '0' + endDay : endDay}T${state === "hour" ? `${endTime < 10 ? `0${endTime}` : endTime}:00` : `00:00`}`

    return {s: s, e: e}
}

export default inputDate;