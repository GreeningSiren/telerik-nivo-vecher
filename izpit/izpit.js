function srednoAritmetichnoNaMasi(masiv) {
    let sbor = 0
    for(let i=0;i<masiv.length;i++){
        sbor += masiv[i];
    }
    return sbor / masiv.length
}

console.log(srednoAritmetichnoNaMasi([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))



let brHora= 10
let chovekX = [], chovekY = [];

for(let i=0; i<brHora; i++){
    chovekX[i] = i;
    chovekY[i] = i;
    console.log(chovekX[i], chovekY[i])
}


function nqkoq(masiv){
    kalkulacii;
    return rezultata;
}

masiv = [];
masiv[0] = 1;
masiv[1] = 2;
masiv[2] = 120891280324098432;
console.log(masiv)

function najGolqmoto(masiv){
    let najgolqmo = -Infinity;
    for(let i=0;i<masiv.length;i++){
        if(masiv[i] > najgolqmo){
            najgolqmo = masiv[i];
        }
    }
    return najgolqmo;
}

console.log(najGolqmoto([0,5,2,10,-1,59,12,696])) // 696
console.log(najGolqmoto([-1,-2,-3,-4,-5])) // -1

console.log(najGolqmoto([0.2,22,18,20,15])) // 22


function najMalko() {
    
}