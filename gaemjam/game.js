let myX, myY;
let topki = [];
const kufte = tryToLoad("kufte", "brown");
let brTopki = 25;
let shot = false;
let firstBall = true;
let blok = [];
let jiwot = [];
let timer = 0;
let random = 5;
let zagubi = false;
let win = false;
endlessCanvas = true;
let disabledCollisions = false;
let shootTimeouts = [];
let level = 1;
let gameStarted = false;
let gameMode;
let startTime = 0;
let currentTime = 0;
let limit = 0;

const blockBreakAudio = new Audio("./audio/blockbreak.ogg");
blockBreakAudio.volume = 0.75;
const hitWallAudio = new Audio("./audio/hitwall.ogg");
hitWallAudio.volume = 0.5;
const hitBlockAudio = new Audio("./audio/hitblock.ogg");
hitBlockAudio.volume = 0.5;
const endlessClearAudio = new Audio("./audio/endlessclear.ogg");
const musicInGameAudio = new Audio("./audio/music_ingame.ogg");
musicInGameAudio.loop = true;

window.addEventListener("blur", () => {
    musicInGameAudio.pause();
});
window.addEventListener("focus", () => {
    if (gameStarted) {
        musicInGameAudio.play();
    }
});

function init() {
    myX = 400;
    myY = 580;
    for (let i = 0; i < 16; i++) {
        blok[i] = [];
        jiwot[i] = [];
        for (let j = 0; j < 6; j++) {
            blok[i][j] = false;
            jiwot[i][j] = 0;
        }
    }
    loadLevel(level);
}
function update() {
    limit = 0;
    if (!win && !zagubi) {
        currentTime = new Date();
        if (shot) {

            for (let i = 0; i < topki.length; i++) {

                topki[i].moveTopka();
                if (areColliding(-10, 1, 10, 800, topki[i].x, topki[i].y, 20, 20) || areColliding(800, 1, 20, 800, topki[i].x, topki[i].y, 20, 20)) {
                    topki[i].dx = -topki[i].dx;
                    if (limit < 10) {
                        let audio = hitWallAudio.cloneNode();
                        limit++;
                        audio.play();
                        audio = null;
                        
                    }
                }
                if (areColliding(0, 0, 800, 10, topki[i].x, topki[i].y, 20, 20)) {
                    topki[i].dy = -topki[i].dy;
                    if (limit < 10) {
                        let audio = hitWallAudio.cloneNode();
                        limit++;
                        audio.play();
                        audio = null;
                        
                    }
                }
                if (topki[i].y >= 580 && topki[i].x != myX) {
                    if (firstBall) {
                        myX = topki[i].x;
                        firstBall = false;
                    }
                    topki[i].y = 580;
                    topki[i].dy = 0;
                    topki[i].dx = (myX - topki[i].x) / 13;
                }
                if (topki[i].y >= 580 && Math.round(topki[i].x) == Math.round(myX)) {
                    topki.splice(i, 1);
                    i--;
                    continue;
                }

                for (let j = 0; j < blok.length; j++) {
                    for (let k = 0; k < blok[j].length; k++) {

                        if (blok[j][k] && !disabledCollisions) {
                            if (areColliding(topki[i].x, topki[i].y, 20, 20, (j * 50), k * 50, 50, 5)) {
                                topki[i].dy = -topki[i].dy;
                                jiwot[j][k]--;
                                if (limit < 10) {
                                    let audio = hitWallAudio.cloneNode();
                                    limit++;
                                    audio.play();
                                    audio = null;
                                    
                                }
                                break;
                            }
                            if (areColliding(topki[i].x, topki[i].y, 20, 20, (j * 50), (k * 50), 5, 50)) {
                                topki[i].dx = -topki[i].dx;
                                jiwot[j][k]--;
                                if (limit < 10) {
                                    let audio = hitWallAudio.cloneNode();
                                    limit++;
                                    audio.play();
                                    audio = null;
                                   
                                }
                                break;
                            }
                            if (areColliding(topki[i].x, topki[i].y, 20, 20, (j * 50) + 45, k * 50, 5, 50)) {
                                topki[i].dx = -topki[i].dx;
                                jiwot[j][k]--;
                                if (limit < 10) {
                                    let audio = hitWallAudio.cloneNode();
                                    limit++;
                                    audio.play();
                                    audio = null;
                                    
                                }
                                break;
                            }
                            if (areColliding(topki[i].x, topki[i].y, 20, 20, (j * 50), (k * 50) + 45, 50, 5)) {
                                topki[i].dy = -topki[i].dy;
                                jiwot[j][k]--;
                                if (limit < 10) {
                                    let audio = hitWallAudio.cloneNode();
                                    limit++;
                                    audio.play();
                                    audio = null;
                                    
                                }
                                break;
                            }

                            if (jiwot[j][k] <= 0) {
                                blok[j][k] = false;
                                if (limit < 10) {
                                    let audio = hitWallAudio.cloneNode();
                                    limit++;
                                    audio.play();
                                    audio = null;
                                    
                                }
                            }
                        }
                    }
                }

            }
            if (topki.length == 0) {
                shot = false;
                firstBall = true;
                let giveBalls = true;
                shootTimeouts.splice(0, shootTimeouts.length);
                for (let i = 0; i < blok.length; i++) {
                    for (let j = 0; j < blok[i].length; j++) {
                        if (blok[i][j].length > 12 && blok[i][13]) {
                            zagubi = true;
                        }
                        if (areColliding(myX, myY, 20, 20, (i * 50), j * 50, 50, 50) && blok[i][j]) {
                            zagubi = true;
                        }
                        if (blok[i][j]) {
                            giveBalls = false;
                        }

                    }
                    if (gameMode === "story") {
                        blok[i].unshift(false);
                        jiwot[i].unshift(0);
                    } else if (gameMode === "endless") {
                        let sigma;
                        if (randomInteger(3) !== 2) {
                            sigma = true;
                        } else {
                            sigma = false;
                        }
                        blok[i].unshift(sigma);
                        jiwot[i].unshift(randomInteger(random) + 1);
                    }


                }
                if (giveBalls) {
                    endlessClearAudio.play();
                    if (gameMode == "story") {
                        brTopki += 25;
                        level++;
                        loadLevel(level);
                    } else {
                        brTopki += 25;
                    }
                }
                timer++;
                disabledCollisions = false;
            }
        } else {
            if (topki.length > 0) {
                topki.splice(0, topki.length);
            }
        }
    }
    switch (timer) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
            random = 5;
            break;
        case 5:
        case 6:
        case 7:
        case 8:
            random = 10;
            break;
        case 9:
        case 10:
        case 11:
        case 12:
            random = 15;
            break;
        case 13:
        case 14:
        case 15:
        case 16:
            random = 20;
            break;
        default:
            random = 25;
    }
}
function draw() {
    if (!win && !zagubi && gameStarted) {
        context.fillStyle = "black";
        context.fillRect(0, 0, 800, 600);
        if (gameMode === "story") {
            writeText("35px Tahoma", "black", "Level:" + level, 830, 200);
            writeText("35px Tahoma", "black", "Time:" + ((currentTime.getTime() - startTime.getTime()) / 1000), 830, 250);
        }
        drawImage(kufte, myX, myY, 20, 20);
        context.fillStyle = "red";
        context.fillRect(820, 40, 60, 60);
        writeText("35px Tahoma", "black", "⬇", 843, 55);
        context.fillStyle = "blue";
        context.fillRect(820, 120, 60, 60);
        if (musicInGameAudio.volume === 1) {
            writeText("35px Tahoma", "black", "🔊", 830, 135);
        } else {
            writeText("35px Tahoma", "black", "🔇", 830, 135);
        }
        for (let i = 0; i < topki.length; i++) {
            drawImage(kufte, topki[i].x, topki[i].y, 20, 20);
        }
        writeText("13px Tahoma", "white", brTopki - topki.length, myX + 3, myY + 3);
        for (let i = 0; i < blok.length; i++) {
            for (let j = 0; j < blok[i].length; j++) {

                if (blok[i][j]) {
                    drawImage(box, i * 50, j * 50, 50, 50);
                    writeText("30px Tahoma", "white", jiwot[i][j], i * 50 + 15, j * 50 + 15);
                }
            }
        }

    } else if (win) {
        context.fillStyle = "black";
        context.fillRect(0, 0, 800, 600);
        writeText("50px Tahoma", "white", "You won!", 400, 300);
    } else if (zagubi) {
        context.fillStyle = "black";
        context.fillRect(0, 0, 800, 600);
        writeText("50px Tahoma", "white", "You lost!", 400, 300);

    } else if (!gameStarted) {
        context.fillStyle = "black";
        context.fillRect(0, 0, 800, 600);
        writeText("50px Tahoma", "white", "Mqtaj Topki", 300, 100);
        writeText("20px Tahoma", "red", "by Kolyo i Bobaka", 300, 150);
        context.fillStyle = "white";
        context.fillRect(300, 200, 200, 50);
        context.fillRect(300, 300, 200, 50);
        context.fillStyle = "black";
        writeText("30px Tahoma", "black", "Story Mode", 330, 210);
        writeText("30px Tahoma", "black", "Endless Mode", 315, 310);
    }
}
function mouseup() {
    if (!win && !zagubi && gameStarted) {
        console.log("Mouse clicked at", mouseX, mouseY);
        console.log(shot);
        if (!shot && mouseX < 800 && mouseY < 550 && mouseY != 0) {
            let d = dist(myX, myY, mouseX, mouseY);
            let raztoqnieX = mouseX - myX;
            let raztoqnieY = mouseY - myY;
            shot = true;
            for (let i = 0; i < brTopki; i++) {
                shootTimeouts[i] = setTimeout(() => suzdajTopka(myX, myY, raztoqnieX / d * 3, raztoqnieY / d * 3, mouseX, mouseY), i * 100);
            }
        } else {
            if (areColliding(820, 40, 60, 60, mouseX, mouseY, 1, 1) && shot /* && (topki.length == brTopki || firstBall == false) */) {
                downTopki();
            }
            if (areColliding(820, 120, 60, 60, mouseX, mouseY, 1, 1)) {
                if (musicInGameAudio.volume === 1) {
                    musicInGameAudio.volume = 0;
                } else {
                    musicInGameAudio.volume = 1;
                }
            }
        }
    } else if (!gameStarted) {
        if (areColliding(300, 200, 200, 50, mouseX, mouseY, 1, 1)) {
            gameStarted = true;
            gameMode = "story";
            musicInGameAudio.play();
            startTime = new Date();
        } else if (areColliding(300, 300, 200, 50, mouseX, mouseY, 1, 1)) {
            gameStarted = true;
            gameMode = "endless";
            for (let i = 0; i < 16; i++) {
                for (let j = 0; j < 6; j++) {
                    if (randomInteger(3) !== 2) {
                        blok[i][j] = true;
                        jiwot[i][j] = randomInteger(random) + 1;
                    } else {
                        blok[i][j] = false;
                    }
                }
            }
            musicInGameAudio.play();
        }
    }
}
function keyup(key) {

    console.log("Pressed", key);
}
function dist(x, y, mX, mY) {
    return Math.sqrt((x - mX) * (x - mX) + (y - mY) * (y - mY));
}
function suzdajTopka(x, y, dx, dy, mX, mY) {
    topki.push({
        x: x,
        y: y,
        dx: dx,
        dy: dy,
        moveTopka: function () {
            this.x = this.x + this.dx;
            this.y = this.y + this.dy;
        }
    });
}

function resetBoxes() {
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 6; j++) {
            if (randomInteger(3) !== 2) {
                blok[i][j] = true;
            } else {
                blok[i][j] = false;
            }
        }
    }
}

function writeText(font, style, text, x, y) {
    context.save();
    context.font = font;
    context.fillStyle = style;
    context.fillText(text, x, y);
    context.restore();
}

function downTopki() {
    disabledCollisions = true;
    console.log("downTopki");
    for (let i = 0; i < shootTimeouts.length; i++) {
        clearTimeout(shootTimeouts[i]);
    }
    for (let i = 0; i < topki.length; i++) {
        topki[i].dx = 0;
        topki[i].dy = 0;
        hitWallAudio.volume = 0;
        setTimeout(() => { topki[i].dx = (myX - topki[i].x) / topki.length; topki[i].dy = (myY - topki[i].y) / topki.length; }, 500);
        hitWallAudio.volume = 0.5;
    }
}
