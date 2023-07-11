import { ip } from "./data.config"

const timeStamp = Date.now()
const date = new Date(timeStamp)
const year = date.getFullYear()
const month = date.getMonth() + 1
const beforeMonth = date.getMonth()
const day = date.getDate()
const hours = date.getHours()
const minutes = date.getMinutes()

export const rateAPI = async () => {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/deadfe07b4ad3228e49d3a4d/latest/USD`)
    const data = await response.json()

    return data
}

export const upbitMinutesAPI = async () => {
    const response = await fetch('https://api.upbit.com/v1/candles/minutes/1?market=KRW-BTC&count=1')
    const data = await response.json()

    return data
}

export const upbitTicksAPI = async () => {
    const response = await fetch('https://api.upbit.com/v1/trades/ticks?market=KRW-BTC&count=1')
    const data = await response.json()

    return data
}

export const binanceAPI = async () => {
    const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
    const data = await response.json();

    return data
}



export const upbitListAPI = async () => {

    const response = await fetch(`http://${ip}/api/upbit/markets`)
    const data = await response.json()

    return data
}

export const binanceListAPI = async () => {
    const response = await fetch(`http://${ip}/api/binance/markets`)
    const data = await response.json()
    return data
}

export const upbitCandlesAPI = async (market, start, end, startTime, endTime) => {
    const response = await fetch(`http://${ip}/api/upbit/candles?market=KRW-${market}&start=${start}${startTime}&end=${end}${endTime}`)
    const data = await response.json()

    return data
}

export const binanceCandlesAPI = async (market, start, end, startTime, endTime) => {
    const response = await fetch(`http://${ip}/api/binance/candles?market=${market}USDT&start=${start}${startTime}&end=${end}${endTime}`)
    const data = await response.json()

    return data
}

export const ListAPI = async () => {
    const data1 = await upbitListAPI()

    const data2 = await binanceListAPI()

    const dataFilter = data1.filter((item1) => {
        return data2.some((item2) => {
            return item1.t.slice(4, item1.t.length) === item2.t.slice(0, item2.t.length - 4)
        })
    }).map((item) => item)
    return dataFilter
}
