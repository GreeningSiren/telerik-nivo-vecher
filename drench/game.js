// Suzdavame promenlivi
const GRID_SIZE = 14;
const pixelSize = 40;
let gameOver = false;
let pixels = [];
for (let i = 0; i < GRID_SIZE; i++) {
    pixels[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
        pixels[i][j] = randomInteger(6);
    }
}
// 0 - Green
// 1 - Pink
// 2 - Purple
// 3 - Light green
// 4 - Red
// 5 - Yellow
function init() {
    // Kodut tuk se izpulnqva vednuj v nachaloto
}
function update() {
    // Kodut tuk se izpulnqva (okolo) 100 puti v sekunda
}
let br = 0;
function draw() {
    if (!gameOver) {
        // Tuk naprogramirai kakvo da se risuva
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                switch (pixels[i][j]) {
                    case 0:
                        context.fillStyle = "#66cc00";
                        break;
                    case 1:
                        context.fillStyle = "#ff9fff";
                        break;
                    case 2:
                        context.fillStyle = "#743ef4";
                        break;
                    case 3:
                        context.fillStyle = "#ccffcc";
                        break;
                    case 4:
                        context.fillStyle = "red";
                        break;
                    case 5:
                        context.fillStyle = "#ffcc00";
                        break;
                }
                context.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
            }
        }

        context.fillStyle = "#66cc00";
        context.fillRect(600, 10, pixelSize, pixelSize);
        context.fillStyle = "#ff9fff";
        context.fillRect(600, 60, pixelSize, pixelSize);
        context.fillStyle = "#743ef4";
        context.fillRect(600, 110, pixelSize, pixelSize);
        context.fillStyle = "#ccffcc";
        context.fillRect(600, 160, pixelSize, pixelSize);
        context.fillStyle = "red";
        context.fillRect(600, 210, pixelSize, pixelSize);
        context.fillStyle = "#ffcc00";
        context.fillRect(600, 260, pixelSize, pixelSize);
        context.font = "30px Tahoma";
        context.fillStyle = "purple";
        context.fillText("брой клик:" + br, 600, 350);
    } else {
        context.fillStyle = "black";
        context.fillRect(0, 0, 800, 600);
        context.fillStyle = "white";
        context.font = "50px Courier New";
        context.fillText("You win! Clicks: " + br, 200, 200);
        context.font = "30px Courier New";
        context.fillText("Created by Kolyo and bobaka", 50, 250);
    }
}
function mouseup() {
    if (!gameOver) {
        // Pri klik s lqv buton - pokaji koordinatite na mishkata
        console.log("Mouse clicked at", mouseX, mouseY);
        if (mouseX > 560) {
            if (areColliding(600, 10, pixelSize, pixelSize, mouseX, mouseY, 1, 1)) { switchColor(0, 0, 0); br++; }
            if (areColliding(600, 60, pixelSize, pixelSize, mouseX, mouseY, 1, 1)) { switchColor(0, 0, 1); br++; }
            if (areColliding(600, 110, pixelSize, pixelSize, mouseX, mouseY, 1, 1)) { switchColor(0, 0, 2); br++; }
            if (areColliding(600, 160, pixelSize, pixelSize, mouseX, mouseY, 1, 1)) { switchColor(0, 0, 3); br++; }
            if (areColliding(600, 210, pixelSize, pixelSize, mouseX, mouseY, 1, 1)) { switchColor(0, 0, 4); br++; }
            if (areColliding(600, 260, pixelSize, pixelSize, mouseX, mouseY, 1, 1)) { switchColor(0, 0, 5); br++; }
        }
    }
}
function keyup(key) {
    // Pechatai koda na natisnatiq klavish
    console.log("Pressed", key);
}

function switchColor(x, y, type) {
    console.log("switch color " + type + " at " + x + " " + y);
    if (x < 0 || y < 0 || x > GRID_SIZE || y > GRID_SIZE) return;
    let segashenCvqt = pixels[x][y];
    pixels[x][y] = type;
    //rekurziq 😍😍😍
    if (vutreLiUPoletoSym(x + 1, y) && pixels[x + 1][y] == segashenCvqt) { switchColor(x + 1, y, type); }
    if (vutreLiUPoletoSym(x - 1, y) && pixels[x - 1][y] == segashenCvqt) { switchColor(x - 1, y, type); }
    if (vutreLiUPoletoSym(x, y + 1) && pixels[x][y + 1] == segashenCvqt) { switchColor(x, y + 1, type); }
    if (vutreLiUPoletoSym(x, y - 1) && pixels[x][y - 1] == segashenCvqt) { switchColor(x, y - 1, type); }
    checkWin();
}

function vutreLiUPoletoSym(kol, red) {
    return !(kol < 0 || kol >= GRID_SIZE || red < 0 || red >= GRID_SIZE);
}

function checkWin() {
    let win = true;
    let color = pixels[0][0];
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (pixels[i][j] != color) win = false;
        }
    }
    if (win) {
        console.log("YOU WIN");
        gameOver = true;
    }
}
