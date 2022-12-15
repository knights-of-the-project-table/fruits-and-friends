'use strict';



// The AI segment uses a scoring system with CPU wins with an assigned score flag of 100
// Simulated human wins are assigned a score flag of -100

// New win condition functions
// Linear board
// Available Moves
// Values on Win/loss
// Redo game tiles / board without extra information

const WIN_CONDITIONS_ARRAY = [
    // first row
    [0, 1, 2, 3],
    // second row
    [4, 5, 6, 7],
    // third row
    [8, 9, 10, 11],
    // fourth row
    [12, 13, 14, 15],
    // first column
    [0, 4, 8, 12],
    // second column
    [1, 5, 9, 13],
    // third column
    [2, 6, 10, 14],
    // fourth column
    [3, 7, 11, 15],
    // first diagonal
    [0, 5, 10, 15],
    // second diagonal
    [3, 6, 9, 12],
    // top left square
    [0, 1, 4, 5],
    // top middle square
    [1, 2, 5, 6],
    // top right square
    [2, 3, 6, 7],
    // middle left square
    [4, 5, 8, 9],
    // middle middle square
    [5, 6, 9, 10],
    // middle right square
    [6, 7, 10, 11],
    // bottom left square
    [8, 9, 12, 13],
    // bottom middle square
    [9, 10, 13, 14],
    // bottom right square
    [10, 11, 14, 15],
  ];

let cpuDifficulty = 12;

class AIBoard{
    constructor(gameLinearBoard){
        this.linearBoard = [];
        this.generate(gameLinearBoard);
    }

