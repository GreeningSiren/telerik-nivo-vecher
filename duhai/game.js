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
let saveFound = false;

// Define an upgrades object to store upgrade values, limits, pricing formulas, and increment values
const upgrades = {
    normalLeafValue: {
        value: 1,
        max: 20,
        incr: 1,
        getPrice() {
            return 10 + this.value * 5;
        }
    },
    duhs: {  // Player's push strength (duhane)
        value: 10,
        max: 50,
        incr: 5,
        getPrice() {
            return 10 + this.value * 5;
        }
    },
    distMax: {
        value: 75,
        max: 200,
        incr: 10,
        getPrice() {
            return 10 + (this.value - 75) * 2;
        }
    },
    waveInterval: {
        value: 3000, // in milliseconds
        max: 1000,   // lower bound (improvement means lower value)
        incr: -250,  // subtract 250 per purchase
        getPrice() {
            return Math.round(10 + (3000 - this.value) / 100);
        }
    },
    leavesPerWave: {
        value: 12,
        max: 50,
        incr: 2,
        getPrice() {
            return 50 + (this.value - 12) * 3;
        }
    },
    // Upgrade for Gold Leaf Value (increases the yield from gold leaves)
    goldLeafValue: {
        value: 1,
        max: 50,
        incr: 1,
        getPrice() {
            // Cost is in gold currency.
            return 20 + this.value * 10;
        }
    },
    // New upgrade: Increase the chance for a gold leaf to spawn.
    goldLeafChance: {
        value: 0, // starting at 0%
        max: 50,  // maximum 50%
        incr: 5,
        getPrice() {
            // Cost is in money (adjust pricing as desired)
            return 250 + this.value * 5;
        }
    }
};

