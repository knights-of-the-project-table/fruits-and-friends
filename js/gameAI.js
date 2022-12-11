'use strict';



// **************************
// **** Jeremy's Playground*****
// **************************

// Valid Move Check
// Input: Two element array for row and column
// Output: Boolean value if the move was valid
// function processMove(move){
//   let row = move[0];
//   let column = move[1];

//   if (gameBoard[row][column].occupiedBy){
//     return false;
//   }

//   let validMove = false;
//   for (let i = 0; i < availableMoves.length; i++){
//     if (availableMoves[i][0] === row && availableMoves[i][1] === column){
//       validMove = true;
//       break;
//     }
//   }
//   if (!validMove){
//     return false;
//   }

//   gameBoard[row][column].occupiedBy = currentPlayer;

//   let newAvailableMoves = [];
//   let fruit = gameBoard[row][column].fruit;
//   let friend = gameBoard[row][column].friend;

//   for (let i = 0; i < BOARD_WIDTH; i++){
//     for (let j = 0; j < BOARD_WIDTH; j++){
//       if (!gameBoard[i][j].occupiedBy && (gameBoard[i][j].fruit === fruit || gameBoard[i][j].friend === friend)){
//         newAvailableMoves.push([i, j]);
//       }
//     }
//   }
//   availableMoves = newAvailableMoves;
//   return true;
// }