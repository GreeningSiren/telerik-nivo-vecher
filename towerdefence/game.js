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
    if(towerShootMode[towerIndex] == "mostHealth") {
        let maxHealth = 0;
        let maxHealthIndex = -1;
        for(let i = 0; i < enemyC; i++) {
            if(enemyHealth[i] > maxHealth && areCirclesColliding(enemyX[i], enemyY[i], enemySize[i], towerX[towerIndex], towerY[towerIndex], towerRange[towerIndex])) {
                maxHealth = enemyHealth[i];
                maxHealthIndex = i;
            }
        }
        return maxHealthIndex;
    }
}
function shootAtEnemy(towerIndex, enemyIndex) {
    let posokaX = (enemyX[enemyIndex] - towerX[towerIndex])/100;
    let posokaY = (enemyY[enemyIndex] - towerY[towerIndex])/100;
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
function distance(x1,y1,x2,y2) {
    let a = x1-x2, b = y1-y2;
    return Math.sqrt(a*a+b*b);
}

function areCirclesColliding(x1, y1, r1, x2, y2, r2) {
   let dx = x2 - x1, dy = y2 - y1;
   return Math.sqrt(dy * dy + dx * dx) < r1 + r2;
}