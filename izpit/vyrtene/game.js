// Suzdavame promenlivi
let myX, myY, ugulche;
function init() {
    // Kodut tuk se izpulnqva vednuj v nachaloto
    myX = 300;
    myY = 300;
    ugulche = 0;
}
function update() {
    // Kodut tuk se izpulnqva (okolo) 100 puti v sekund

    if(isKeyPressed[68]) {
        ugulche += 0.05;
    }
    if(isKeyPressed[65]) {
        ugulche -= 0.05;
    }
    if(isKeyPressed[87]) {
        let x = 2*Math.cos(ugulche);
        let y = 2*Math.sin(ugulche);
        myX += x;
        myY += y;
    }
}
function draw() {
    // Tuk naprogramirai kakvo da se risuva
    drawImage(backField, 0, 0, 800, 600);
    drawImage(femaleAction, myX, myY, 60, 80);
    writeText("20px Tahoma", "red", "Ugulche: " + ugulche.toFixed(2), 20, 20);
}
function mouseup() {
    // Pri klik s lqv buton - pokaji koordinatite na mishkata
    console.log("Mouse clicked at", mouseX, mouseY);
}
function keyup(key) {
    // Pechatai koda na natisnatiq klavish
    console.log("Pressed", key);
}

function writeText(font, style, text, x, y) {
   context.save();
   context.font = font;
   context.fillStyle = style;
   context.fillText(text, x, y);
   context.restore();
}