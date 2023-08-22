import { ip } from "./data.config"

export const upbitListAPI = async () => {

    const response = await fetch(`/api/upbit/markets`)
    const data = await response.json()

    return data
}

export const binanceListAPI = async () => {
    const response = await fetch(`/api/binance/markets`)
    const data = await response.json()
    return data
}

export const upbitCandlesAPI = async (market, start, end) => {
    const response = await fetch(`/api/upbit/candles?market=KRW-${market}&start=${start}&end=${end}`)
    const data = await response.json()

    return data
}

export const binanceCandlesAPI = async (market, start, end) => {
    const response = await fetch(`/api/binance/candles?market=${market}USDT&start=${start}&end=${end}`)
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
