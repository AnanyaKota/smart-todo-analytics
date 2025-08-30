const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

// Completed vs Pending
const completed = tasks.filter(t => t.status === "Completed").length;
const pending = tasks.length - completed;

new Chart(document.getElementById("statusChart"), {
  type: "doughnut",
  data: { labels: ["Completed", "Pending"], datasets: [{ data: [completed, pending], backgroundColor: ["#0077b6", "#ef476f"] }] },
  options: { maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
});

// Priority Chart
const priorities = ["High", "Medium", "Low"];
const priorityCounts = priorities.map(p => tasks.filter(t => t.priority === p).length);

new Chart(document.getElementById("priorityChart"), {
  type: "bar",
  data: { labels: priorities, datasets: [{ label: "Tasks by Priority", data: priorityCounts, backgroundColor: ["#ef476f","#ffb703","#06d6a0"] }] },
  options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, stepSize: 1 } } }
});

// Category Chart
const categories = [...new Set(tasks.map(t => t.category))];
const categoryCounts = categories.map(c => tasks.filter(t => t.category === c).length);

new Chart(document.getElementById("categoryChart"), {
  type: "pie",
  data: { labels: categories, datasets: [{ data: categoryCounts, backgroundColor: ["#0077b6","#ffb703","#06d6a0","#8338ec","#ff006e"] }] },
  options: { maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
});

// Deadlines (Upcoming vs Overdue)
const today = new Date();
const nextWeek = new Date(); nextWeek.setDate(today.getDate() + 7);

const upcoming = tasks.filter(t => {
  if (t.dueDate === "No Date") return false;
  const due = new Date(t.dueDate);
  return t.status !== "Completed" && due >= today && due <= nextWeek;
}).length;

const overdue = tasks.filter(t => {
  if (t.dueDate === "No Date") return false;
  const due = new Date(t.dueDate);
  return t.status !== "Completed" && due < today;
}).length;

new Chart(document.getElementById("deadlineChart"), {
  type: "bar",
  data: { labels: ["Upcoming (7 days)","Overdue"], datasets: [{ label: "Deadlines", data: [upcoming, overdue], backgroundColor: ["#06d6a0","#ef476f"] }] },
  options: { maintainAspectRatio: false, scales: { y: { beginAtZero: true, stepSize: 1 } }, plugins: { legend: { display: false } } }
});
