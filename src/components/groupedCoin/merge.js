/**
     * 점 두개를 하나로 합치는 함수.
     *
     * @param m1 merge 할 데이터1
     * 원본 객체로 들어오면 데이터가 변형되므로, clone 된 객체가 들어와야함.
     * @param m2 merge 할 데이터2
     * 원본 데이터가 들어와도 괜찮음. 참조만 함.
     * @returns {*} merge 된 결과 return.
     */
const merge = (m1, m2) => {
    if (m1.t < m2.t) {
        m1.cp = m2.cp
    } else {
        m1.op = m2.op
    }
    m1.hp = Math.max(m1.hp, m2.hp)
    m1.lp = Math.min(m1.lp, m2.lp)
    m1.tv += m2.tv
    m1.tp += m2.tp
    m1.groupedCount++
    return m1;
}

export default merge;