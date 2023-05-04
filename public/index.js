const BG_COLOR = '#231f20';
const SNAKE_COLOR = '#c2c2c2';
const FOOD_COLOR = '#e66916';

const socket = io('http://localhost:3000');
socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);

const gameScreen = document.getElementById('game-screen');
const score = document.getElementById('scoreNum');
let canvas, ctx;

initCanvas();

function initCanvas() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  canvas.width = canvas.height = 600;

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  document.addEventListener('keydown', keydown);
}

function paintGame(state) {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const food = state.food;
  const gridsize = state.gridsize;
  const size = canvas.width / gridsize;

  ctx.fillStyle = FOOD_COLOR;
  ctx.fillRect(food.x * size, food.y * size, size, size);

  paintPlayer(state.player, size, state.player.color[state.player.colorIndex]);
  score.innerHTML = state.player.foodEaten;
}

function paintPlayer(playerState, size, color) {
  const snake = playerState.snake;

  ctx.fillStyle = color;
  for(let cell of snake) {
    ctx.fillRect(cell.x * size, cell.y * size, size, size);
  }
}

function keydown(e) {
  console.log(e.keyCode)
  socket.emit('keydown', e.keyCode);
}

function handleInit(msg) {
  console.log(msg);
}

function handleGameState(gameState) {
  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => paintGame(gameState));
}

function handleGameOver() {
  alert('Game Over');
}