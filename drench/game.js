// Suzdavame promenlivi
const GRID_SIZE = 14;
const pixelSize = 40;
let pixels = []
for(let i = 0; i < GRID_SIZE; i++) {
    pixels[i] = []
    for(let j = 0; j < GRID_SIZE; j++) {
        pixels[i][j] = randomInteger(6)
    }
}
// 0 - Green
// 1 - Pink
// 2 - Purple
// 3 - Light green
// 4 - Red
// 5 - Yellow
function init() {
    // Kodut tuk se izpulnqva vednuj v nachaloto
}
function update() {
    // Kodut tuk se izpulnqva (okolo) 100 puti v sekunda
}
function draw() {
    // Tuk naprogramirai kakvo da se risuva
    for(let i = 0; i < GRID_SIZE; i++) {
        for(let j = 0; j < GRID_SIZE; j++) {
            switch(pixels[i][j]) {
                case 0:
                    context.fillStyle = "#66cc00";
                    break;
                case 1:
                    context.fillStyle = "#ff9fff";
                    break;
                case 2:
                    context.fillStyle = "#743ef4";
                    break;
                case 3:
                    context.fillStyle = "#ccffcc";
                    break;
                case 4:
                    context.fillStyle = "red";
                    break;
                case 5:
                    context.fillStyle = "#ffcc00";
                    break;
            }
            context.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
        }
    }

    context.fillStyle = "#66cc00";
    context.fillRect(600,10, pixelSize, pixelSize);
    context.fillStyle = "#ff9fff";
    context.fillRect(600,60, pixelSize, pixelSize);
    context.fillStyle = "#743ef4";
    context.fillRect(600,110, pixelSize, pixelSize);
    context.fillStyle = "#ccffcc";
    context.fillRect(600,160, pixelSize, pixelSize);
    context.fillStyle = "red";
    context.fillRect(600,210, pixelSize, pixelSize);
    context.fillStyle = "#ffcc00";
    context.fillRect(600,260, pixelSize, pixelSize);
}
function mouseup() {
    // Pri klik s lqv buton - pokaji koordinatite na mishkata
    console.log("Mouse clicked at", mouseX, mouseY);
    if(mouseX > 560) {
        if(areColliding(600, 10, pixelSize, pixelSize, mouseX, mouseY, 1, 1)) {switchColor(0)}
        if(areColliding(600, 60, pixelSize, pixelSize, mouseX, mouseY, 1, 1)) {switchColor(1)}
        if(areColliding(600, 110, pixelSize, pixelSize, mouseX, mouseY, 1, 1)) {switchColor(2)}
        if(areColliding(600, 160, pixelSize, pixelSize, mouseX, mouseY, 1, 1)) {switchColor(3)}
        if(areColliding(600, 210, pixelSize, pixelSize, mouseX, mouseY, 1, 1)) {switchColor(4)}
        if(areColliding(600, 260, pixelSize, pixelSize, mouseX, mouseY, 1, 1)) {switchColor(5)}
    }
}
function keyup(key) {
    // Pechatai koda na natisnatiq klavish
    console.log("Pressed", key);
}

function switchColor(type) {
    console.log("switched to type " + type)
    //smeni ig
    console.log(dfs(pixels, pixels[0][0]))
}


function dfs(graph, start) {
    const visited = new Set();
    const traversalOrder = [];
  
  function dfsHelper(node) {
      visited.add(node);
      traversalOrder.push(node);
  
  for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
          dfsHelper(neighbor);
        }
      }
    }
  
  dfsHelper(start);
  
  return traversalOrder;
  }