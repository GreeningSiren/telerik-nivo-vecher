// Suzdavame promenlivi (Creating variables)
let myX = 300, myY = 300, myUgul = 0, skorost = 2, razmerGlava = 30,
    opashkaBroi = 0, opashkaX = [], opashkaY = [], opashkaUgul = [], opashkaRazmer = 20,
    glavaIstorqX = [], glavaIstorqY = [], glavaIstorqUgul = [], zagubih = false,
    qbalkiBroi = 10, qbalkaX = [], qbalkaY = [], qbalkaCvqt = [];

// Function to get a random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to choose coordinates for the apple
function izberiKoordNaQbulka() {
    let x, y;
    let bluskaLiSe;
    do {
        x = randomInteger(800 - razmerGlava) + razmerGlava / 2;
        y = randomInteger(600 - razmerGlava) + razmerGlava / 2;

        bluskaLiSe = false;
        for (let i = 0; i < qbalkaX.length; i++) {
            if ((x - qbalkaX[i]) ** 2 + (y - qbalkaY[i]) ** 2 <= razmerGlava ** 2) {
                bluskaLiSe = true;
            }
        }
    } while (bluskaLiSe);

    return [x, y];
}

// Initialization function
function init() {
    for (let i = 0; i < qbalkiBroi; i++) {
        let cvqt = getRandomColor();

        let [x, y] = izberiKoordNaQbulka();
        qbalkaX.push(x);
        qbalkaY.push(y);
        qbalkaCvqt.push(cvqt);

        [x, y] = izberiKoordNaQbulka();
        qbalkaX.push(x);
        qbalkaY.push(y);
        qbalkaCvqt.push(cvqt);
    }
}

// Function to add a tail segment
function dobaviOpashka() {
    if (opashkaBroi == 0) {
        opashkaX.push(myX + razmerGlava / 2 - opashkaRazmer / 2 + Math.cos(myUgul + Math.PI) * (opashkaRazmer / 2 + razmerGlava / 2));
        opashkaY.push(myY + razmerGlava / 2 - opashkaRazmer / 2 + Math.sin(myUgul + Math.PI) * (opashkaRazmer / 2 + razmerGlava / 2));
        opashkaUgul.push(myUgul);
    } else {
        opashkaX.push(opashkaX[opashkaBroi - 1] + Math.cos(opashkaUgul[opashkaBroi - 1] + Math.PI) * opashkaRazmer);
        opashkaY.push(opashkaY[opashkaBroi - 1] + Math.sin(opashkaUgul[opashkaBroi - 1] + Math.PI) * opashkaRazmer);
        opashkaUgul.push(opashkaUgul[opashkaBroi - 1]);
    }
    opashkaBroi++;
}

