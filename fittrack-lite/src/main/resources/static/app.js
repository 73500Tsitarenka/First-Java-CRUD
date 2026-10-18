
const API = "/api/exercises";

const table = document.getElementById("exerciseTable");
const searchInput = document.getElementById("searchInput");
const dialog = document.getElementById("exerciseDialog");
const form = document.getElementById("exerciseForm");

let exercises = [];
let editingId = null;

const $ = (id) => document.getElementById(id);

function showError(message) {
    $("errorMessage").textContent = message;
    $("errorMessage").hidden = !message;
}

async function request(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...options.headers
        }
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(body || `Request failed (${response.status})`);
    }

    if (response.status === 204) return null;
    return response.json();
}

async function loadExercises() {
    showError("");

    try {
        exercises = await request(API);
        renderExercises();
    } catch (error) {
        showError(`Could not load exercises. ${error.message}`);
        table.innerHTML =
            '<tr><td colspan="5" class="empty">Unable to load exercises.</td></tr>';
    }
}

function renderExercises() {
    const query = searchInput.value.trim().toLowerCase();

    const filtered = exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(query)
    );

    $("totalExercises").textContent = exercises.length;
    $("totalSets").textContent = exercises.reduce((sum, e) => sum + e.sets, 0);
    $("totalReps").textContent = exercises.reduce(
        (sum, e) => sum + e.sets * e.reps, 0
    );
    $("resultCount").textContent =
        `${filtered.length} exercise${filtered.length === 1 ? "" : "s"}`;

    if (filtered.length === 0) {
        table.innerHTML = `<tr><td colspan="5" class="empty">${
            query ? "No exercises match your search." : "No exercises yet. Add your first one!"
        }</td></tr>`;
        return;
    }

    table.innerHTML = filtered.map((exercise) => `
        <tr>
            <td>
                <div class="exercise-name">${escapeHtml(exercise.name)}</div>
                <div class="exercise-id">ID #${exercise.id}</div>
            </td>
            <td><span class="weight-pill">${exercise.weightKg} kg</span></td>
            <td>${exercise.sets}</td>
            <td>${exercise.reps}</td>
            <td>
                <div class="action-group">
                    <button class="edit-button" data-action="edit" data-id="${exercise.id}">Edit</button>
                    <button class="delete-button" data-action="delete" data-id="${exercise.id}">Delete</button>
                </div>
            </td>
        </tr>
    `).join("");
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function openAddDialog() {
    editingId = null;
    form.reset();
    $("weightKg").value = "0";
    $("sets").value = "3";
    $("reps").value = "12";
    $("dialogTitle").textContent = "Add exercise";
    $("saveButton").textContent = "Save exercise";
    $("formError").hidden = true;
    dialog.showModal();
    $("exerciseName").focus();
}

function openEditDialog(exercise) {
    editingId = exercise.id;
    $("exerciseName").value = exercise.name;
    $("weightKg").value = exercise.weightKg;
    $("sets").value = exercise.sets;
    $("reps").value = exercise.reps;
    $("dialogTitle").textContent = "Edit exercise";
    $("saveButton").textContent = "Save changes";
    $("formError").hidden = true;
    dialog.showModal();
    $("exerciseName").focus();
}

$("addButton").addEventListener("click", openAddDialog);
$("closeDialog").addEventListener("click", () => dialog.close());
$("cancelButton").addEventListener("click", () => dialog.close());
searchInput.addEventListener("input", renderExercises);

table.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    const exercise = exercises.find((item) => item.id === id);
    if (!exercise) return;

    if (button.dataset.action === "edit") {
        openEditDialog(exercise);
        return;
    }

    if (button.dataset.action === "delete") {
        if (!confirm(`Delete "${exercise.name}"? This cannot be undone.`)) return;

        button.disabled = true;

        try {
            await request(`${API}/${id}`, { method: "DELETE" });
            await loadExercises();
        } catch (error) {
            showError(`Could not delete exercise. ${error.message}`);
        } finally {
            button.disabled = false;
        }
    }
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = $("exerciseName").value.trim();
    const weightKg = Number($("weightKg").value);
    const sets = Number($("sets").value);
    const reps = Number($("reps").value);

    if (!name || name.length > 100) {
        $("formError").textContent = "Enter an exercise name up to 100 characters.";
        $("formError").hidden = false;
        return;
    }

    if (!Number.isFinite(weightKg) || weightKg < 0 || weightKg > 10000
        || !Number.isInteger(sets) || sets < 1 || sets > 100
        || !Number.isInteger(reps) || reps < 1 || reps > 1000) {
        $("formError").textContent = "Check the weight, sets and reps values.";
        $("formError").hidden = false;
        return;
    }

    const exercise = { name, weightKg, sets, reps };
    const saveButton = $("saveButton");
    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    try {
        if (editingId === null) {
            await request(API, {
                method: "POST",
                body: JSON.stringify(exercise)
            });
        } else {
            await request(`${API}/${editingId}`, {
                method: "PUT",
                body: JSON.stringify(exercise)
            });
        }

        dialog.close();
        await loadExercises();
    } catch (error) {
        $("formError").textContent = `Could not save exercise. ${error.message}`;
        $("formError").hidden = false;
    } finally {
        saveButton.disabled = false;
        saveButton.textContent = editingId === null ? "Save exercise" : "Save changes";
    }
});

loadExercises();
