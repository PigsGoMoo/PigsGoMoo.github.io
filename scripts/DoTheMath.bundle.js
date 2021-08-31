/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./DoTheMath/src/game1.js":
/*!********************************!*\
  !*** ./DoTheMath/src/game1.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Game)\n/* harmony export */ });\nclass Game {\r\n  constructor(maxVal, minVal = 1, rounds = Infinity) {\r\n    // The upper limit of multiplication\r\n    this.high = maxVal > minVal ? maxVal : minVal + 1;\r\n    // The lower limit of multiplication\r\n    // Cannot be less than 0\r\n    this.low = minVal >= 0 ? minVal : 1;\r\n    // Number of rounds - also cannot be <= 0\r\n    this.rounds = rounds <= 0 ? 1 : rounds;\r\n    // The operations to use\r\n    this.operations = [];\r\n\r\n    // To keep track of game mode for restart purposes\r\n    this.mode = '';\r\n\r\n    // To keep track of current round\r\n    this.currRound = 1;\r\n    // Keep track of current game state\r\n    this.gameState = false;\r\n    // Number of wrong guesses\r\n    this.wrong = 0;\r\n    // Total num of guesses\r\n    this.guesses = 0;\r\n\r\n    // Current score\r\n    this.score = 0;\r\n    // Highest score this session\r\n    this.highscore = 0;\r\n\r\n    // First and second num to be multiplied together to get ans\r\n    this.firstNum = 0;\r\n    this.secondNum = 0;\r\n    this.ans = 0;\r\n\r\n    // Dict of seen values\r\n    this.seen = {};\r\n\r\n    // Timers\r\n    this.timer = 60;\r\n    this.timerActive = false;\r\n    this.speedTimer = 5;\r\n    this.startTime = 3;\r\n\r\n    // Bindings\r\n    this.skip = this.skip.bind(this);\r\n    this.tickTimer = this.tickTimer.bind(this);\r\n    this.speedModeHelper = this.speedModeHelper.bind(this);\r\n    this.speedMode = this.speedMode.bind(this);\r\n    this.startGame = this.startGame.bind(this);\r\n    this.startRound = this.startRound.bind(this);\r\n    this.endGame = this.endGame.bind(this);\r\n    this.makeGuess = this.makeGuess.bind(this);\r\n    this.restart = this.restart.bind(this);\r\n    this.setTimer = this.setTimer.bind(this);\r\n    this.timerTick = this.timerTick.bind(this);\r\n  }\r\n\r\n  // Method to grab a new batch of numbers\r\n  startRound() {\r\n    // If less than total rounds\r\n    if (this.gameState && this.currRound <= this.rounds) {\r\n      if (this.mode === 'speed') {\r\n        this.speedTimer = 5;\r\n        document.querySelector(\r\n          'h2'\r\n        ).innerText = `Round time: ${this.speedTimer}`;\r\n      } else if (this.mode === 'rounds') {\r\n        document.querySelector(\r\n          'h1'\r\n        ).innerText = `Current round: ${this.currRound}`;\r\n      }\r\n      this.firstNum =\r\n        Math.floor(Math.random() * (this.high - this.low + 1)) + this.low;\r\n      this.secondNum =\r\n        Math.floor(Math.random() * (this.high - this.low + 1)) + this.low;\r\n\r\n      // console.log(`Seen values: ${JSON.stringify(this.seen)}`);\r\n      this.ans = this.findAnswer();\r\n\r\n      this.displayMessage('Start guessing...');\r\n      document.querySelector('.score').textContent = this.score;\r\n      document.querySelector('.number1').textContent = this.firstNum;\r\n      document.querySelector('.number2').textContent = this.secondNum;\r\n      document.querySelector('.guess').value = '';\r\n      document.querySelector('body').style.backgroundColor = '#222';\r\n      document.querySelector('.number1').style.width = '15rem';\r\n      document.querySelector('.number2').style.width = '15rem';\r\n    } else {\r\n      this.endGame();\r\n    }\r\n  }\r\n\r\n  findAnswer() {\r\n    const oper = Math.floor(Math.random() * this.operations.length);\r\n    // console.log(`oper: ${this.operations[oper]}`);\r\n    const op = this.operations[oper];\r\n\r\n    while (\r\n      this.seen[this.firstNum] &&\r\n      this.seen[this.firstNum][this.secondNum] &&\r\n      this.seen[this.firstNum][this.secondNum].includes(op)\r\n    ) {\r\n      // console.log(\r\n      //   `${this.firstNum} and ${this.secondNum} already asked. Rerolling values`\r\n      // );\r\n      this.firstNum =\r\n        Math.floor(Math.random() * (this.high - this.low + 1)) + this.low;\r\n      this.secondNum =\r\n        Math.floor(Math.random() * (this.high - this.low + 1)) + this.low;\r\n    }\r\n    if (\r\n      !this.seen[this.firstNum] ||\r\n      !this.seen[this.firstNum][this.secondNum]\r\n    ) {\r\n      this.seen[this.firstNum] = { [this.secondNum]: [op] };\r\n    } else {\r\n      this.seen[this.firstNum][this.secondNum].push(op);\r\n    }\r\n    console.log(this.seen);\r\n\r\n    const opBox = document.querySelector('.operation');\r\n\r\n    switch (op) {\r\n      case '+': {\r\n        opBox.innerText = '+';\r\n        return this.firstNum + this.secondNum;\r\n      }\r\n      case '-': {\r\n        opBox.innerText = '-';\r\n        if (this.firstNum < this.secondNum) {\r\n          const temp = this.secondNum;\r\n          this.secondNum = this.firstNum;\r\n          this.firstNum = temp;\r\n        }\r\n        return this.firstNum - this.secondNum;\r\n      }\r\n      case 'x': {\r\n        opBox.innerText = 'x';\r\n        return this.firstNum * this.secondNum;\r\n      }\r\n      default: {\r\n        console.log(`Operation not found`);\r\n        opBox.innerText = 'x';\r\n        return this.firstNum * this.secondNum;\r\n      }\r\n    }\r\n  }\r\n\r\n  startGame() {\r\n    // console.log(\r\n    //   `Starting game with upper limit of ${this.high} and lower limit of ${this.low}. ${this.rounds} rounds\\nAvailable operations:`\r\n    // );\r\n    // console.log(this.operations);\r\n    this.startTime = 3;\r\n    document.querySelector(\r\n      'h1'\r\n    ).innerText = `Game starts in: ${this.startTime}. . .`;\r\n    this.startTimer = setInterval(this.tickTimer, 1000);\r\n    setTimeout(() => {\r\n      // console.log(`Game started`);\r\n      this.gameState = true;\r\n      this.startRound();\r\n    }, 3000);\r\n  }\r\n\r\n  tickTimer() {\r\n    this.startTime--;\r\n    // console.log(`Starting in...${this.startTime}`);\r\n    document.querySelector(\r\n      'h1'\r\n    ).innerText = `Game starts in: ${this.startTime}. . .`;\r\n    if (this.startTime === 0) {\r\n      this.stopTimer(this.startTimer);\r\n    }\r\n  }\r\n\r\n  endGame() {\r\n    this.gameState = false;\r\n    const percent = (100 - (this.wrong / this.guesses) * 100).toFixed(2);\r\n    this.displayMessage(\r\n      `Game over!\\nYour final score is: ${this.score}\\nYou made ${\r\n        this.wrong\r\n      } wrong guesses\\nThat's a ${isNaN(percent) ? 0 : percent}% answer rate`\r\n    );\r\n    this.seen = {};\r\n    if (this.timerActive) {\r\n      this.stopTimer(this.ticker);\r\n      if (this.mode === 'speed') {\r\n        this.stopTimer(this.speedModeTimer);\r\n      }\r\n    }\r\n  }\r\n\r\n  makeGuess(guess) {\r\n    // console.log(guess, typeof guess);\r\n\r\n    // When there is no input\r\n    if (!guess && guess !== 0) {\r\n      // document.querySelector('.message').textContent = '⛔️ No number!';\r\n      this.displayMessage('⛔️ No number!');\r\n\r\n      // When player wins\r\n    } else if (guess === this.ans) {\r\n      // document.querySelector('.message').textContent = '🎉 Correct Number!';\r\n      this.displayMessage('🎉 Correct Number!');\r\n      // document.querySelector('.number').textContent = ans;\r\n\r\n      document.querySelector('body').style.backgroundColor = '#60b347';\r\n      // document.querySelector('.number').style.width = '30rem';\r\n      this.score++;\r\n\r\n      if (this.score > this.highscore) {\r\n        this.highscore = this.score;\r\n        document.querySelector('.highscore').textContent = this.highscore;\r\n      }\r\n      this.currRound++;\r\n      setTimeout(this.startRound, 500);\r\n\r\n      // When guess is wrong\r\n    } else if (guess !== this.ans) {\r\n      this.displayMessage(guess > this.ans ? '📈 Too high!' : '📉 Too low!');\r\n      document.querySelector('body').style.backgroundColor = '#ff0000';\r\n      this.wrong++;\r\n      this.score--;\r\n    }\r\n    this.guesses++;\r\n  }\r\n\r\n  displayMessage(message) {\r\n    document.querySelector('.message').innerText = message;\r\n  }\r\n\r\n  setTimer(time = 60) {\r\n    this.timer = time;\r\n    this.timerActive = true;\r\n    this.ticker = setInterval(() => {\r\n      this.timerTick(this.ticker);\r\n    }, 1000);\r\n    document.querySelector('h1').innerText = `Time remaining: ${this.timer}`;\r\n  }\r\n\r\n  timerTick(timer) {\r\n    // console.log(`tick`);\r\n    this.timer--;\r\n    document.querySelector('h1').innerText = `Time remaining: ${this.timer}`;\r\n    if (this.timer <= 0) {\r\n      // console.log(`Time over`);\r\n      this.endGame();\r\n      this.stopTimer(timer);\r\n      this.timerActive = false;\r\n    }\r\n  }\r\n\r\n  stopTimer(timer) {\r\n    clearInterval(timer);\r\n  }\r\n\r\n  speedModeHelper() {\r\n    this.speedTimer--;\r\n    document.querySelector('h2').innerText = `Round time: ${this.speedTimer}`;\r\n    if (this.speedTimer === 0) {\r\n      this.speedTimer = 5;\r\n      this.startRound();\r\n    }\r\n  }\r\n\r\n  speedMode() {\r\n    document.querySelector('h2').style.display = 'block';\r\n    document.querySelector('h2').innerText = `Round time: 5`;\r\n    document.querySelector('h1').style.top = '30%';\r\n    this.startGame();\r\n    setTimeout(() => {\r\n      this.speedModeTimer = setInterval(this.speedModeHelper, 1000);\r\n      this.setTimer(90);\r\n    }, 3000);\r\n  }\r\n\r\n  skip() {\r\n    if (this.mode === 'speed') return;\r\n    this.wrong++;\r\n    this.score--;\r\n    this.guesses++;\r\n    this.currRound++;\r\n    this.startRound();\r\n  }\r\n\r\n  restart() {\r\n    this.endGame();\r\n    document.querySelector('.number1').textContent = '?';\r\n    document.querySelector('.number2').textContent = '?';\r\n    this.currRound = 1;\r\n    this.wrong = 0;\r\n    this.guesses = 0;\r\n    this.score = 0;\r\n    switch (this.mode) {\r\n      case 'timed': {\r\n        this.startGame();\r\n        setTimeout(() => {\r\n          this.setTimer(60);\r\n        }, 3000);\r\n        break;\r\n      }\r\n      case 'rounds': {\r\n        this.startGame();\r\n        break;\r\n      }\r\n      case 'speed': {\r\n        this.speedMode();\r\n        break;\r\n      }\r\n      default: {\r\n        console.log(`An error occurred: No mode found`);\r\n        break;\r\n      }\r\n    }\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack://Gub/./DoTheMath/src/game1.js?");

/***/ }),

