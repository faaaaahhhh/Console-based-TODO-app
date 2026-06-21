import { Task } from "./db.js";
import { Op } from "sequelize";


// ==================== ADD TASK ====================

async function addTask(userId, title, description, dueDate, priority) {

    title = title.trim();
    description = description.trim();
    priority = priority.trim().toLowerCase();

    // Title validation
    if (!title) {
        console.log("Task title cannot be empty.");
        return;
    }

    // Priority validation
    const validPriorities = ["low", "medium", "high"];

    if (!validPriorities.includes(priority)) {
        console.log("Priority must be Low, Medium, or High.");
        return;
    }

    // Normalize priority (store clean format)
    priority =
        priority.charAt(0).toUpperCase() +
        priority.slice(1);

    // Date validation (strict)
    const [year, month, day] = dueDate.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) ||
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        console.log("Invalid date. Use YYYY-MM-DD.");
        return;
    }

    const task = await Task.create({
        userId,
        title,
        description,
        dueDate,
        priority,
        status: "Pending",
    });

    console.log("\nTask added successfully!");

    console.log(`ID: ${task.id}`);
    console.log(`Title: ${task.title}`);
    console.log(`Description: ${task.description}`);
    console.log(`Due Date: ${task.dueDate}`);
    console.log(`Priority: ${task.priority}`);
    console.log(`Status: ${task.status}`);
}


// ==================== VIEW TASKS ====================

async function viewTasks(userId) {

    const tasks = await Task.findAll({
        where: { userId },
    });

    if (tasks.length === 0) {
        console.log("No tasks found.");
        return;
    }

    console.log("\nYour Tasks:\n");

    tasks.forEach((task) => {
        console.log("\n====================");
        console.log(`ID: ${task.id}`);
        console.log(`Title: ${task.title}`);
        console.log(`Description: ${task.description}`);
        console.log(`Due Date: ${task.dueDate}`);
        console.log(`Priority: ${task.priority}`);
        console.log(`Status: ${task.status}`);
        console.log("====================");
    });
}


// ==================== EDIT TASK ====================

async function editTask(
    userId,
    taskId,
    title,
    description,
    dueDate,
    priority,
    status
) {

    const task = await Task.findOne({
        where: { id: taskId, userId },
    });

    if (!task) {
        console.log("Task not found.");
        return;
    }

    title = title.trim();
    description = description.trim();
    priority = priority.trim().toLowerCase();
    status = status.trim().toLowerCase();

    // Priority validation
    const validPriorities = ["low", "medium", "high"];

    if (!validPriorities.includes(priority)) {
        console.log("Invalid priority.");
        return;
    }

    priority =
        priority.charAt(0).toUpperCase() +
        priority.slice(1);

    // Status validation
    const validStatus = ["pending", "completed"];

    if (!validStatus.includes(status)) {
        console.log("Invalid status.");
        return;
    }

    status =
        status.charAt(0).toUpperCase() +
        status.slice(1);

    // Date validation
    const [year, month, day] = dueDate.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) ||
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        console.log("Invalid date format.");
        return;
    }

    await task.update({
        title,
        description,
        dueDate,
        priority,
        status,
    });

    console.log("Task updated successfully!");
}


// ==================== DELETE TASK ====================

async function deleteTask(userId, taskId) {

    const task = await Task.findOne({
        where: { id: taskId, userId },
    });

    if (!task) {
        console.log("Task not found.");
        return;
    }

    await task.destroy();

    console.log("Task deleted successfully!");
}


// ==================== SEARCH TASKS ====================

async function searchTasks(userId, keyword) {

    keyword = keyword.trim();

    const tasks = await Task.findAll({
        where: {
            userId,
            [Op.or]: [
                {
                    title: {
                        [Op.like]: `%${keyword}%`,
                    },
                },
                {
                    description: {
                        [Op.like]: `%${keyword}%`,
                    },
                },
            ],
        },
    });

    if (tasks.length === 0) {
        console.log("No matching tasks found.");
        return;
    }

    console.log("\nSearch Results:\n");

    tasks.forEach((task) => {
        console.log("\n====================");
        console.log(`ID: ${task.id}`);
        console.log(`Title: ${task.title}`);
        console.log(`Description: ${task.description}`);
        console.log(`Due Date: ${task.dueDate}`);
        console.log(`Priority: ${task.priority}`);
        console.log(`Status: ${task.status}`);
        console.log("====================");
    });
}


// ==================== GET TASK BY ID ====================

async function getTaskById(userId, taskId) {

    return await Task.findOne({
        where: { id: taskId, userId },
    });
}


// ==================== EXPORTS ====================

export {
    addTask,
    viewTasks,
    editTask,
    deleteTask,
    searchTasks,
    getTaskById,
};