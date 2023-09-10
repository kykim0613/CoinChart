// Input 포맷 자르는 함수
export const sliceDateFunc = (value) => {
    return value.slice(0, 4) + value.slice(5, 7) + value.slice(8, 10)
}