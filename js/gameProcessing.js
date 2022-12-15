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

let availableMoves = [];
let currentPlayer = 1;

// Flag to enable / disable cpu player
let cpuEnabled = true;

// Sets up the board
let gameBoardObj = newGameBoard();
let gameBoard = gameBoardObj.board;
// Linear game board is used in the AI calculations
const linearGameBoard = gameBoardObj.linearBoard;

// Sets up players
let playersObject = newPlayers();
let players = playersObject.players;



// Loads previous save state (if any) and starts the game
function gameStart(){
  // Three objects loaded from saved state: Board, availableMoves[], current tile

  initializeMoves();
  setCurrentPlayerStatus();
  enableAvailableTiles();
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

// Event Handler for clicking on a tile
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
    gameStatus.innerText = `Player ${currentPlayer} Won!`;
    disableTiles();
    return;
  } else {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayerStatus();
  }

  // If the CPU is enabled, asynchronously call the CPU move
  if (cpuEnabled && currentPlayer === 2) {
    asyncCpuMove();
  }

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
  disableTiles();

  for (let i = 0; i < availableMoves.length; i++){
    let row = availableMoves[i][0];
    let column = availableMoves[i][1];
    gameBoard[row][column].button.disabled = false;
  }
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

function disableTiles() {
  gameTiles.forEach(gameTile => {
    gameTile.disabled = true;
  });
}

function setCurrentPlayerStatus() {
  let currentPlayerName = '';
  if (currentPlayer === 1) {
    currentPlayerName = playerOne;
  } else {
    currentPlayerName = playerTwo;
  }
  gameStatus.innerText = `${currentPlayerName}'s Turn`;
}

// This function awaits a timed-out promise that calculates the CPU's next move. This is done to give the player a sense of rhythm when the CPU moves, and to make sure that the player token is painted in the browser in the makeMove function before the CPU token is added to the board.
async function asyncCpuMove() {
  const timeOutInterval = 2000;
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

// This function reset the game 
const resetButtonEvent = () => {

  availableMoves = [];
  currentPlayer = 1;
  
  for (let i = 0; i < gameBoardObj.linearBoard.length; i++){
    gameBoardObj.linearBoard[i].occupiedBy = null;
  }

  gameBoardObj = newGameBoard();
  gameBoard = gameBoardObj.board;
  
  // Add each gameTile html element to the game board and create Event Handler
  gameTiles.forEach((gameTile, i) => {
    const row = Math.floor(i / BOARD_WIDTH);
    const column = i % BOARD_WIDTH;
    gameBoard[row][column].button = gameTile;
    // Make sure the current default or previous game tiles are removed
    removeAllChildNodes(gameTile);
    // Before the game starts, each button is disabled
    gameTile.disabled = true;
    gameTile.id = i;
    let image = document.createElement('img');
    image.className = 'tileLayer';
    image.src = gameBoard[row][column].imageSrc;
    gameTile.appendChild(image);
    gameTile.removeEventListener('click', () => {
      makeMove(row, column);
    })
    gameTile.addEventListener('click', () => {
      makeMove(row, column);
    });

  });
  localStorage.clear('savedAvailableMoves');
  localStorage.clear('savedGameBoardState');
  localStorage.clear('savedCurrentPlayer');
  
  gameStart();

}

// This function removes all child nodes from an element
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

const singlePlayerGame = () => {
  cpuEnabled = false;
  resetButtonEvent();
}

const versusCPU = () => {
  cpuEnabled = true;
  resetButtonEvent();
}

const resetButton = document.getElementById('resetButton');

resetButton.addEventListener('click', resetButtonEvent);

const singlePlayerButton = document.getElementById('twoPlayerGameButton');

singlePlayerButton.addEventListener('click', singlePlayerGame);

const playMachineButton = document.getElementById('onePlayerGameButton');

playMachineButton.addEventListener('click', versusCPU);
