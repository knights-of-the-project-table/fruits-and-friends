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

let playerOne = 'Player 1';
let submittedName = document.getElementById('submittedName');

let userName = document.getElementById('userName1');
userName.addEventListener('submit', logUserName);

function logUserName(event) {
  event.preventDefault();
  let form = event.target;
  playerOne = form.nameText.value;
  submittedName.innerText = playerOne;
  document.getElementById('gameStatus').innerText = `${playerOne}'s Turn`;
  form.nameText.value = '';
}

let playerTwo = 'Player 2';
let submittedName2 = document.getElementById('submittedName2');

let userName2 = document.getElementById('userName2');
userName2.addEventListener('submit', logUserName2);

function logUserName2(event) {
  event.preventDefault();
  let form = event.target;
  playerTwo = form.nameText2.value;
  submittedName2.innerText = playerTwo;
  form.nameText2.value = '';
}

