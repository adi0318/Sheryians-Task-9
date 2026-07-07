const goalInput = document.querySelector("#goal-input");
const addGoalBtn = document.querySelector("#add-goal");

const goalList = document.querySelector("#goal-list");
const goalCount = document.querySelector("#goal-count");

let goals = JSON.parse(localStorage.getItem("goals")) || [];

function saveGoals() {
  localStorage.setItem("goals", JSON.stringify(goals));
}

function updateGoalCount() {
  goalCount.textContent = `${goals.length} Goal${goals.length !== 1 ? "s" : ""}`;
}

function createGoal(goalData) {
  const goal = document.createElement("li");
  goal.className = "goal";

  goal.innerHTML = `
    <div class="goal-info">
      <h3>${goalData.title}</h3>

      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>

      <p class="goal-percent"></p>
      <p class="goal-status"></p>
    </div>

    <div class="goal-actions">
      <button class="decrease-goal">
        <i class="ri-subtract-line"></i>
      </button>

      <button class="increase-goal">
        <i class="ri-add-line"></i>
      </button>

      <button class="delete-goal">
        <i class="ri-delete-bin-line"></i>
      </button>
    </div>
  `;

  const progressFill = goal.querySelector(".progress-fill");
  const progressText = goal.querySelector(".goal-percent");
  const statusText = goal.querySelector(".goal-status");

  function updateProgress() {
  progressFill.style.width = `${goalData.progress}%`;

  progressText.textContent = `${goalData.progress}% Completed`;

  if (goalData.progress === 100) {
    statusText.innerHTML = `<i class="ri-trophy-line"></i> Completed`;
    goal.classList.add("goal-complete");
  }

  else if (goalData.progress >= 50) {
    statusText.innerHTML = `<i class="ri-progress-5-fill"></i> In Progress`;
    goal.classList.remove("goal-complete");
  }

  else if (goalData.progress > 0) {
    statusText.innerHTML = `<i class="ri-progress-1-line"></i> Just Started`;
    goal.classList.remove("goal-complete");
  }

  else {
    statusText.innerHTML = `<i class="ri-progress-8-fill"></i> Ready to Begin`;
    goal.classList.remove("goal-complete");
  }

  saveGoals();
}

  updateProgress();

  goal.querySelector(".increase-goal").addEventListener("click", () => {
    if (goalData.progress < 100) {
      goalData.progress += 10;

      if (goalData.progress > 100) {
        goalData.progress = 100;
      }

      updateProgress();
    }
  });

  goal.querySelector(".decrease-goal").addEventListener("click", () => {
    if (goalData.progress > 0) {
      goalData.progress -= 10;

      if (goalData.progress < 0) {
        goalData.progress = 0;
      }

      updateProgress();
    }
  });

  goal.querySelector(".delete-goal").addEventListener("click", () => {
    goals = goals.filter((g) => g.id !== goalData.id);

    saveGoals();

    renderGoals();
  });

  goalList.appendChild(goal);
}

function renderGoals() {
  goalList.innerHTML = "";

  goals.forEach((goal) => {
    createGoal(goal);
  });

  updateGoalCount();
}

addGoalBtn.addEventListener("click", () => {
  const text = goalInput.value.trim();

  if (!text) return;

  const goal = {
    id: Date.now(),
    title: text,
    progress: 0,
  };

  goals.push(goal);

  saveGoals();

  goalInput.value = "";

  renderGoals();
});

renderGoals();