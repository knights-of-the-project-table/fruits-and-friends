'use strict';

// File contains game artifacts

// BACKLOG: Update to have object literals for fruit options and friend options
//          Update TAG #729

class GameBoard{
  constructor(){
    this.board = [];
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
        let newTile = new GameboardTile(i, j);
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
  }
}

class GameboardTile{
  constructor(fruit, friend){
    this.fruit = fruit;
    this.friend = friend;
    this.occupiedBy = null;
  }
}


// **************************
// **** For Testing Only*****
// **************************

let test = new GameBoard;
console.log(test);
