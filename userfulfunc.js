//MARK: areCirclesColliding
function areCirclesColliding(x1, y1, r1, x2, y2, r2) {
    let dx = x2 - x1, dy = y2 - y1;
    return Math.sqrt(dy * dy + dx * dx) < r1 + r2;
}


//MARK: drawCircle
function drawCircle(x, y, r, style) {
    context.fillStyle = style
    context.beginPath()
    context.arc(x, y, r, 0, 2 * Math.PI)
    context.closePath()
    context.fill()
}


//MARK: makeDvumerMasiv
function makeDvumerenMasiv(rows, cols) {
	let dvMasiv = [];
	for (let i = 0; i < rows; i++) {
		dvMasiv[i] = [];
		for (let j = 0; j < cols; j++) {
			dvMasiv[i][j] = randomInteger(4);
		}
	}
	return dvMasiv;
}


//MARK: narisuv4ugalnik
function narisuvai4ugalnik(x1, y1, x2, y2, x3, y3, x4, y4) {
    // context.fillStyle = "#f45f45"
    context.beginPath()
    context.moveTo(x1, y1)
    context.lineTo(x2, y2)
    context.lineTo(x3, y3)
    context.lineTo(x4, y4)
    // context.lineTo(x1,y1)
    context.closePath()
    context.fill()
}

//MARK: writeText
function writeText(font, style, text, x, y) {
    context.font = font
    context.fillStyle = style
    context.fillText(text, x, y)
}
