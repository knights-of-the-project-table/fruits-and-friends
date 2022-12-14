'use strict';

const WIN_CONDITIONS = [
  // first row
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  // second row
  [[1, 0], [1, 1], [1, 2], [1, 3]],
  // third row
  [[2, 0], [2, 1], [2, 2], [2, 3]],
  // fourth row
  [[3, 0], [3, 1], [3, 2], [3, 3]],
  // first column
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  // second column
  [[0, 1], [1, 1], [2, 1], [3, 1]],
  // third column
  [[0, 2], [1, 2], [2, 2], [3, 2]],
  // fourth column
  [[0, 3], [1, 3], [2, 3], [3, 3]],
  // first diagonal
  [[0, 0], [1, 1], [2, 2], [3, 3]],
  // second diagonal
  [[0, 3], [1, 2], [2, 1], [3, 0]],
  // top left square
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  // top middle square
  [[0, 1], [0, 2], [1, 1], [1, 2]],
  // top right square
  [[0, 2], [0, 3], [1, 2], [1, 3]],
  // middle left square
  [[1, 0], [1, 1], [2, 0], [2, 1]],
  // middle middle square
  [[1, 1], [1, 2], [2, 1], [2, 2]],
  // middle right square
  [[1, 2], [1, 3], [2, 2], [2, 3]],
  // bottom left square
  [[2, 0], [2, 1], [3, 0], [3, 1]],
  // bottom middle square
  [[2, 1], [2, 2], [3, 1], [3, 2]],
  // bottom right square
  [[2, 2], [2, 3], [3, 2], [3, 3]],
];

let gameStatus = document.getElementById('gameStatus');
let gameTiles = document.querySelectorAll('.gameTile');
let savedGameFile = false;
let availableMoves = [];
let currentPlayer = 1;

// Flag to enable / disable cpu player - initialize to true
let cpuEnabled = true;

// Sets up the board
let gameBoardObj = newGameBoard();
let gameBoard = gameBoardObj.board;
// Linear game board is used in the AI calculations
let linearGameBoard = gameBoardObj.linearBoard;

// Sets up players
let playersObject = newPlayers();
let players = playersObject.players;
let currentPlayerName = players[currentPlayer - 1].name;

// This is the page load function that populates a default board with ordered tiles and loads a game state if one exists
function onPageLoad() {
  renderPlayerInfo();
  
  if (restoreCurrentPlayer()) {
    savedGameFile = true;
  }

  if (savedGameFile){
    savedGameEvent();
  } else {
    renderDefaultBoard();
  }
}

function renderPlayerInfo() {
  // If there's player info in local storage, call the restorePlayers function
  if (localStorage.getItem('savedPlayersState')) {
    playersObject = restorePlayers();
    players = playersObject.players;
  }
  setScoreBoard();
}

function setScoreBoard() {
  const player1 = players[0];
  const player2 = players[1];
  const playerOneScoreBoardName = document.getElementById('playerOneScoreBoardName');
  playerOneScoreBoardName.innerText = player1.name;
  const playerTwoScoreBoardName = document.getElementById('playerTwoScoreBoardName');
  playerTwoScoreBoardName.innerText = player2.name;
  const playerOneScore = document.getElementById('playerOneScore');
  playerOneScore.innerText = player1.wins;
  const playerTwoScore = document.getElementById('playerTwoScore');
  playerTwoScore.innerText = player2.wins;
}

function renderDefaultBoard() {
  // For each game tile button, load the corresponding tile from the ordered set of the gameBoardTiles array from gameArtifacts.js
  gameTiles.forEach((gameTile, i) => {
    // Before the game starts, each button is disabled
    gameTile.disabled = true;
    let image = document.createElement('img');
    image.className = 'tileLayer';
    image.src = gameBoardTiles[i].imageSrc;
    gameTile.appendChild(image);
    gameStatus.innerText = 'Choose a game type to begin!'
  });
}

