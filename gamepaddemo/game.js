// Suzdavame promenlivi
let myX, myY;
let showNoGamepadError = true;
let controllerButtons = {
    0: "A",
    1: "B",
    2: "X",
    3: "Y",
    4: "LB",
    5: "RB",
    6: "LT",
    7: "RT",
    8: "Back",
    9: "Start",
    10: "L3",
    11: "R3",
    12: "Up",
    13: "Down",
    14: "Left",
    15: "Right",
    16: "Xbox",
}

let gamepad = null;


function init() {
    // Kodut tuk se izpulnqva vednuj v nachaloto
    myX = 300;
    myY = 300;
}
function update() {
    // Kodut tuk se izpulnqva (okolo) 100 puti v sekunda
    myX = myX + (mouseX - myX) / 10;
    myY = myY + (mouseY - myY) / 10;
    if (!gamepad) {
        showNoGamepadError = true;
        temp = navigator.getGamepads();
        if (temp && temp[0]) {
            gamepad = temp[0];
            showNoGamepadError = false;
            console.log("Gamepad connected:", gamepad);
        } else {
            gamepad = null;
        }
    } else {
        showNoGamepadError = false;
        temp = navigator.getGamepads();
        if (temp && temp[0]) {
            // Update the gamepad reference if it exists
            gamepad = temp[0];
        } else {
            // If no gamepad is connected, set it to null
            gamepad = null;
            showNoGamepadError = true;
            console.log("No gamepad detected");
        }
    }
}
function draw() {
    // Tuk naprogramirai kakvo da se risuva
    drawImage(backField, 0, 0, 800, 600);
    drawImage(femaleAction, myX, myY, 60, 80);
    if (showNoGamepadError) {
        writeText("20px Arial", "red", "No gamepad detected!\nPress any button to connect", 300, 300);
    } else {
        writeText("15px Arial", "black", "Gamepad connected: \n" + gamepad.id + "\nTimestamp:\n" + gamepad.timestamp.toFixed(15), 350, 120);
        for (let i = 0; i < 17; i++) {
            if (gamepad.buttons[i].pressed) {
                drawControllerButton(i, 50 + i * 40, 500, 30);
            } else {
                drawControllerButton(i, 50 + i * 40, 500, 30);
            }
        }

        if (gamepad.vibrationActuator) {
            if (gamepad.vibrationActuator.effects[0] === "dual-rumble") {
                writeText("20px Arial", "green", "Test Vibration", 300, 350);
                context.save();
                context.strokeStyle = "#333";
                context.lineWidth = 3;
                context.fillStyle = "#cccccc";
                context.fillRect(320, 380, 160, 50);
                context.strokeRect(320, 380, 160, 50);
                context.fillStyle = "#222";
                context.font = "22px Arial";
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillText("Vibrate!", 400, 405);
                context.restore();
                // Button box coords: x=320, y=380, width=160, height=50
            } else {
                writeText("20px Arial", "yellow", "Vibration actuator not supported: " + gamepad.vibrationActuator.effects[0], 300, 350);
            }
        } else {
            writeText("20px Arial", "red", "No vibration actuator found", 300, 350);
        }

        // Визуализиране на Left Stick (Axes 0 и 1)
        if (gamepad.axes.length >= 2) {
            const leftStickX = gamepad.axes[0];
            const leftStickY = gamepad.axes[1];

            const baseX = 100;
            const baseY = 100;
            const stickRadius = 40;

            context.save();
            context.strokeStyle = "#555";
            context.beginPath();
            context.arc(baseX, baseY, stickRadius, 0, Math.PI * 2);
            context.stroke();

            const dotX = baseX + leftStickX * stickRadius;
            const dotY = baseY + leftStickY * stickRadius;
            context.fillStyle = "#ff0000"; // Червен за ляв стик
            context.beginPath();
            context.arc(dotX, dotY, 8, 0, Math.PI * 2);
            context.fill();

            context.fillStyle = "#000";
            context.font = "16px Arial";
            context.fillText("Left Stick", baseX - 30, baseY - 50);
            context.fillText(`X: ${leftStickX.toFixed(2)}`, baseX - 30, baseY + 60);
            context.fillText(`Y: ${leftStickY.toFixed(2)}`, baseX - 30, baseY + 80);
            context.restore();
        }

        // Визуализиране на Right Stick (Axes 2 и 3)
        if (gamepad.axes.length >= 4) {
            const rightStickX = gamepad.axes[2];
            const rightStickY = gamepad.axes[3];

            const baseX = 250;
            const baseY = 100;
            const stickRadius = 40;

            context.save();
            context.strokeStyle = "#555";
            context.beginPath();
            context.arc(baseX, baseY, stickRadius, 0, Math.PI * 2);
            context.stroke();

            const dotX = baseX + rightStickX * stickRadius;
            const dotY = baseY + rightStickY * stickRadius;
            context.fillStyle = "#0000ff"; // Син за десен стик
            context.beginPath();
            context.arc(dotX, dotY, 8, 0, Math.PI * 2);
            context.fill();

            context.fillStyle = "#000";
            context.font = "16px Arial";
            context.fillText("Right Stick", baseX - 30, baseY - 50);
            context.fillText(`X: ${rightStickX.toFixed(2)}`, baseX - 30, baseY + 60);
            context.fillText(`Y: ${rightStickY.toFixed(2)}`, baseX - 30, baseY + 80);
            context.restore();
        }

    }
}
function mouseup() {
    // Pri klik s lqv buton - pokaji koordinatite na mishkata
    console.log("Mouse clicked at", mouseX, mouseY);
    if (mouseX >= 320 && mouseX < 480 && mouseY >= 380 && mouseY < 430 && gamepad && gamepad.vibrationActuator.effects[0] === "dual-rumble") {
        gamepad.vibrationActuator.playEffect("dual-rumble", {
            startDelay: 0,
            duration: 1000,
            weakMagnitude: 0.5,
            strongMagnitude: 0.5
        });
        console.log("Vibration started with duration 1000ms and magnitudes 0.5");
    }
}
function keyup(key) {
    // Pechatai koda na natisnatiq klavish
    console.log("Pressed", key);
}
function writeText(font, style, text, x, y) {
    context.save();
    context.font = font;
    context.fillStyle = style;
    // Split text by newlines and draw each line
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
        context.fillText(lines[i], x, y + i * 24); // 24px line height for 20px font
    }
    context.restore();
}

function drawControllerButton(buttonIndex, x, y, size) {
    context.save();
    context.fillStyle = "#000000";
    context.fillRect(x, y, size, size); // Draw button background
    if (gamepad.buttons[buttonIndex].pressed) {
        context.fillStyle = "#00ff00"; // Green for pressed buttons
    }
    if (buttonIndex === 6 || buttonIndex === 7) {
        context.globalAlpha = gamepad.buttons[buttonIndex].value // Red for LT and RT
    }
    context.fillRect(x, y, size, size);
    context.globalAlpha = 1.0; // Reset alpha for text
    context.fillStyle = "#ffffff";
    context.font = "20px Arial";
    // Use controllerButtons to get the button label
    const label = controllerButtons[buttonIndex] || buttonIndex;
    context.fillText(label, x + 10, y + 30);
    if (buttonIndex === 6 || buttonIndex === 7) {
        context.fillText(gamepad.buttons[buttonIndex].value.toFixed(2), x, y + 50);
    }
    context.restore();
}