    generate(gameLinearBoard){
        
        for (let i = 0; i < gameLinearBoard.length; i++){
            let fruit = gameLinearBoard[i].fruit;
            let friend = gameLinearBoard[i].friend;
            let occupiedBy = gameLinearBoard[i].occupiedBy;

            this.linearBoard[i] = new AITile(fruit, friend, occupiedBy);
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
    return WIN_CONDITIONS_ARRAY.some(condition => {
      // For every win condition, check to see if the current player occupies the necessary indices of the game board using .every() method
      return condition.every(gameBoardPosition => {
        return board.linearBoard[gameBoardPosition].occupiedBy === divePlayer;
      });
    });
  }

function deepDiveAvailableMoves(board, fruit, friend){
    let newAvailableMoves = [];

    for (let i = 0; i < board.length; i++) {
            if (!board[i].occupiedBy && (board[i].fruit === fruit || board[i].friend === friend)) {
                // console.log(i, j);
                newAvailableMoves.push(i);
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
            if (board.linearBoard[i].occupiedBy) {
                if ((i === 5 || i === 6 || i === 9 || i === 10)) {
                    if (board.linearBoard[i].occupiedBy === 1) {
                        score -= 7;
                    } else {
                        score += 7;
                    }
                } else {
                    if (board.linearBoard[i].occupiedBy === 1) {
                        score -= 4;
                    } else {
                        score += 4;
                    }
                }
            }
        
    }
    return score;    
}

// Core recursive depth-first function to search through moves immediately available at each level
// Returns the best score for the CPU player based on max-min / Alpha-Beta methods for the initial node passed
function deepDive(board, diveAvailableMoves, divePlayer, depth){
    // If a win is detected for divePlayer, stop recursion and return win flag
    let depthShift = depth - cpuDifficulty; 

    if (deepDiveWin(board, diveAvailableMoves, divePlayer)){
        let moveScore = (divePlayer * 2 - 3) * (100 + depthShift);
        // console.log(moveScore);
        return (moveScore);
    }
    depth--;

    // If max depth reached, return board value
    if (depth < 1){
        let moveScore = deepDiveBoardScore(board);
        return (moveScore);
    }

    // Iterate to next player
    divePlayer = divePlayer === 1 ? 2 : 1;
    let playerCoefficient = (divePlayer * 2 - 3);       // Set to 1 for CPU (max-layer) and -1 for human (min-layer)
    let bestMoveScore = (-1000) * playerCoefficient;    // Set infinite flag (-1000 on max-layer and 1000 on min-layer)

    let testMove = [];

    // Loop through valid moves for hypothetical board state
    for (let i = 0; i < diveAvailableMoves.length; i++){
        let cpuMoveBoard =  new AIBoard(board.linearBoard);     // 
        let move = diveAvailableMoves[i];
        // console.log(move);
        if (cpuMoveBoard.linearBoard[move].occupiedBy){
            console.log(cpuMoveBoard.linearBoard[move].occupiedBy);
        }
        cpuMoveBoard.linearBoard[move].occupiedBy = divePlayer;
        let fruit = cpuMoveBoard.linearBoard[move].fruit;
        let friend = cpuMoveBoard.linearBoard[move].friend;

        let branchAvailableMoves =  deepDiveAvailableMoves(cpuMoveBoard.linearBoard, fruit, friend);
        let moveScore = deepDive(cpuMoveBoard, branchAvailableMoves, divePlayer, depth);
        // console.log(branchAvailableMoves);
        // console.log(divePlayer);

        if (divePlayer === 2 && bestMoveScore < moveScore){           
            bestMoveScore = moveScore;
            testMove = diveAvailableMoves[i];
            // if (bestMoveScore === (100 + depthShift)){
            //     return bestMoveScore;
            // }
        }

        if (divePlayer === 1 && bestMoveScore > moveScore){            
            bestMoveScore = moveScore;
            testMove = diveAvailableMoves[i];
            // if (bestMoveScore === (100 - depthShift)){
            //     return bestMoveScore;
            // }
        }

        // if (depthShift === 0){
        //     console.log(moveScore);
        // }

        // console.log(bestMoveScore);

        // if (bestMoveScore === ((100 + depthShift) * playerCoefficient)){
        //     return bestMoveScore;
        // }   

        // if computer player, returns the highest value
        // if simulated human, returns the lowest value

    }

    return (bestMoveScore);

}

// Seeds a recursive algorithm to determine the best possible move for a desired level of difficulty
// Requires a difficulty level
// Returns CPU move in [row, column] format
function cpuPlayerMoveGenerator(){
    
    let row = null;
    let column = null;
    let bestMoveScore = -1000;  // To approximate -infinity flag for alpha-beta method
    let bestMoveIndex = 0;      // Index of move with highest value

    // console.log(linearGameBoard);

    //  Loop through all current valid moves and finds the move with the best possible outcome
    for (let i = 0; i < availableMoves.length; i++){
        let moveScore = 0;
        let moveCoords = availableMoves[i];
        let move = moveCoords[0] * 4 + moveCoords[1];
        let boardSeed = new AIBoard(linearGameBoard);       // Makes a copy of the current board for simulated moves



        // Makes simulated move
        boardSeed.linearBoard[move].occupiedBy = 2;
        let fruit = boardSeed.linearBoard[move].fruit;
        let friend = boardSeed.linearBoard[move].friend;
        let diveAvailableMoves = deepDiveAvailableMoves(boardSeed.linearBoard, fruit, friend);

        // console.log(moveCoords);
        // console.log(move);
        // console.log(linearGameBoard);
        // console.log(boardSeed.linearBoard);

        // Calls on deepDive() to return a score for that particular move branch
        // Function does depth-first search out of all possible moves up to 'cpuDifficulty' layers
        moveScore = deepDive(boardSeed, diveAvailableMoves, 2, cpuDifficulty);

        // Update best move score and associated index
        if (bestMoveScore < moveScore){
            bestMoveScore = moveScore;
            bestMoveIndex = i;
        }        

        // If unavoidable win is detected, stop search and take that path
        // if (bestMoveScore === 100){
        //     break;
        // }
    }


    row = availableMoves[bestMoveIndex][0] ;
    column = availableMoves[bestMoveIndex][1];

    // console.log(`Possible move scores: ${moveScoreArray}`);
    // console.log(`Current board: ${linearGameBoard}`);
    // console.log(`Possible moves: ${availableMoves}`);
    console.log(`Best move score: ${bestMoveScore}`);
    console.log(`Picked move: ${[row, column]}`);

    return([row, column])
}

function cpuPlayerInitialize(){
    let wins = players[0].wins;
    let losses = players[0].losses;
    let winLossDifference = wins - losses;

    if (winLossDifference < 1){
        cpuDifficulty = 1;
    } else if (winLossDifference > 8){
        cpuDifficulty = 8;
    } else {
        cpuDifficulty = winLossDifference;
    }
}

// if (typeof window == "undefined"){
//   let boardMessed = new AIBoard(
//     [{fruit: 'watermelon', friend: `dragon`, occupiedBy: null},
//     {fruit: 'orange',friend: `dragon`, occupiedBy: null},
//     {fruit: 'orange',friend: `kangaroo`, occupiedBy: null},
//     {fruit: 'watermelon',friend: `kangaroo`, occupiedBy: 2},
//     {fruit: 'banana',friend: `kangaroo`, occupiedBy: 1},
//     {fruit: 'strawberry',friend: `kangaroo`, occupiedBy: 1},
//     {fruit: 'banana', friend: `dog`,occupiedBy: null},
//     {fruit: 'watermelon',friend: `dog`, occupiedBy: null},
//     {fruit: 'orange', friend: `turtle`, occupiedBy: 2},
//     {fruit: 'banana', friend: `turtle`, occupiedBy: 1},
//     {fruit: 'orange', friend: `dog`, occupiedBy: 1},
//     {fruit: 'watermelon', friend: `turtle`, occupiedBy: null},
//     {fruit: 'strawberry', friend: `turtle`, occupiedBy: 2},
//     {fruit: 'banana', friend: `dragon`, occupiedBy: null},
//     {fruit: 'strawberry', friend: `dragon`, occupiedBy: null},
//     {fruit: 'strawberry', friend: `dog`, occupiedBy: null}]
//   );

//   let temp = [];
//   for (let i  = 0; i < 16; i++){
//     let x = Math.floor(i/4);
//     let y = i % 4;
//     let jp = y * 4 +x ;
//     temp[jp] = boardMessed.linearBoard[i];
//   }

//   let board = new AIBoard(temp);

//   console.log(boardMessed.linearBoard[1]);
//   console.log(board.linearBoard[1]);
// //    let testArray = [[1,0],[2,0],[2,1], [3,1], [3,3]];
//    let testArray = [4, 8, 9, 13, 15];
// //    let testArray = [8];

//   let score = deepDive(board, testArray, 1, cpuDifficulty);
//   console.log(score);
// }

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