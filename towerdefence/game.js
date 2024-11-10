function Init() {
}
function Update() {
}
function Draw() {
}
function KeyUp(key) {
}
function MouseUp() {
}
function findTarget(towerIndex) {
    switch (towers[towerIndex].shootingMode) {
        case "mostHealth": {
            let maxHealth = 0;
            let maxHealthIndex = -1;
            for (let i = 0; i < enemies.length; i++) {
                if (enemies[i].health > maxHealth && areCirclesColliding(enemies[i].x, enemies[i].y, enemies[i].size, towers[towerIndex].x, towers[towerIndex].y, towers[towerIndex].range) && towers[towerIndex].lastShot != i) {
                    maxHealth = enemies[i].health;
                    maxHealthIndex = i;
                }
            }
            towers[towerIndex].lastShot = maxHealthIndex;
            return maxHealthIndex;
        }
        case "leastHealth": {
            let minHealth = Infinity;
            let minHealthIndex = -1;
            for (let i = 0; i < enemies.length; i++) {
                if (enemies[i].health < minHealth && areCirclesColliding(enemies[i].x, enemies[i].y, enemies[i].size, towers[towerIndex].x, towers[towerIndex].y, towers[towerIndex].range) && towers[towerIndex].lastShot != i) {
                    minHealth = enemies[i].health;
                    minHealthIndex = i;
                }
            }
            towers[towerIndex].lastShot = minHealthIndex;
            return minHealthIndex;
        }
        case "firstEnemy": {
            for (let i = 0; i < enemies.length; i++) {
                if (areCirclesColliding(enemies[i].x, enemies[i].y, enemies[i].size, towers[towerIndex].x, towers[towerIndex].y, towers[towerIndex].range) && towers[towerIndex].lastShot != i) {
                    towers[towerIndex].lastShot = i;
                    return i;
                }
            }
        }
        case "closestEnemy": {
            let minDistance = Infinity;
            let minDistanceIndex = -1;
            for (let i = 0; i < enemies.length; i++) {
                let distance = getDistance(towers[towerIndex].x, towers[towerIndex].y, enemies[i].x, enemies[i].y);
                if (distance < minDistance && areCirclesColliding(enemies[i].x, enemies[i].y, enemies[i].size, towers[towerIndex].x, towers[towerIndex].y, towers[towerIndex].range) && towers[towerIndex].lastShot != i) {
                    minDistance = distance;
                    minDistanceIndex = i;
                }
            }
            towers[towerIndex].lastShot = minDistanceIndex;
            return minDistanceIndex;
        }
    }
}
function shootAtEnemy(towerIndex, enemyIndex) {
    let posokaX = (enemies[enemyIndex].x - towers[towerIndex].x) / 100;
    let posokaY = (enemies[enemyIndex].y - towers[towerIndex].y) / 100;
    spawnBullet(towers[towerIndex].x, towers[towerIndex].y, posokaX, posokaY);
}
function removeBullet(bulletIndex) {
    bullets.splice(bulletIndex,1)

}
function removeEnemy(enemyIndex) {
    enemies.splice(enemyIndex,1)
}
function onCollideEnemyWithBullet(enemyIndex, bulletIndex) {

}
function getDistance(x1, y1, x2, y2) {
    let a = x1 - x2, b = y1 - y2;
    return Math.sqrt(a * a + b * b);
}

function areCirclesColliding(x1, y1, r1, x2, y2, r2) {
    let dx = x2 - x1, dy = y2 - y1;
    return Math.sqrt(dy * dy + dx * dx) < r1 + r2;
}