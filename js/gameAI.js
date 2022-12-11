'use strict';

// The AI segment uses a scoring system with CPU wins with an assigned score flag of 100
// Simulated human wins are assigned a score flag of -100

// New win condition functions
// Linear board
// Available Moves
// Values on Win/loss
// Redo game tiles / board without extra information

let cpuDifficulty = 5;

class AIBoard{
    constructor(gameBoard){
        this.board = [];
        this.linearBoard = [];
        this.generate(gameBoard);
    }

    generate(gameLinearBoard){
        for (let i = 0; i < BOARD_HEIGHT; i++){
            this.board.push(new Array(4).fill(0));
        }
        
        for (let i = 0; i < gameLinearBoard.length; i++){
            let fruit = gameLinearBoard[i].fruit;
            let friend = gameLinearBoard[i].friend;
            let occupiedBy = gameLinearBoard[i].occupiedBy;

            this.linearBoard[i] = new AITile(fruit, friend, occupiedBy);

            let row = Math.floor(i / BOARD_WIDTH);
            let column = i % BOARD_HEIGHT;
            this.board[row][column] = this.linearBoard[i];
        }
    }
}

class AITile{
    constructor(fruit, friend, occupiedBy){
        this.fruit = fruit;
        this.friend = friend;
        this.occupiedBy = occupiedBy;
    }
}

function deepDiveWin(board, diveAvailableMoves, divePlayer){

    if (diveAvailableMoves.length === 0) {
      return true;
    }
    // Iterate through every win condition with the .some() method, which tests whether at least one element in the array passes the test of a callback function.
    return WIN_CONDITIONS.some(condition => {
      // For every win condition, check to see if the current player occupies the necessary indices of the game board using .every() method
      return condition.every(gameBoardPosition => {
        let row = gameBoardPosition[0];
        let column = gameBoardPosition[1];
        return board[row][column].occupiedBy === divePlayer;
      });
    });
  }

function deepDiveAvailableMoves(board, fruit, friend){
    let newAvailableMoves = [];

    for (let i = 0; i < BOARD_WIDTH; i++) {
        for (let j = 0; j < BOARD_WIDTH; j++) {
            if (!board[i][j].occupiedBy && (board[i][j].fruit === fruit || board[i][j].friend === friend)) {
                newAvailableMoves.push([i, j]);
            }
        }
    }
    return newAvailableMoves;
}

// Adds up the positions on the board
// 4 points for the border squares (4 ways to win)
// 7 points for the center squares (7 ways to win)
// Subtracts points for positions held by human
function deepDiveBoardScore(board){

    let score = 0;
    for (let i = 0; i < BOARD_WIDTH; i++){
        for (let j = 0; j < BOARD_HEIGHT; j++){
            if (!(i * j === 1 || i * j === 2 || (i === 2 && j === 2))){
                if(board[i][j].occupiedBy === 1){
                    score -= 7;
                } else {
                    score += 7;
                }
            } else {
                if(board[i][j].occupiedBy === 1){
                    score -= 4;
                } else {
                    score += 4;
                }
            }
        }
    }
    return score;    
}

function deepDive(board, diveAvailableMoves, divePlayer, depth){

    // If a win is detected for divePlayer, stop recursion and return win flag
    if (deepDiveWin(board.board, diveAvailableMoves, divePlayer)){
        return ((divePlayer * 2 - 3) * 100);
    }
    depth--;

    // If max depth reached, return board value
    if (depth < 1){
        return deepDiveBoardScore(board.board)
    }


    // Iterate to next player
    divePlayer = divePlayer === 1 ? 2 : 1;

    let playerCoefficient = (divePlayer * 2 - 3);
    let nodeScore = (-1000) * playerCoefficient;

    for (let i = 0; i < diveAvailableMoves.length; i++){
        let cpuMoveBoard =  new AIBoard(board.linearBoard);
        let move = diveAvailableMoves[i];
        cpuMoveBoard.board[move[0]][move[1]].occupiedBy = divePlayer;
        let fruit = cpuMoveBoard.board[move[0]][move[1]].fruit;
        let friend = cpuMoveBoard.board[move[0]][move[1]].friend;

        let branchAvailableMoves =  deepDiveAvailableMoves(board.board, fruit, friend);
        let branchScore = deepDive(cpuMoveBoard, branchAvailableMoves, divePlayer, depth);

        if (divePlayer === 2 && nodeScore < branchScore){
            nodeScore = branchScore;
        }

        if (divePlayer === 1 && nodeScore > branchScore){
            nodeScore = branchScore;
        }

        if (nodeScore === (100 * playerCoefficient)){
            return nodeScore;    
        }   

        // if computer player, returns the highest value
        // if simulated human, returns the lowest value

    }

}

