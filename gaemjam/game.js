// Suzdavame promenlivi
let myX, myY;
let topki = [];
const kufte = tryToLoad("kufte", "brown");
let brTopki = 50;
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
function init() {
    // Kodut tuk se izpulnqva vednuj v nachaloto
    myX = 400;
    myY = 580;
    for (let i = 0; i < 16; i++) {
        blok[i] = [];
        jiwot[i] = [];
        for (let j = 0; j < 6; j++) {
            if (randomInteger(3) !== 2) {
                blok[i][j] = true;
                jiwot[i][j] = randomInteger(random) + 1;
            } else {
                blok[i][j] = false;
            }
        }
    }
}
function update() {
    // Kodut tuk se izpulnqva (okolo) 100 puti v sekunda
    if (!win && !zagubi) {
        if (shot) {
            // firstBall = true
            for (let i = 0; i < topki.length; i++) {
                topki[i].moveTopka();
                if (areColliding(-10, 1, 10, 800, topki[i].x, topki[i].y, 20, 20) || areColliding(800, 1, 20, 800, topki[i].x, topki[i].y, 20, 20)) { // proverka lqvo i dqsno
                    topki[i].dx = -topki[i].dx;
                }
                if (areColliding(0, 0, 800, 10, topki[i].x, topki[i].y, 20, 20)) { // proverka gore
                    topki[i].dy = -topki[i].dy;
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

                        //console.log(k * 20);                       
                        if (blok[j][k] && !disabledCollisions) {
                            if (areColliding(topki[i].x, topki[i].y, 20, 20, (j * 50), k * 50, 50, 5)) { // gore proverka
                                topki[i].dy = -topki[i].dy;
                                // blok[j][k] = false;
                                jiwot[j][k]--;
                                break;
                            }
                            if (areColliding(topki[i].x, topki[i].y, 20, 20, (j * 50), (k * 50) + 1, 5, 50)) { // lqvo proverka
                                topki[i].dx = -topki[i].dx;
                                // blok[j][k] = false;
                                jiwot[j][k]--;
                                break;
                            }
                            if (areColliding(topki[i].x, topki[i].y, 20, 20, (j * 50) + 45, k * 50, 5, 50)) { // dqsno proverka
                                topki[i].dx = -topki[i].dx;
                                // blok[j][k] = false;
                                jiwot[j][k]--;
                                break;
                            }
                            if (areColliding(topki[i].x, topki[i].y, 20, 20, (j * 50), (k * 50) + 45, 50, 5)) { // dole proverka
                                topki[i].dy = -topki[i].dy;
                                // blok[j][k] = false;
                                jiwot[j][k]--;
                                break;
                            }
                            if (jiwot[j][k] <= 0) {
                                blok[j][k] = false;
                            }
                        }
                    }
                }

            }
            if (topki.length == 0) {
                shot = false;
                firstBall = true;
                let giveBalls = true
                for (let i = 0; i < blok.length; i++) {
                    for (let j = 0; j < blok[i].length; j++) {
                        if (blok[i].length > 12 && blok[i][j]) {
                            zagubi = true;
                        }
                        if (blok[i][j]) {
                            giveBalls = false
                        }

                    }
                    let sigma;
                    if (randomInteger(3) !== 2) {
                        sigma = true;
                    } else {
                        sigma = false;
                    }
                    blok[i].unshift(sigma);
                    jiwot[i].unshift(randomInteger(random) + 1);

                }
                if (giveBalls) {
                    brTopki += 50;

                    if (timer >= 16) {
                        win = true
                    }
                }
                timer++;
                disabledCollisions = false;
            }
        }
        switch (Math.floor(timer)) {
            case 0:
            case 1:
            case 2:
            case 3:
                random = 5;
                break;

            case 4:
            case 5:
            case 6:
            case 7:
                random = 10;
                break;

            case 8:
            case 9:
            case 10:
            case 11:
                random = 15;
                break;

            case 12:
            case 13:
            case 14:
            case 15:
                random = 25;
                break;

            case 16:
                random = 35;
                break;

            default:
                random = 35;
                break;
        }
    }
}
function draw() {
    if (!win && !zagubi) {
        // Tuk naprogramirai kakvo da se risuva
        context.fillStyle = "black";
        context.fillRect(0, 0, 800, 600);
        // drawImage(backField, 0, 0, 800, 600);
        drawImage(kufte, myX, myY, 20, 20);
        context.fillStyle = "red";
        context.fillRect(820, 40, 60, 60);
        writeText("35px Tahoma", "black", "⬇", 843, 55);
        for (let i = 0; i < topki.length; i++) {
            drawImage(kufte, topki[i].x, topki[i].y, 20, 20);
        }
        writeText("13px Tahoma", "white", brTopki - topki.length, myX + 3, myY + 3);
        for (let i = 0; i < blok.length; i++) {
            for (let j = 0; j < blok[i].length; j++) {

                if (blok[i][j]) {
                    drawImage(box, i * 50, j * 50, 50, 50);
                    writeText("30px Tahoma", "white", jiwot[i][j], i * 50 + 15, j * 50 + 15);
                    // context.fillStyle = "red";
                    // context.fillRect((i * 50), (j * 50) + 1, 5, 50);

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

    }
}
function mouseup() {
    if (!win) {
        // Pri klik s lqv buton - pokaji koordinatite na mishkata
        console.log("Mouse clicked at", mouseX, mouseY);
        console.log(shot);
        if (!shot && mouseX < 800 && mouseY < 475 && mouseX != 0 && mouseY != 0) {
            let d = dist(myX, myY, mouseX, mouseY);
            let raztoqnieX = mouseX - myX;
            let raztoqnieY = mouseY - myY;
            for (let i = 0; i < brTopki; i++) {
                setTimeout(() => suzdajTopka(myX, myY, raztoqnieX / d * 2, raztoqnieY / d * 2, mouseX, mouseY), i * 100);
            }
            shot = true;
        } else {
            if (areColliding(820, 40, 60, 60, mouseX, mouseY, 1, 1) && (topki.length == brTopki || firstBall == false)) {
                downTopki();
            }
        }
    }
}
function mousedown() {
    // set_d(); 
}
function keyup(key) {

    // Pechatai koda na natisnatiq klavish
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
function set_d() {
    for (let i = 0; i < topki.length; i++) {
        topki[i].dx = mouseX - 420;
        topki[i].dy = mouseY - 600;
    }
}
function move() {
    for (let i = 0; i < topki.length; i++) {
        topki[i].x = topki[i].x + dx * 0.1;
        topki[i].y = topki[i].y + dy * 0.1;
    }
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
    for (let i = 0; i < topki.length; i++) {
        topki[i].dx = 0;
        topki[i].dy = 0;
        setTimeout(() => { topki[i].dx = (myX - topki[i].x) / topki.length; }, 500);
        setTimeout(() => { topki[i].dy = (myY - topki[i].y) / topki.length; }, 500);
    }
}