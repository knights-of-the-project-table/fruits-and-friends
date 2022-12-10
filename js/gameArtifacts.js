'use strict';

// File contains game artifacts

// BACKLOG: Update to have object literals for fruit options and friend options
//          Update TAG #729
const imageAssets = [['./img/assets/dog-banana.jpg', './img/assets/dragon-banana.jpg', './img/assets/kangaroo-banana.jpg', './img/assets/turtle-orange.jpg'], ['./img/assets/dog-orange.jpg', './img/assets/dragon-orange.jpg', './img/assets/kangaroo-orange.jpg', './img/assets/turtle-orange.jpg'], ['./img/assets/dog-strawberry.jpg', './img/assets/dragon-strawberry.jpg', './img/assets/kangaroo-strawberry.jpg', './img/assets/turtle-strawberry.jpg'], ['./img/assets/dog-watermelon.jpg', './img/assets/dragon-watermelon.jpg', './img/assets/kangaroo-watermelon.jpg', './img/assets/turtle-watermelon.jpg']];

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
  constructor(fruit, friend, imageSrc){
    this.fruit = fruit;
    this.friend = friend;
    this.occupiedBy = null;
    this.button = null;
    this.imageSrc = imageSrc;
  }
}

class PlayerData{
  constructor(){
    this.wins = 0;
    this.losses = 0;
    this.playerToken = null;
  }
}

// **************************
// **** For Testing Only*****
// **************************

let test = new GameBoard;
console.log(test);
