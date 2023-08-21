export const handleMinBtn = () => {
    setBtn("min")
    setSelectedTime(100)
    // setLoader(true)
    inputDate(coinList[selectedIndex].e - 100, coinList[selectedIndex].e)
}
export const handleHourBtn = () => {
    setBtn("hour")
    setSelectedTime(100)
    // setLoader(true)
    inputDate(coinList[selectedIndex].e - 100, coinList[selectedIndex].e)
}
export const handleDateBtn = () => {
    setBtn("date")
    setSelectedTime(10000)
    // setLoader(true)
    inputDate(coinList[selectedIndex].e - 10000, coinList[selectedIndex].e)
    fixTime()
}
export const handleWeekBtn = () => {
    setBtn("week")
    setSelectedTime(70000)
    // setLoader(true)
    inputDate(coinList[selectedIndex].e - 70000, coinList[selectedIndex].e)
    fixTime()
}
export const handleMonthBtn = () => {
    setBtn("month")
    setSelectedTime(1000000)
    // setLoader(true)
    inputDate(coinList[selectedIndex].e - 1000000, coinList[selectedIndex].e)
    fixTime()
}