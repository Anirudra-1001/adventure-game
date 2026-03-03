const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let health = 100;
let level = 1;
let highScore = localStorage.getItem("highScore") || 0;

document.getElementById("highScore").innerText = highScore;

const playerImg = new Image();
playerImg.src = "https://i.imgur.com/6X12UGp.png";

const enemyImg = new Image();
enemyImg.src = "https://i.imgur.com/Zv6fY5G.png";

const treasureImg = new Image();
treasureImg.src = "https://i.imgur.com/9Xn4XkT.png";

const bgImg = new Image();
bgImg.src = "https://i.imgur.com/qIufhof.jpg";

let player = {
  x: 50,
  y: 200,
  width: 50,
  height: 50,
  speed: 5
};

let enemies = [];
let treasures = [];
let powerUps = [];

function createEnemies(num) {
  enemies = [];
  for (let i = 0; i < num; i++) {
    enemies.push({
      x: Math.random() * 700,
      y: Math.random() * 400,
      width: 50,
      height: 50,
      speed: 2 + level
    });
  }
}

function createTreasures(num) {
  treasures = [];
  for (let i = 0; i < num; i++) {
    treasures.push({
      x: Math.random() * 750,
      y: Math.random() * 450,
      width: 40,
      height: 40
    });
  }
}

function createPowerUp() {
  powerUps = [{
    x: Math.random() * 750,
    y: Math.random() * 450,
    width: 40,
    height: 40
  }];
}

createEnemies(2);
createTreasures(3);
createPowerUp();

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") player.y -= player.speed;
  if (e.key === "ArrowDown") player.y += player.speed;
  if (e.key === "ArrowLeft") player.x -= player.speed;
  if (e.key === "ArrowRight") player.x += player.speed;
});

function collision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  enemies.forEach(enemy => {
    enemy.y += enemy.speed;
    if (enemy.y > canvas.height) enemy.y = 0;

    ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

    if (collision(player, enemy)) {
      health -= 1;
      document.getElementById("health").innerText = health;
    }
  });

  treasures.forEach((treasure, index) => {
    ctx.drawImage(treasureImg, treasure.x, treasure.y, treasure.width, treasure.height);

    if (collision(player, treasure)) {
      score += 10;
      treasures.splice(index, 1);
      document.getElementById("score").innerText = score;
    }
  });

  powerUps.forEach((p, index) => {
    ctx.fillStyle = "cyan";
    ctx.fillRect(p.x, p.y, p.width, p.height);

    if (collision(player, p)) {
      health += 20;
      powerUps.splice(index, 1);
      document.getElementById("health").innerText = health;
    }
  });

  if (treasures.length === 0) {
    level++;
    document.getElementById("level").innerText = level;
    createEnemies(level + 1);
    createTreasures(level + 2);
    createPowerUp();
  }

  if (health <= 0) {
    if (score > highScore) {
      localStorage.setItem("highScore", score);
    }
    alert("Game Over!");
    restartGame();
  }

  requestAnimationFrame(update);
}

function restartGame() {
  score = 0;
  health = 100;
  level = 1;
  document.getElementById("score").innerText = score;
  document.getElementById("health").innerText = health;
  document.getElementById("level").innerText = level;
  createEnemies(2);
  createTreasures(3);
  createPowerUp();
}

update();
