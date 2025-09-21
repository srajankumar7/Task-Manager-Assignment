const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

document.getElementById("addBtn").onclick = addTask;
taskInput.addEventListener("keypress", e => e.key === "Enter" && addTask());

window.onload = () => {
  let tasks = JSON.parse(localStorage.getItem("tasks"));

  if (!tasks || tasks.length === 0) {
    tasks = [
      { text: "Drinking Water", completed: false },
      { text: "Exercise", completed: false },
      { text: "Recharging Phone Number", completed: false }
    ];
    localStorage.setItem("tasks", JSON.stringify(tasks)); 
  }

  tasks.forEach(t => renderTask(t.text, t.completed));
  updateProgress();
};


function addTask() {
  const text = taskInput.value.trim();
  if (!text) return alert("⚠ Please enter a task!");
  renderTask(text, false);
  taskInput.value = "";
  saveTasks();
}

function renderTask(text, done) {
  const li = document.createElement("li");
  if (done) li.classList.add("completed");
  li.innerHTML = `<span>${text}</span>
    <div class="actions">
      <button onclick="toggleTask(this)">✅</button>
      <button onclick="deleteTask(this)">❌</button>
    </div>`;
  taskList.appendChild(li);
}

function toggleTask(btn) {
  btn.closest("li").classList.toggle("completed");
  saveTasks();
}

function deleteTask(btn) {
  btn.closest("li").remove();
  saveTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(
    [...taskList.querySelectorAll("li")].map(li => ({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed")
    }))
  ));
  updateProgress();
}

function updateProgress() {
  const tasks = taskList.querySelectorAll("li");
  const done = taskList.querySelectorAll("li.completed").length;
  const total = tasks.length;
  progressBar.style.width = (total ? (done / total) * 100 : 0) + "%";
  progressText.textContent = `${done} of ${total} tasks completed`;
}
