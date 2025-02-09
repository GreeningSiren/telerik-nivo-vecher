// Suzdavame promenlivi
let myX, myY;
// Class representing a straight line segment
class Segment {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }
    // Draw the line segment
    draw() {
        drawLine(this.startX, this.startY, this.endX, this.endY, "gray");
    }
}

// Class representing a circular arc segment
class CircleSegment {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.centerX = (startX + endX) / 2;
        this.centerY = (startY + endY) / 2;
        this.radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) / 2;
        this.startAngle = 0;
        this.endAngle = Math.PI;
    }
    // Draw the circular arc segment
    draw() {
        context.save();
        context.beginPath();
        context.arc(this.centerX, this.centerY, this.radius, this.startAngle, this.endAngle);
        context.strokeStyle = "gray";
        context.stroke();
        context.restore();
    }
}

// Class representing an enemy that moves along segments
class Enemy {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.currentSegmentIndex = 0;
    }
    // Update the enemy's position
    update() {
        if (segments.length > 0 && this.currentSegmentIndex < segments.length) {
            let segment = segments[this.currentSegmentIndex];
            if (segment instanceof CircleSegment) {
                if(Math.abs(this.x - segment.endX) < 2 && Math.abs(this.y - segment.endY) < 2) {
                    this.currentSegmentIndex++;
                }
            } else if (segment instanceof Segment) {
                let targetX = segment.endX;
                let targetY = segment.endY;
                let dx = targetX - this.x;
                let dy = targetY - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > this.speed) {
                    this.x += (dx / distance) * this.speed;
                    this.y += (dy / distance) * this.speed;
                } else {
                    this.x = targetX;
                    this.y = targetY;
                    this.currentSegmentIndex++;
                }
            }
        }
    }
    // Draw the enemy
    draw() {
        drawImage(balloon, this.x - 25, this.y - 25, 50, 50);
    }
}

let balloon = tryToLoad('balloon', "red");
let segments = [];
segments.push(new Segment(100, 100, 200, 100, "road"));
segments.push(new Segment(200, 100, 200, 200, "road"));
segments.push(new Segment(200, 200, 100, 200, "road"));
// segments.push(new CircleSegment(150, 150, 50, 0, Math.PI, "road"));
segments.push(new CircleSegment(100, 200, 300, 200));
segments.push(new Segment(300, 200, 300, 300, "road"));

let enemy = new Enemy(100, 100, 1);

function init() {
    // Kodut tuk se izpulnqva vednuj v nachaloto
    myX = 300;
    myY = 300;
}

function update() {
    // Kodut tuk se izpulnqva (okolo) 100 puti v sekunda
    myX = myX + (mouseX - myX) / 10;
    myY = myY + (mouseY - myY) / 10;
    enemy.update();
}

function draw() {
    // Tuk naprogramirai kakvo da se risuva
    context.fillStyle = "black";
    context.fillRect(0, 0, 800, 600);
    for (let i = 0; i < segments.length; i++) {
        segments[i].draw && segments[i].draw();
    }
    enemy.draw();
}

function mouseup() {
    // Pri klik s lqv buton - pokaji koordinatite na mishkata
    console.log("Mouse clicked at", mouseX, mouseY);
}

function keyup(key) {
    // Pechatai koda na natisnatiq klavish
    console.log("Pressed", key);
}

function drawLine(x1, y1, x2, y2, color) {
    context.save();
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.strokeStyle = color;
    context.stroke();
    context.restore();
}