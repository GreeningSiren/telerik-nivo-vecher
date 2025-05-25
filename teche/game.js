// w - ширината на двумерния масив
// h - височината на двумерния масив
// initCellCB е функция, която приема 2 числа и връща число. НАПРИМЕР:
// function ASDF(col, red) {
//      return //типа на клетката, която се намира на col и red//
// }
// Функцията връща двумерен масив с размери w и h
function make2DArray(w, h, initCellCB) {
    let arr = [];
    for(let i = 0; i < w; i++) {
        arr[i] = [];
        for(let j = 0; j < h; j++) {
            arr[i][j] = initCellCB(i, j);
        }
    }
    return arr;
}
function copy2DArray(oldArray) {
    function copyCellFromOldArray(col, red) {
        return oldArray[col][red];
    }
    return make2DArray(GRID_W, GRID_H, copyCellFromOldArray);
}
let pole, CELL_SIZE, GRID_W, GRID_H, ogradaShir;
let kartinkaZaTipPole;


function DAI_NULA(col, red) {
    return 0;
}
function DAI_RANDOM(col, red) {
    return randomInteger(3);
}
function GENERATE_OGRADA(col, red) {
    if (col < ogradaShir ||
        col > GRID_W - 1 - ogradaShir ||
        red < ogradaShir ||
        red > GRID_H - 1 - ogradaShir) {
        return 1;
    } else {
        return 0;
    }
}
function init() {
    CELL_SIZE = 15; 
    GRID_W = Math.floor(600 / CELL_SIZE);
    GRID_H = Math.floor(600 / CELL_SIZE);
    // pole = make2DArray(GRID_W, GRID_H, DAI_NULA);
    // pole = make2DArray(GRID_W, GRID_H, DAI_RANDOM);
    ogradaShir = 5;
    pole = make2DArray(GRID_W, GRID_H, GENERATE_OGRADA);
    // pole = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,0,1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,1,1,0,1,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,0,0,1,0,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,0,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,0,1,0,0,1,1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,0,1,1,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,0,0,1,0,0,1,1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,0,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,1,0,0,0,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,0,1,1,1,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,0,0,1,0,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,1,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,1,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,1,1,1,1,0,1,0,0,0,0,0,0],[0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,0,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0,1,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,0,1,1,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,1,1,0,0,0,0,0],[0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
    kartinkaZaTipPole = [paddle, box, gem[12]];
}

