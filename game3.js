const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 80;

const scoreBoard = document.getElementById("scoreBoard");
const restartBtn = document.getElementById("restartBtn");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");

// 🔥 Load High Score
let highScore = localStorage.getItem("highScore") || 0;

let score = 0;
let level = 1;
let gameOver = false;

let enemies = [];
let bullets = [];

let player = {
    x: canvas.width / 2,
    y: canvas.height - 100
};

let gunIndex = 0;

// ⭐ ==============================
// STAR BACKGROUND SYSTEM
// ================================
let stars = [];

function createStars() {
    for (let i = 0; i < 120; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 1.5 + 0.5
        });
    }
}

function drawStars() {
    stars.forEach(star => {
        star.y += star.speed;

        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }

        ctx.fillStyle = "white";
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });
}

// 🌌 Nebula Effect
function drawNebula() {
    let gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 3,
        50,
        canvas.width / 2,
        canvas.height / 3,
        400
    );

    gradient.addColorStop(0, "rgba(0, 255, 255, 0.2)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 🔫 Draw Gun
function drawGun() {
    ctx.save();
    ctx.translate(player.x, player.y);

    if (gunIndex === 0) {
        ctx.fillStyle = "cyan";
        ctx.fillRect(-15, 0, 30, 50);
        ctx.fillStyle = "white";
        ctx.fillRect(-4, -20, 8, 20);
    }

    if (gunIndex === 1) {
        ctx.fillStyle = "red";
        ctx.fillRect(-20, 0, 40, 60);
        ctx.fillStyle = "yellow";
        ctx.fillRect(-6, -30, 12, 30);
    }

    if (gunIndex === 2) {
        ctx.fillStyle = "purple";
        ctx.beginPath();
        ctx.arc(0, 20, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "lime";
        ctx.fillRect(-4, -35, 8, 35);
    }

    ctx.restore();
}

// 🔫 Switch Guns
document.getElementById("nextGun").onclick = () => {
    gunIndex = (gunIndex + 1) % 3;
};

document.getElementById("prevGun").onclick = () => {
    gunIndex = (gunIndex - 1 + 3) % 3;
};

// 🖱 Move Player
canvas.addEventListener("mousemove", (e) => {
    player.x = e.clientX;
});

// 🔥 Shoot
canvas.addEventListener("click", () => {
    bullets.push({
        x: player.x,
        y: player.y - 30,
        speed: 8 + gunIndex * 2
    });
});

// 👾 Spawn Enemy
function spawnEnemy() {
    let speed = 2 + score * 0.015;

    enemies.push({
        x: Math.random() * canvas.width,
        y: 0,
        size: 20,
        speed: speed
    });
}

// 🎮 Update Score
function updateScoreBoard() {
    scoreBoard.innerText =
        `Score: ${score} | Level: ${level} | High Score: ${highScore}`;
}

// 🎮 Game Loop
function gameLoop() {

    if (gameOver) return;

    // 🔄 CLEAR + BACKGROUND EFFECT
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawNebula();

    drawGun();

    // 🔫 Bullets
    bullets.forEach((bullet, bIndex) => {
        bullet.y -= bullet.speed;

        ctx.fillStyle = "yellow";
        ctx.fillRect(bullet.x - 3, bullet.y, 6, 15);

        if (bullet.y < 0) bullets.splice(bIndex, 1);

        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x > enemy.x - enemy.size &&
                bullet.x < enemy.x + enemy.size &&
                bullet.y < enemy.y + enemy.size
            ) {
                enemies.splice(eIndex, 1);
                bullets.splice(bIndex, 1);

                score++;
                level = Math.floor(score / 20) + 1;

                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem("highScore", highScore);
                }

                updateScoreBoard();
            }
        });
    });

    // 👾 Enemies
    enemies.forEach((enemy) => {
        enemy.y += enemy.speed;

        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();

        if (enemy.y > canvas.height - 80) {
            endGame();
        }
    });

    requestAnimationFrame(gameLoop);
}

// ❌ End Game
function endGame() {
    gameOver = true;

    finalScore.innerHTML =
        `Final Score: ${score}<br>High Score: ${highScore}`;

    gameOverScreen.classList.remove("hidden");
}

// 🔄 Restart
restartBtn.onclick = () => {
    score = 0;
    level = 1;
    enemies = [];
    bullets = [];
    gameOver = false;

    updateScoreBoard();
    gameOverScreen.classList.add("hidden");

    gameLoop();
};

// ⏱ Spawn Enemies
setInterval(() => {
    if (!gameOver) spawnEnemy();
}, 1000);

// ⭐ CREATE STARS INIT
createStars();

updateScoreBoard();
gameLoop();