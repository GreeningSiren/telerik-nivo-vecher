// Suzdavame promenlivi
let myX, myY;
let topki = [];
const kufte = tryToLoad("kufte", "brown");
let startLenTopki = 20
let shot = false
let firstBall = true
let blok = [];
function init() {
    // Kodut tuk se izpulnqva vednuj v nachaloto
    myX = 400
    myY = 580
    for (let i = 0; i < 16; i++) {
        blok[i] = [];
        for (let j = 0; j < 6; j++) {
            if (randomInteger(3) !== 2) {
                blok[i][j] = true;
            } else {
                blok[i][j] = false;
            }
        }
    }
}
function update() {
    // Kodut tuk se izpulnqva (okolo) 100 puti v sekunda
    if (shot) {
        // firstBall = true
        for (let i = 0; i < topki.length; i++) {
            topki[i].moveTopka();
            if (areColliding(-10, 1, 10, 800, topki[i].x, topki[i].y, 20, 20) || areColliding(800, 1, 20, 800, topki[i].x, topki[i].y, 20, 20)) { // proverka lqvo i dqsno
                topki[i].dx = -topki[i].dx
            }
            if (areColliding(0, 0, 800, 10, topki[i].x, topki[i].y, 20, 20)) { // proverka gore
                topki[i].dy = -topki[i].dy
            }

            if (topki[0].y >= 580 && firstBall) {
                myX = topki[0].x
                firstBall = false
            }
            if (topki[i].y >= 580 && topki[i].x != myX) {
                topki[i].dy = 0
                topki[i].dx = myX - topki[i].x
            }
            if (topki[i].y >= 580 && Math.floor(topki[i].x) == Math.floor(myX)) {
                topki.splice(i, 1)
                i--;
                continue;
            }

            for (let j = 0; j < blok.length; j++) {
                for (let k = 0; k < blok[j].length; k++) {
                    if (blok[j][k]) {
                        if (areColliding(topki[i].x, topki[i].y, 20, 20, (j * 50), k * 50, 50, 5)) { // gore proverka
                            topki[i].dy = -topki[i].dy;
                            blok[j][k] = false;
                            break;
                        }
                        if (areColliding(topki[i].x, topki[i].y, 20, 20, (j * 50), (k * 50) + 1, 5, 50)) { // lqvo proverka
                            topki[i].dx = -topki[i].dx;
                            blok[j][k] = false;
                            break;
                        }
                        if (areColliding(topki[i].x, topki[i].y, 20, 20, (j * 50) + 45, k * 50, 5, 50)) { // dqsno proverka
                            topki[i].dx = -topki[i].dx;
                            blok[j][k] = false;
                            break;
                        }
                        if (areColliding(topki[i].x, topki[i].y, 20, 20, (j * 50), (k * 50) + 45, 50, 5)) { // dole proverka
                            topki[i].dy = -topki[i].dy;
                            blok[j][k] = false;
                            break;
                        }
                    }
                }
            }

        }
        if (topki.length == 0) {
            shot = false
            firstBall = true
            for(let i = 0; i < blok.length; i++) {
                let sigma;
                if (randomInteger(3) !== 2) {
                    sigma = true;
                } else {
                    sigma = false;
                }
                blok[i].unshift(sigma);
            }
        }
    }
}
function draw() {
    // Tuk naprogramirai kakvo da se risuva
    context.fillStyle = "black";
    context.fillRect(0, 0, 800, 600);
    // drawImage(backField, 0, 0, 800, 600);
    drawImage(kufte, myX, myY, 20, 20);
    for (let i = 0; i < topki.length; i++) {
        drawImage(kufte, topki[i].x, topki[i].y, 20, 20);
    }
    for (let i = 0; i < blok.length; i++) {
        for (let j = 0; j < blok[i].length; j++) {
            
            if (blok[i][j]) {
                drawImage(box, i * 50, j * 50, 50, 50);
                // context.fillStyle = "red";
                // context.fillRect((i * 50), (j * 50) + 1, 5, 50);
                
            }
        }
    }
}
function mouseup() {
    // Pri klik s lqv buton - pokaji koordinatite na mishkata
    console.log("Mouse clicked at", mouseX, mouseY);
    console.log(shot);
    if (!shot) {
        let d = dist(myX, myY, mouseX, mouseY);
        let raztoqnieX = mouseX - myX;
        let raztoqnieY = mouseY - myY;
        for (let i = 0; i < startLenTopki; i++) {
            setTimeout(() => suzdajTopka(myX, myY, raztoqnieX / d * 2, raztoqnieY / d * 2, mouseX, mouseY), i * 100);
        }
        shot = true;
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
            this.x = this.x + this.dx ;
            this.y = this.y + this.dy ;
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
