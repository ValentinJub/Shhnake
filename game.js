'use strict'
const { GRID_SIZE } = require('./public/constants.js');

// Create game state that holds the game logic
function createGameState() {
  return {
    player: {
      pos: {
        x: 3,
        y: 10,
      },
      vel: {
        x: 0,
        y: 0,
      },
      snake: [
        {x: 1, y: 10},
        {x: 2, y: 10},
        {x: 3, y: 10},
      ],
      foodEaten: 0,
      colorIndex: 0,
      color: [
        '#76C144',
        '#40BF86',
        '#3E8EBB',
        '#473EBB',
        '#9E3EBB',
        '#BB3EBB',
        '#BB3E64',
        '#BCC144',
        '#C8E3AB',
        '#E4F1F6',
      ]
    },
    food: {
      x: 7,
      y: 7,
    },
    gridsize: GRID_SIZE,
  };
}

function updateColorIndex(state) {
  const playerOne = state.player;
  if(playerOne.foodEaten % 3 === 0) {
    playerOne.colorIndex++;
    if(playerOne.colorIndex > playerOne.color.length - 1) {
      playerOne.colorIndex = 0;
    }
  }
}

// Create game loop that updates the game state
function gameLoop(state, indexedFrameRate) {
  if(!state) return;
  
  //we define playerOne
  const playerOne = state.player;

  //we update the playerOne position relative to its velocity
  playerOne.pos.x += playerOne.vel.x;
  playerOne.pos.y += playerOne.vel.y;

  //if the playerOne position is outside the grid, we return 2
  if(playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE || playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE) {
    return 2;
  }

  //if the playerOne has eaten the food we spawn more food, increase the snake length, and increase the frame rate
  if(state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
    playerOne.snake.push({...playerOne.pos});
    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;
    playerOne.foodEaten++;
    updateColorIndex(state);
    randomFood(state);
    indexedFrameRate++;
  }

  //if playerOne is moving
  if(playerOne.vel.x || playerOne.vel.y) {
    //if playerOne has collided with itself, we return 2
    for(let cell of playerOne.snake) {
      if(cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
        return 2;
      }
    }
    //if playerOne has not collided with itself, we push the new position to the snake and shift the snake
    playerOne.snake.push({...playerOne.pos});
    playerOne.snake.shift();
  }
  return false;
}

// Create random food
function randomFood(state) {
  let food = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  }

  //we can't pop food in a corner
  if(food.x === 0 && food.y === 0) {
    return randomFood(state);
  }
  if(food.x === 0 && food.y === GRID_SIZE - 1) {
    return randomFood(state);
  }
  if(food.x === GRID_SIZE - 1 && food.y === 0) {
    return randomFood(state);
  }
  if(food.x === GRID_SIZE - 1 && food.y === GRID_SIZE - 1) {
    return randomFood(state);
  }

  for(let cell of state.player.snake) {
    if(cell.x === food.x && cell.y === food.y) {
      return randomFood(state);
    }
  }
  state.food = food;
}

function getUpdatedVelocity(keyCode) {
  switch(keyCode) {
    case 37: { // left
      return {x: -1, y: 0};
    }
    case 38: { // up 
      return {x: 0, y: -1};
    }
    case 39: { // right
      return {x: 1, y: 0};
    }
    case 40: { // down 
      return {x: 0, y: 1};
    }
  }
}

module.exports = {
  createGameState,
  gameLoop,
  getUpdatedVelocity
}