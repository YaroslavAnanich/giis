async function drawCircle(xCenter, yCenter, radius) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const debugMode = document.getElementById('debugMode').checked;
    const gridSize = 10;

    let x = 0;
    let y = radius;
    let d = 3 - 2 * radius;

    while (y >= x) {
        if (debugMode) {
            let gridX = Math.round((xCenter + x) / gridSize) * gridSize;
            let gridY = Math.round((yCenter + y) / gridSize) * gridSize;
            let gridX2 = Math.round((xCenter + y) / gridSize) * gridSize;
            let gridY2 = Math.round((yCenter + x) / gridSize) * gridSize;
            let gridX3 = Math.round((xCenter + y) / gridSize) * gridSize;
            let gridY3 = Math.round((yCenter - x) / gridSize) * gridSize;
            let gridX4 = Math.round((xCenter + x) / gridSize) * gridSize;
            let gridY4 = Math.round((yCenter - y) / gridSize) * gridSize;
            let gridX5 = Math.round((xCenter - x) / gridSize) * gridSize;
            let gridY5 = Math.round((yCenter - y) / gridSize) * gridSize;
            let gridX6 = Math.round((xCenter - y) / gridSize) * gridSize;
            let gridY6 = Math.round((yCenter - x) / gridSize) * gridSize;
            let gridX7 = Math.round((xCenter - y) / gridSize) * gridSize;
            let gridY7 = Math.round((yCenter + x) / gridSize) * gridSize;
            let gridX8 = Math.round((xCenter - x) / gridSize) * gridSize;
            let gridY8 = Math.round((yCenter + y) / gridSize) * gridSize;

            ctx.fillStyle = 'black';
            ctx.fillRect(gridX, gridY, gridSize, gridSize);
            ctx.fillRect(gridX2, gridY2, gridSize, gridSize);
            ctx.fillRect(gridX3, gridY3, gridSize, gridSize);
            ctx.fillRect(gridX4, gridY4, gridSize, gridSize);
            ctx.fillRect(gridX5, gridY5, gridSize, gridSize);
            ctx.fillRect(gridX6, gridY6, gridSize, gridSize);
            ctx.fillRect(gridX7, gridY7, gridSize, gridSize);
            ctx.fillRect(gridX8, gridY8, gridSize, gridSize);
            await new Promise(resolve => setTimeout(resolve, 10));
        } else {
            ctx.fillStyle = 'black';
            ctx.fillRect(xCenter + x, yCenter + y, 1, 1);
            ctx.fillRect(xCenter + y, yCenter + x, 1, 1);
            ctx.fillRect(xCenter + y, yCenter - x, 1, 1);
            ctx.fillRect(xCenter + x, yCenter - y, 1, 1);
            ctx.fillRect(xCenter - x, yCenter - y, 1, 1);
            ctx.fillRect(xCenter - y, yCenter - x, 1, 1);
            ctx.fillRect(xCenter - y, yCenter + x, 1, 1);
            ctx.fillRect(xCenter - x, yCenter + y, 1, 1);
        }

        if (d < 0) {
            d += 4 * x + 6;
        } else {
            d += 4 * (x - y) + 10;
            y--;
        }
        x++;
    }
}

