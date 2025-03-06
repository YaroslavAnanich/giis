const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const methodSelect = document.getElementById('method');

let points = [];
let dragging = null;

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Проверка, не кликнули ли на существующую точку
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (Math.hypot(p.x - x, p.y - y) < 10) {
            return; // Кликнули на точку, ничего не делаем
        }
    }
    
    points.push({x, y});
    draw();
});

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Проверка, на какую точку кликнули
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (Math.hypot(p.x - x, p.y - y) < 10) {
            dragging = i; // Начали перетаскивать точку
            return;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (dragging === null) return; // Если не перетаскиваем, ничего не делаем
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    points[dragging].x = x;
    points[dragging].y = y;
    
    draw();
});

canvas.addEventListener('mouseup', () => {
    dragging = null; // Окончили перетаскивание
});

methodSelect.addEventListener('change', draw);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw control points
    ctx.fillStyle = 'red';
    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    
    if (points.length < 2) return;
    
    const method = methodSelect.value;
    switch(method) {
        case 'spline':
            drawSpline();
            break;
        case 'hermite':
            drawHermite();
            break;
        case 'bezier':
            drawBezier();
            break;
    }
}

function drawSpline() {
    if (points.length < 2) return;

    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Parametric natural cubic spline implementation
    const tValues = points.map((_, i) => i);
    const xCoeff = computeNaturalCoefficients(points, 'x', tValues);
    const yCoeff = computeNaturalCoefficients(points, 'y', tValues);

    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
        for (let t = tValues[i]; t <= tValues[i+1]; t += 0.05) {
            const x = evaluateCoeff(xCoeff, tValues, t);
            const y = evaluateCoeff(yCoeff, tValues, t);
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}

function computeNaturalCoefficients(points, coord, t) {
    const n = points.length - 1;
    if (n < 1) return [];

    const h = [];
    for (let i = 0; i < n; i++) {
        h.push(t[i+1] - t[i]);
    }

    const a = points.map(p => p[coord]);
    const alpha = new Array(n).fill(0);
    for (let i = 1; i < n; i++) {
        alpha[i] = (3/h[i] * (a[i+1] - a[i])) - (3/h[i-1] * (a[i] - a[i-1]));
    }

    const l = new Array(n+1).fill(0);
    const mu = new Array(n+1).fill(0);
    const z = new Array(n+1).fill(0);
    l[0] = 1;

    for (let i = 1; i < n; i++) {
        l[i] = 2*(t[i+1] - t[i-1]) - h[i-1]*mu[i-1];
        mu[i] = h[i]/l[i];
        z[i] = (alpha[i] - h[i-1]*z[i-1])/l[i];
    }

    l[n] = 1;
    z[n] = 0;
    const c = new Array(n+1).fill(0);
    const b = new Array(n).fill(0);
    const d = new Array(n).fill(0);

    for (let j = n-1; j >= 0; j--) {
        c[j] = z[j] - mu[j]*c[j+1];
        b[j] = (a[j+1] - a[j])/h[j] - h[j]*(c[j+1] + 2*c[j])/3;
        d[j] = (c[j+1] - c[j])/(3*h[j]);
    }

    return { a, b, c, d };
}

function evaluateCoeff(coeff, t, tVal) {
    let i = 0;
    while (i < t.length - 1 && tVal > t[i+1]) i++;
    const dt = tVal - t[i];
    return coeff.a[i] + coeff.b[i]*dt + coeff.c[i]*dt**2 + coeff.d[i]*dt**3;
}

function drawHermite() {
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i+1];
        
        // Calculate tangents
        let m0, m1;
        if (i === 0) {
            m0 = {x: p1.x - p0.x, y: p1.y - p0.y};
        } else {
            m0 = {x: (p1.x - points[i-1].x)/2, y: (p1.y - points[i-1].y)/2};
        }

        if (i === points.length - 2) {
            m1 = {x: p1.x - p0.x, y: p1.y - p0.y};
        } else {
            m1 = {x: (points[i+2].x - p0.x)/2, y: (points[i+2].y - p0.y)/2};
        }

        for (let t = 0; t <= 1; t += 0.05) {
            const h00 = 2*t**3 - 3*t**2 + 1;
            const h10 = t**3 - 2*t**2 + t;
            const h01 = -2*t**3 + 3*t**2;
            const h11 = t**3 - t**2;

            const x = h00*p0.x + h10*m0.x + h01*p1.x + h11*m1.x;
            const y = h00*p0.y + h10*m0.y + h01*p1.y + h11*m1.y;
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}

function drawBezier() {
    if (points.length < 4) return;

    ctx.strokeStyle = '#9C27B0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length; i += 3) {
        if (i+3 >= points.length) break;
        const [p0, p1, p2, p3] = points.slice(i, i+4);

        for (let t = 0; t <= 1; t += 0.05) {
            const x = bezierX(p0.x, p1.x, p2.x, p3.x, t);
            const y = bezierY(p0.y, p1.y, p2.y, p3.y, t);
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}

function bezierX(x0, x1, x2, x3, t) {
    return (1-t)**3 * x0 + 3*(1-t)**2 * t * x1 + 3*(1-t) * t**2 * x2 + t**3 * x3;
}

function bezierY(y0, y1, y2, y3, t) {
    return (1-t)**3 * y0 + 3*(1-t)**2 * t * y1 + 3*(1-t) * t**2 * y2 + t**3 * y3;
}
