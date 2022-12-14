'use strict';

// Splash screen //

let intro = document.querySelector('.intro');
let logoSpan = document.querySelectorAll('.logo');

// 'DOMContentLoaded' triggers all the functions when the DOM content has been loaded //
// A callback function is executed after another function has finished execution. //

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    logoSpan.forEach((span, idx) => {
      setTimeout(() => {
        span.classList.add('active');
      }, (idx + 1) * 400);
    });
    setTimeout(() => {
      logoSpan.forEach((span, idx) => {
        setTimeout(() => {
          span.classList.remove('active');
          span.classList.add('fade');
        }, (idx + 1) * 50);
      });
    }, 2000);
    setTimeout(() => {
      intro.style.top = '-100vh';
    }, 2300);
  });
});

// Sidebar functionality //

let sidebarButton = document.querySelector('.sidebarButton');
let sidebarContent = document.querySelector('.sidebarContent');
let sidebar = document.querySelector('.sidebar');

sidebarButton.addEventListener('click', function () {
  sidebarButton.classList.toggle('buttonToggle');
  sidebarContent.classList.toggle('buttonToggle');
  sidebar.classList.toggle('buttonToggle');
});

// Username //

let userName = document.getElementById('userName1');
userName.addEventListener('submit', logUserName);

function logUserName(event) {
  event.preventDefault();
  let form = event.target;
  let playerOneName = form.nameText.value;
  players[0].name = playerOneName;
  // Only update the player status if a game has begun, i.e., if there is saved game data
  if (savedGameFile) {
    setCurrentPlayerStatus();
  }
  setScoreBoard();
  form.nameText.value = '';
  savePlayers(players);
}

let userName2 = document.getElementById('userName2');
userName2.addEventListener('submit', logUserName2);

function logUserName2(event) {
  event.preventDefault();
  let form = event.target;
  let playerTwoName = form.nameText2.value;
  players[1].name = playerTwoName;
  // Only update the player status if a game has begun, i.e., if there is saved game data
  if (savedGameFile) {
    setCurrentPlayerStatus();
  }
  setScoreBoard();
  form.nameText2.value = '';
  savePlayers(players);
}

