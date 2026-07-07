const timerDisplay = document.querySelector("#timer-display");
const timerMode = document.querySelector("#timer-mode");

const startBtn = document.querySelector("#start-timer");
const pauseBtn = document.querySelector("#pause-timer");
const resetBtn = document.querySelector("#reset-timer");

const progressFill = document.querySelector("#timer-progress-fill");

const modeBtns = document.querySelectorAll(".mode-btn");

let timer;
pauseBtn.disabled = true;
let totalSeconds = 25 * 60;
let remainingSeconds = totalSeconds;
let isRunning = false;

function updateDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

updateDisplay();

function updateProgress() {
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  progressFill.style.width = `${progress}%`;
}

startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  if (isRunning) return;

  isRunning = true;

  timer = setInterval(() => {
    if (remainingSeconds <= 0) {
      clearInterval(timer);
      isRunning = false;

      alert("🎉 Time's Up!");

      return;
    }

    remainingSeconds--;

    updateDisplay();
    updateProgress();
  }, 1000);
});

pauseBtn.addEventListener("click", () => {
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  clearInterval(timer);

  isRunning = false;
});

resetBtn.addEventListener("click", () => {
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  clearInterval(timer);

  isRunning = false;

  remainingSeconds = totalSeconds;

  updateDisplay();
  updateProgress();
});

modeBtns.forEach((btn) => {
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  btn.addEventListener("click", () => {
    clearInterval(timer);
    isRunning = false;

    modeBtns.forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");

    const minutes = Number(btn.dataset.time);

    totalSeconds = minutes * 60;
    remainingSeconds = totalSeconds;

    timerMode.textContent = btn.textContent;

    updateDisplay();
    updateProgress();
  });
});
