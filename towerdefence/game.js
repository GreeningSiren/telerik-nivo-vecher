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
    return 0;
}
function shootAtEnemy(towerIndex, enemyIndex) {
    spawnBullet(mouseX, mouseY, -1, 0);
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
function distance() {

}