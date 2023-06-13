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

    const response = await fetch(`http://158.180.73.78:15000/api/upbit/markets`)
    const data = await response.json()

    return data
}

export const binanceListAPI = async () => {
    const response = await fetch(`http://158.180.73.78:15000/api/binance/symbols`)
    const data = await response.json()
    return data
}

export const upbitCandlesAPI = async (market, start, end) => {
    const response = await fetch(`http://158.180.73.78:15000/api/upbit/candles?market=KRW-${market}&start=${start}&end=${end}`)
    const data = await response.json()

    return data
}

export const binanceCandlesAPI = async (market, start, end) => {
    const response = await fetch(`http://158.180.73.78:15000/api/binance/candles?symbol=${market}USDT&start=${start}&end=${end}`)
    const data = await response.json()

    return data
}

// const response2 = await fetch(`http://158.180.73.78:15000/api/upbit/candles?market=KRW-BTC&start=${date[5].s}&end=${date[5].e}`)
//     const data = await response2.json()

// const response2 = await fetch(`http://158.180.73.78:15000/api/binance/candles?symbol=BTCUSDT&start=${date[5].s}&end=${date[5].e}`)
//     const data2 = await response2.json()