function updatePoleVirus(oldPole) {
    let newPole = copy2DArray(oldPole);
    // За всяка клетка от полето - ако е съседна на клетка от тип 2 - тя се инфектира и става от тип 2
    // 2 - virus
    // 0 - stena
    // 1 - prazno
    for(let i = 1; i < GRID_W - 1; i++) {
        for(let j = 1; j < GRID_H - 1; j++) {
            if(oldPole[i][j] == 1) {
                if (oldPole[i - 1][j] == 2 || oldPole[i][j + 1] == 2 ||
                    oldPole[i + 1][j] == 2 || oldPole[i][j - 1] == 2) {
                    newPole[i][j] = 2;
                }
            }
        }
    }
    return newPole;
}
function daiMiBrSusedi(kol, red) {
    let brSusedi = 0;
    brSusedi =
        (pole[kol - 1][red] == 1) +
        (pole[kol + 1][red] == 1) +
        (pole[kol][red + 1] == 1) +
        (pole[kol][red - 1] == 1) +
        (pole[kol + 1][red + 1] == 1) +
        (pole[kol - 1][red - 1] == 1) +
        (pole[kol + 1][red - 1] == 1) +
        (pole[kol - 1][red + 1] == 1);
    return brSusedi;
}
function updatePoleGameOfLife(oldPole) {
    let newPole = make2DArray(GRID_W, GRID_H, DAI_NULA);
    for(let i = 1; i < GRID_W - 1; i++) {
        for(let j = 1; j < GRID_H - 1; j++) {
            let brSusedi = daiMiBrSusedi(i, j);
            // Слагаме клетка само ако тя ще бъде 1
            // Защото и без това newPole е пълно със нули
            // 1 - alive
            // 0 - dead
            if(oldPole[i][j] == 1) {
                if(brSusedi == 2 || brSusedi == 3) {
                    newPole[i][j] = 1;
                }
            } else {
                if(brSusedi == 3) {
                    newPole[i][j] = 1;
                }
            }
        }
    }
    return newPole;
}
function updatePoleWaterSimulation(oldPole) {
    let newPole = make2DArray(GRID_W, GRID_H, DAI_NULA);
    for(let i = 1; i < GRID_W - 1; i++) {
        for(let j = 1; j < GRID_H - 1; j++) {
            // 1 - wall
            if(oldPole[i][j] == 1) {
                newPole[i][j] = 1;
                // 2 - water
            } else if(oldPole[i][j] == 2) {
                if(oldPole[i][j+1] == 0 && newPole[i][j+1] == 0) {
                    newPole[i][j + 1] = 2;
                } else if(oldPole[i][j+1] == 2 || oldPole[i][j+1] == 1) {
                    if (randomInteger(2) == 0) {
                        if (oldPole[i + 1][j] == 0 && newPole[i+1][j] == 0) {
                            newPole[i + 1][j] = 2;
                        } else {
                            newPole[i][j] = 2;
                        }
                    } else {
                        if (oldPole[i - 1][j] == 0 && newPole[i-1][j] == 0) {
                            newPole[i - 1][j] = 2;
                        } else {
                            newPole[i][j] = 2;
                        }
                    }
                } else {
                    newPole[i][j] = oldPole[i][j];
                }
            }
        }
    }
    return newPole;
}
// function updatePoleWaterSimulation(oldPole) {
//     const newPole = make2DArray(GRID_W, GRID_H, DAI_NULA);

//     for (let col = 1; col < GRID_W - 1; col++) {
//         for (let row = GRID_H - 2; row >= 1; row--) {
//             const cell = oldPole[col][row];

//             if (cell === 1) {
//                 newPole[col][row] = 1; // wall
//             } else if (cell === 2) {
//                 // 1. Down
//                 if (oldPole[col][row + 1] === 0 && newPole[col][row + 1] === 0) {
//                     newPole[col][row + 1] = 2;

//                 // 2. Down-left
//                 } else if (oldPole[col - 1][row + 1] === 0 && newPole[col - 1][row + 1] === 0) {
//                     newPole[col - 1][row + 1] = 2;

//                 // 3. Down-right
//                 } else if (oldPole[col + 1][row + 1] === 0 && newPole[col + 1][row + 1] === 0) {
//                     newPole[col + 1][row + 1] = 2;

//                 // 4. Left
//                 } else if (oldPole[col - 1][row] === 0 && newPole[col - 1][row] === 0) {
//                     newPole[col - 1][row] = 2;

//                 // 5. Right
//                 } else if (oldPole[col + 1][row] === 0 && newPole[col + 1][row] === 0) {
//                     newPole[col + 1][row] = 2;

//                 } else {
//                     // 6. Stay
//                     newPole[col][row] = 2;
//                 }
//             }
//         }
//     }

//     return newPole;
// }

let t = 0;
function update() {
    t++;
    if(t % 5 == 0)
     {/* 
        pole = updatePoleGameOfLife(pole);
        pole = updatePoleVirus(pole);
        pole = updatePoleGameOfLife(pole); */
        pole = updatePoleWaterSimulation(pole);
    }
}
function draw() {
    for(let i = 0; i < GRID_W; i++) {
        for(let j = 0; j < GRID_H; j++) {
            drawImage(kartinkaZaTipPole[pole[i][j]], i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }
}
function mouseup() {
    // mouseX, mouseY
    let mouseKol = Math.floor(mouseX / CELL_SIZE), mouseRed = Math.floor(mouseY / CELL_SIZE);

    pole[mouseKol][mouseRed] = 2;
}
function keyup() {
    let mouseKol = Math.floor(mouseX / CELL_SIZE), mouseRed = Math.floor(mouseY / CELL_SIZE);

    pole[mouseKol][mouseRed] = 1;
}