/***/ "./DoTheMath/src/index.js":
/*!********************************!*\
  !*** ./DoTheMath/src/index.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game1 */ \"./DoTheMath/src/game1.js\");\n\r\n\r\nconst num1 = document.querySelector('.number1');\r\nconst oper = document.querySelector('.operation');\r\nconst num2 = document.querySelector('.number2');\r\nconst btn1 = document.querySelector('#btn1');\r\nconst btn2 = document.querySelector('#btn2');\r\nconst btn3 = document.querySelector('#btn3');\r\nlet game1;\r\nlet upper;\r\nlet lower;\r\nlet mode;\r\n\r\nfunction displayButtons() {\r\n  num1.style.display = 'none';\r\n  oper.style.display = 'none';\r\n  num2.style.display = 'none';\r\n  btn1.style.display = 'block';\r\n  btn2.style.display = 'block';\r\n  btn3.style.display = 'block';\r\n}\r\n\r\nfunction hideButtons() {\r\n  num1.style.display = 'block';\r\n  oper.style.display = 'block';\r\n  num2.style.display = 'block';\r\n  btn1.style.display = 'none';\r\n  btn2.style.display = 'none';\r\n  btn3.style.display = 'none';\r\n}\r\n\r\nfunction addListeners(game) {\r\n  document.querySelector('.check').addEventListener('click', game.skip);\r\n  document\r\n    .querySelector('.guess')\r\n    .addEventListener('keypress', function (event) {\r\n      // console.log(`Key pressed: ${event.key}`);\r\n      if (event.key === 'Enter' && game.gameState) {\r\n        const guess = Number(document.querySelector('.guess').value);\r\n        document.querySelector('.guess').value = '';\r\n        game.makeGuess(guess);\r\n      } else if (event.key === 'Enter' && !game.gameState) {\r\n        // console.log(`Game over in index.js showing`);\r\n        game.displayMessage(`The game hasn't started yet!`);\r\n        // setTimeout(game.endGame, 2000);\r\n      }\r\n    });\r\n\r\n  document.querySelector('.again').addEventListener('click', game.restart);\r\n\r\n  document.querySelector('.back').addEventListener('click', () => {\r\n    goHome(game);\r\n  });\r\n}\r\n\r\nfunction removeListeners(game) {\r\n  document.querySelector('.check').removeEventListener('click', game.makeGuess);\r\n  document\r\n    .querySelector('.guess')\r\n    .removeEventListener('keypress', function (event) {\r\n      // console.log(`Key pressed: ${event.key}`);\r\n      if (event.key === 'Enter' && game.gameState) {\r\n        const guess = Number(document.querySelector('.guess').value);\r\n        document.querySelector('.guess').value = '';\r\n        game.makeGuess(guess);\r\n      } else if (event.key === 'Enter' && !game.gameState) {\r\n        // console.log(`Removed EL`);\r\n        game.displayMessage(`The game is already over!`);\r\n        setTimeout(game.endGame, 2000);\r\n      }\r\n    });\r\n\r\n  document.querySelector('.again').removeEventListener('click', game.restart);\r\n}\r\n\r\nfunction goHome(game) {\r\n  if (game.gameState) {\r\n    game.endGame();\r\n    document.querySelector('h1').innerText = 'Choose your game mode';\r\n  }\r\n  btn1.innerText = 'Timed';\r\n  btn2.innerText = 'Rounds';\r\n  btn3.innerText = 'Speed';\r\n  addBtnListeners();\r\n  document.querySelector('h2').style.display = 'none';\r\n  document.querySelector('h1').style.top = '45%';\r\n  document.querySelector('.number1').textContent = '?';\r\n  document.querySelector('.number2').textContent = '?';\r\n  document.querySelector('.guess').value = '';\r\n  document.querySelector('body').style.backgroundColor = '#222';\r\n  removeListeners(game);\r\n  displayButtons();\r\n}\r\n\r\nfunction grabLowerValue() {\r\n  document.querySelector('.check').removeEventListener('click', grabLowerValue);\r\n  // document\r\n  //   .querySelector('.guess')\r\n  //   .removeEventListener('keypress', function (event) {\r\n  //     // console.log(`Key pressed: ${event.key}`);\r\n  //     if (event.key === 'Enter') {\r\n  //       grabLowerValue();\r\n  //     }\r\n  //   });\r\n  lower = Number(document.querySelector('.guess').value);\r\n  // console.log(`Setting lower limit to ${lower}`);\r\n  document.querySelector('.guess').value = '';\r\n  document.querySelector(\r\n    '.between'\r\n  ).innerText = `(Between ${lower} and ${upper})`;\r\n\r\n  chooseOperations();\r\n}\r\n\r\nfunction grabUpperValue() {\r\n  upper = Number(document.querySelector('.guess').value);\r\n  // console.log(`Setting upper limit to ${upper}`);\r\n  document.querySelector('.guess').value = '';\r\n  document.querySelector('.check').removeEventListener('click', grabUpperValue);\r\n  // document\r\n  //   .querySelector('.guess')\r\n  //   .removeEventListener('keypress', function (event) {\r\n  //     // console.log(`Key pressed: ${event.key}`);\r\n  //     if (event.key === 'Enter') {\r\n  //       grabUpperValue();\r\n  //     }\r\n  //   });\r\n  document.querySelector('h1').innerText = 'Choose lower limit';\r\n  document.querySelector('.check').addEventListener('click', grabLowerValue);\r\n  // document\r\n  //   .querySelector('.guess')\r\n  //   .addEventListener('keypress', function (event) {\r\n  //     // console.log(`Key pressed: ${event.key}`);\r\n  //     if (event.key === 'Enter') {\r\n  //       grabLowerValue();\r\n  //     }\r\n  //   });\r\n}\r\n\r\nfunction chooseLimit() {\r\n  hideButtons();\r\n  document.querySelector('h1').innerText = 'Choose upper limit';\r\n\r\n  document.querySelector('.check').addEventListener('click', grabUpperValue);\r\n\r\n  // document\r\n  //   .querySelector('.guess')\r\n  //   .addEventListener('keypress', function (event) {\r\n  //     // console.log(`Key pressed: ${event.key}`);\r\n  //     if (event.key === 'Enter') {\r\n  //       grabUpperValue(btnID);\r\n  //     }\r\n  //   });\r\n}\r\n\r\nfunction chooseOperations() {\r\n  displayButtons();\r\n  removeBtnListeners();\r\n\r\n  document.querySelector('h1').innerText =\r\n    'Which operations do you want to do? Click Skip to confirm';\r\n  btn1.innerText = 'x';\r\n  btn2.innerText = '+';\r\n  btn3.innerText = '-';\r\n\r\n  btn1.addEventListener('click', btn1Select);\r\n  btn2.addEventListener('click', btn2Select);\r\n  btn3.addEventListener('click', btn3Select);\r\n\r\n  document.querySelector('.check').addEventListener('click', confirmOperations);\r\n}\r\n\r\nfunction confirmOperations() {\r\n  hideButtons();\r\n\r\n  btn1.removeEventListener('click', btn1Select);\r\n  btn2.removeEventListener('click', btn2Select);\r\n  btn3.removeEventListener('click', btn3Select);\r\n\r\n  document\r\n    .querySelector('.check')\r\n    .removeEventListener('click', confirmOperations);\r\n\r\n  const buttons = document.querySelectorAll('.selected');\r\n  const oper = [];\r\n  buttons.forEach((op) => {\r\n    // console.log(op.innerText);\r\n    oper.push(op.innerText);\r\n    op.classList.remove('selected');\r\n  });\r\n  // console.log(oper);\r\n  // If button 1 - timed mode\r\n  if (mode === 'timed') {\r\n    game1 = new _game1__WEBPACK_IMPORTED_MODULE_0__.default(upper, lower);\r\n    game1.mode = mode;\r\n    game1.operations = game1.operations.concat(oper);\r\n    game1.startGame();\r\n    setTimeout(() => {\r\n      game1.setTimer(60);\r\n    }, 3000);\r\n\r\n    // If button 2 - Round mode\r\n  } else if (mode === 'rounds') {\r\n    game1 = new _game1__WEBPACK_IMPORTED_MODULE_0__.default(upper, lower, 25);\r\n    document.querySelector('h1').innerText = `Do the Math!`;\r\n    game1.mode = mode;\r\n    game1.operations = game1.operations.concat(oper);\r\n    game1.startGame();\r\n    // else button 3 - speed mode\r\n  } else {\r\n    game1 = new _game1__WEBPACK_IMPORTED_MODULE_0__.default(upper, lower);\r\n    game1.mode = mode;\r\n    game1.operations = game1.operations.concat(oper);\r\n    game1.speedMode();\r\n  }\r\n\r\n  addListeners(game1);\r\n}\r\n\r\nfunction btn1Select() {\r\n  btn1.classList.toggle('selected');\r\n}\r\n\r\nfunction btn2Select() {\r\n  btn2.classList.toggle('selected');\r\n}\r\n\r\nfunction btn3Select() {\r\n  btn3.classList.toggle('selected');\r\n}\r\n\r\nfunction btn1Handle() {\r\n  hideButtons();\r\n  chooseLimit();\r\n  mode = 'timed';\r\n}\r\n\r\nfunction btn2Handle() {\r\n  hideButtons();\r\n  chooseLimit();\r\n  mode = 'rounds';\r\n}\r\n\r\nfunction btn3Handle() {\r\n  hideButtons();\r\n  chooseLimit();\r\n  mode = 'speed';\r\n}\r\n\r\nfunction removeBtnListeners() {\r\n  btn1.removeEventListener('click', btn1Handle);\r\n  btn2.removeEventListener('click', btn2Handle);\r\n  btn3.removeEventListener('click', btn3Handle);\r\n}\r\n\r\nfunction addBtnListeners() {\r\n  btn1.addEventListener('click', btn1Handle);\r\n  btn2.addEventListener('click', btn2Handle);\r\n  btn3.addEventListener('click', btn3Handle);\r\n}\r\n\r\ndocument.querySelector('h1').innerText = `Choose your game mode`;\r\ndisplayButtons();\r\n\r\nbtn1.addEventListener('click', btn1Handle);\r\n\r\nbtn2.addEventListener('click', btn2Handle);\r\n\r\nbtn3.addEventListener('click', btn3Handle);\r\n\n\n//# sourceURL=webpack://Gub/./DoTheMath/src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./DoTheMath/src/index.js");
/******/ 	
/******/ })()
;