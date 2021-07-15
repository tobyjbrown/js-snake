// make a grid -> an array of game tiles

let difficultyBtns = document.querySelector('.diff-btns').children;

let playBtn = document.getElementById('playBtn');
let splashScreen = document.getElementById('splash');

let gameOverScreen = document.getElementById('gameOver');
let finalScore = document.getElementById("displayScore");
let displayHighScore = document.getElementById('displayHighScore');
let highScoreMessage = document.getElementById('highScoreMessage');

let playAgainBtn = document.getElementById('playAgainBtn');

// ============================================

let board = document.getElementById('snakeGame');
let ctx = board.getContext('2d');

// board tiles
const boardColumns = 25
const boardRows = 20
let boardTileWidth = board.width / boardColumns;
let boardTileHeight = board.height / boardRows;

let boardArr = []; // empty array

// snake
// starting point
let snakeX = 10;
let snakeY = 11;

let snake = [[snakeX, snakeY],[snakeX + 1][snakeY],[snakeX + 2][snakeY],[snakeX + 3][snakeY]];

// direction
let dx = 0;
let dy = 1;


// initial coin location
let coinX;
let coinY;

// score
let score = 1;


// ============================================
// event listeners

window.addEventListener('keydown', function(e) {
    setTimeout(keyPressHandler(e), difficultySpeed);
});

function keyPressHandler(e) {
    if(e.key == 'down' || e.key == "ArrowDown") {
        e.preventDefault();
        if(dy != -1) {
            dx = 0;
            dy = 1;
        }
    } else if (e.key == 'up' || e.key == "ArrowUp") {
        e.preventDefault();
        if(dy != 1) {
            dx = 0;
            dy = -1;
        }
    } else if (e.key == 'left' || e.key == "ArrowLeft") {
        e.preventDefault();
        if(dx != 1) {
            dx = -1;
            dy = 0;
        }
    } else if (e.key == 'right' || e.key == "ArrowRight") {
        e.preventDefault();
        if(dx != -1) {
            dx = 1;
            dy = 0;
        }
    }
};

function drawSnake() {
    // set tiles on board to true that are snake
    if(snake.length == 1) {
        boardArr[snake[0][0]][snake[0][1]].snake = false;
    }

    if (snakeX + dx < 0) {
        snakeX = boardColumns;
    } else if (snakeX + dx == boardColumns) {
        snakeX = -1;
    } else if (snakeY + dy < 0) {
        snakeY = boardRows;
    } else if (snakeY + dy == boardRows) {
        snakeY = -1;
    }

    snakeX += dx;
    snakeY += dy;

    snake.unshift([snakeX, snakeY]);
    snake.pop();

    if (snake.length > 1) {
        boardArr[snake[snake.length - 1][0]][snake[snake.length - 1][1]].snake = false;
    }

    // switch on the snake on the board
    snake.forEach( bodyPart => boardArr[bodyPart[0]][bodyPart[1]].snake = true);

    // turn off the last part of the snake on the board
    if (snake.length > 1) {
        boardArr[snake[snake.length - 1][0]][snake[snake.length - 1][1]].snake = false;
    }
    
    // draws snake
    for(let c = 0; c < boardColumns; c++) {
        for(let r = 0; r < boardRows; r++) {
            if(boardArr[c][r].snake == true) {
                ctx.beginPath();
                ctx.rect(boardArr[c][r].tileX, boardArr[c][r].tileY, boardTileWidth, boardTileHeight);
                ctx.fillStyle = 'red';
                ctx.fill();
                ctx.closePath()
            } 
        }
    }
}
// nested for loop that populates an array
function createBoard() {
    for(let c = 0; c < boardColumns; c++) {
        boardArr[c] = []
        for(let r = 0; r < boardRows; r++) {
            let tileX = (c*boardTileWidth);
            let tileY = (r*boardTileHeight);
            boardArr[c][r] = {tileX, tileY, snake: false, coin: false};
        }
    }
    newCoin();
}

function drawCoins() {
    
    // draws coin
    for(let c = 0; c < boardColumns; c++) {
        for(let r = 0; r < boardRows; r++) {
            if(boardArr[c][r].coin == true) {
                ctx.beginPath();
                ctx.rect(boardArr[c][r].tileX, boardArr[c][r].tileY, boardTileWidth, boardTileHeight);
                ctx.fillStyle = 'green';
                ctx.fill();
                ctx.closePath()
            } 
        }
    }
}

function detectCollision() {
    if(snakeX == coinX && snakeY == coinY) {
        boardArr[coinX][coinY].coin = false;        
        newCoin();
        score++;
        snake.push([coinX, coinY]);
    };

    function checkForDuplicates(snake) {
        for(let i = 0; i < snake.length; i++) {
            for(let j = i + 1; j < snake.length; j++) {
                if(snake[j][0] === snake[i][0] && snake[j][1] === snake[i][1]) {
                    return true
                }
            }
        }
        return false;
    }

    if(checkForDuplicates(snake)) {
        clearInterval(play);
        setTimeout(gameOver, 1000);
    };
}

function newCoin() {

    do {
        coinY = Math.floor(Math.random() * boardRows);
        coinX = Math.floor(Math.random() * boardColumns);
    } while(boardArr[coinX][coinY].snake == true);
    boardArr[coinX][coinY].coin = true;
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = 'red';
    ctx.fillText("Score: " + (score - 1), 10, 25);
}


function draw() {
    ctx.clearRect(0, 0, board.width, board.height);
    drawCoins();
    drawSnake();
    detectCollision();
    drawScore();
}

playBtn.addEventListener('click', playGame);
playAgainBtn.addEventListener('click', function() {
    document.location.reload();
});

for(let i = 0; i < difficultyBtns.length; i++) {
    difficultyBtns[i].addEventListener('click', function(e) {
        if(!e.target.classList.contains('current-diff')) {
            for(let j = 0; j < difficultyBtns.length; j++) {
                difficultyBtns[j].classList.remove('current-diff');
            }
            e.target.classList.add('current-diff');
        };
    });
}

let difficultySpeed = 100;

function setDifficulty() {
    if(difficultyBtns[0].classList.contains('current-diff')) {
        difficultySpeed = 150;
    } else if(difficultyBtns[1].classList.contains('current-diff')) {
        difficultySpeed = 100;
    } else if(difficultyBtns[2].classList.contains('current-diff')) {
        difficultySpeed = 50;
    } else if(difficultyBtns[3].classList.contains('current-diff')) {
        difficultySpeed = 25;
    }
}

function gameOver() {
    sessionStorage.setItem('score', score - 1);
    if(!sessionStorage.getItem('highScore') || score - 1 > sessionStorage.getItem('highScore')) {
        sessionStorage.setItem('highScore', score - 1);
        highScoreMessage.innerHTML = "New high score!";
    }

    board.style.opacity = 0;

    function showSplash() {
        board.style.display = "none";
        finalScore.innerHTML = score - 1;
        displayHighScore.innerHTML = sessionStorage.getItem('highScore');
        gameOverScreen.style.display = "block";
    };
    
    setTimeout(showSplash, 1000);
}

let play;

function playGame() {
    setDifficulty();
    board.style.display = "block";
    splashScreen.style.display = "none";
    createBoard();
    console.log(difficultySpeed);
    play = setInterval(draw, difficultySpeed);
}
