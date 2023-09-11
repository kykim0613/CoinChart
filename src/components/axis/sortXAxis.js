export const sortXAxis = (x, y) => {
    let result = []
    const xLength = x.length

    for (let i = 0; i < xLength; i++) {
        result.push({ x: x[i], y: y[i] })
    }

    return result
}

export default sortXAxis;