// Update function to handle game logic
function update() {
    if (zagubih) {
        return;
    }
    if (isKeyPressed[65]) {
        myUgul -= 0.05;
    }
    if (isKeyPressed[68]) {
        myUgul += 0.05;
    }
    myX += Math.cos(myUgul) * skorost;
    myY += Math.sin(myUgul) * skorost;
    let nachaloNaIzhabenataIstoriq = glavaIstorqX.length - 1;
    for (let i = 0; i < opashkaBroi; i++) {
        for (let j = nachaloNaIzhabenataIstoriq; j >= 0; j--) {
            if (i == 0) {
                if (
                    (myX + razmerGlava / 2 - glavaIstorqX[j]) ** 2 +
                    (myY + razmerGlava / 2 - glavaIstorqY[j]) ** 2 >
                    (razmerGlava / 2 + opashkaRazmer / 2) ** 2
                ) {
                    opashkaX[i] = glavaIstorqX[j] - opashkaRazmer / 2;
                    opashkaY[i] = glavaIstorqY[j] - opashkaRazmer / 2;
                    opashkaUgul[i] = glavaIstorqUgul[j];
                    nachaloNaIzhabenataIstoriq = j;
                    break;
                }
            } else {
                if (
                    (opashkaX[i - 1] + opashkaRazmer / 2 - glavaIstorqX[j]) ** 2 +
                    (opashkaY[i - 1] + opashkaRazmer / 2 - glavaIstorqY[j]) ** 2 >
                    opashkaRazmer ** 2
                ) {
                    opashkaX[i] = glavaIstorqX[j] - opashkaRazmer / 2;
                    opashkaY[i] = glavaIstorqY[j] - opashkaRazmer / 2;
                    opashkaUgul[i] = glavaIstorqUgul[j];
                    nachaloNaIzhabenataIstoriq = j;
                    break;
                }
            }
        }
    }

    glavaIstorqX.splice(0, nachaloNaIzhabenataIstoriq - 100);
    glavaIstorqY.splice(0, nachaloNaIzhabenataIstoriq - 100);
    glavaIstorqUgul.splice(0, nachaloNaIzhabenataIstoriq - 100);

    glavaIstorqX.push(myX + razmerGlava / 2);
    glavaIstorqY.push(myY + razmerGlava / 2);
    glavaIstorqUgul.push(myUgul);

    for (let i = 0; i < opashkaBroi; i++) {
        if ((myX + razmerGlava / 2 - (opashkaX[i] + opashkaRazmer / 2)) ** 2 +
            (myY + razmerGlava / 2 - (opashkaY[i] + opashkaRazmer / 2)) ** 2
            <= (razmerGlava / 2 + opashkaRazmer / 2) ** 2) {
            zagubih = true;
        }
    }

    for (let i = 0; i < qbalkaX.length; i++) {
        if ((myX + razmerGlava / 2 - qbalkaX[i]) ** 2 +
            (myY + razmerGlava / 2 - qbalkaY[i]) ** 2
            <= (razmerGlava / 2 + opashkaRazmer / 2) ** 2) {
            dobaviOpashka();

            /*
            let drugaQbalka;
            if (i % 2 == 0) {
                drugaQbalka = i + 1;
            } else {
                drugaQbalka = i - 1;
            }

            myX = qbalkaX[drugaQbalka];
            myY = qbalkaY[drugaQbalka];
            */

            let cvqt = getRandomColor();
            let [x, y] = izberiKoordNaQbulka()
            qbalkaX[i] = x;
            qbalkaY[i] = y;
            qbalkaCvqt[i] = cvqt;

            [x, y] = izberiKoordNaQbulka();
            qbalkaX[drugaQbalka] = x;
            qbalkaY[drugaQbalka] = y;
            qbalkaCvqt[drugaQbalka] = cvqt;
        }
    }

    if (myY < -razmerGlava) {
        myY = 600;
    }
    if (myY > 600) {
        myY = -razmerGlava;
    }
    if (myX < -razmerGlava) {
        myX = 800;
    }
    if (myX > 800) {
        myX = -razmerGlava;
    }
}


// Draw function to render the game
function draw() {
    context.fillStyle = "black";
    context.fillRect(0, 0, 800, 600);

    context.save();
    context.translate(myX + 15, myY + 15);
    context.rotate(myUgul);
    context.translate(-myX - 15, -myY - 15);

    context.fillStyle = "#00aa00";
    context.fillRect(myX, myY, razmerGlava, razmerGlava);
    context.fillStyle = "#002200";
    context.beginPath();
    context.arc(myX + razmerGlava / 2, myY + razmerGlava / 2, razmerGlava / 2, 0, 2 * Math.PI);
    context.fill();

    context.fillStyle = "#aa0000";
    context.fillRect(myX + 20, myY + 5, 5, 5);
    context.fillRect(myX + 20, myY + 20, 5, 5);

    context.restore();

    for (let i = 0; i < opashkaBroi; i++) {
        context.save();
        context.translate(opashkaX[i] + 10, opashkaY[i] + 10);
        context.rotate(opashkaUgul[i]);
        context.translate(-opashkaX[i] - 10, -opashkaY[i] - 10);

        context.fillStyle = "#00aa00";
        context.fillRect(opashkaX[i], opashkaY[i], 20, 20);

        context.fillStyle = "#002200";
        context.beginPath();
        context.arc(opashkaX[i] + opashkaRazmer / 2, opashkaY[i] + opashkaRazmer / 2, opashkaRazmer / 2, 0, 2 * Math.PI);
        context.fill();

        context.restore();
    }

    // Draw apples
    for (let i = 0; i < qbalkaX.length; i++) {
        context.fillStyle = qbalkaCvqt[i];
        context.beginPath();
        context.arc(qbalkaX[i], qbalkaY[i], opashkaRazmer / 2, 0, 2 * Math.PI);
        context.fill();
    }

    // Display game over message if lost
    if (zagubih) {
        context.fillStyle = "#ff0000";
        context.font = "70px Arial";
        context.fillText("SLABAK, UNRQ!!1", 100, 300);
    }

    // Uncomment to show the history of the head's position
    // for (let i = 0; i < glavaIstorqX.length; i++) {
    //     context.fillStyle = "#00ffff";
    //     context.beginPath();
    //     context.arc(glavaIstorqX[i], glavaIstorqY[i], 1, 0, 2 * Math.PI);
    //     context.fill();
    // }
}

// Function to handle mouse click events
function mouseup() {
    // Pri klik s lqv buton - pokaji koordinatite na mishkata (On left click - show mouse coordinates)
    console.log("Mouse clicked at", mouseX, mouseY);
}

// Function to handle key up events
function keyup(key) {
    console.log(key);
}