async function drawEllipse(xCenter, yCenter, radiusX, radiusY) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const debugMode = document.getElementById('debugMode').checked;
    const gridSize = 10;

    for (let angle = 0; angle <= 360; angle++) {
        let x = xCenter + radiusX * Math.cos(angle * Math.PI / 180);
        let y = yCenter + radiusY * Math.sin(angle * Math.PI / 180);

        if (debugMode) {
            let gridX = Math.round(x / gridSize) * gridSize;
            let gridY = Math.round(y / gridSize) * gridSize;

            ctx.fillStyle = 'black';
            ctx.fillRect(gridX, gridY, gridSize, gridSize);
            await new Promise(resolve => setTimeout(resolve, 10));
        } else {
            ctx.fillStyle = 'black';
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

async function drawHyperbola(xCenter, yCenter, radiusX, radiusY) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const debugMode = document.getElementById('debugMode').checked;
    const gridSize = 10;

    for (let x = -200; x <= 200; x++) {
        let y1 = yCenter + Math.sqrt((x * x / radiusX / radiusX - 1) * radiusY * radiusY);
        let y2 = yCenter - Math.sqrt((x * x / radiusX / radiusX - 1) * radiusY * radiusY);

        if (!isNaN(y1) && x >= radiusX) {
            if (debugMode) {
                let gridX = Math.round((xCenter + x) / gridSize) * gridSize;
                let gridY1 = Math.round(y1 / gridSize) * gridSize;
                let gridY2 = Math.round(y2 / gridSize) * gridSize;

                ctx.fillStyle = 'black';
                ctx.fillRect(gridX, gridY1, gridSize, gridSize);
                ctx.fillRect(gridX, gridY2, gridSize, gridSize);
                await new Promise(resolve => setTimeout(resolve, 10));
            } else {
                ctx.fillStyle = 'black';
                ctx.fillRect(xCenter + x, y1, 1, 1);
                ctx.fillRect(xCenter + x, y2, 1, 1);
            }
        }

        if (!isNaN(y1) && x <= -radiusX) {
            if (debugMode) {
                let gridX = Math.round((xCenter + x) / gridSize) * gridSize;
                let gridY1 = Math.round(y1 / gridSize) * gridSize;
                let gridY2 = Math.round(y2 / gridSize) * gridSize;

                ctx.fillStyle = 'black';
                ctx.fillRect(gridX, gridY1, gridSize, gridSize);
                ctx.fillRect(gridX, gridY2, gridSize, gridSize);
                await new Promise(resolve => setTimeout(resolve, 10));
            } else {
                ctx.fillStyle = 'black';
                ctx.fillRect(xCenter + x, y1, 1, 1);
                ctx.fillRect(xCenter + x, y2, 1, 1);
            }
        }
    }
}

async function drawParabola(xCenter, yCenter, p) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const debugMode = document.getElementById('debugMode').checked;
    const gridSize = 10;

    for (let x = 0; x <= 100; x++) {
        let y = x * x / (4 * p);
        if (debugMode) {
            let gridX1 = Math.round((xCenter + x) / gridSize) * gridSize;
            let gridX2 = Math.round((xCenter - x) / gridSize) * gridSize;
            let gridY1 = Math.round((yCenter + y) / gridSize) * gridSize;
            let gridY2 = Math.round((yCenter - y) / gridSize) * gridSize;

            ctx.fillStyle = 'black';
            ctx.fillRect(gridX1, gridY1, gridSize, gridSize);
            ctx.fillRect(gridX1, gridY2, gridSize, gridSize);
            ctx.fillRect(gridX2, gridY1, gridSize, gridSize);
            ctx.fillRect(gridX2, gridY2, gridSize, gridSize);
            await new Promise(resolve => setTimeout(resolve, 10));
        } else {
            ctx.fillStyle = 'black';
            ctx.fillRect(xCenter + x, yCenter + y, 1, 1);
            ctx.fillRect(xCenter + x, yCenter - y, 1, 1);
            ctx.fillRect(xCenter - x, yCenter + y, 1, 1);
            ctx.fillRect(xCenter - x, yCenter - y, 1, 1);
        }
    }
}

async function drawCurve() {
    const curveType = document.getElementById('curveType').value;
    const radius = parseInt(document.getElementById('radius').value);
    const xCenter = parseInt(document.getElementById('xCenter').value);
    const yCenter = parseInt(document.getElementById('yCenter').value);

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (curveType) {
        case 'circle':
            await drawCircle(xCenter, yCenter, radius);
            break;
        case 'ellipse':
            await drawEllipse(xCenter, yCenter, radius, radius / 2);
            break;
        case 'hyperbola':
            await drawHyperbola(xCenter, yCenter, radius, radius / 2);
            break;
        case 'parabola':
            await drawParabola(xCenter, yCenter, radius);
            break;
        default:
            console.log('Выберите тип кривой');
    }
}



function drawGrid(ctx, gridSize, canvasWidth, canvasHeight) {
    ctx.strokeStyle = 'lightgray'; // Цвет линий сетки
    ctx.lineWidth = 0.5; // Толщина линий сетки

    // Рисуем вертикальные линии
    for (let x = 0; x <= canvasWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
    }

    // Рисуем горизонтальные линии
    for (let y = 0; y <= canvasHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
    }
}

async function drawCurve() {
    const curveType = document.getElementById('curveType').value;
    const radius = parseInt(document.getElementById('radius').value);
    const xCenter = parseInt(document.getElementById('xCenter').value);
    const yCenter = parseInt(document.getElementById('yCenter').value);

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const debugMode = document.getElementById('debugMode').checked;
    const gridSize = 10;

    if (debugMode) {
        drawGrid(ctx, gridSize, canvas.width, canvas.height);
    }

    switch (curveType) {
        case 'circle':
            await drawCircle(xCenter, yCenter, radius);
            break;
        case 'ellipse':
            await drawEllipse(xCenter, yCenter, radius, radius / 2);
            break;
        case 'hyperbola':
            await drawHyperbola(xCenter, yCenter, radius, radius / 2);
            break;
        case 'parabola':
            await drawParabola(xCenter, yCenter, radius);
            break;
        default:
            console.log('Выберите тип кривой');
    }
}