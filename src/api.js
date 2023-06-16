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
    const response = await fetch(`http://${ip}/api/binance/symbols`)
    const data = await response.json()
    return data
}

export const upbitCandlesAPI = async (market, start, end) => {
    const response = await fetch(`http://${ip}/api/upbit/candles?market=KRW-${market}&start=${start}&end=${end}`)
    const data = await response.json()
    console.log(data)

    return data
}

export const binanceCandlesAPI = async (market, start, end) => {
    const response = await fetch(`http://${ip}/api/binance/candles?symbol=${market}USDT&start=${start}&end=${end}`)
    const data = await response.json()

    return data
}

export const ListAPI = async () => {
    const data1 = await upbitListAPI()
    const dataList = data1.map((data) => data)
    const upbitSymbol = data1.map((title) => title.t.slice(4, title.t.length))

    const data2 = await binanceListAPI()
    const binanceSymbol = data2.map((title) => title.t.slice(0, title.t.length - 4))

    let coinListArray = []
    for (let i = 0; i < upbitSymbol.length; i++) {
        for (let j = 0; j < binanceSymbol.length; j++) {
            if (upbitSymbol[i] === binanceSymbol[j]) {
                coinListArray = [...coinListArray, dataList[i]]
            }
        }
    }
    return coinListArray
}