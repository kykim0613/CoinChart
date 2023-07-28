function solution(park, routes) {
    var answer = [];
    let start =[]
    const router = (i, j) => {
        let x = i
        let y = j
        for(let k = 0; k < routes.length; k++){
            if(routes[k][0] === "N"){
                x = x - Number(routes[k][2])
            }
            if(routes[k][0] === "S"){
                x = x + Number(routes[k][2])
            }
            if(routes[k][0] === "W"){
                y = y - Number(routes[k][2])
            }
            if(routes[k][0] === "E"){
                y = y + Number(routes[k][2])
            }
        }
        start.push(x, y)
        return start
    }
    
    for(let i = 0; i < park.length; i++) {
        for(let j = 0; j < park[i].length; j++){
            if(park[i][j] === 'S'){
                router(i, j)
                break
            }
        }
    }
    return answer;
}