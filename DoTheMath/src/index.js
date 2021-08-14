import Game from './game1';

//BUG: Fix game over bug
// TODO: Add countdown before start timer

const num1 = document.querySelector('.number1');
const oper = document.querySelector('.operation');
const num2 = document.querySelector('.number2');
const btn1 = document.querySelector('#btn1');
const btn2 = document.querySelector('#btn2');
const btn3 = document.querySelector('#btn3');
let game1;
let upper;
let lower;
let mode;

function displayButtons() {
  num1.style.display = 'none';
  oper.style.display = 'none';
  num2.style.display = 'none';
  btn1.style.display = 'block';
  btn2.style.display = 'block';
  btn3.style.display = 'block';
}

function hideButtons() {
  num1.style.display = 'block';
  oper.style.display = 'block';
  num2.style.display = 'block';
  btn1.style.display = 'none';
  btn2.style.display = 'none';
  btn3.style.display = 'none';
}

function addListeners(game) {
  document.querySelector('.check').addEventListener('click', game.skip);
  document
    .querySelector('.guess')
    .addEventListener('keypress', function (event) {
      // console.log(`Key pressed: ${event.key}`);
      if (event.key === 'Enter' && game.gameState) {
        const guess = Number(document.querySelector('.guess').value);
        document.querySelector('.guess').value = '';
        game.makeGuess(guess);
      } else if (event.key === 'Enter' && !game.gameState) {
        // console.log(`Game over in index.js showing`);
        game.displayMessage(`The game hasn't started yet!`);
        // setTimeout(game.endGame, 2000);
      }
    });

  document.querySelector('.again').addEventListener('click', game.restart);

  document.querySelector('.back').addEventListener('click', () => {
    goHome(game);
  });
}

function removeListeners(game) {
  document.querySelector('.check').removeEventListener('click', game.makeGuess);
  document
    .querySelector('.guess')
    .removeEventListener('keypress', function (event) {
      // console.log(`Key pressed: ${event.key}`);
      if (event.key === 'Enter' && game.gameState) {
        const guess = Number(document.querySelector('.guess').value);
        document.querySelector('.guess').value = '';
        game.makeGuess(guess);
      } else if (event.key === 'Enter' && !game.gameState) {
        // console.log(`Removed EL`);
        game.displayMessage(`The game is already over!`);
        setTimeout(game.endGame, 2000);
      }
    });

  document.querySelector('.again').removeEventListener('click', game.restart);
}

function goHome(game) {
  if (game.gameState) {
    game.endGame();
    document.querySelector('h1').innerText = 'Choose your game mode';
  }
  document.querySelector('h2').style.display = 'none';
  document.querySelector('h1').style.top = '45%';
  document.querySelector('.number1').textContent = '?';
  document.querySelector('.number2').textContent = '?';
  document.querySelector('.guess').value = '';
  document.querySelector('body').style.backgroundColor = '#222';
  removeListeners(game);
  displayButtons();
}

function grabLowerValue() {
  document.querySelector('.check').removeEventListener('click', grabLowerValue);
  // document
  //   .querySelector('.guess')
  //   .removeEventListener('keypress', function (event) {
  //     // console.log(`Key pressed: ${event.key}`);
  //     if (event.key === 'Enter') {
  //       grabLowerValue();
  //     }
  //   });
  lower = Number(document.querySelector('.guess').value);
  // console.log(`Setting lower limit to ${lower}`);
  document.querySelector('.guess').value = '';
  document.querySelector(
    '.between'
  ).innerText = `(Between ${lower} and ${upper})`;

  // If button 1 - timed mode
  if (mode === 'timed') {
    game1 = new Game(upper, lower);
    game1.mode = mode;
    game1.startGame();
    setTimeout(() => {
      game1.setTimer(60);
    }, 3000);

    // If button 2 - Round mode
  } else if (mode === 'rounds') {
    game1 = new Game(upper, lower, 25);
    document.querySelector('h1').innerText = `Do the Math!`;
    game1.mode = mode;
    game1.startGame();
    // else button 3 - speed mode
  } else {
    game1 = new Game(upper, lower);
    game1.mode = mode;
    game1.speedMode();
  }

  addListeners(game1);
}

function grabUpperValue() {
  upper = Number(document.querySelector('.guess').value);
  // console.log(`Setting upper limit to ${upper}`);
  document.querySelector('.guess').value = '';
  document.querySelector('.check').removeEventListener('click', grabUpperValue);
  // document
  //   .querySelector('.guess')
  //   .removeEventListener('keypress', function (event) {
  //     // console.log(`Key pressed: ${event.key}`);
  //     if (event.key === 'Enter') {
  //       grabUpperValue();
  //     }
  //   });
  document.querySelector('h1').innerText = 'Choose lower limit';
  document.querySelector('.check').addEventListener('click', grabLowerValue);
  // document
  //   .querySelector('.guess')
  //   .addEventListener('keypress', function (event) {
  //     // console.log(`Key pressed: ${event.key}`);
  //     if (event.key === 'Enter') {
  //       grabLowerValue();
  //     }
  //   });
}

function chooseLimit() {
  hideButtons();
  document.querySelector('h1').innerText = 'Choose upper limit';

  document.querySelector('.check').addEventListener('click', grabUpperValue);

  // document
  //   .querySelector('.guess')
  //   .addEventListener('keypress', function (event) {
  //     // console.log(`Key pressed: ${event.key}`);
  //     if (event.key === 'Enter') {
  //       grabUpperValue(btnID);
  //     }
  //   });
}

document.querySelector('h1').innerText = `Choose your game mode`;
displayButtons();

btn1.addEventListener('click', () => {
  hideButtons();
  chooseLimit();
  mode = 'timed';
});

btn2.addEventListener('click', () => {
  hideButtons();
  chooseLimit();
  mode = 'rounds';
});

btn3.addEventListener('click', () => {
  hideButtons();
  chooseLimit();
  mode = 'speed';
});
