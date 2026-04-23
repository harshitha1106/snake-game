// board
var blocksize = 25;
var rows = 20;
var cols = 20;
var board;
var context;
var score = 0;
var gameLoop;
var gameOver = false;

// snake head
var snakex = blocksize * 5;
var snakey = blocksize * 5;

// movement
var velocityx = 0;
var velocityy = 0;

// snake body
var snakebody = [];

// food
var foodx;
var foody;

window.onload = function () {
    board = document.getElementById("board");
    board.height = rows * blocksize;
    board.width = cols * blocksize;
    context = board.getContext("2d");

    placefood();

    document.getElementById("score").innerText = "Score: " + score;

    document.addEventListener("keydown", changedirection);

    gameLoop = setInterval(update, 100);
};

function update() {
    if (gameOver) return;

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    // move body
    for (let i = snakebody.length - 1; i > 0; i--) {
        snakebody[i] = snakebody[i - 1];
    }

    if (snakebody.length > 0) {
        snakebody[0] = [snakex, snakey];
    }

    // move head
    snakex += velocityx * blocksize;
    snakey += velocityy * blocksize;

    // wrap around
    if (snakex < 0) snakex = (cols - 1) * blocksize;
    else if (snakex >= cols * blocksize) snakex = 0;

    if (snakey < 0) snakey = (rows - 1) * blocksize;
    else if (snakey >= rows * blocksize) snakey = 0;

    // self collision
    for (let i = 0; i < snakebody.length; i++) {
        if (snakex === snakebody[i][0] && snakey === snakebody[i][1]) {
            gameOver = true;
            clearInterval(gameLoop);
        }
    }

    // draw snake head
    context.fillStyle = "lime";
    context.fillRect(snakex, snakey, blocksize, blocksize);

    // draw snake body
    context.fillStyle = "white";
    for (let i = 0; i < snakebody.length; i++) {
        context.fillRect(snakebody[i][0], snakebody[i][1], blocksize, blocksize);
    }

    // draw food
    context.fillStyle = "red";
    context.fillRect(foodx, foody, blocksize, blocksize);

    // eat food
    if (snakex === foodx && snakey === foody) {
        snakebody.push([foodx, foody]);
        score++;

        document.getElementById("score").innerText = "Score: " + score;

        placefood();
    }

    // 🔥 show game over + final score
    if (gameOver) {
        context.fillStyle = "white";
        context.font = "30px Arial";
        context.fillText("Game Over", 120, 200);

        context.font = "20px Arial";
        context.fillText("Final Score: " + score, 120, 240);
    }
}

function placefood() {
    let valid = false;

    while (!valid) {
        foodx = Math.floor(Math.random() * cols) * blocksize;
        foody = Math.floor(Math.random() * rows) * blocksize;

        valid = true;

        if (foodx === snakex && foody === snakey) valid = false;

        for (let i = 0; i < snakebody.length; i++) {
            if (foodx === snakebody[i][0] && foody === snakebody[i][1]) {
                valid = false;
                break;
            }
        }
    }
}

function changedirection(e) {
    if (e.code === "ArrowUp" && velocityy !== 1) {
        velocityx = 0;
        velocityy = -1;
    }
    else if (e.code === "ArrowDown" && velocityy !== -1) {
        velocityx = 0;
        velocityy = 1;
    }
    else if (e.code === "ArrowLeft" && velocityx !== 1) {
        velocityx = -1;
        velocityy = 0;
    }
    else if (e.code === "ArrowRight" && velocityx !== -1) {
        velocityx = 1;
        velocityy = 0;
    }
}