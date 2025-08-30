// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Create a new task
function createTask() {
    const name = document.getElementById("newTaskInput").value.trim();
    const category = document.getElementById("taskCategory").value.trim();
    const dueDate = document.getElementById("taskDueDate").value;
    const priority = document.getElementById("taskPriority").value;
    const notes = document.getElementById("taskNotes").value.trim();
    if (!name) return;

    const task = {
        name,
        category: category || "General",
        dueDate: dueDate || "No Date",
        priority,
        notes,
        status: "Pending"
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    clearInputs();
}

// Clear input fields
function clearInputs() {
    document.getElementById("newTaskInput").value = "";
    document.getElementById("taskCategory").value = "";
    document.getElementById("taskDueDate").value = "";
    document.getElementById("taskNotes").value = "";
}

// Render tasks
function renderTasks() {
    const list = document.getElementById("taskBucket");
    list.innerHTML = "";

    let filteredTasks = filterAndSortTasks();

    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = task.status === "Completed" ? "completed" : "";
        li.dataset.status = task.status;
        li.innerHTML = `<strong>${task.name}</strong> (${task.category}, ${task.priority}, ${task.dueDate})<br>${task.notes}`;

        // Toggle status on click
        li.addEventListener("click", () => {
            if (task.status === "Pending") task.status = "In Progress";
            else if (task.status === "In Progress") task.status = "Completed";
            else task.status = "Pending";
            saveTasks();
            renderTasks();
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "remove-btn";
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        };

        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

// Filter, sort, search
function filterAndSortTasks() {
    const filterStatus = document.getElementById("filterStatus").value;
    const sortBy = document.getElementById("sortTasks").value;
    const searchQuery = document.getElementById("searchTask").value.toLowerCase();

    let result = [...tasks];

    if (filterStatus !== "all") result = result.filter(t => t.status === filterStatus);

    if (searchQuery) {
        result = result.filter(t =>
            t.name.toLowerCase().includes(searchQuery) ||
            t.category.toLowerCase().includes(searchQuery) ||
            t.notes.toLowerCase().includes(searchQuery)
        );
    }

    if (sortBy === "priority") {
        const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
        result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === "dueDate") {
        result.sort((a, b) => {
            const dateA = new Date(a.dueDate !== "No Date" ? a.dueDate : "9999-12-31");
            const dateB = new Date(b.dueDate !== "No Date" ? b.dueDate : "9999-12-31");
            return dateA - dateB;
        });
    }

    return result;
}

// Initialize
renderTasks();
