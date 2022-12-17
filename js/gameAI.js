'use strict';

// The AI shall, to reduce calculation time, use a linear board[16] instead of the 2D game artifacts board[4][4]
// The linear board shall be composed of reduced memory game tiles
// The AI shall use 1D arrays for win conditions to account of linear board[16]
// The AI shall use the player's win - losses to determine difficulty
// The AI shall use max tree depth to toggle difficulty
// The AI shall recalulate difficulty upon each win/loss
// The AI shall have difficulty limited to 1 to 12 inclusive

// General flow:
// Recurse
// Check base case
    // Player wins
    // Max depth reached
    // return base node score
// Loop through each available move
    // Copy board
    // Make move
    // Evaluate next available move set
    // Recurse
    // Keep copy of max/min score
// Return score

// Minimax scoring/logic rules
// X(computer) shall take the highest scoring move
// N(simulated human) shall take the lowest scoring move
// If tie, pick first option in available move array
// Base case at win/loss or max depth reached
// Win = 100
// Loss = -100
// Max depth = border spaces worth 4 or -4, center worth 7 or -7

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

// cpuDifficulty determines the depth of the search tree
let cpuDifficulty = 12;

// Reduced impact game board
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

// Low impact game tiles
class AITile{
    constructor(fruit, friend, occupiedBy){
        this.fruit = fruit;
        this.friend = friend;
        this.occupiedBy = occupiedBy;
    }
}

// Purpose: To determine if a move has won the game through three win conditions
//          1) 4 in a row, column, diagonal given by WIN_CONDITIONS_ARRAY
//          2) Next player has no available moves
// Input: AIboard object, array of available moves, current player (1 or 2)
// Output: boolean
function deepDiveWin(board, diveAvailableMoves, divePlayer) {
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

// Purpose: To return an array of all unoccupied moves that match the given fruit or friend
// Input: AIboard object, fruit, friend
// Output: Array of integers (0-15) indicating possible which moves the player can make
function deepDiveAvailableMoves(board, fruit, friend){
    let newAvailableMoves = [];

    for (let i = 0; i < board.length; i++) {
            if (!board[i].occupiedBy && (board[i].fruit === fruit || board[i].friend === friend)) {
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
// Returns the best score for the CPU player based on minimax methods for the initial node passed
// General flow of following function listed at the top of this file
function deepDive(board, diveAvailableMoves, divePlayer, depth){

    // Shift for node scores for the CPU to favor shallow (quick) wins
    // Shift also delays possible losses if a win isn't predicted
    let depthShift = depth - cpuDifficulty;

    // BASE CASE WIN
    // If a win is detected for divePlayer, stop recursion and return win flag
    if (deepDiveWin(board, diveAvailableMoves, divePlayer)){
        let moveScore = (divePlayer * 2 - 3) * (100 + depthShift);
        return (moveScore);
    }

    depth--;

    // BASE CASE DEPTH
    // If max depth reached, return board value
    if (depth < 1){
        let moveScore = deepDiveBoardScore(board);
        return (moveScore);
    }

    // Iterate to next player
    divePlayer = divePlayer === 1 ? 2 : 1;
    let playerCoefficient = (divePlayer * 2 - 3);       // Set to 1 for CPU (max-layer) and -1 for human (min-layer)
    let bestMoveScore = (-1000) * playerCoefficient;    // Set infinite flag (-1000 on max-layer and 1000 on min-layer)

    // Loop through each available move
    for (let i = 0; i < diveAvailableMoves.length; i++){
        let cpuMoveBoard =  new AIBoard(board.linearBoard);     // Make copy of current board
        let move = diveAvailableMoves[i];

        // Logic check
        if (cpuMoveBoard.linearBoard[move].occupiedBy){
            console.log(`Game board logic polluted`);
        }

        // Make move
        cpuMoveBoard.linearBoard[move].occupiedBy = divePlayer;
        let fruit = cpuMoveBoard.linearBoard[move].fruit;
        let friend = cpuMoveBoard.linearBoard[move].friend;

        let branchAvailableMoves = [];
        branchAvailableMoves = deepDiveAvailableMoves(cpuMoveBoard.linearBoard, fruit, friend); // Evaluate next available move set
        let moveScore = deepDive(cpuMoveBoard, branchAvailableMoves, divePlayer, depth);        // Recurse

        // Keep copy of max/min score
        // if computer player, returns the highest value
        // if simulated human, returns the lowest value
        if (divePlayer === 2 && bestMoveScore < moveScore){           
            bestMoveScore = moveScore;
            // Enable for alpha-beta
            // if (bestMoveScore === (100 + depthShift)){
            //     return bestMoveScore;
            // }
        }

        if (divePlayer === 1 && bestMoveScore > moveScore){            
            bestMoveScore = moveScore;
            // Enable for alpha-beta
            // if (bestMoveScore === (100 - depthShift)){
            //     return bestMoveScore;
            // }
        }

        // Enable for alpha-beta
        // if (bestMoveScore === ((100 + depthShift) * playerCoefficient)){
        //     return bestMoveScore;
        // }   



    }

    return (bestMoveScore);
}

// Seeds a recursive algorithm to determine the best possible move for a desired level of difficulty
// Requires a difficulty level
// Returns CPU move in [row, column] format
function cpuPlayerMoveGenerator(){
    
    let row = null;
    let column = null;
    let bestMoveScore = -1000;  // To approximate -infinity flag for minimax
    let bestMoveIndex = 0;      // Index of move with highest value

    //  Loop through all current valid moves and finds the move with the best possible outcome
    for (let i = 0; i < availableMoves.length; i++){
        let moveScore = 0;
        let moveCoords = availableMoves[i];
        let move = moveCoords[0] * 4 + moveCoords[1];       // Converts grid [row][col] layout into [index]
        let boardSeed = new AIBoard(linearGameBoard);       // Makes a copy of the current board for simulated moves

        // Makes simulated move
        boardSeed.linearBoard[move].occupiedBy = 2;
        let fruit = boardSeed.linearBoard[move].fruit;
        let friend = boardSeed.linearBoard[move].friend;
        let diveAvailableMoves = deepDiveAvailableMoves(boardSeed.linearBoard, fruit, friend);

        // Calls on deepDive() to return a score for that particular move branch
        // Function does depth-first search out of all possible moves up to 'cpuDifficulty' layers
        moveScore = deepDive(boardSeed, diveAvailableMoves, 2, cpuDifficulty);

        // Update best move score and associated index
        if (bestMoveScore < moveScore){
            bestMoveScore = moveScore;
            bestMoveIndex = i;
        }        

        // If unavoidable win is detected, stop search and take that path
        if (bestMoveScore === 100){
            break;
        }
    }

    row = availableMoves[bestMoveIndex][0] ;
    column = availableMoves[bestMoveIndex][1];

    console.log(`Best move score: ${bestMoveScore}`);   // How close you are to your doom!!!
    console.log(`Picked move: ${[row, column]}`);

    return([row, column])
}

// Initializes cpuDifficulty based on player wins/losses
function cpuPlayerInitialize(){
    let wins = players[0].wins;
    let losses = players[0].losses;
    let winLossDifference = wins - losses;

    console.log([wins, losses]);

    if (winLossDifference < 1){
        cpuDifficulty = 1;
    } else if (winLossDifference >= 12){
        cpuDifficulty = 12;
    } else {
        cpuDifficulty = winLossDifference + 1;
    }

    console.log(cpuDifficulty);
}


// ********************************************************
// **** Jeremy's Playground - For debugging purposes only
// *********************************************************


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




















