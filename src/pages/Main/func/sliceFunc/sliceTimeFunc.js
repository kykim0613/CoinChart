//input type이 time일 때 자르는 함수
export const sliceTimeFunc = (value) => {
    return value.slice(16, 18) + value.slice(19, 21)
}