// This function loads all local storage data and populates the game board with it, then continues the game
function savedGameEvent() {

  gameBoardObj = restoreGameBoard();
  availableMoves = restoreAvailableMoves();
  currentPlayer = restoreCurrentPlayer();
  cpuEnabled = restoreOnePlayerOrTwo();
  gameBoard = gameBoardObj.board;
  linearGameBoard = gameBoardObj.linearBoard;
  currentPlayerName = players[currentPlayer-1].name;
  setCurrentPlayerStatus();

  // Add each gameTile html element to the game board and create Event Handler
  gameTiles.forEach((gameTile, i) => {
    const row = Math.floor(i / BOARD_WIDTH);
    const column = i % BOARD_WIDTH;
    gameBoard[row][column].button = gameTile;
    // Make sure the current default or previous game tiles are removed
    removeAllChildNodes(gameTile);
    gameTile.id = i;
    let image = document.createElement('img');
    image.className = 'tileLayer';
    image.src = gameBoard[row][column].imageSrc;
    gameTile.appendChild(image);
    gameTile.addEventListener('click', makeMoveEvent);

    if (gameBoard[row][column].occupiedBy) {
      let token = document.createElement('img');
      token.src = players[gameBoard[row][column].occupiedBy - 1].playerToken;
      token.className = 'tokenLayer';
      gameBoard[row][column].button.appendChild(token);
    }
  });

  // If the CPU is enabled, set the difficulty
  if (cpuEnabled) {
    cpuPlayerInitialize();
  }

  // If the CPU is enabled and was calculating it's move when the browser closed or was refreshed, it needs to perform its move, otherwise continue the game as usual
  if (cpuEnabled && currentPlayer === 2) {
    disableTiles()
    setCurrentPlayerStatus();
    asyncCpuMove(4000);
  } else {
    gameStart();
  }
}

function setCurrentPlayerStatus() {
  currentPlayerName = players[currentPlayer - 1].name;
  gameStatus.innerText = `${currentPlayerName}'s Turn`;
}

// This function removes all child nodes from an element
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// Starts the game by initializing current available moves
function gameStart(){
  if (availableMoves.length === 0) {
    initializeMoves();
  }
  setCurrentPlayerStatus();
  enableAvailableTiles();
  currentPlayerName = players[currentPlayer-1].name;
  setCurrentPlayerStatus(currentPlayerName);
}

// Event Handler for clicking on a tile. This is made as an intermediate step because asyncCpuMove calls makeMove with row and column arguments
function makeMoveEvent(event) {
  const index = Number(event.currentTarget.id);
  const row = Math.floor(index / BOARD_WIDTH);
  const column = index % BOARD_WIDTH;
  makeMove(row, column)
}

// Function that performs moves and updates the game board with token images, as well as checking for game win state.
function makeMove(row, column) {
  gameBoard[row][column].occupiedBy = currentPlayer;
  let fruit = gameBoard[row][column].fruit;
  let friend = gameBoard[row][column].friend;
  updateAvailableMoves(fruit, friend);

  // Only enable available tiles if there is no CPU or if there is a CPU and the CPU just made a move
  if (!cpuEnabled || (cpuEnabled && currentPlayer === 2)) {
    enableAvailableTiles();
  } else {
    disableTiles();
  }

  // Adds player token image on top of tile image
  let token = document.createElement('img');
  token.src = players[currentPlayer - 1].playerToken;
  token.className = 'tokenLayer';
  gameBoard[row][column].button.appendChild(token);

  if (evaluateWin()) {
    if (cpuEnabled){
      if (currentPlayer === 1){
        gameStatus.innerText = `You beat level ${cpuDifficulty}! Leveling up!`;
      }else if (currentPlayer === 2){
        gameStatus.innerText = `${currentPlayerName} level ${cpuDifficulty} wins this round!`;
      }

    }else {
    gameStatus.innerText = `${currentPlayerName} Won!`;
    }

    players[currentPlayer-1].wins++;
    players[currentPlayer%2].losses++;
    savePlayers(players);
    setScoreBoard()
    disableTiles();
    clearForNewGame();
    return;
  } else {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayerStatus();
  }

  // If the CPU is enabled, asynchronously call the CPU move
  if (cpuEnabled && currentPlayer === 2) {
    asyncCpuMove(2000);
  }

  saveGameBoard(gameBoard);
  savePlayers(players);
  saveAvailableMoves(availableMoves);
  saveCurrentPlayer(currentPlayer);
}

// Updates the availableMoves array with the next set of valid moves
function updateAvailableMoves(fruit, friend){
  let newAvailableMoves = [];

  for (let i = 0; i < BOARD_WIDTH; i++){
    for (let j = 0; j < BOARD_WIDTH; j++){
      if (!gameBoard[i][j].occupiedBy && (gameBoard[i][j].fruit === fruit || gameBoard[i][j].friend === friend)){
        newAvailableMoves.push([i, j]);
      }
    }
  }
  availableMoves = newAvailableMoves;
}

// Enables game tiles based upon the moves which will be available for the following turn
function enableAvailableTiles(){
  //First disable all tiles and then enable those that are valid
  disableTiles();

  for (let i = 0; i < availableMoves.length; i++){
    let row = availableMoves[i][0];
    let column = availableMoves[i][1];
    gameBoard[row][column].button.disabled = false;
  }
}

function disableTiles() {
  gameTiles.forEach(gameTile => {
    gameTile.disabled = true;
  });
}

