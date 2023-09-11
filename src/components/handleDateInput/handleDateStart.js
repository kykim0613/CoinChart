import transFormat from "./transFormat"

// startInput을 눌러서 날짜가 변경되는걸 반영해주는 함수
const handleDateStart = (value, end, inputRange) => {

    const now = new Date(inputRange.s)
    const next = new Date(now)
    next.setMonth(now.getMonth() + 1)

    const month = next - now

    const currentMonth = new Date(value)
    const nextMonth = new Date(inputRange.e)

    const compare = nextMonth - currentMonth

    if(compare < month){
        if (transFormat(value) < end) {
            return {s: value, e: inputRange.e}
        } else {
            return alert(`시작날짜는 종료날짜보다 클 수 없습니다.`)
        }
    } else {
        return alert(`한달 이내로만 선택이 가능합니다.`)
    }
}

export default handleDateStart;