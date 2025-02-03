// Global Variables
let myX, myY;
let shop = false;
endlessCanvas = true;
canvasWidth = window.innerWidth;
canvasHeight = window.innerHeight;
let leaf = [];
let leaves = [];

// Load leaf images
for (let i = 0; i < 2; i++) {
    leaf[i] = new Image();
    leaf[i].src = "images/leaf[" + i + "].png";
    console.log(leaf[i].src);
}

const playerImg = new Image();
playerImg.src = "images/player.png";
const background = tryToLoad("background");
const saveIcon = tryToLoad("saveIcon");

// Currencies
let money = 0;      // Normal money earned from normal leaves
let gold = 0;       // Gold currency earned from gold leaves
let lastWaveTime = 0;
let gameStarted = false;
// We'll no longer use this global variable – use the upgrade's value instead
// let golfLeafChance = 10; 
let saveFound = false;

// Define an upgrades object to store upgrade values, limits, and pricing formulas
const upgrades = {
    normalLeafValue: {
        value: 1,
        max: 10,
        getPrice() {
            return 10 + this.value * 5;
        }
    },
    duhs: {  // Player's push strength (duhane)
        value: 10,
        max: 50,
        getPrice() {
            return 10 + this.value * 5;
        }
    },
    distMax: {
        value: 75,
        max: 200,
        getPrice() {
            return 10 + (this.value - 75) * 2;
        }
    },
    waveInterval: {
        value: 3000, // in milliseconds
        max: 1000,   // lower bound (improvement means lower value)
        getPrice() {
            return 10 + (3000 - this.value) / 100;
        }
    },
    leavesPerWave: {
        value: 12,
        max: 50,
        getPrice() {
            return 10 + (this.value - 12) * 3;
        }
    },
    // Upgrade for Gold Leaf Value (increases the yield from gold leaves)
    goldLeafValue: {
        value: 1,
        max: 50,
        getPrice() {
            // Cost is in gold currency.
            return 20 + this.value * 10;
        }
    },
    // New upgrade: Increase the chance for a gold leaf to spawn.
    goldLeafChance: {
        value: 10, // initial chance is 10%
        max: 50,   // maximum 50%
        getPrice() {
            // Cost is in money (adjust the pricing formula as desired)
            return 15 + this.value * 2;
        }
    }
};

// For convenience, mirror some upgrade values into game variables
let normalLeafValue = upgrades.normalLeafValue.value;
let waveInterval = upgrades.waveInterval.value;
let leavesPerWave = upgrades.leavesPerWave.value;

// Classes
class Igrach {
    constructor(x, y, width, height, tool) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.tool = tool;
        // These values will be set based on upgrades
        this.distMax = upgrades.distMax.value;
        this.duhane = upgrades.duhs.value;
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
        this.type = type; // 0 = normal leaf, 1 = gold leaf
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
            this.leafX -= Math.cos(angle) * player.duhane;
            this.leafY -= Math.sin(angle) * player.duhane;
            this.rotation += 0.1;
        }

        // If leaf is out of canvas, remove it and award currency
        if (
            this.leafX + this.leafWidth / 4 < 0 ||
            this.leafX + this.leafWidth * 3 / 4 > canvasWidth ||
            this.leafY + this.leafHeight / 4 < 0 ||
            this.leafY + this.leafHeight * 3 / 4 > canvasHeight
        ) {
            const index = leaves.indexOf(this);
            if (index > -1) {
                leaves.splice(index, 1);
                if (this.type === 0) {
                    money += normalLeafValue;
                } else if (this.type === 1) {
                    // Gold leaves add to the gold currency using the goldLeafValue upgrade
                    gold += upgrades.goldLeafValue.value;
                }
            }
        }
    }
}

const player = new Igrach(mouseX, mouseY, 60, 70, 0);

function init() {
    // Initialization code runs once at the start
    player.x = 300;
    player.y = 300;

    if (localStorage.getItem("LeafBlower-save")) {
        let save = atob(localStorage.getItem("LeafBlower-save"));
        save = JSON.parse(save);

        money = save.money;
        gold = save.gold;  // Restore gold currency

        // Restore upgrades from save. Use Object.assign to update our upgrades object.
        Object.assign(upgrades.normalLeafValue, save.upgrades.normalLeafValue);
        Object.assign(upgrades.duhs, save.upgrades.duhs);
        Object.assign(upgrades.distMax, save.upgrades.distMax);
        Object.assign(upgrades.waveInterval, save.upgrades.waveInterval);
        Object.assign(upgrades.leavesPerWave, save.upgrades.leavesPerWave);
        Object.assign(upgrades.goldLeafValue, save.upgrades.goldLeafValue);
        Object.assign(upgrades.goldLeafChance, save.upgrades.goldLeafChance);

        // Mirror upgrade values back to our game variables and player stats.
        normalLeafValue = upgrades.normalLeafValue.value;
        waveInterval = upgrades.waveInterval.value;
        leavesPerWave = upgrades.leavesPerWave.value;
        player.duhane = upgrades.duhs.value;
        player.distMax = upgrades.distMax.value;

        // Rebuild leaves as instances of Listo
        leaves = save.leaves.map(l => new Listo(l.leafX, l.leafY, l.leafWidth, l.leafHeight, l.type));

        saveFound = true;
    }
}

