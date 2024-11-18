// Suzdavame promenlivi
const enemyImg = tryToLoad("qshubgrem", "black");
const back = tryToLoad("back", "white");
const kufte = tryToLoad("kufte", "brown");
const bullet = tryToLoad("bullet", "black");

let enemies = [];
const enemySize = 80;
const bulletSize = 40;
const startEnemyNum = 5;
let bullets = [];
let player;

let lives = 10;
let gameOver = false;
let winReq = 20;
let win = false;

function init() {
    // Kodut tuk se izpulnqva vednuj v nachaloto
    player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        ugul: 0,
        moveplayer: function () {
            this.x += 2 * Math.cos(this.ugul);
            this.y += 2 * Math.sin(this.ugul);
        },
        movebackplayer: function () {
            this.x -= 2 * Math.cos(this.ugul);
            this.y -= 2 * Math.sin(this.ugul);
        },
        summonBullet: function () {
            spawnBullet(this.x, this.y, 3 * Math.cos(this.ugul), 3 * Math.sin(this.ugul));
        }
    }
    for (let i = 0; i < startEnemyNum; i++) {
        summonQshu(generateenemycoord("x"), generateenemycoord("y"), 3, 3);
    }
}

function update() {
    // Kodut tuk se izpulnqva (okolo) 100 puti v sekunda
    if (!gameOver && !win) {
        if (randomInteger(100) === 5) {
            summonQshu(generateenemycoord("x"), generateenemycoord("y"), 3, 3);
        }
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].moveenemy();

            if (areColliding(enemies[i].x, enemies[i].y, enemySize, enemySize / 2, player.x, player.y, 60, 80)) {
                killEnemy(i);
                lives--;
            }
        }

        if (isKeyPressed[87]) {
            player.moveplayer();
        }
        if (isKeyPressed[65]) {
            player.ugul -= 0.04;
        }
        if (isKeyPressed[68]) {
            player.ugul += 0.04;
        }
        if (isKeyPressed[83]) {
            player.movebackplayer();
        }

        for (let i = 0; i < bullets.length; i++) {
            bullets[i].movebullet();

            if (!areColliding(bullets[i].x, bullets[i].y, bulletSize, bulletSize, 0, 0, 800, 600)) {
                killBullet(i);
            }
            for (let j = 0; j < enemies.length; j++) {
                if (areColliding(bullets[i].x, bullets[i].y, bulletSize, bulletSize, enemies[j].x, enemies[j].y, enemySize, enemySize / 2)) {
                    killBullet(i);
                    killEnemy(j);
                    winReq--;
                }
            }
        }

        if (lives <= 0) {
            gameOver = true;
        }

        if (winReq <= 0) {
            win = true;
        }
    }
}

function draw() {
    if (!gameOver && !win) {
        // Tuk naprogramirai kakvo da se risuva
        drawImage(back, 0, 0, canvas.width, canvas.height);
        drawImage(kufte, player.x, player.y, 60, 80);
        for (let i = 0; i < enemies.length; i++) {
            drawImage(enemyImg, enemies[i].x, enemies[i].y, enemySize, enemySize / 2);
        }

        for (let i = 0; i < bullets.length; i++) {
            drawImage(bullet, bullets[i].x, bullets[i].y, bulletSize, bulletSize);
        }

        context.fillStyle = "Red";
        context.font = "50px Tahoma";
        context.fillText("Lives: " + lives, 0, 0);
        context.fillText("Win: ("+(20-winReq) + "/20)", 250,0)
    } else if(gameOver) {
        context.fillStyle = "black";
        context.fillRect(0, 0, 800, 600);
        context.fillStyle = "white";
        context.font = "50px Tahoma";
        context.fillText("game over", 0, 0);
    } else if(win) {
        context.fillStyle = "black";
        context.fillRect(0, 0, 800, 600);
        context.fillStyle = "white";
        context.font = "50px Tahoma";
        context.fillText("win", 0, 0);
    }
}

function mouseup() {
    // Pri klik s lqv buton - pokaji koordinatite na mishkata
    console.log("Mouse clicked at", mouseX, mouseY);
}

function keyup(key) {
    // Pechatai koda na natisnatiq klavish
    console.log("Pressed", key);
    if (!gameOver && !win) {
        if (key === 32) {
            player.summonBullet();
        }
    } else {
        if (key === 82) {
            location.reload()
        }
    }
}

function summonQshu(x, y, dx, dy) {
    enemies.push({
        x: x,
        y: y,
        dx: dx,
        dy: dy,
        moveenemy: function () {
            this.x = this.x + (player.x - this.x) / 250;
            this.y = this.y + (player.y - this.y) / 250;
        }
    })
}

function generateenemycoord(type) {
    let startX = randomInteger(800 - enemySize);
    let startY = randomInteger(800 - enemySize);
    while (areColliding(startX - 250, startY - 250, enemySize + 250, enemySize / 2 + 250, player.x - 50, player.y - 50, 60 + 50, 80 + 50)) {
        startX = randomInteger(800 - enemySize);
        startY = randomInteger(800 - enemySize);
     }
    if (type === "x") {
        return startX
    }
    if (type === "y") {
        return startY
    }
}

function spawnBullet(x, y, dx, dy) {
    bullets.push({
        x: x,
        y: y,
        dx: dx,
        dy: dy,
        movebullet: function () {
            this.x += this.dx;
            this.y += this.dy;
        }
    })
}

function killBullet(bulletIndex) {
    bullets.splice(bulletIndex, 1);
}

function killEnemy(enemyIndex) {
    enemies.splice(enemyIndex, 1);
}