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
    switch (towerShootMode[towerIndex]) {
        case "mostHealth":
            let maxHealth = 0;
            let maxHealthIndex = -1;
            for (let i = 0; i < enemyC; i++) {
                if (enemyHealth[i] > maxHealth && areCirclesColliding(enemyX[i], enemyY[i], enemySize[i], towerX[towerIndex], towerY[towerIndex], towerRange[towerIndex]) && towerLastShot[towerIndex] != i) {
                    maxHealth = enemyHealth[i];
                    maxHealthIndex = i;
                }
            }
            towerLastShot[towerIndex] = maxHealthIndex;
            return maxHealthIndex;
        case "leastHealth":
            let minHealth = Infinity;
            let minHealthIndex = -1;
            for (let i = 0; i < enemyC; i++) {
                if (enemyHealth[i] < minHealth && areCirclesColliding(enemyX[i], enemyY[i], enemySize[i], towerX[towerIndex], towerY[towerIndex], towerRange[towerIndex]) && towerLastShot[towerIndex] != i) {
                    minHealth = enemyHealth[i];
                    minHealthIndex = i;
                }
            }
            towerLastShot[towerIndex] = minHealthIndex;
            return minHealthIndex;
        case "firstEnemy":
            for (let i = 0; i < enemyC; i++) {
                if (areCirclesColliding(enemyX[i], enemyY[i], enemySize[i], towerX[towerIndex], towerY[towerIndex], towerRange[towerIndex]) && towerLastShot[towerIndex] != i) {
                    towerLastShot[towerIndex] = i;
                    return i;
                }
            }
        case "closestEnemy":
            let minDistance = Infinity;
            let minDistanceIndex = -1;
            for (let i = 0; i < enemyC; i++) {
                let distance = getDistance(towerX[towerIndex], towerY[towerIndex], enemyX[i], enemyY[i]);
                if (distance < minDistance && areCirclesColliding(enemyX[i], enemyY[i], enemySize[i], towerX[towerIndex], towerY[towerIndex], towerRange[towerIndex]) && towerLastShot[towerIndex] != i) {
                    minDistance = distance;
                    minDistanceIndex = i;
                }
            }
            towerLastShot[towerIndex] = minDistanceIndex;
            return minDistanceIndex;
    }
}
function shootAtEnemy(towerIndex, enemyIndex) {
    let posokaX = (enemyX[enemyIndex] - towerX[towerIndex]) / 100;
    let posokaY = (enemyY[enemyIndex] - towerY[towerIndex]) / 100;
    spawnBullet(towerX[towerIndex], towerY[towerIndex], posokaX, posokaY);
}
function removeBullet(bulletIndex) {
    let lastBulletI = bulletC - 1;
    bulletX[bulletIndex] = bulletX[lastBulletI];
    bulletY[bulletIndex] = bulletY[lastBulletI];
    bulletDX[bulletIndex] = bulletDX[lastBulletI];
    bulletDY[bulletIndex] = bulletDY[lastBulletI];
    bulletC--;
}
function removeEnemy(enemyIndex) {
    let lastEnemyI = enemyC - 1;
    enemyX[enemyIndex] = enemyX[lastEnemyI];
    enemyY[enemyIndex] = enemyY[lastEnemyI];
    enemySize[enemyIndex] = enemySize[lastEnemyI];
    enemyHealth[enemyIndex] = enemyHealth[lastEnemyI];
    enemySpeed[enemyIndex] = enemySpeed[lastEnemyI];
    enemyC--;
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