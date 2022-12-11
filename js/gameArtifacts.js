'use strict';

// File contains game artifacts

// Board dimensions
const BOARD_WIDTH = 4;
const BOARD_HEIGHT = 4;
const BOARD_AREA = BOARD_WIDTH * BOARD_HEIGHT;

// Generates and returns a new GameBoard object
function newGameBoard(){
  return new GameBoard;
}

// Restores, refactors, and returns a GameBoard object from local storage
function restoreGameBoard(){
  let storedGameBoard = JSON.parse(localStorage.getItem('savedGameBoardState'));
  let instantiatedGameBoard = new GameBoard;
  let boardVersion = instantiatedGameBoard.board;

  for (let i = 0; i < storedGameBoard.length; i++){
    for (let j = 0; j < storedGameBoard.length; j++){
      let fruit = storedGameBoard[i][j].fruit;
      let friend = storedGameBoard[i][j].friend;
      let imageSrc = storedGameBoard[i][j].imageSrc;
      let occupiedBy = storedGameBoard[i][j].occupiedBy;

      boardVersion[i][j] = new GameboardTile(fruit, friend, imageSrc, occupiedBy);
    }
  }
  return instantiatedGameBoard;
}

// Takes in a game board (2D) and saves it in local storage
function saveGameBoard(board){
  localStorage.setItem('savedGameBoardState', JSON.stringify(board));
}

// Creates and returns a Players object which contains PlayerData
function newPlayers(){
  return new Players;
}

// Restores, refactors, and returns a Players object from local storage
function restorePlayers(){
  let storedPlayers = JSON.parse(localStorage.getItem('savedPlayersState'));
  let instantiatedPlayers = new Players();

  for (let i = 0; i < storedPlayers.length; i++){
    let playerData = storedPlayers[i];
    let wins = playerData.wins;
    let losses = playerData.losses;
    let playerToken = playerData.playerToken;
    let instancedPlayerData = new PlayerData(wins, losses, playerToken);
    instantiatedPlayers.players[i] = instancedPlayerData;
  }

  return instantiatedPlayers;
}

// Takes in a players array and stores it in local storage
function savePlayers(players){
  localStorage.setItem('savedPlayersState', JSON.stringify(players));
}

// Clears local saved data for players (wins/losses/assigned token)
function resetPlayers(){
  localStorage.clear('savedPlayersState');
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

    for (let i = 0; i < BOARD_AREA; i++){
      intList.push(i);
    }

    while (intList.length > 0){
      let positionGenerator = Math.floor(Math.random() * intList.length);
      position.push(intList.splice(positionGenerator,1));
    }

    gameBoardTiles.forEach((gameBoardTile) => {
      tileDeck.push([position.pop(), gameBoardTile]);
    });

    for (let i = 0; i < BOARD_HEIGHT; i++){
      this.board.push(new Array(4).fill(0));
    }

    while (tileDeck.length > 0){
      let tile = tileDeck.pop();
      let row = Math.floor(tile[0] / BOARD_WIDTH);
      let column = tile[0] % BOARD_HEIGHT;
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
      this.players[0].playerToken = './img/assets/player-tokens/black-token.svg';
    }
    if (playerToken2) {
      this.players[1].playerToken = playerToken2;
    } else {
      this.players[1].playerToken = './img/assets/player-tokens/red-token.svg';
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

const gameBoardTiles = [
  new GameboardTile('banana', 'dog', './img/assets/tiles/banana-dog.jpg'),
  new GameboardTile('banana', 'dragon', './img/assets/tiles/banana-dragon.jpg'),
  new GameboardTile('banana', 'kangaroo', './img/assets/tiles/banana-kangaroo.jpg'),
  new GameboardTile('banana', 'turtle', './img/assets/tiles/banana-turtle.jpg'),
  new GameboardTile('orange', 'dog', './img/assets/tiles/orange-dog.jpg'),
  new GameboardTile('orange', 'dragon', './img/assets/tiles/orange-dragon.jpg'),
  new GameboardTile('orange', 'kangaroo', './img/assets/tiles/orange-kangaroo.jpg'),
  new GameboardTile('orange', 'turtle', './img/assets/tiles/orange-turtle.jpg'),
  new GameboardTile('strawberry', 'dog', './img/assets/tiles/strawberry-dog.jpg'),
  new GameboardTile('strawberry', 'dragon', './img/assets/tiles/strawberry-dragon.jpg'),
  new GameboardTile('strawberry', 'kangaroo', './img/assets/tiles/strawberry-kangaroo.jpg'),
  new GameboardTile('strawberry', 'turtle', './img/assets/tiles/strawberry-turtle.jpg'),
  new GameboardTile('watermelon', 'dog', './img/assets/tiles/watermelon-dog.jpg'),
  new GameboardTile('watermelon', 'dragon', './img/assets/tiles/watermelon-dragon.jpg'),
  new GameboardTile('watermelon', 'kangaroo', './img/assets/tiles/watermelon-kangaroo.jpg'),
  new GameboardTile('watermelon', 'turtle', './img/assets/tiles/watermelon-turtle.jpg'),
];

// **************************
// **** For Testing Only*****
// **************************