// Evaluate Win Conditions
// This function compares the current board state to the WIN_CONDITIONS array to test if the current player has won with 4 in a row, a 2x2 square, or if there are no more available moves for the next player
// Output: Boolean for the current player's win
function evaluateWin(){
  if (availableMoves.length === 0) {
    return true;
  }
  // Iterate through every win condition with the .some() method, which tests whether at least one element in the array passes the test of a callback function.
  return WIN_CONDITIONS.some(condition => {
    // For every win condition, check to see if the current player occupies the necessary indices of the game board using .every() method
    return condition.every(gameBoardPosition => {
      let row = gameBoardPosition[0];
      let column = gameBoardPosition[1];
      return gameBoard[row][column].occupiedBy === currentPlayer;
    });
  });
}

// This function awaits a timed-out promise that calculates the CPU's next move. This is done to give the player a sense of rhythm when the CPU moves, and to make sure that the player token is painted in the browser in the makeMove function before the CPU token is added to the board.
async function asyncCpuMove(timeOutInterval) {
  const move = await resolveAfterTimeout(timeOutInterval);
  const row = move[0];
  const column = move[1];
  makeMove(row, column);
}

// This function returns the CPU's calculated next move after a set time interval
function resolveAfterTimeout(timeOut) {
  return new Promise(resolve => {
    setTimeout(() => {
      let move = cpuPlayerMoveGenerator();
      resolve(move);
    }, timeOut);
  });
}

// Populates the array of allowed moves for game start, i.e., only the outer border of tiles are valid placements for a token
function initializeMoves(){
  for (let i = 0; i < BOARD_WIDTH; i++){
    for (let j = 0; j < BOARD_WIDTH; j++){
      if (!(i * j === 1 || i * j === 2 || (i === 2 && j === 2))){
        availableMoves.push([i, j]);
      }
    }
  }
}

//Event handlers for all buttons (1 player game, 2 player game, new game)
const onePlayerGameButton = document.getElementById('onePlayerGameButton');
onePlayerGameButton.addEventListener('click', versusCPU);

const twoPlayerGameButton = document.getElementById('twoPlayerGameButton');
twoPlayerGameButton.addEventListener('click', twoPlayerGame);

const newGameButton = document.getElementById('newGameButton');
newGameButton.addEventListener('click', newGame);

function versusCPU() {
  clearForNewGame();
  // Reset the score when a different game type is chosen
  if (!cpuEnabled) {
    resetScores();
  }
  cpuEnabled = true;
  // If a new 1 player game is chosen, change Player 2's name to Deep Fish :)
  players[1].name = 'Deep Fish';
  setScoreBoard();
  newGameButtonEvent();
}

function twoPlayerGame() {
  clearForNewGame();
  // Reset the score when a different game type is chosen
  if (cpuEnabled) {
    resetScores();
  }
  cpuEnabled = false;
  // If Player 2 name is Deep Fish, change to Player 2
  if (players[1].name === 'Deep Fish') {
    players[1].name = 'Player 2';
  }
  setScoreBoard();
  newGameButtonEvent();
}

function newGame() {
  clearForNewGame();
  newGameButtonEvent();
}

function resetScores() {
  players[0].wins = 0;
  players[0].losses = 0;
  players[1].wins = 0;
  players[1].losses = 0;
}

// This function starts a new game 
function newGameButtonEvent() {

  availableMoves = [];
  currentPlayer = 1;

  for (let i = 0; i < gameBoardObj.linearBoard.length; i++) {
    gameBoardObj.linearBoard[i].occupiedBy = null;
  }

  gameBoardObj = newGameBoard();

  gameBoard = gameBoardObj.board;
  linearGameBoard = gameBoardObj.linearBoard;
  
  // Add each gameTile html element to the game board and create Event Handler
  gameTiles.forEach((gameTile, i) => {
    const row = Math.floor(i / BOARD_WIDTH);
    const column = i % BOARD_WIDTH;
    gameBoard[row][column].button = gameTile;
    // Make sure the current default or previous game tiles are removed
    removeAllChildNodes(gameTile);
    gameTile.id = i;
    let image = document.createElement('img');
    image.className = 'tileLayer';
    image.src = gameBoard[row][column].imageSrc;
    gameTile.appendChild(image);
    gameTile.addEventListener('click', makeMoveEvent);
  });
  gameStart();
  saveGameBoard(gameBoard);
  savePlayers(players);
  saveAvailableMoves(availableMoves);
  saveCurrentPlayer(currentPlayer);
  saveOnePlayerOrTwo(cpuEnabled);

  // If the CPU is enabled, make sure to update the difficulty based off of the wins/losses
  if (cpuEnabled) {
    cpuPlayerInitialize();
  }
  savedGameFile = true; 
}

// Load event
onPageLoad();