function update() {
    if (gameStarted) {
        // Update player position smoothly toward mouse
        player.x = player.x + (mouseX - player.x) / 2;
        player.y = player.y + (mouseY - player.y) / 2;

        // Spawn leaves in waves (limit total leaves to avoid slowdown)
        const currentTime = Date.now();
        if ((!lastWaveTime || currentTime - lastWaveTime > waveInterval) && leaves.length < 6000) {
            lastWaveTime = currentTime;
            for (let i = 0; i < leavesPerWave; i++) {
                const leafX = Math.random() * canvasWidth;
                const leafY = Math.random() * canvasHeight;
                const leafWidth = 50;
                const leafHeight = 50;
                // Use the upgraded chance for gold leaves
                const type = Math.random() < upgrades.goldLeafChance.value / 100 ? 1 : 0;
                const newLeaf = new Listo(leafX, leafY, leafWidth, leafHeight, type);
                leaves.push(newLeaf);
            }
        }

        leaves.forEach((l) => l.update());
    }
}

function draw() {
    context.globalAlpha = 0.8;
    drawImage(background, 0, 0, canvasWidth, canvasHeight);
    context.globalAlpha = 1;
    if (gameStarted) {
        player.draw();
        leaves.forEach((l) => l.draw());

        // Display normal money and gold currency with background
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillRect(0, 0, 250, 40);
        context.fillRect(0, 40, 250, 40);
        context.font = "30px Tahoma";
        context.fillStyle = "white";
        context.fillText("Money: " + money, 0, 0);
        context.fillText("Gold: " + gold, 0, 50);

        if (shop) {
            // Calculate current prices from upgrades
            const normalLeafValuePrice = upgrades.normalLeafValue.getPrice();
            const duhnePrice = upgrades.duhs.getPrice();
            const distMaxPrice = upgrades.distMax.getPrice();
            const waveIntervalPrice = upgrades.waveInterval.getPrice();
            const leavesPerWavePrice = upgrades.leavesPerWave.getPrice();
            const goldLeafValuePrice = upgrades.goldLeafValue.getPrice();
            const goldLeafChancePrice = upgrades.goldLeafChance.getPrice();

            // Draw shop background
            context.fillStyle = "rgba(0, 0, 0, 0.8)";
            context.fillRect(100, 100, canvasWidth - 200, canvasHeight - 200);

            context.fillStyle = "white";
            context.font = "30px Tahoma";
            context.fillText("Shop", canvasWidth / 2 - 40, 140);

            // Draw close shop button
            context.fillStyle = "red";
            context.fillRect(canvasWidth - 150, 120, 30, 30);
            context.fillStyle = "white";
            context.fillText("X", canvasWidth - 145, 125);

            context.font = "20px Tahoma";
            // Normal Leaf Value Upgrade (cost: money)
            context.fillText("Upgrade Normal Leaf Value (Current: " + upgrades.normalLeafValue.value + ")", 150, 190);
            context.fillText(normalLeafValuePrice, 710, 190);
            context.drawImage(leaf[0], 745, 180, 30, 30);
            // Duhane (Push Strength) Upgrade (cost: money)
            context.fillText("Upgrade Duhane (Current: " + upgrades.duhs.value + ")", 150, 240);
            context.fillText(duhnePrice, 710, 240);
            context.drawImage(leaf[0], 745, 230, 30, 30);
            // DistMax Upgrade (cost: money)
            context.fillText("Upgrade DistMax (Current: " + upgrades.distMax.value + ")", 150, 290);
            context.fillText(distMaxPrice, 710, 290);
            context.drawImage(leaf[0], 745, 280, 30, 30);
            // Wave Interval Upgrade (Lower is better; cost: money)
            context.fillText("Decrease Wave Interval (Current: " + waveInterval + "ms)", 150, 340);
            context.fillText(waveIntervalPrice, 710, 340);
            context.drawImage(leaf[0], 745, 330, 30, 30);
            // Leaves Per Wave Upgrade (cost: money)
            context.fillText("Increase Leaves Per Wave (Current: " + upgrades.leavesPerWave.value + ")", 150, 390);
            context.fillText(leavesPerWavePrice, 710, 390);
            context.drawImage(leaf[0], 745, 380, 30, 30);
            // Gold Leaf Value Upgrade (cost: gold)
            context.fillText("Upgrade Gold Leaf Value (Current: " + upgrades.goldLeafValue.value + ")", 150, 440);
            context.fillText(goldLeafValuePrice, 710, 440);
            context.drawImage(leaf[1], 745, 430, 30, 30);
            // New Upgrade: Gold Leaf Chance (cost: money)
            context.fillText("Upgrade Gold Leaf Chance (Current: " + upgrades.goldLeafChance.value + "%)", 150, 490);
            context.fillText(goldLeafChancePrice, 710, 490);
            context.drawImage(leaf[1], 745, 480, 30, 30);

            // Draw Buy buttons for each upgrade option with max check
            // Helper function to draw a buy button
            function drawBuyButton(x, y, upgradeObj) {
                // If the upgrade is maxed out, draw red and display "Max"
                if (upgradeObj.value >= upgradeObj.max) {
                    context.fillStyle = "red";
                    context.fillRect(x, y, 100, 30);
                    context.fillStyle = "white";
                    context.fillText("Max", x + 30, y + 5);
                } else {
                    context.fillStyle = "green";
                    context.fillRect(x, y, 100, 30);
                    context.fillStyle = "white";
                    context.fillText("Buy", x + 30, y + 5);
                }
            }

            // Draw each button with the proper position and upgrade object
            drawBuyButton(600, 180, upgrades.normalLeafValue);
            drawBuyButton(600, 230, upgrades.duhs);
            drawBuyButton(600, 280, upgrades.distMax);
            drawBuyButton(600, 330, upgrades.waveInterval);
            drawBuyButton(600, 380, upgrades.leavesPerWave);
            drawBuyButton(600, 430, upgrades.goldLeafValue);
            drawBuyButton(600, 480, upgrades.goldLeafChance);
        } else {
            // Draw shop button (leaf image background)
            context.fillStyle = "rgba(0, 0, 0, 0.5)";
            context.fillRect(5, canvasHeight - 65, 60, 60);
            context.drawImage(leaf[0], 10, canvasHeight - 60, 50, 50);

            // Draw save button using saveIcon
            context.fillStyle = "rgba(0, 0, 0, 0.5)";
            context.fillRect(canvasWidth - 70, 0, 70, 70);
            drawImage(saveIcon, canvasWidth - 60, 5, 50, 50);
            context.fillStyle = "white";
            context.font = "20px Tahoma";
            context.fillText("Save", canvasWidth - 55, 50);
        }
    } else {
        // Draw start screen
        context.font = "30px Tahoma";
        context.fillStyle = "black";
        context.fillText("Duhai Duhalki", canvasWidth / 2 - 150, canvasHeight / 4);
        context.fillStyle = "black";
        context.fillRect(canvasWidth / 2 - 100, canvasHeight / 2 - 25, 200, 50);
        context.fillStyle = "white";
        context.fillText("Start Game", canvasWidth / 2 - 80, canvasHeight / 2 - 10);

        if (saveFound) {
            context.fillStyle = "white";
            context.font = "20px Tahoma";
            context.fillText("Save Found", canvasWidth / 2 - 50, canvasHeight / 2 + 75);

            context.fillStyle = "red";
            context.fillRect(canvasWidth / 2 - 100, canvasHeight / 2 + 125, 200, 50);
            context.fillStyle = "white";
            context.fillText("Delete Save", canvasWidth / 2 - 80, canvasHeight / 2 + 150);
        }
    }
}

