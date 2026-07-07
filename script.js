const bgVideo = document.querySelector("#bg-video");
const bgSource = document.querySelector("#bg-source");
const logo = document.querySelector(".logo");

const greeting = document.querySelector("#greeting");
const clock = document.querySelector("#clock");
const date = document.querySelector("#date");
const pages = document.querySelectorAll(".page");

const city = document.querySelector("#city");
const temp = document.querySelector("#temp");
const condition = document.querySelector("#condition");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");

const sidebarItems = document.querySelectorAll(".sidebar-item");

const themeBtn = document.querySelector("#theme-btn");

const taskInput = document.querySelector("#task-input");
const addTaskBtn = document.querySelector("#add-task");
const taskList = document.querySelector("#task-list");
const importantBtn = document.querySelector("#important-btn");
const taskCount = document.querySelector("#task-count");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.querySelector("#clear-completed");

let currentFilter = "all";
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateBackground(hour) {
  let bgVideoSrc = "";

  if (hour >= 5 && hour < 12) {
    bgVideoSrc = "https://www.pexels.com/download/video/18423730/";
    greeting.textContent = "Good Morning !";
  } else if (hour >= 12 && hour < 17) {
    bgVideoSrc = "https://www.pexels.com/download/video/6421026/";
    greeting.textContent = "Good Afternoon !";
  } else if (hour >= 17 && hour < 20) {
    bgVideoSrc = "https://www.pexels.com/download/video/12738277/";
    greeting.textContent = "Good Evening !";
  } else {
    bgVideoSrc = "https://www.pexels.com/download/video/1826945/";
    greeting.textContent = "Good Night !";
  }

  if (bgSource.getAttribute("src") !== bgVideoSrc) {
    bgVideo.classList.add("fade-out");

    setTimeout(() => {
      bgSource.src = bgVideoSrc;
      bgVideo.load();
      bgVideo.play();
      bgVideo.classList.remove("fade-out");
    }, 500);
  }
}

function updateTime() {
  const now = new Date();

  const hour = Number(
    now.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      hour12: false,
    })
  );

  updateBackground(hour);

  clock.textContent = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  date.textContent = now.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

updateTime();

setInterval(updateTime, 1000);

let currentPage = "home";
console.log(currentPage);

function showPage(pageId) {
  pages.forEach((page) => {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");

  sidebarItems.forEach((item) => {
    item.classList.remove("active");

    if (item.dataset.feature === pageId) {
      item.classList.add("active");
    }
  });

  currentPage = pageId;
}

logo.addEventListener("click", () => {
  showPage("home");
  sidebarItems.forEach((item) => {
    item.classList.remove("active");
  });
});

sidebarItems.forEach((item) => {
  const previewVideo = item.querySelector("video");

  item.addEventListener("mouseenter", () => {
    previewVideo.currentTime = 0;
    previewVideo.play();
  });

  item.addEventListener("mouseleave", () => {
    previewVideo.pause();
    previewVideo.currentTime = 0;
  });

  item.addEventListener("click", () => {
    const pageId = item.dataset.feature;
    if (currentPage === pageId) {
      showPage("home");
    } else {
      showPage(pageId);
    }
  });
});

function getLocation() {
  if (!navigator.geolocation) {
    city.textContent = "Geolocation not supported";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      getWeather(latitude, longitude);
      getCity(latitude, longitude);
    },

    () => {
      city.textContent = "Location permission denied";
    }
  );
}

async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

  try {
    const response = await fetch(url);

    const data = await response.json();

    temp.textContent = `${Math.round(data.current.temperature_2m)}°C`;

    humidity.textContent = `${data.current.relative_humidity_2m}%`;

    wind.textContent = `${data.current.wind_speed_10m} km/h`;

    condition.textContent = getWeatherCondition(data.current.weather_code);
  } catch (err) {
    console.error(err);
  }
}

async function getCity(lat, lon) {
  console.log("Fetching city...", lat, lon);
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );

    const data = await response.json();

    const address = data.address;

    const cityName =
      address.city ||
      address.state_district ||
      address.city_district ||
      address.town ||
      address.village ||
      address.county;

    const stateName = address.state;

    city.textContent = `${cityName}, ${stateName}`;
  } catch {
    city.textContent = "Unknown";
  }
}

