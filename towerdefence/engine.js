var MouseUp, KeyUp, Update, Draw, Init, findTarget, shootAtEnemy, removeEnemy, removeBullet, onCollideEnemyWithBullet, distance;
let particleSystem = {};
// Game
let isGameStarted = false;
// Towers
let towerX, towerY, towerCooldown, towerTimer, towerHealth, towerShootMode, towerRange, towerC;

// Enemies
let enemyX, enemyY, enemySize, enemyHealth, enemyC;

// Bullets
let bulletX, bulletY, bulletDX, bulletDY, bulletC;

// Images
let enemyImage, bulletImage, towerImage, backImage;

// Level (not initialized in init)
let level = 1, startingTowerCount = 4, bulletSpeed = 4, bulletSize = 30, towerSize = 150, levelC = 3;

let congratsTimer = 0, congratsTime = 300;

let lives = 10;
var money = 0;

function init() {
    towerX = []; towerY = []; towerCooldown = []; towerTimer = []; towerHealth = []; towerShootMode = []; towerRange = []; towerC = 0;
    enemyX = []; enemyY = []; enemySize = []; enemyHealth = []; enemySpeed = []; enemyC = 0;
    bulletX = []; bulletY = []; bulletDX = []; bulletDY = []; bulletC = 0;
    enemyImage = tryToLoad("enemy", "red");
    bulletImage = tryToLoad("bullet", "black");
    towerImage = tryToLoad("tower", "brown");
    backImage = tryToLoad("back", "white");

    // Spawn towers when game starts
    let h = (canvas.height) / startingTowerCount;
    for (let i = 0; i < startingTowerCount; i++) {
        spawnTower(700, h * i, 10, 100, "mostHealth", 500);
    }

    // Spawn level 1 waves
    if (level == 1) {
        spawnWave1(10, -100, 50, 10, 1);
        spawnWave1(10, -1600, 50, 10, 2);
        spawnWave1(10, -2900, 50, 10, 3);
    }

    if (level == 2) {
        spawnWave2(10, 10, -1000, 100, 200, 300, 5, 1.9);
        spawnWave2(10, 10, -300, 100, 200, 300, 5, 1.9);
        spawnWave2(3, 3, -2000, 100, 200, 300, 15, 1.9);
        spawnWave2(3, 3, -1300, 100, 200, 300, 15, 1.9);
    }

    if (level == 3) {
        spawnBossWave(-400);
        spawnBossWave(-600);
    }
    Init();
}

function spawnEnemy(x, y, size, health, speed) {
    enemyX[enemyC] = x;
    enemyY[enemyC] = y;
    enemySize[enemyC] = size;
    enemyHealth[enemyC] = health;
    enemySpeed[enemyC] = speed;
    enemyC++;
}
function spawnTower(x, y, cooldown, health, shootingMode, range) {
    towerX[towerC] = x;
    towerY[towerC] = y;
    towerCooldown[towerC] = cooldown;
    towerTimer[towerC] = 0;
    towerHealth[towerC] = health;
    towerShootMode[towerC] = shootingMode;
    towerRange[towerC] = range;
    towerC++;
}
function spawnBullet(x, y, dX, dY) {
    bulletX[bulletC] = x;
    bulletY[bulletC] = y;
    bulletDX[bulletC] = dX;
    bulletDY[bulletC] = dY;
    bulletC++;
}
function spawnWave1(numEnemies, x, enemiesSize, enemiesHealth, enemySpeed) {
    // Task idea
    let h = canvas.height / numEnemies;
    for (let i = 0; i < numEnemies; i++) {
        spawnEnemy(x, h * i, enemiesSize, enemiesHealth, enemySpeed);
    }
}
function spawnWave2(numCols, numRows, x, y, w, h, enemiesHealth, enemySpeed) {
    // Task idea
    let ww = w / numCols;
    let hh = h / numRows;

    for (let i = 0; i < numCols; i++) {
        for (let j = 0; j < numRows; j++) {
            if (i * j == 0 || i == numCols - 1 || j == numRows - 1) {
                spawnEnemy(x + ww * i, y + hh * j, ww, enemiesHealth, enemySpeed);
            }
        }
    }
}
function spawnBossWave(x) {
    spawnEnemy(x, 300, 200, 50, 0.3);
    spawnWave1(10, x - 300, 100, 5, 1);
    spawnWave1(10, x - 600, 100, 5, 1);
    spawnWave1(10, x - 900, 100, 5, 1);
}