// Classes
class Igrach {
    constructor(x, y, width, height, tool) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.tool = tool;
    }
    draw() {
        const angle = Math.atan2(mouseY - this.y, mouseX - this.x);
        context.save();
        context.translate(this.x + this.width / 2 - 20, this.y + this.height / 2 - 20);
        context.rotate(angle);
        context.drawImage(playerImg, -this.width / 2, -this.height / 2, this.width, this.height);
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
        context.translate(this.leafX + this.leafWidth / 2, this.leafY + this.leafHeight / 2);
        context.rotate(this.rotation);
        context.drawImage(leaf[this.type], -this.leafWidth / 2, -this.leafHeight / 2, this.leafWidth, this.leafHeight);
        context.restore();
    }
    update() {
        // Calculate distance between player and leaf
        const dx = player.x - this.leafX;
        const dy = player.y - this.leafY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If player is close, push leaf in the opposite direction smoothly
        if (distance < upgrades.distMax.value) {
            const angle = Math.atan2(dy, dx);
            this.leafX -= Math.cos(angle) * upgrades.duhs.value;
            this.leafY -= Math.sin(angle) * upgrades.duhs.value;
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
                    money += upgrades.normalLeafValue.value;
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

        // Enforce max values from the code (if saved value exceeds code-defined maximum)
        for (let key in upgrades) {
            if (upgrades[key].value > upgrades[key].max) {
                upgrades[key].value = upgrades[key].max;
            }
        }

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
        if ((!lastWaveTime || currentTime - lastWaveTime > upgrades.waveInterval.value) && leaves.length < 6000) {
            lastWaveTime = currentTime;
            for (let i = 0; i < upgrades.leavesPerWave.value; i++) {
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
        context.fillRect(0, 0, 160, 40);
        context.fillRect(0, 40, 160, 40);
        context.font = "30px Tahoma";
        context.fillStyle = "white";
        context.drawImage(leaf[0], 0, 0, 40, 40);
        context.fillText(abbrNum(money, 2), 40, 5);
        context.drawImage(leaf[1], 0, 40, 40, 40);
        context.fillText(abbrNum(gold, 2), 40, 50);

        if (shop) {
            // Define an ordered array for the upgrades (for drawing and purchase handling)
            const upgradeOrder = [
                { key: "normalLeafValue", label: "Upgrade Normal Leaf Value", icon: leaf[0], costCurrency: "money" },
                { key: "duhs", label: "Upgrade Duhane", icon: leaf[0], costCurrency: "money" },
                { key: "distMax", label: "Upgrade DistMax", icon: leaf[0], costCurrency: "money" },
                { key: "waveInterval", label: "Decrease Wave Interval", icon: leaf[0], costCurrency: "money" },
                { key: "leavesPerWave", label: "Increase Leaves Per Wave", icon: leaf[0], costCurrency: "money" },
                { key: "goldLeafChance", label: "Upgrade Gold Leaf Chance", icon: leaf[0], costCurrency: "money" },
                { key: "goldLeafValue", label: "Upgrade Gold Leaf Value", icon: leaf[1], costCurrency: "gold" }
            ];

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

            // Fixed positioning for each upgrade item
            let baseY = 190;
            const xText = 150;      // Where the upgrade label is drawn
            const xPrice = 710;     // Where the price is drawn
            const xIcon = 745;      // Where the icon is drawn
            const xButton = 600;    // Where the buy button is drawn
            const buttonWidth = 100, buttonHeight = 30;
            for (let i = 0; i < upgradeOrder.length; i++) {
                const upgradeKey = upgradeOrder[i].key;
                const upgradeObj = upgrades[upgradeKey];
                const label = upgradeOrder[i].label;
                const icon = upgradeOrder[i].icon;
                const costCurrency = upgradeOrder[i].costCurrency;
                const price = upgradeObj.getPrice();
                let displayText = `${label} (Current: ${upgradeObj.value}`;
                if (upgradeKey === "waveInterval") {
                    displayText += "ms";
                }
                displayText += ")";

                // Draw the upgrade label and price
                context.fillStyle = "white";
                context.fillText(displayText, xText, baseY);
                context.fillText(price, xPrice, baseY);

                // Draw the upgrade icon
                context.drawImage(icon, xIcon, baseY - 10, 30, 30);

                // Draw the buy button using the helper function
                drawBuyButton(xButton, baseY - 15, upgradeObj, costCurrency, buttonWidth, buttonHeight);

                baseY += 50;
            }

            // Helper function to draw a buy button.
            // It uses the upgrade object, costCurrency string, and button dimensions.
            function drawBuyButton(x, y, upgradeObj, costCurrency, buttonWidth, buttonHeight) {
                if (upgradeObj.incr > 0) {
                    if (upgradeObj.value >= upgradeObj.max) {
                        context.fillStyle = "red";
                        context.fillRect(x, y + 10, buttonWidth, buttonHeight);
                        context.fillStyle = "white";
                        context.fillText("Max", x + 30, y + 20);
                    } else {
                        context.fillStyle = "green";
                        context.fillRect(x, y + 10, buttonWidth, buttonHeight);
                        context.fillStyle = "white";
                        context.fillText("Buy", x + 30, y + 20);
                    }
                } else {
                    if (upgradeObj.value <= upgradeObj.max) {
                        context.fillStyle = "red";
                        context.fillRect(x, y + 10, buttonWidth, buttonHeight);
                        context.fillStyle = "white";
                        context.fillText("Max", x + 30, y + 20);
                    } else {
                        context.fillStyle = "green";
                        context.fillRect(x, y + 10, buttonWidth, buttonHeight);
                        context.fillStyle = "white";
                        context.fillText("Buy", x + 30, y + 20);
                    }
                }
            }
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
    console.log("Mouse clicked at", mouseX, mouseY);
    if (gameStarted) {
        if (!shop) {
            if (areColliding(mouseX, mouseY, 1, 1, 5, canvasHeight - 65, 60, 60)) {
                shop = true;
            }
            if (areColliding(mouseX, mouseY, 1, 1, canvasWidth - 70, 0, 70, 70)) {
                let time = Date.now();
                let save = {
                    leaves, // (We rebuild these on load)
                    money,
                    gold,
                    upgrades,
                    //waveInterval,
                    leavesPerWave,
                    time
                };
                save = btoa(JSON.stringify(save));
                localStorage.setItem("LeafBlower-save", save);
                alert("Game saved at " + new Date(time).toLocaleString());
            }
        } else {
            if (areColliding(mouseX, mouseY, 1, 1, canvasWidth - 150, 120, 30, 30)) {
                shop = false;
            }

            // Use the same upgradeOrder array to handle purchases.
            const upgradeOrder = [
                "normalLeafValue",
                "duhs",
                "distMax",
                "waveInterval",
                "leavesPerWave",
                "goldLeafChance",
                "goldLeafValue"
            ];
            let baseY = 190;
            for (let i = 0; i < upgradeOrder.length; i++) {
                const key = upgradeOrder[i];
                const upgradeObj = upgrades[key];
                // Button area: x = 600, y = baseY - 15, width = 100, height = 30.
                if (areColliding(mouseX, mouseY, 1, 1, 600, baseY - 15, 100, 30)) {
                    let price = upgradeObj.getPrice();
                    let currency = "money";
                    if (key === "goldLeafValue") {
                        currency = "gold";
                    }
                    // Check if the upgrade is not 
                    if (upgradeObj.incr > 0) {
                        if (upgradeObj.value < upgradeObj.max) {
                            if (currency === "money" && money >= price) {
                                upgradeObj.value += upgradeObj.incr;
                                money -= price;
                            } else if (currency === "gold" && gold >= price) {
                                upgradeObj.value += upgradeObj.incr;
                                gold -= price;
                            }
                        }
                    } else {
                        if (upgradeObj.value > upgradeObj.max) {
                            if (currency === "money" && money >= price) {
                                upgradeObj.value += upgradeObj.incr;
                                money -= price;
                            } else if (currency === "gold" && gold >= price) {
                                upgradeObj.value += upgradeObj.incr;
                                gold -= price;
                            }
                        }
                    }
                }
                baseY += 50;
            }
        }
    } else {
        if (areColliding(mouseX, mouseY, 1, 1, canvasWidth / 2 - 100, canvasHeight / 2 - 25, 200, 50)) {
            gameStarted = true;
            window.onbeforeunload = function () {
                const currentSave = {
                    leaves,
                    money,
                    gold,
                    upgrades,
                    //waveInterval,
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
    console.log("Pressed", key);
    if (gameStarted) {
        if (key == 66) { // Toggle shop when 'B' is pressed (keycode 66)
            shop = !shop;
        }
    }
}

function abbrNum(n, d) {
    const units = ['k', 'm', 'b', 't'], factor = 10 ** d;
    for (let i = units.length - 1, s; i >= 0; i--) {
        if ((s = 10 ** ((i + 1) * 3)) <= n) {
            n = Math.round(n * factor / s) / factor;
            if (n === 1000 && i < units.length - 1) { n = 1; i++; }
            return n + units[i];
        }
    }
    return n;
}
