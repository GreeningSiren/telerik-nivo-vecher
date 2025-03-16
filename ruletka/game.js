const socket = io();

let chislo = -1;
let bet = -1
endlessCanvas = true;

socket.on("chislo", (x) => {
    chislo = x;

    if(bet != -1 && chislo == bet) {
        console.log("ti si gei!!!")
    }
    bet = -1;
})

socket.on("imena", (imena) => {
    console.log(imena)
})
function init() {
    let ime = prompt();
    socket.emit("register", ime)
}

function update() { }

function draw() {
    context.fillStyle = "darkgreen";
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (chislo == 0) {
        context.fillStyle = "lime";
    } else if (chislo % 2 == 0) {
        context.fillStyle = "red";
    } else {
        context.fillStyle = "black";
    }
    context.font = "50px Arial";
    context.fillText(chislo, 0, 0);

    for (let i = 0; i < 10; i++) {
        let chislo = i;
        if (chislo == 0) {
            context.fillStyle = "lime";
        } else if (chislo % 2 == 0) {
            context.fillStyle = "red";
        } else {
            context.fillStyle = "black";
        }
        context.fillText(chislo + "", i * 70, 50);
        chislo += 10;
        if (chislo == 0) {
            context.fillStyle = "lime";
        } else if (chislo % 2 == 0) {
            context.fillStyle = "red";
        } else {
            context.fillStyle = "black";
        }
        context.fillText(chislo + "", i * 70, 150);
        chislo += 10;
        if (chislo == 0) {
            context.fillStyle = "lime";
        } else if (chislo % 2 == 0) {
            context.fillStyle = "red";
        } else {
            context.fillStyle = "black";
        }
        context.fillText(chislo + "", i * 70, 250);
        chislo += 10;
        if (chislo <= 36) {
            if (chislo == 0) {
                context.fillStyle = "lime";
            } else if (chislo % 2 == 0) {
                context.fillStyle = "red";
            } else {
                context.fillStyle = "black";
            }
            context.fillText(chislo + "", i * 70, 350);
        }
    }
}

function mouseup() {
    let X = Math.floor(mouseX / 70)
    let Y = Math.floor((mouseY - 50) / 100)
    let tui = Y * 10 + X
    console.log(tui)
    if(X <= 9 && tui <= 36) {
        bet = tui
        socket.emit("zalagam", tui)
    }
}