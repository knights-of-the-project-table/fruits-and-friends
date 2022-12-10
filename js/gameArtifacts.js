'use strict';

// File contains game artifacts

// BACKLOG: Update to have object literals for fruit options and friend options
//          Update TAG #729
const imageAssets = [['./img/assets/dog-banana.jpg', './img/assets/dragon-banana.jpg', './img/assets/kangaroo-banana.jpg', './img/assets/turtle-orange.jpg'], 
                    ['./img/assets/dog-orange.jpg', './img/assets/dragon-orange.jpg', './img/assets/kangaroo-orange.jpg', './img/assets/turtle-orange.jpg'],
                    ['./img/assets/dog-strawberry.jpg', './img/assets/dragon-strawberry.jpg', './img/assets/kangaroo-strawberry.jpg', './img/assets/turtle-strawberry.jpg'],
                    ['./img/assets/dog-watermelon.jpg', './img/assets/dragon-watermelon.jpg', './img/assets/kangaroo-watermelon.jpg', './img/assets/turtle-watermelon.jpg']];

// Generates and returns a new GameBoard object
function newGameBoard(){
  return new GameBoard;
}

// Restores, refactors, and returns a GameBoard object from local storage
function restoreGameBoard(){
  let storedGameBoard = JSON.parse(localStorage.getItem(`savedGameBoardState`));
  let instantiatedGameBoard = new GameBoard;
  let boardVersion

  for (i = 0; i < storedGameBoard.length; i++){
    for (j = 0; j < storedGameBoard.length; j++){
      let fruit = storedGameBoard[i][j][0];
      let friend = storedGameBoard[i][j][1];
      let imageSrc = storedGameBoard[i][j][2];
      let occupiedBy = storedGameBoard[i][j][3];

      boardVersion[i][j] = new GameboardTile(fruit, friend, imageSrc, occupiedBy);
    }
  }
  return instantiatedGameBoard;
}

// Takes in a game board (2D) and saves it in local storage
function saveGameBoard(board){
  localStorage.setItem(`savedGameBoardState`, JSON.stringify(board));
}

// Creates and returns a Players object which contains PlayerData
function newPlayers(){
  return new Players;
}

// Restores, refactors, and returns a Players object from local storage
function restorePlayers(){
  let storedPlayers = JSON.parse(localStorage.getItem(`savedPlayersState`));
  let instantiatedPlayers = new Players();

  for (let i = 0; i < storedPlayers.length; i++){
    let playerData = storedPlayers[i];
    let wins = playerData[0];
    let losses = playerData[1];
    let playerToken = playerData[2];
    let instancedPlayerData = new PlayerData(wins, losses, playerToken);
    instantiatedPlayers.push(instancedPlayerData);
  }
  
  return instantiatedPlayers;  
}

// Takes in a Players object and stores it in local storage
function savePlayers(players){
  localStorage.setItem(`savedPlayersState`, JSON.stringify(players));
}

// Clears local saved data for players (wins/losses/assigned token)
function resetPlayers(){
  localStorage.clear(`savedPlayersState`);
}

class GameBoard{
  constructor(){
    this.board = [];
    this.linearBoard = [];
    this.generate();
  }

  generate(){
    let tileDeck = [];
    let intList  =[];
    let position = [];

    for (let i = 0; i < 16; i++){
      intList.push(i);
    }

    while (intList.length > 0){
      let positionGenerator = Math.floor(Math.random() * intList.length);
      position.push(intList.splice(positionGenerator,1));
    }

    // Loops may be updated to 'for in' if fruits and friends are defined in object literals
    // TAG #729
    for (let i = 0; i < 4; i++){
      for (let j = 0; j < 4; j++){
        let newTile = new GameboardTile(i, j, imageAssets[i][j]);
        tileDeck.push([position.pop(), newTile]);
      }
    }

    for (let i = 0; i < 4; i++){
      this.board.push(new Array(4));
    }

    while (tileDeck.length > 0){
      let tile = tileDeck.pop();
      let row = Math.floor(tile[0] / 4);
      let column = tile[0] % 4;
      this.board[row][column] = tile[1];
    }

    for (let i = 0; i < this.board.length; i++){
      for (let j = 0; j < this.board[i].length; j++){
        this.linearBoard.push(this.board[i][j]);
      }
    }
  }
}

class GameboardTile{
  constructor(fruit, friend, imageSrc, occupiedBy = null){
    this.fruit = fruit;
    this.friend = friend;
    this.imageSrc = imageSrc;
    this.occupiedBy = occupiedBy;
    this.button = null;
  }
}

class Players{
  constructor(playerToken1 = null, playerToken2 = null){
    this.players = [];

    this.players.push(new PlayerData);
    this.players.push(new PlayerData);
    if (playerToken1) {
      this.players[0].playerToken = playerToken1;
    } else {
      this.players[0].playerToken = 'img/assets/black-token.svg';
    }
    if (playerToken2) {
      this.players[1].playerToken = playerToken2;
    } else {
      this.players[1].playerToken = 'img/assets/red-token.svg';
    }
  }
}

class PlayerData{
  constructor(wins = 0, losses = 0, playerToken = null){
    this.wins = wins;
    this.losses = losses;
    this.playerToken = playerToken;
  }
}

// **************************
// **** For Testing Only*****
// **************************

let test = new GameBoard;
console.log(test);
