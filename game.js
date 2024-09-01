const canvas = document.getElementById(gameCanvas);
const ctx = canvas.getContext(2d);

const game = {
    isRunning false,
    score 0,
    wave 1,
    enemies [],
    bullets [],
    powerUps [],
    player {
        x canvas.width  2,
        y canvas.height - 30,
        width 20,
        height 20,
        speed 5,
        color white,
        bullets [],
        powerUps []
    }
};

 Listen for key presses
const keys = {};
document.addEventListener('keydown', (e) = {
    keys[e.key] = true;
    if (e.key === 'G' && !game.isRunning) startGame();
});
document.addEventListener('keyup', (e) = keys[e.key] = false);

 Game Start Function
function startGame() {
    game.isRunning = true;
    gameLoop();
}

 Main Game Loop
function gameLoop() {
    if (!game.isRunning) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

 Update Game State
function update() {
    movePlayer();
    updateBullets();
    updateEnemies();
    checkCollisions();
    spawnEnemies();
}

 Draw Everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawEnemies();
}

 Move the Player
function movePlayer() {
    if (keys['ArrowUp'] && game.player.y  0) game.player.y -= game.player.speed;
    if (keys['ArrowDown'] && game.player.y  canvas.height - game.player.height) game.player.y += game.player.speed;
    if (keys['ArrowLeft'] && game.player.x  0) game.player.x -= game.player.speed;
    if (keys['ArrowRight'] && game.player.x  canvas.width - game.player.width) game.player.x += game.player.speed;
    if (keys[' ']) shootBullet();
}

 Draw the Player
function drawPlayer() {
    ctx.fillStyle = game.player.color;
    ctx.beginPath();
    ctx.moveTo(game.player.x, game.player.y);
    ctx.lineTo(game.player.x - 10, game.player.y + 20);
    ctx.lineTo(game.player.x + 10, game.player.y + 20);
    ctx.closePath();
    ctx.fill();
}

 Shoot a Bullet
function shootBullet() {
    if (game.player.bullets.length  5) {  Limit bullets on screen
        game.player.bullets.push({ x game.player.x, y game.player.y, speed 7 });
    }
}

 Update Bullets
function updateBullets() {
    game.player.bullets = game.player.bullets.filter(bullet = bullet.y  0);
    game.player.bullets.forEach(bullet = bullet.y -= bullet.speed);
}

 Draw Bullets
function drawBullets() {
    ctx.fillStyle = 'yellow';
    game.player.bullets.forEach(bullet = {
        ctx.fillRect(bullet.x - 2, bullet.y, 4, 10);
    });
}

 Spawn Enemies
function spawnEnemies() {
    if (game.enemies.length  game.wave  5) {
        const size = Math.random()  20 + 10;
        game.enemies.push({
            x Math.random()  (canvas.width - size),
            y -size,
            size size,
            speed Math.random()  2 + 1,
            type Math.random()  0.5  'circle'  'square'
        });
    }
}

 Update Enemies
function updateEnemies() {
    game.enemies.forEach(enemy = {
        enemy.y += enemy.speed;
    });
    game.enemies = game.enemies.filter(enemy = enemy.y  canvas.height);
}

 Draw Enemies
function drawEnemies() {
    game.enemies.forEach(enemy = {
        ctx.fillStyle = enemy.type === 'circle'  'red'  'blue';
        if (enemy.type === 'circle') {
            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI  2);
            ctx.fill();
        } else {
            ctx.fillRect(enemy.x - enemy.size  2, enemy.y - enemy.size  2, enemy.size, enemy.size);
        }
    });
}

 Collision Detection
function checkCollisions() {
    game.player.bullets.forEach((bullet, bIndex) = {
        game.enemies.forEach((enemy, eIndex) = {
            if (bullet.x  enemy.x - enemy.size  2 && bullet.x  enemy.x + enemy.size  2 &&
                bullet.y  enemy.y - enemy.size  2 && bullet.y  enemy.y + enemy.size  2) {
                game.player.bullets.splice(bIndex, 1);
                game.enemies.splice(eIndex, 1);
                game.score += 10;
            }
        });
    });
}
