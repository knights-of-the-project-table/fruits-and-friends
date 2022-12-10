'use strict';
const BOARD_WIDTH = 4;

const WIN_CONDITIONS = [
  // first row
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  // second row row
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

const gameStatus = document.getElementById('gameStatus');
const gameTiles = document.querySelectorAll('.gameTile');
const gameBoard = new GameBoard().board;

let availableMoves = [];
let currentPlayer = 1;

// Main Game Processing
function gameProcess(){
  initializeMoves();

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

// Add each gameTile html element to the game board and create Event Handler
gameTiles.forEach((gameTile, i) => {
  const row = Math.floor(i / BOARD_WIDTH);
  const column = i % BOARD_WIDTH;
  gameBoard[row][column].button = gameTile;
  // Before the game starts, each button is disabled
  gameTile.disabled = true;
  gameTile.addEventListener('click', makeMove(row, column));
});

// Event Handler for clicking on a tile
function makeMove(row, column) {
  gameBoard[row][column].occupiedBy = currentPlayer;

  // TODO: add function that processes valid moves by enabling tiles using the availableMoves array

  // TODO: add function that replaces tile image with token image

  // TODO: add function to replace previous move image tile with current move image tile

  if (evaluateWin()) {
    gameStatus.innerText = `Player ${currentPlayer} Won!`;
    endGame();
  } else {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayerStatus();
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

function endGame() {
  gameTiles.forEach(gameTile => {
    gameTile.disabled = true;
  });
}

function setCurrentPlayerStatus() {
  gameStatus.innerText = `Player ${currentPlayer}'s Turn`;
}

// Valid Move Check
// Input: Two element array for row and column
// Output: Boolean value if the move was valid
function processMove(move){
  let row = move[0];
  let column = move[1];

  if (gameBoard[row][column].occupiedBy){
    return false;
  }

  let validMove = false;
  for (let i = 0; i < availableMoves.length; i++){
    if (availableMoves[i][0] === row && availableMoves[i][1] === column){
      validMove = true;
      break;
    }
  }
  if (!validMove){
    return false;
  }

  gameBoard[row][column].occupiedBy = currentPlayer;

  let newAvailableMoves = [];
  let fruit = gameBoard[row][column].fruit;
  let friend = gameBoard[row][column].friend;

  for (let i = 0; i < BOARD_WIDTH; i++){
    for (let j = 0; j < BOARD_WIDTH; j++){
      if (!gameBoard[i][j].occupiedBy && (gameBoard[i][j].fruit === fruit || gameBoard[i][j].friend === friend)){
        newAvailableMoves.push([i, j]);
      }
    }
  }
  availableMoves = newAvailableMoves;
  return true;
}



// **************************
// **** For Testing Only*****
// **************************
gameProcess();
