let timer;
let startTime;
let elapsed = 0;
let running = false;
let lastLapTime = 0;
let lapInterval = 5;
let chartInstance = null;

function updateClock() {
  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const secs = String(elapsed % 60).padStart(2, '0');

  const minEl = document.getElementById("min");
  const secEl = document.getElementById("sec");

  if (minEl.textContent !== mins) {
    minEl.textContent = mins;
    minEl.classList.add("flip");
    setTimeout(() => minEl.classList.remove("flip"), 500);
  }

  if (secEl.textContent !== secs) {
    secEl.textContent = secs;
    secEl.classList.add("flip");
    setTimeout(() => secEl.classList.remove("flip"), 500);
  }
}

function startTimer() {
  if (running) return;
  const task = document.getElementById("taskInput").value.trim();
  if (!task) return alert("Please enter a task.");

  const userInterval = parseInt(document.getElementById("lapIntervalInput").value);
  lapInterval = (!isNaN(userInterval) && userInterval > 0) ? userInterval : 5;

  running = true;
  startTime = new Date();
  lastLapTime = 0;
  elapsed = 0;
  document.getElementById("lapList").innerHTML = "";

  timer = setInterval(() => {
    elapsed++;
    updateClock();
  }, 1000);

  // auto-lap after user-defined interval (once)
  setTimeout(() => {
    if (running) {
      recordLap();
      lastLapTime = elapsed;
    }
  }, lapInterval * 1000);
}

function stopTimer() {
  if (!running) return;
  clearInterval(timer);
  running = false;

  const task = document.getElementById("taskInput").value.trim();
  const endTime = new Date();
  const duration = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  const session = {
    task,
    start: startTime.toLocaleTimeString(),
    end: endTime.toLocaleTimeString(),
    duration,
    minutes: Math.floor(elapsed / 60) + (elapsed % 60) / 60
  };

  saveSession(session);
  renderDashboard();
}

function resetTimer() {
  clearInterval(timer);
  running = false;
  elapsed = 0;
  updateClock();
  lastLapTime = 0;
  document.getElementById("lapList").innerHTML = "";
}

function recordLap() {
  const totalMins = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const totalSecs = String(elapsed % 60).padStart(2, '0');
  const lapTime = elapsed - lastLapTime;
  const lapMins = String(Math.floor(lapTime / 60)).padStart(2, '0');
  const lapSecs = String(lapTime % 60).padStart(2, '0');

  const ul = document.getElementById("lapList");
  const li = document.createElement("li");
  li.textContent = `Lap ${ul.children.length + 1} | Total: ${totalMins}:${totalSecs} | Lap: ${lapMins}:${lapSecs}`;
  ul.appendChild(li);
}

function saveSession(session) {
  let data = JSON.parse(localStorage.getItem("sessions")) || [];
  data.push(session);
  localStorage.setItem("sessions", JSON.stringify(data));
}

function renderDashboard() {
  const data = JSON.parse(localStorage.getItem("sessions")) || [];
  const ctx = document.getElementById("taskChart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  if (data.length === 0) {
    alert("No data available to show.");
    return;
  }

  const taskNames = data.map(d => d.task);
  const taskDurations = data.map(d => d.minutes);

  chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: taskNames,
      datasets: [{
        label: 'Time Spent (min)',
        data: taskDurations,
        backgroundColor: [
          '#00eaff', '#ff00c8', '#ffc400', '#00ffa6', '#ff5757',
          '#9d72ff', '#22c55e', '#f59e0b'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#fff', font: { size: 14 } }
        }
      }
    }
  });

  const tbody = document.getElementById("taskTableBody");
  tbody.innerHTML = '';
  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${row.task}</td><td>${row.start}</td><td>${row.end}</td><td>${row.duration}</td>`;
    tbody.appendChild(tr);
  });
}

function clearAllData() {
  if (confirm("Are you sure you want to delete all session data?")) {
    localStorage.removeItem("sessions");
    if (chartInstance) {
      chartInstance.destroy();
    }
    document.getElementById("taskTableBody").innerHTML = "";
    alert("All session data cleared.");
  }
}

function setTheme(theme) {
  document.body.className = "theme-" + theme;
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}