function controlTower(key) {
    let towerIndex = -1;
    for (let i = 0; i < towerC; i++) {
        if (areColliding(towerX[i], towerY[i], towerSize, towerSize, mouseX, mouseY, 1, 1)) {
            towerIndex = i;
        }
    }
    if (towerIndex >= 0) {
        if (isKeyPressed[65]) {
            towerCooldown[towerIndex] -= 1;
        }

        if (isKeyPressed[68]) {
            towerCooldown[towerIndex] += 1;
        }

        // 'Q' key for decreasing towerRange (Q/E range)
        if (isKeyPressed[81]) {
            towerRange[towerIndex] -= 1;
        }

        // 'E' key for increasing towerRange (Q/E range)
        if (isKeyPressed[69]) {
            towerRange[towerIndex] += 1;
        }
        // SPACE
        if (key == 32) {
            let modeNow = towerShootMode[towerIndex], newMode;
            if (modeNow == "mostHealth") {
                newMode = "leastHealth";
            } else if (modeNow == "leastHealth") {
                newMode = "firstEnemy";
            } else if (modeNow == "firstEnemy") {
                newMode = "closestEnemy";
            } else {
                newMode = "mostHealth";
            }
            towerShootMode[towerIndex] = newMode
        }
    }
}

function update() {
    particleSystem.update();
    if (!isGameStarted) {
        return;
    }
    // Move bullets
    for (let i = 0; i < bulletC; i++) {
        bulletX[i] += bulletDX[i];
        bulletY[i] += bulletDY[i];
        // Remove bullets outside of screen
        if (bulletX[i] < 0) {
            removeBullet(i);
            break;
        }
    }

    // Move enemies 
    for (let i = 0; i < enemyC; i++) {
        enemyX[i] += enemySpeed[i];
    }

    // Towers cooldown and shooting
    for (let i = 0; i < towerC; i++) {
        towerTimer[i]++;
        if (towerCooldown[i] <= towerTimer[i]) {
            towerTimer[i] = 0;
            // Find enemy for tower
            let enemyIndex = findTarget(i);

            // Shoot at enemy
            if (enemyIndex != -1) {
                shootAtEnemy(i, enemyIndex);
            }
        }

        // Collision between towers and enemies
        for (let j = 0; j < enemyC; j++) {

            if (areColliding(towerX[i], towerY[i], towerSize, towerSize, enemyX[j], enemyY[j], enemySize[j], enemySize[j])) {
                lives -= 1;
                removeEnemy(j);
                particleSystem.makeExplosion(towerX[i], towerY[i], 100);
                particleSystem.makeExplosion(towerX[i] - 50, towerY[i], 100);
                particleSystem.makeExplosion(towerX[i] - 30, towerY[i] + 30, 100);
                particleSystem.makeExplosion(towerX[i] + 30, towerY[i] + 30, 100);
                break;
            }
        }
    }

    // Collision between enemy and bullet
    for (let i = 0; i < enemyC; i++) {
        for (let j = 0; j < bulletC; j++) {
            if (areColliding(enemyX[i], enemyY[i], enemySize[i], enemySize[i], bulletX[j], bulletY[j], bulletSize, bulletSize)) {
                enemyHealth[i] -= 1;
                removeBullet(j);

                onCollideEnemyWithBullet(i, j);
                break;
            }
        }
    }
    // Delete bullets that are out of bounds
    for (let i = 0; i < bulletC; i++) {
        if (!areColliding(bulletX[i], bulletY[i], bulletSize, bulletSize, 0, 0, 800, 600)) {
            removeBullet(i);
            break;
        }
    }

    // Delete enemies with no health or out of bounds
    for (let i = 0; i < enemyC; i++) {
        if (enemyHealth[i] <= 0) {
            money++;
        }
        if (enemyHealth[i] <= 0 || enemyX[i] > 800) {
            particleSystem.makeExplosion(enemyX[i] + enemySize[i] / 2, enemyY[i] + enemySize[i] / 2, 100);
            removeEnemy(i);
            break;
        }

    }
    // tower controls
    controlTower();

    Update();
}
function draw() {
    if (isGameStarted) {
        drawImage(backImage, 0, 0, 800, 600);
        context.font = "50px Courier New";
        context.fillText("Level: " + level, 0, 0);
        context.fillText("Lives: " + lives, 0, 50);

        // Draw enemies
        for (let i = 0; i < enemyC; i++) {
            drawImage(enemyImage, enemyX[i], enemyY[i], enemySize[i], enemySize[i]);

            // Enemy health bar 
            let w = enemyHealth[i] * 10;
            let h = 10;
            context.fillStyle = "black";
            context.fillRect(enemyX[i] - w / 2 + enemySize[i] / 2 - h / 6, enemyY[i] - h / 6 - h / 6, w + h / 3, h + h / 3);
            context.fillStyle = "red";
            context.fillRect(enemyX[i] - w / 2 + enemySize[i] / 2, enemyY[i] - h / 6, w, h);
        }
        // Draw bullets
        for (let i = 0; i < bulletC; i++) {
            context.save();
            context.translate(bulletX[i], bulletY[i]);
            context.rotate(Math.atan2(bulletDY[i], bulletDX[i]) + Math.PI);
            drawImage(bulletImage, -bulletSize / 2, -bulletSize / 2, bulletSize, bulletSize);
            context.restore();
        }


        // Draw congratulations at end of level
        if (enemyC == 0) {
            context.font = "30px Courier New";
            context.fillText("Congratulations!", 0, 100);

            if (congratsTimer == 0) {
                congratsTimer = congratsTime
            } else {
                congratsTimer--;
            }
            if (congratsTimer == 1) {
                level++;
                init();
            }
        }
    } else {
        context.font = "30px Courier New";
        context.fillStyle = "blue";
        context.fillText("Click to play", 200, 300);
    }
    // Draw towers
    for (let i = 0; i < towerC; i++) {
        drawImage(towerImage, towerX[i], towerY[i], towerSize, towerSize);
        // Selected tower highlight
        if (areColliding(towerX[i], towerY[i], towerSize, towerSize, mouseX, mouseY, 1, 1)) {
            context.globalAlpha = 0.3;
            context.strokeStyle = "black";
            context.beginPath();
            context.arc(towerX[i], towerY[i], towerRange[i], 0, 2 * Math.PI);
            context.stroke();
            context.globalAlpha = 1;

            let menuX = 0, menuY = 450;
            context.fillStyle = "white"
            context.fillRect(menuX, menuY, 500, 150);
            context.fillStyle = "black"
            context.strokeRect(menuX, menuY, 500, 150);
            context.font = "30px Courier New";
            context.fillText("A/D Speed: " + towerCooldown[i], menuX, menuY);
            context.fillText("Cooldown: " + towerTimer[i], menuX, menuY + 30);
            context.fillText("Q/E Range:" + towerRange[i], menuX, menuY + 60);
            context.fillText("SPACE Mode: " + towerShootMode[i], menuX, menuY + 90);
            context.fillText("Health: " + towerHealth[i], menuX, menuY + 120);
        }
    }
    if (level > levelC) {
        context.font = "60px Courier New";
        context.fillText("You win", 0, 0);
    }
    // Draw particle system
    particleSystem.draw();

    // Game over screen
    if (lives <= 0) {
        context.clearRect(0, 0, 800, 600);
        context.font = "50px Courier New";
        context.fillText("Game over", 0, 0);
    }

    Draw();
}
function mouseup() {
    // Start game on mouse click
    if (!isGameStarted) {
        isGameStarted = true;
    }

    MouseUp();
}
function keyup(key) {
    controlTower(key);

    KeyUp(key);
}

