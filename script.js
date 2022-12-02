const screens = document.querySelectorAll(".screen");
const start = document.querySelector(".start");
const timeList = document.querySelector(".time-list");
const timer = document.querySelector("#time");
const board = document.querySelector("#board");
const best = document.querySelector("#best-score");

console.log(best);

let count = 0;
let time = "";
let score = 0;
let bestScore = 0;
let wrapBoard = "";
const colors = [
  "#e13f2d",
  "#8a3cab",
  "#3498db",
  "#d2e622",
  "#e67f25",
  "#2ecc71",
  "#dc1fa7",
];

start.addEventListener("click", toBegin);

function toBegin(event) {
  event.preventDefault();
  screens[0].classList.add("up");
}

timeList.addEventListener("click", setTime);

function setTime(event) {
  if (event.target.classList.contains("time-btn")) {
    time = +event.target.getAttribute("data-time");
    count = time;
    screens[1].classList.add("up");
    if (time === 60) {
      timer.innerHTML = "01:00";
    } else {
      timer.innerHTML = "00:" + time;
    }
    loadingBestScore();
    startGame();
  }
}

function loadingBestScore() {
  if (localStorage.getItem("bestScore" + count)) {
    bestScore = JSON.parse(
      localStorage.getItem("bestScore" + count)
    );
  }
  best.innerHTML = bestScore;
}

board.addEventListener("click", (event) => {
  if (event.target.classList.contains("circle")) {
    score++;
    event.target.remove();
    createRandomCircle();
    saveBestScore();
  }
});

function saveBestScore() {
  if (score > bestScore) {
    localStorage.setItem(
      "bestScore" + count,
      JSON.stringify(score)
    );
  }
}

function startGame() {
  let timerId = setInterval(startGameTimer, 1000);
  createRandomCircle();
  setTimeout(() => {
    clearInterval(timerId);
    finishGame();
  }, time + "000");
  console.log(time);
}

function startGameTimer() {
  time--;
  timer.innerHTML = "00:" + time;
  if (time < 10) {
    timer.innerHTML = "00:0" + time;
  }
}

function finishGame(event) {
  board.innerHTML = `
  <div class="board-wrapper">
    <h1>Счет: ${score}</h1>
    <div class="board-btn time-btn" data-time="${count}">Попробовать снова</div>
    <div class="board-btn-restart time-btn">Начать сначала</div>
  </div>
  `;

  if (score > bestScore) {
    best.innerHTML = score;
  }

  const boardBtn = document.querySelector(".board-btn");
  const boardBtnRestart = document.querySelector(
    ".board-btn-restart"
  );
  const boardWrapper = document.querySelector(
    ".board-wrapper"
  );
  wrapBoard = boardWrapper;

  boardBtn.addEventListener("click", tryAgain);
  boardBtnRestart.addEventListener("click", restart);
}

function createRandomCircle() {
  const circle = document.createElement("div");
  const size = getRandomNumber(10, 50);
  const { width, height } = board.getBoundingClientRect();
  const x = getRandomNumber(0, width - size);
  const y = getRandomNumber(0, height - size);
  const color = randomColor();

  circle.classList.add("circle");
  circle.style.width = size + "px";
  circle.style.height = size + "px";
  circle.style.top = y + "px";
  circle.style.left = x + "px";
  circle.style.background = color;
  circle.style.boxShadow = `0 0 2px ${color}, 0 0 10px ${color}`;

  board.appendChild(circle);
}

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function tryAgain(event) {
  wrapBoard.remove();
  time = +event.target.getAttribute("data-time");
  console.log(time);
  score = 0;
  loadingBestScore();
  startGame();
}

function randomColor() {
  const index = Math.floor(Math.random() * colors.length);

  return colors[index];
}

function restart() {
  screens[0].classList.remove("up");
  screens[1].style.visibility = "hidden";
  setTimeout(() => {
    screens[1].classList.remove("up");
    setTimeout(showScreen, 250);
  }, 500);
  wrapBoard.remove();
  score = 0;
}

function showScreen() {
  screens[1].style.visibility = "";
}
