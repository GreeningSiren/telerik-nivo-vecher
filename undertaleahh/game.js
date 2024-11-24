let spisukOtSustoqniq = [
    {   // index 0
        text: "Паднал си в дупка докато катериш планина",
        actions: [
            "Отчайваш се и се отказваш от живота",
            "Пробваш се да се покатериш",
            "Копаeш надолу към Китай"
        ]
    },
    {   // index 1
        text: "GAME OVER",
        actions: [
            "RESTART"
        ]
    },
    {   // index 2
        text: "Докато се катериш обратно нагоре виждаш змия",
        actions: [
            "Прегърни змията",
            "Биеш се с змията"
        ]
    },
    {   // index 3
        text: "Излизаш в Китай ама те арестуват",
        actions: [
            "Остави се на полицайте"
        ]
    },
    { // index 4
        text: "В Чинчонг затвора си",
        actions: [
            "Остави се на съдбата",
            "РЕВОЛЮЦИЯЯЯ"
        ]
    },
    { // index 5
        minigame: true,
        curRoll: -1,
        snakeHealth: 20,
        playerHealth: 20,
        init: function () {
            this.curRoll = -1
            this.snakeHealth = 20
            this.playerHealth = 20
        },
        draw: function () {
            // drawImage(kufte,0, 0, 800, 600)
            if(this.curRoll !== -1) {
                context.fillStyle = "white"
                context.fillRect(50,50,50,50)
                writeText("20px Tahoma", "Black", this.curRoll, 75, 75)
            }
            context.fillStyle = "white"
            context.fillRect(500,200,100,50)

            context.fillStyle = "Red"
            context.fillRect(365,120,60, 10)
            context.fillStyle = "Green"
            context.fillRect(365,120,this.snakeHealth*3, 10)
            drawImage(snake, 350, 130,100,100)

            context.fillStyle = "Red"
            context.fillRect(270,370,120,100)
            context.fillStyle = "Green"
            context.fillRect(270,370,this.playerHealth*6,100)
        },
        update: function () {
            if(this.snakeHealth <= 0) {
                curState = 6
            }
            if(this.playerHealth <= 0) {
                curState = 1
            }

        },
        mouseup: function () {
            if(areColliding(mouseX,mouseY,1,1,500,200,100,50)) {
                console.log("roll")
                this.roll()
            }
        },
        roll: function () {
            this.curRoll = randomInteger(20)
            if(this.curRoll > 10) {
                this.snakeHealth = this.snakeHealth - this.curRoll
            } else {
                this.playerHealth = this.playerHealth - this.curRoll*0.5
            }
        }
    },
    { // index 6
        text: "Уби змията. :(",
        actions: [
            "Отчайваш се и се отказваш от живота",
            "Копаeш надолу към Китай"
        ]
    }
];

const snake = tryToLoad("snake", "green")

let spisakOtTranzicii = [
    {
        nachalo: 0, krai: 1, nomerAction: 0, // Отчайваш се и се отказваш от живота
    },
    {
        nachalo: 0, krai: 2, nomerAction: 1, // Опитваш се да се покатериш
    },
    {
        nachalo: 0, krai: 3, nomerAction: 2, // Опитваш се да се покатериш
    },
    {
        nachalo: 1, krai: 0, nomerAction: 0,    // RESTART
    },
    {
        nachalo: 2, krai: 1, nomerAction: 0     // Прегърни змията
    },
    {
        nachalo: 2, krai: 5, nomerAction: 1  // Биеш се с змията
    },
    {
        nachalo: 3, krai: 4, nomerAction: 0, // Излизаш в Китай ама те арестуват
    },
    {
        nachalo: 6, krai: 1, nomerAction: 0, // Отчайваш се и се отказваш от живота
    },
    {
        nachalo: 6, krai: 3, nomerAction: 1 // Излизаш в Китай ама те арестуват
    },
    {
        nachalo: 4, krai: 1, nomerAction: 0, // Остави се на съдбата
    },
    {
        nachalo: 4, krai: 7, nomerAction: 1 // РЕВОЛЮЦИЯЯЯ
    }
];

let curState = 0;
let minigameInited = false

function init() {}

function update() {
    if (spisukOtSustoqniq[curState].minigame) {
        if (spisukOtSustoqniq[curState].update) {
            spisukOtSustoqniq[curState].update()
        }
        if (spisukOtSustoqniq[curState].init && !minigameInited) {
            minigameInited = true
            spisukOtSustoqniq[curState].init()
        }
    }
}

function draw() {
    context.fillStyle = "Black"
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "White"
    if (!spisukOtSustoqniq[curState].minigame) {
        writeText("30px Tahoma", "White", spisukOtSustoqniq[curState].text, 0, 0);
        for (let i = 0; i < spisukOtSustoqniq[curState].actions.length; i++) {
            writeText("10px Tahoma", "White", (i + 1) + ". " + spisukOtSustoqniq[curState].actions[i], i * 250, 100);
        }
    } else {
        if (spisukOtSustoqniq[curState].draw) {
            spisukOtSustoqniq[curState].draw()
        }
    }
}

function keyup(key) {
    console.log("key " + key)
    if (key > 48 && key < 53) {
        curState = switchState(curState, key - 49)
    }
}

function mouseup() {
    console.log(mouseX, mouseY)
    if(spisukOtSustoqniq[curState].mouseup) {
        spisukOtSustoqniq[curState].mouseup()
    }
}

function writeText(font, style, text, x, y) {
    context.save();
    context.font = font;
    context.fillStyle = style;
    context.fillText(text, x, y);
    context.restore();
}

function switchState(nachalo, action) {
    for (let i = 0; i < spisakOtTranzicii.length; i++) {
        if (spisakOtTranzicii[i].nachalo === nachalo && spisakOtTranzicii[i].nomerAction === action) {
            minigameInited = false;
            return spisakOtTranzicii[i].krai
        }
    }
    return nachalo
}