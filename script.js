let seconds = 0;
let interval;
let running = false;

function updateDigits() {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const minT = Math.floor(mins / 10);
  const minU = mins % 10;
  const secT = Math.floor(secs / 10);
  const secU = secs % 10;

  flip("minTens", minT);
  flip("minUnits", minU);
  flip("secTens", secT);
  flip("secUnits", secU);
}

function flip(id, number) {
  const el = document.getElementById(id);
  const newVal = number.toString().padStart(2, "0");
  if (el.innerText !== newVal) {
    el.classList.remove("flip");
    void el.offsetWidth; // Re-trigger animation
    el.classList.add("flip");
    el.innerText = newVal;
  }
}

document.getElementById("startBtn").addEventListener("click", () => {
  if (!running) {
    interval = setInterval(() => {
      seconds++;
      updateDigits();
    }, 1000);
    running = true;
    document.getElementById("startBtn").textContent = "⏸ Pause";
  } else {
    clearInterval(interval);
    running = false;
    document.getElementById("startBtn").textContent = "▶ Start";
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  clearInterval(interval);
  seconds = 0;
  updateDigits();
  document.getElementById("startBtn").textContent = "▶ Start";
  document.getElementById("lapList").innerHTML = "";
  running = false;
});

document.getElementById("lapBtn").addEventListener("click", () => {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const lapItem = document.createElement("li");
  lapItem.textContent = `⏱️ ${mins}:${secs}`;
  document.getElementById("lapList").appendChild(lapItem);
});

function changeTheme(theme) {
  const body = document.getElementById("mainBody");
  body.className = ""; // remove all classes
  body.classList.add(`theme-${theme}`);
}

updateDigits();