function getWeatherCondition(code) {
  const weatherCodes = {
    0: "Clear Sky",

    1: "Mainly Clear",

    2: "Partly Cloudy",

    3: "Overcast",

    45: "Fog",

    48: "Fog",

    51: "Light Drizzle",

    53: "Drizzle",

    55: "Heavy Drizzle",

    61: "Rain",

    63: "Moderate Rain",

    65: "Heavy Rain",

    71: "Snow",

    80: "Rain Showers",

    95: "Thunderstorm",
  };

  return weatherCodes[code] || "Unknown";
}

getLocation();

function enableLightMode() {
  document.body.classList.add("light");
  themeBtn.innerHTML = '<i class="ri-sun-line"></i>';
  localStorage.setItem("theme", "light");
}

function enableDarkMode() {
  document.body.classList.remove("light");
  themeBtn.innerHTML = '<i class="ri-moon-line"></i>';
  localStorage.setItem("theme", "dark");
}

themeBtn.addEventListener("click", () => {
  if (document.body.classList.contains("light")) {
    enableDarkMode();
  } else {
    enableLightMode();
  }
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  enableLightMode();
} else {
  enableDarkMode();
}

function updateTaskCount() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;

  taskCount.textContent = `${completed}/${total} Completed`;

  clearCompletedBtn.disabled = completed === 0;
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  filteredTasks.forEach((task) => {
    createTask(task);
  });

  updateTaskCount();
}

function createTask(taskData) {
  const task = document.createElement("li");
  task.className = "task";
  if (taskData.important) {
    task.classList.add("important");
  }
  task.innerHTML = `
        <div class="task-left">

            <button class="complete-task">
                <i class="ri-checkbox-blank-circle-line"></i>
            </button>

            <span class="task-text">${taskData.text}</span>

        </div>

        <div class="task-actions">

    <button class="edit-task">
        <i class="ri-edit-line"></i>
    </button>

    <button class="delete-task">
        <i class="ri-delete-bin-line"></i>
    </button>

</div>
        `;
  if (taskData.completed) {
    task.classList.add("completed");

    task.querySelector(".complete-task").innerHTML =
      '<i class="ri-checkbox-circle-fill"></i>';
  }

  task.querySelector(".delete-task").addEventListener("click", () => {
    tasks = tasks.filter((t) => t.id !== taskData.id);

    saveTasks();

    renderTasks();
  });

  const completeBtn = task.querySelector(".complete-task");

  completeBtn.addEventListener("click", () => {
    task.classList.toggle("completed");

    taskData.completed = task.classList.contains("completed");

    completeBtn.innerHTML = taskData.completed
      ? '<i class="ri-checkbox-circle-fill"></i>'
      : '<i class="ri-checkbox-blank-circle-line"></i>';

    renderTasks();
    saveTasks();
  });

  const taskTextElement = task.querySelector(".task-text");
  const editBtn = task.querySelector(".edit-task");

  editBtn.addEventListener("click", () => {
    if (!taskTextElement.isContentEditable) {
      taskTextElement.contentEditable = true;
      taskTextElement.focus();

      editBtn.innerHTML = '<i class="ri-check-line"></i>';
      task.classList.add("editing");
    } else {
      taskTextElement.contentEditable = false;

      taskTextElement.textContent = taskTextElement.textContent.trim();

      taskData.text = taskTextElement.textContent;

      editBtn.innerHTML = '<i class="ri-edit-line"></i>';
      task.classList.remove("editing");

      saveTasks();
    }
  });

  taskTextElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      taskTextElement.contentEditable = false;
      taskTextElement.textContent = taskTextElement.textContent.trim();

      taskData.text = taskTextElement.textContent.trim();
      saveTasks();

      editBtn.innerHTML = '<i class="ri-edit-line"></i>';
      task.classList.remove("editing");
    }
  });

  taskList.appendChild(task);
}

addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();

  if (text === "") return;
  const task = {
    id: Date.now(),
    text: text,
    important: isImportant,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskInput.value = "";
  isImportant = false;
  importantBtn.classList.remove("active");
  importantBtn.innerHTML = '<i class="ri-star-line"></i>';
});

let isImportant = false;

importantBtn.addEventListener("click", () => {
  isImportant = !isImportant;

  importantBtn.classList.toggle("active");

  importantBtn.innerHTML = isImportant
    ? '<i class="ri-star-fill"></i>'
    : '<i class="ri-star-line"></i>';
});

renderTasks();

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;

    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    renderTasks();
  });
});

clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);

  saveTasks();

  renderTasks();
});
