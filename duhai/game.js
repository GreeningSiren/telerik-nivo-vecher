// Suzdavame promenlivi
let myX, myY;
let shop = false;
endlessCanvas = true;
canvasWidth = window.innerWidth;
canvasHeight = window.innerHeight;
let leaf = [];
let leaves = [];
for (let i = 0; i < 2; i++) {
    leaf[i] = new Image();
    leaf[i].src = "images/leaf[" + i + "].png";
    console.log(leaf[i].src);
}
const playerImg = new Image();
playerImg.src = "images/player.png";
const background = tryToLoad("background");

let money = 0;
let lastWaveTime = 0;
let leavesPerWave = 12;

class Igrach {
    constructor(x, y, width, height, tool) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.tool = tool;
        this.distMax = 75;
        this.duhane = 10;
    }
    draw() {
        const angle = Math.atan2(mouseY - this.y, mouseX - this.x);
        context.save();
        context.translate(
            this.x + this.width / 2 - 20,
            this.y + this.height / 2 - 20
        );
        context.rotate(angle);
        context.drawImage(
            playerImg,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        context.restore();
    }
}
class Listo {
    constructor(leafX, leafY, leafWidth, leafHeight, type) {
        this.leafX = leafX;
        this.leafY = leafY;
        this.leafWidth = leafWidth;
        this.leafHeight = leafHeight;
        this.type = type;
        this.rotation = 0;
    }
    draw() {
        context.save();
        context.translate(
            this.leafX + this.leafWidth / 2,
            this.leafY + this.leafHeight / 2
        );
        context.rotate(this.rotation);
        context.drawImage(
            leaf[this.type],
            -this.leafWidth / 2,
            -this.leafHeight / 2,
            this.leafWidth,
            this.leafHeight
        );
        context.restore();
    }
    update() {
        // Calculate distance between player and leaf
        const dx = player.x - this.leafX;
        const dy = player.y - this.leafY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If player is close, push leaf in the opposite direction smoothly
        if (distance < player.distMax) {
            const angle = Math.atan2(dy, dx);
            this.leafX -= Math.cos(angle) * player.duhane; // Reduce the push strength for smoother movement
            this.leafY -= Math.sin(angle) * player.duhane; // Reduce the push strength for smoother movement
            this.rotation += 0.1; // Gradual rotation effect
        }

        // If leaf is out of canvas, remove it and increase money
        if (
            this.leafX < 0 ||
            this.leafX > canvasWidth ||
            this.leafY < 0 ||
            this.leafY > canvasHeight
        ) {
            const index = leaves.indexOf(this);
            if (index > -1) {
                leaves.splice(index, 1);
                if (this.type == 0) {
                    money += 1;
                } else if (this.type == 1) {
                    money += 2;
                }
            }
        }
    }
}
const player = new Igrach(300, 300, 60, 70, 0);

function init() {
    // Kodut tuk se izpulnqva vednuj v nachaloto
    player.x = 300;
    player.y = 300;
}
function update() {
    // Kodut tuk se izpulnqva (okolo) 100 puti v sekunda
    player.x = player.x + (mouseX - player.x) / 2;
    player.y = player.y + (mouseY - player.y) / 2;
    // Spawn leaves in waves
    const waveInterval = 3000; // Time between waves in milliseconds
    leavesPerWave = 12; // Number of leaves per wave
    const currentTime = Date.now();
    if (!lastWaveTime || currentTime - lastWaveTime > waveInterval) {
        lastWaveTime = currentTime;
        for (let i = 0; i < leavesPerWave; i++) {
            const leafX = Math.random() * canvasWidth;
            const leafY = Math.random() * canvasHeight;
            const leafWidth = 50;
            const leafHeight = 50;
            const type = Math.random() < 0.1 ? 1 : 0;
            const newLeaf = new Listo(leafX, leafY, leafWidth, leafHeight, type);
            leaves.push(newLeaf);
        }
    }

    leaves.forEach((l) => l.update());
}
function draw() {
    context.globalAlpha = 0.8;
    drawImage(background, 0, 0, canvasWidth, canvasHeight);
    context.globalAlpha = 1;
    player.draw();
    leaves.forEach((l) => l.draw());
    context.font = "30px Tahoma";
    context.fillStyle = "black";
    context.fillText("Mangizi:" + money, canvasWidth - 200, 10);
    if (shop) {
        context.fillStyle = "black";
        context.fillRect(100, 100, canvasWidth - 200, canvasHeight - 200);
        drawImage(paddleGhost, 200, 125, canvasWidth - 400, 50);
        context.fillStyle = "white";
        context.fillText("kupi neshto", 250, 135);
    }
}
function mouseup() {
    // Pri klik s lqv buton - pokaji koordinatite na mishkata
    console.log("Mouse clicked at", mouseX, mouseY);
}
function keyup(key) {
    // Pechatai koda na natisnatiq klavish
    console.log("Pressed", key);
    if (key == 66) {
        shop = !shop;
    }
}
