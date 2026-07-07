const eventTitle = document.querySelector("#event-title");
const eventDate = document.querySelector("#event-date");
const eventTime = document.querySelector("#event-time");
const addEventBtn = document.querySelector("#add-event");

const eventList = document.querySelector("#event-list");
const eventCount = document.querySelector("#event-count");
const calendarDays = document.querySelector(".calendar-days");

let currentDate = new Date();

let events = JSON.parse(localStorage.getItem("events")) || [];

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(events));
}

function renderCalendar() {
  calendarDays.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("empty");
    calendarDays.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateBox = document.createElement("div");
    dateBox.classList.add("day");

    dateBox.innerHTML = `
      <span class="date-number">${day}</span>
    `;

    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const today = new Date().toISOString().split("T")[0];

    if (dateString === today) {
      dateBox.classList.add("today");
    }

    const todaysEvents = events.filter((event) => event.date === dateString);

    todaysEvents.forEach((event) => {
      const eventDiv = document.createElement("div");
      eventDiv.className = "calendar-event";
      eventDiv.textContent = event.title;

      dateBox.appendChild(eventDiv);
    });

    calendarDays.appendChild(dateBox);
  }
}

function updateEventCount() {
  eventCount.textContent = `${events.length} Upcoming Event${events.length !== 1 ? "s" : ""}`;
}

addEventBtn.addEventListener("click", () => {
  const title = eventTitle.value.trim();
  const date = eventDate.value;
  const time = eventTime.value;

  if (!title || !date || !time) return;

  const event = {
    id: Date.now(),
    title,
    date,
    time,
  };

  events.push(event);

  saveEvents();
  renderCalendar();

  eventTitle.value = "";
  eventDate.value = "";
  eventTime.value = "";

  renderEvents();
});

function renderEvents() {
  eventList.innerHTML = "";

  events.sort((a, b) => {
    return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
  });

  events.forEach((event) => {
    createEvent(event);
  });

  updateEventCount();
}

function createEvent(eventData) {
  const event = document.createElement("li");

  event.className = "event";

  event.innerHTML = `
    <div class="event-info">
      <h3>${eventData.title}</h3>

      <p>
        <i class="ri-calendar-line"></i>
        ${eventData.date}
      </p>

      <p>
        <i class="ri-time-line"></i>
        ${eventData.time}
      </p>
    </div>

    <button class="delete-event">
      <i class="ri-delete-bin-line"></i>
    </button>
  `;

  event.querySelector(".delete-event").addEventListener("click", () => {
    events = events.filter((e) => e.id !== eventData.id);

    saveEvents();

    renderEvents();
    renderCalendar();
  });

  eventList.appendChild(event);
}

renderEvents();
renderCalendar();
