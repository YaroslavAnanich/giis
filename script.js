class LineDrawingApp {
    constructor() {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.drawButton = document.getElementById("drawButton");
        this.algorithmSelect = document.getElementById("algorithm");
        this.debugModeCheckbox = document.getElementById("debugMode");
        this.delayTime = 50;

        this.bindEvents();
    }

    bindEvents() {
        this.drawButton.addEventListener("click", () =>
            this.handleDrawButtonClick()
        );
    }

    handleDrawButtonClick() {
        const x1 = parseInt(document.getElementById("x1").value);
        const y1 = parseInt(document.getElementById("y1").value);
        const x2 = parseInt(document.getElementById("x2").value);
        const y2 = parseInt(document.getElementById("y2").value);
        const algorithm = this.algorithmSelect.value;
        const debugMode = this.debugModeCheckbox.checked;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (debugMode) {
            this.drawGrid();
        }

        switch (algorithm) {
            case "cda":
                this.drawSegmentCDA(x1, y1, x2, y2, debugMode);
                break;
            case "bresenham":
                this.drawSegmentBresenham(x1, y1, x2, y2, debugMode);
                break;
            case "wu":
                this.drawSegmentWu(x1, y1, x2, y2, debugMode);
                break;
        }
    }

    drawGrid() {
        const gridSize = 15;
        this.ctx.strokeStyle = "#e0e0e0";
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x <= this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    async drawSegmentCDA(x1, y1, x2, y2, debugMode) {
        const originalFillStyle = this.ctx.fillStyle;
        this.ctx.fillStyle = "black";

        let dx = x2 - x1;
        let dy = y2 - y1;
        let steps = Math.max(Math.abs(dx), Math.abs(dy));
        let xIncrement = dx / steps;
        let yIncrement = dy / steps;
        let x = x1;
        let y = y1;

        for (let i = 0; i <= steps; i++) {
            if (debugMode) {
                await this.drawDebugBlock(Math.round(x), Math.round(y), i);
                await this.delay();
            } else {
                this.ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
            }
            x += xIncrement;
            y += yIncrement;
        }

        this.ctx.fillStyle = originalFillStyle;
    }

    async drawSegmentBresenham(x1, y1, x2, y2, debugMode) {
        const originalFillStyle = this.ctx.fillStyle;
        this.ctx.fillStyle = "black";

        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);
        let sx = x1 < x2 ? 1 : -1;
        let sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;
        let x = x1;
        let y = y1;
        let i = 0;

        while (true) {
            if (debugMode) {
                await this.drawDebugBlock(x, y, i++);
                await this.delay();
            } else {
                this.ctx.fillRect(x, y, 1, 1);
            }

            if (x === x2 && y === y2) break;
            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }

        this.ctx.fillStyle = originalFillStyle;
    }

    async drawSegmentWu(x1, y1, x2, y2, debugMode) {
        const originalFillStyle = this.ctx.fillStyle;

        let dx = x2 - x1;
        let dy = y2 - y1;

        const plot = async (x, y, c, step) => {
            if (debugMode) {
                await this.drawDebugBlock(x, y, step, `rgba(0,0,0,${c})`);
                await this.delay();
            } else {
                this.ctx.fillStyle = `rgba(0,0,0,${c})`;
                this.ctx.fillRect(x, y, 1, 1);
            }
        };

        if (Math.abs(dx) > Math.abs(dy)) {
            if (x1 > x2) {
                [x1, x2] = [x2, x1];
                [y1, y2] = [y2, y1];
                dx = x2 - x1;
                dy = y2 - y1;
            }
            let gradient = dy / dx;
            let y = y1 + gradient;
            for (let x = x1 + 1; x <= x2; x++) {
                await plot(x, Math.floor(y), 1 - (y - Math.floor(y)), x - x1);
                await plot(x, Math.floor(y) + 1, y - Math.floor(y), x - x1);
                y += gradient;
            }
        } else {
            if (y1 > y2) {
                [x1, x2] = [x2, x1];
                [y1, y2] = [y2, y1];
                dx = x2 - x1;
                dy = y2 - y1;
            }
            let gradient = dx / dy;
            let x = x1 + gradient;
            for (let y = y1 + 1; y <= y2; y++) {
                await plot(Math.floor(x), y, 1 - (x - Math.floor(x)), y - y1);
                await plot(Math.floor(x) + 1, y, x - Math.floor(x), y - y1);
                x += gradient;
            }
        }

        this.ctx.fillStyle = originalFillStyle;
    }

    async drawDebugBlock(x, y, step, color = "black") {
        const gridSize = 15;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x * gridSize,
            y * gridSize,
            gridSize - 0.5,
            gridSize - 0.5
        );

        this.ctx.fillStyle = "white";
        this.ctx.font = "6px";
        this.ctx.fillText(
            step.toString(),
            x * gridSize + 3,
            (y + 0.5) * gridSize
        );
    }

    delay() {
        return new Promise((resolve) => setTimeout(resolve, this.delayTime));
    }
}

const app = new LineDrawingApp();
