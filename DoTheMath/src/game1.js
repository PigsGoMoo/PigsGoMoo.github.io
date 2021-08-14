export default class Game {
  constructor(maxVal, minVal = 1, rounds = Infinity) {
    // The upper limit of multiplication
    this.high = maxVal > minVal ? maxVal : minVal + 1;
    // The lower limit of multiplication
    // Cannot be less than 0
    this.low = minVal >= 0 ? 1 : minVal;
    // Number of rounds - also cannot be <= 0
    this.rounds = rounds <= 0 ? 1 : rounds;

    // To keep track of game mode for restart purposes
    this.mode = '';

    // To keep track of current round
    this.currRound = 1;
    // Keep track of current game state
    this.gameState = false;
    // Number of wrong guesses
    this.wrong = 0;
    // Total num of guesses
    this.guesses = 0;

    // Current score
    this.score = 0;
    // Highest score this session
    this.highscore = 0;

    // First and second num to be multiplied together to get ans
    this.firstNum = 0;
    this.secondNum = 0;
    this.ans = 0;

    // Dict of seen values
    this.seen = {};

    // Timers
    this.timer = 60;
    this.timerActive = false;
    this.speedTimer = 5;
    this.startTime = 3;

    // Bindings
    this.skip = this.skip.bind(this);
    this.tickTimer = this.tickTimer.bind(this);
    this.speedModeHelper = this.speedModeHelper.bind(this);
    this.speedMode = this.speedMode.bind(this);
    this.startGame = this.startGame.bind(this);
    this.startRound = this.startRound.bind(this);
    this.endGame = this.endGame.bind(this);
    this.makeGuess = this.makeGuess.bind(this);
    this.restart = this.restart.bind(this);
    this.setTimer = this.setTimer.bind(this);
    this.timerTick = this.timerTick.bind(this);
  }

  // Method to grab a new batch of numbers
  startRound() {
    // If less than total rounds
    if (this.gameState && this.currRound <= this.rounds) {
      if (this.mode === 'speed') {
        this.speedTimer = 5;
        document.querySelector(
          'h2'
        ).innerText = `Round time: ${this.speedTimer}`;
      } else if (this.mode === 'rounds') {
        document.querySelector(
          'h1'
        ).innerText = `Current round: ${this.currRound}`;
      }
      this.firstNum =
        Math.floor(Math.random() * (this.high - this.low)) + this.low;
      this.secondNum =
        Math.floor(Math.random() * (this.high - this.low)) + this.low;
      while (
        this.seen[this.firstNum] &&
        this.seen[this.firstNum][this.secondNum]
      ) {
        console.log(
          `${this.firstNum} and ${this.secondNum} already asked. Rerolling values`
        );
        this.firstNum =
          Math.floor(Math.random() * (this.high - this.low)) + this.low;
        this.secondNum =
          Math.floor(Math.random() * (this.high - this.low)) + this.low;
      }
      if (!this.seen[this.firstNum]) {
        this.seen[this.firstNum] = { [this.secondNum]: true };
      } else {
        this.seen[this.firstNum][this.secondNum] = true;
      }
      console.log(`Seen values: ${JSON.stringify(this.seen)}`);
      this.ans = this.firstNum * this.secondNum;

      this.displayMessage('Start guessing...');
      document.querySelector('.score').textContent = this.score;
      document.querySelector('.number1').textContent = this.firstNum;
      document.querySelector('.number2').textContent = this.secondNum;
      document.querySelector('.guess').value = '';
      document.querySelector('body').style.backgroundColor = '#222';
      document.querySelector('.number1').style.width = '15rem';
      document.querySelector('.number2').style.width = '15rem';
    } else {
      this.endGame();
    }
  }

  startGame() {
    console.log(
      `Starting game with upper limit of ${this.high} and lower limit of ${this.low}. ${this.rounds} rounds`
    );
    this.startTime = 3;
    document.querySelector(
      'h1'
    ).innerText = `Game starts in: ${this.startTime}. . .`;
    this.startTimer = setInterval(this.tickTimer, 1000);
    setTimeout(() => {
      console.log(`Game started`);
      this.gameState = true;
      this.startRound();
    }, 3000);
  }

  tickTimer() {
    this.startTime--;
    console.log(`Starting in...${this.startTime}`);
    document.querySelector(
      'h1'
    ).innerText = `Game starts in: ${this.startTime}. . .`;
    if (this.startTime === 0) {
      this.stopTimer(this.startTimer);
    }
  }
  endGame() {
    this.gameState = false;
    const percent = (100 - (this.wrong / this.guesses) * 100).toFixed(2);
    this.displayMessage(
      `Game over!\nYour final score is: ${this.score}\nYou made ${
        this.wrong
      } wrong guesses\nThat's a ${isNaN(percent) ? 0 : percent}% answer rate`
    );
    this.seen = {};
    if (this.timerActive) {
      this.stopTimer(this.ticker);
      if (this.mode === 'speed') {
        this.stopTimer(this.speedModeTimer);
      }
    }
  }

  makeGuess(guess) {
    // console.log(guess, typeof guess);

    // When there is no input
    if (!guess) {
      // document.querySelector('.message').textContent = '⛔️ No number!';
      this.displayMessage('⛔️ No number!');

      // When player wins
    } else if (guess === this.ans) {
      // document.querySelector('.message').textContent = '🎉 Correct Number!';
      this.displayMessage('🎉 Correct Number!');
      // document.querySelector('.number').textContent = ans;

      document.querySelector('body').style.backgroundColor = '#60b347';
      // document.querySelector('.number').style.width = '30rem';
      this.score++;

      if (this.score > this.highscore) {
        this.highscore = this.score;
        document.querySelector('.highscore').textContent = this.highscore;
      }
      this.currRound++;
      setTimeout(this.startRound, 500);

      // When guess is wrong
    } else if (guess !== this.ans) {
      this.displayMessage(guess > this.ans ? '📈 Too high!' : '📉 Too low!');
      document.querySelector('body').style.backgroundColor = '#ff0000';
      this.wrong++;
      this.score--;
    }
    this.guesses++;
  }

  displayMessage(message) {
    document.querySelector('.message').innerText = message;
  }

  setTimer(time = 60) {
    this.timer = time;
    this.timerActive = true;
    this.ticker = setInterval(() => {
      this.timerTick(this.ticker);
    }, 1000);
    document.querySelector('h1').innerText = `Time remaining: ${this.timer}`;
  }

  timerTick(timer) {
    console.log(`tick`);
    this.timer--;
    document.querySelector('h1').innerText = `Time remaining: ${this.timer}`;
    if (this.timer <= 0) {
      console.log(`Time over`);
      this.endGame();
      this.stopTimer(timer);
      this.timerActive = false;
    }
  }

  stopTimer(timer) {
    clearInterval(timer);
  }

  speedModeHelper() {
    this.speedTimer--;
    document.querySelector('h2').innerText = `Round time: ${this.speedTimer}`;
    if (this.speedTimer === 0) {
      this.speedTimer = 5;
      this.startRound();
    }
  }

  speedMode() {
    document.querySelector('h2').style.display = 'block';
    document.querySelector('h2').innerText = `Round time: 5`;
    document.querySelector('h1').style.top = '30%';
    this.startGame();
    setTimeout(() => {
      this.speedModeTimer = setInterval(this.speedModeHelper, 1000);
      this.setTimer(90);
    }, 3000);
  }

  skip() {
    if (this.mode === 'speed') return;
    this.wrong++;
    this.score--;
    this.guesses++;
    this.currRound++;
    this.startRound();
  }

  restart() {
    this.endGame();
    document.querySelector('.number1').textContent = '?';
    document.querySelector('.number2').textContent = '?';
    this.currRound = 1;
    this.wrong = 0;
    this.guesses = 0;
    this.score = 0;
    switch (this.mode) {
      case 'timed': {
        this.startGame();
        setTimeout(() => {
          this.setTimer(60);
        }, 3000);
        break;
      }
      case 'rounds': {
        this.startGame();
        break;
      }
      case 'speed': {
        this.speedMode();
        break;
      }
      default: {
        console.log(`An error occurred: No mode found`);
        break;
      }
    }
  }
}