// Seeds a recursive algorithm to determine the best possible move for a desired level of difficulty
// Requires a difficulty level
// Returns CPU move in [row, column] format
function cpuPlayerMoveGenerator(){
    let moveScore = 0;
    let row = null;
    let column = null;
    let bestMoveScore = -1000;
    let bestMoveIndex = 0;

    for (let i = 0; i < availableMoves.length; i++){
        let move = availableMoves[i];
        let boardSeed = new AIBoard(linearGameBoard);
        boardSeed.board[move[0]][move[1]].occupiedBy = 2;
        let fruit = boardSeed.board[move[0]][move[1]].fruit;
        let friend = boardSeed.board[move[0]][move[1]].friend;
        
        let diveAvailableMoves = deepDiveAvailableMoves(boardSeed.board, fruit, friend);

        // Calls on deepDive() to return a score for that particular move branch
        moveScore = deepDive(boardSeed, diveAvailableMoves, 2, cpuDifficulty);

        if (bestMoveScore < moveScore){
            bestMoveScore = moveScore;
            bestMoveIndex = i;
        }

        // If unavoidable win is detected, stop search and take that path
        if (bestMoveScore === 100){
            break;
        }
    }

    row = availableMoves[bestMoveIndex][0];
    column = availableMoves[bestMoveIndex][1];

    return([row, column])
}

function cpuPlayerInitialize(){
    let wins = players[0].wins;
    let losses = players[0].losses;
    let winLossDifference = wins - losses;

    if (winLossDifference < 1){
        cpuDifficulty = 1;
    } else if (winLossDifference > 9){
        cpuDifficulty = 9;
    } else {
        cpuDifficulty = winLossDifference;
    }
}



// function sample(depth){
//     if (depth === 0){
//     return;
//     }
//     let branches = 6;
//     branches = branches - (depth/2);

//     for (let i = 0; i < branches; i++){
//         new GameBoard;
//         sample(depth - 1);
//     }
// }






// Recursion
// X(computer) will take the highest of the nodes
// N(simulated human) will take the lowest of the nodes
// If tie, doesn't matter
// Branch ends at win/loss or max depth reached
// Win = 100
// Loss = -100
// Tie = pick first
// STRETCH = assign values to each space and include in node value
// STRETCH = border spaces worth 4, center worth 7















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


// function cornerWin(){

    // }
    
    // function sideWinR(){
        
    // }
    
    // function sideWinC(){
    
    // }
    
    // function centerWin(){
    
    // }
    
    // function AIEvaluateWin(space){
    //     const row = Math.floor(space / BOARD_WIDTH);
    //     const column = space % BOARD_WIDTH;
    
    //     if (AIBoard.board[row][column].occupiedBy === AIBoard.board[(row + 1)%4][column].occupiedBy === AIBoard.board[(row + 2)%4][column].occupiedBy === AIBoard.board[(row + 3)%4][column].occupiedBy){
    //         return true;
    //     }
    //     if (AIBoard.board[row][column].occupiedBy === AIBoard.board[row][(column+1)%4].occupiedBy === AIBoard.board[row][(column+2)%4].occupiedBy === AIBoard.board[row][(column+3)%4].occupiedBy){
    //         return true;
    //     }
    //     if ((row + column === 3) && AIBoard.linearBoard[3] === AIBoard.linearBoard[6] === AIBoard.linearBoard[9]===AIBoard.linearBoard[12]){
    //         return true;
    //     }
    //     if ((row === column) && AIBoard.linearBoard[0] === AIBoard.linearBoard[5] === AIBoard.linearBoard[10] === AIBoard.linearBoard[15]){
    //         return true;
    //     }
    
    //     // Work in progress
    
    // }