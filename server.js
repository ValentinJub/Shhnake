require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(helmet({
  noSniff: true,
  xssFilter: true,
  hidePoweredBy: {
    setTo: 'PHP 7.4.3'
  },
  noCache: true
}));

app.use('/public', express.static(process.cwd() + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

const io = require('socket.io')(server);
const { createGameState, gameLoop, getUpdatedVelocity } = require('./game.js');
const { FRAMERATE } = require('./public/constants.js');

io.on('connection', (client) => {
  const state = createGameState();
  client.on('keydown', handleKeydown);
  client.on('newGame', handleNewGame);

  function handleNewGame() {}

  function handleKeydown(keyCode) {
    try {
      keyCode = parseInt(keyCode);
    } catch (error) {
      console.log(error)
      return;
    }

    const vel = getUpdatedVelocity(keyCode);
    
    if(vel) {
      // how to prevent 180 degree turns?
      if((state.player.vel.x !== 0 && vel.x !== 0) || (state.player.vel.y !== 0 && vel.y !== 0)) return;
      state.player.vel = vel;
    }
  }

  startGameInterval(client, state);
});

function startGameInterval(client, state) {
  let indexedFrameRate = FRAMERATE;
  const intervalId = setInterval(() => {
    
    const winner = gameLoop(state, indexedFrameRate);
    
    if(!winner) {
      client.emit('gameState', JSON.stringify(state));
    } else {
      client.emit('gameOver');
      clearInterval(intervalId);
    }
  }, (1000 / indexedFrameRate))
}


module.exports = app; // For testing