function mouseup() {
    // Log mouse coordinates on click
    console.log("Mouse clicked at", mouseX, mouseY);
    if (gameStarted) {
        if (!shop) {
            if (areColliding(mouseX, mouseY, 1, 1, 5, canvasHeight - 65, 60, 60)) {
                shop = true;
            }
            if (areColliding(mouseX, mouseY, 1, 1, canvasWidth - 70, 0, 70, 70)) {
                let time = Date.now();
                // Prepare save data including upgrades and gold
                let save = {
                    leaves, // (We rebuild these on load)
                    money,
                    gold,
                    upgrades, // Save our upgrades object
                    waveInterval,
                    leavesPerWave,
                    time
                };
                save = btoa(JSON.stringify(save));
                localStorage.setItem("LeafBlower-save", save);

                alert("Game saved at " + new Date(time).toLocaleString());
            }
        } else {
            // In shop mode
            if (areColliding(mouseX, mouseY, 1, 1, canvasWidth - 150, 120, 30, 30)) {
                shop = false;
            }

            // Check upgrade buttons and apply upgrades if the player has enough currency
            // Upgrade Normal Leaf Value (cost: money)
            if (areColliding(mouseX, mouseY, 1, 1, 600, 180, 100, 30)) {
                const price = upgrades.normalLeafValue.getPrice();
                if (money >= price && upgrades.normalLeafValue.value < upgrades.normalLeafValue.max) {
                    upgrades.normalLeafValue.value++;
                    money -= price;
                    normalLeafValue = upgrades.normalLeafValue.value;
                }
            }
            // Upgrade Duhane (Push Strength, cost: money)
            if (areColliding(mouseX, mouseY, 1, 1, 600, 230, 100, 30)) {
                const price = upgrades.duhs.getPrice();
                if (money >= price && upgrades.duhs.value < upgrades.duhs.max) {
                    upgrades.duhs.value += 5;
                    money -= price;
                    player.duhane = upgrades.duhs.value;
                }
            }
            // Upgrade DistMax (cost: money)
            if (areColliding(mouseX, mouseY, 1, 1, 600, 280, 100, 30)) {
                const price = upgrades.distMax.getPrice();
                if (money >= price && upgrades.distMax.value < upgrades.distMax.max) {
                    upgrades.distMax.value += 10;
                    money -= price;
                    player.distMax = upgrades.distMax.value;
                }
            }
            // Decrease Wave Interval (improvement; cost: money)
            if (areColliding(mouseX, mouseY, 1, 1, 600, 330, 100, 30)) {
                const price = upgrades.waveInterval.getPrice();
                if (money >= price && upgrades.waveInterval.value > upgrades.waveInterval.max) {
                    upgrades.waveInterval.value = Math.max(upgrades.waveInterval.max, upgrades.waveInterval.value - 500);
                    money -= price;
                    waveInterval = upgrades.waveInterval.value;
                }
            }
            // Increase Leaves Per Wave (cost: money)
            if (areColliding(mouseX, mouseY, 1, 1, 600, 380, 100, 30)) {
                const price = upgrades.leavesPerWave.getPrice();
                if (money >= price && upgrades.leavesPerWave.value < upgrades.leavesPerWave.max) {
                    upgrades.leavesPerWave.value += 2;
                    money -= price;
                    leavesPerWave = upgrades.leavesPerWave.value;
                }
            }
            // Upgrade Gold Leaf Value (cost: gold)
            if (areColliding(mouseX, mouseY, 1, 1, 600, 430, 100, 30)) {
                const price = upgrades.goldLeafValue.getPrice();
                if (gold >= price && upgrades.goldLeafValue.value < upgrades.goldLeafValue.max) {
                    upgrades.goldLeafValue.value++;
                    gold -= price;
                }
            }
            // New: Upgrade Gold Leaf Chance (cost: gold)
            if (areColliding(mouseX, mouseY, 1, 1, 600, 480, 100, 30)) {
                const price = upgrades.goldLeafChance.getPrice();
                if (gold >= price && upgrades.goldLeafChance.value < upgrades.goldLeafChance.max) {
                    upgrades.goldLeafChance.value++;
                    gold -= price;
                }
            }
        }
    } else {
        // On the start screen
        if (areColliding(mouseX, mouseY, 1, 1, canvasWidth / 2 - 100, canvasHeight / 2 - 25, 200, 50)) {
            gameStarted = true;
            window.onbeforeunload = function () {
                const currentSave = {
                    leaves,
                    money,
                    gold,
                    upgrades,
                    waveInterval,
                    leavesPerWave
                };
                const savedData = JSON.parse(atob(localStorage.getItem("LeafBlower-save")));
                if (JSON.stringify(currentSave) !== JSON.stringify(savedData)) {
                    return true;
                }
                return null;
            }
        }
        if (areColliding(mouseX, mouseY, 1, 1, canvasWidth / 2 - 100, canvasHeight / 2 + 125, 200, 50)) {
            if (confirm("Are you sure you want to delete the save?")) {
                localStorage.removeItem("LeafBlower-save");
                alert("Save deleted");
                saveFound = false;
                location.reload();
            }
        }
    }
}

function keyup(key) {
    // Log key pressed
    console.log("Pressed", key);
    if (gameStarted) {
        if (key == 66) { // Toggle shop when 'B' is pressed (keycode 66)
            shop = !shop;
        }
    }
}
