const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

let bird = {
    x: 50,
    y: 150,
    width: 50,
    height: 50,
    gravity: 0.6,
    lift: -10,
    velocity: 0,
    image: new Image(),
    imagePath: '/nani-modified.png', // Updated path
    loadImage() {
        this.image.src = this.imagePath;
    },
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    },
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    flap() {
        this.velocity = this.lift;
    }
};

bird.loadImage();

let pipes = [];
let pipeWidth = 40;
let pipeGap = 150;
let frameCount = 0;

function createPipe() {
    let pipeHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({
        x: canvas.width,
        y: 0,
        width: pipeWidth,
        height: pipeHeight,
    });
    pipes.push({
        x: canvas.width,
        y: pipeHeight + pipeGap,
        width: pipeWidth,
        height: canvas.height - pipeHeight - pipeGap,
    });
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    });
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 2;
    });
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function checkCollision() {
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        if (bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            bird.y < pipe.y + pipe.height &&
            bird.y + bird.height > pipe.y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.draw();
    drawPipes();
}

function update() {
    bird.update();
    if (frameCount % 90 === 0) {
        createPipe();
    }
    updatePipes();
    frameCount++;
}

function gameLoop() {
    update();
    draw();
    if (checkCollision()) {
        document.getElementById('start-button').style.display = 'block';
        return;
    }
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        bird.flap();
    }
});

document.getElementById('start-button').addEventListener('click', () => {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frameCount = 0;
    document.getElementById('start-button').style.display = 'none';
    gameLoop();
});