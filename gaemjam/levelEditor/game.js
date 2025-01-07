let blok = [];
let jiwot = [];
function init() {
    // Kodut tuk se izpulnqva vednuj v nachaloto
    for (let i = 0; i < 16; i++) {
        blok[i] = [];
        jiwot[i] = [];
        for (let j = 0; j < 10; j++) {
            blok[i][j] = false;
            jiwot[i][j] = 0;
        }
    }
}

function update() {
    // Kodut tuk se izpulnqva (okolo) 100 puti v sekunda
}

function draw() {
    // Tuk naprogramirai kakvo da se risuva
    context.fillStyle = "black";
    context.fillRect(0, 0, 800, 600);
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 10; j++) {
            if (blok[i][j]) {
                drawImage(box, i * 50, j * 50, 50, 50);
                writeText("30px Tahoma", "white", jiwot[i][j], i * 50 + 15, j * 50 + 15);
            } else {
                writeText("15px Tahoma", "white", i + " " + j, i * 50 + 15, j * 50 + 15);
            }
        }
    }
}

function mouseup() {
    // Pri klik s lqv buton - pokaji koordinatite na mishkata
    console.log("Mouse clicked at", mouseX, mouseY);
    blok[Math.floor(mouseX / 50)][Math.floor(mouseY / 50)] = !blok[Math.floor(mouseX / 50)][Math.floor(mouseY / 50)];
}

function keyup(key) {
    // Pechatai koda na natisnatiq klavish
    console.log("Pressed", key);
    if(key === 32) {
        jiwot[Math.floor(mouseX / 50)][Math.floor(mouseY / 50)] = prompt("Enter new value for the block");
    } else if (key === 69) {
        const blokJson = JSON.stringify(blok);
        navigator.clipboard.writeText(blokJson).then(() => {
            alert("blok copied to clipboard");
        });
    } else if (key === 82) {
        const jiwotJson = JSON.stringify(jiwot);
        navigator.clipboard.writeText(jiwotJson).then(() => {
            alert("jiwot copied to clipboard");
        });
    }
}

function writeText(font, style, text, x, y) {
   context.save();
   context.font = font;
   context.fillStyle = style;
   context.fillText(text, x, y);
   context.restore();
}