particleSystem = {
    particles: [],
    Particle: function (x, y, dx, dy, color, size) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.size = size;
        this.timer = 30;
        this.update = function () {
            this.x += this.dx;
            this.y += this.dy;
            this.dy += 0.07;
            this.timer -= 1 + Math.random() / 2;
            this.size += Math.random() / 3;
        }
        this.draw = function () {
            context.save();
            context.translate(this.x, this.y);
            context.rotate(4 * Math.PI * this.timer / 100);
            context.globalAlpha = Math.max(0, this.timer / 100);
            context.fillStyle = this.color;
            context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            context.restore();
            context.globalAlpha = 1;
        }
    },
    makeExplosion: function (x, y, n) {
        for (let i = 0; i < n; i++) {
            let ugul = i * 2 * Math.PI / n;
            this.particles.push(new this.Particle(
                x,
                y,
                3 * (0.5 + Math.random()) * Math.cos(ugul),
                3 * (0.5 + Math.random()) * Math.random() * Math.sin(ugul),
                "rgb(" + (200 + randomInteger(55)) + ", " + randomInteger(200) + ", " + randomInteger(30) + ")",
                10
            ));
        }
    },
    update: function () {
        this.particles = this.particles.filter(p => {
            return areColliding(0, 0, canvas.width, canvas.height, p.x, p.y, p.size, p.size) || this.timer < 0
        })
        this.particles.forEach(p => { p.update() });
    },
    draw: function () {
        this.particles.forEach(p => { p.draw() });
    }
};
