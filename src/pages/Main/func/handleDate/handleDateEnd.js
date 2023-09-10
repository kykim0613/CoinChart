import { transFormat } from "../transFormat/transFormat"

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