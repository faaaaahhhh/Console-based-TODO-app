import { initDB, closeDB } from "./db.js";
import readlineSync from "readline-sync";
import {
    registerUser,
    loginUser,
} from "./user.js";

import {
    addTask,
    viewTasks,
    editTask,
    deleteTask,
    searchTasks,
    getTaskById,
} from "./task.js";

import { User } from "./db.js";


// ==================== VALID INPUT HELPER ====================

async function getValidInput(question, validateFn, errorMsg) {

    while (true) {

        const value = readlineSync.question(question);

        if (validateFn(value)) {
            return value;
        }

        console.log(errorMsg);
    }
}


// ==================== TODO MENU ====================

async function todoMenu(currentUser) {

    let isLoggedIn = true;

    while (isLoggedIn) {

        console.log("\n===== Todo Menu =====");
        console.log("1. Add Task");
        console.log("2. View All Tasks");
        console.log("3. Edit Task");
        console.log("4. Delete Task");
        console.log("5. Search Tasks");
        console.log("6. Logout");

        const choice = readlineSync.question("Enter your choice: ");

        switch (choice) {

            // ================= ADD TASK =================
            case "1": {

                const title = await getValidInput(
                    "Enter task title: ",
                    (v) => v.trim() !== "",
                    "Title cannot be empty."
                );

                const description = await getValidInput(
                    "Enter task description: ",
                    (v) => v.trim() !== "",
                    "Description cannot be empty."
                );

                const dueDate = await getValidInput(
                    "Enter due date (YYYY-MM-DD): ",
                    (value) => {
                        const [y, m, d] = value.split("-").map(Number);
                        const date = new Date(y, m - 1, d);

                        return (
                            /^\d{4}-\d{2}-\d{2}$/.test(value) &&
                            date.getFullYear() === y &&
                            date.getMonth() === m - 1 &&
                            date.getDate() === d
                        );
                    },
                    "Invalid date format."
                );

                let priority = await getValidInput(
                    "Enter priority (Low/Medium/High): ",
                    (v) =>
                        ["low", "medium", "high"].includes(
                            v.toLowerCase()
                        ),
                    "Invalid priority."
                );

                priority =
                    priority.charAt(0).toUpperCase() +
                    priority.slice(1).toLowerCase();

                await addTask(
                    currentUser.id,
                    title,
                    description,
                    dueDate,
                    priority
                );

                break;
            }

            // ================= VIEW TASKS =================
            case "2": {
                await viewTasks(currentUser.id);
                break;
            }

            // ================= EDIT TASK =================
            case "3": {

                const taskId = await getValidInput(
                    "Enter task ID to edit: ",
                    (v) => !isNaN(v) && Number(v) > 0,
                    "Invalid task ID."
                );

                const task = await getTaskById(
                    currentUser.id,
                    Number(taskId)
                );

                if (!task) {
                    console.log("Task not found.");
                    break;
                }

                const title = await getValidInput(
                    `Current Title: ${task.title}\nEnter new title: `,
                    (v) => v.trim() !== "",
                    "Title cannot be empty."
                );

                const description = await getValidInput(
                    `Current Description: ${task.description}\nEnter new description: `,
                    (v) => v.trim() !== "",
                    "Description cannot be empty."
                );

                const dueDate = await getValidInput(
                    `Current Due Date: ${task.dueDate}\nEnter new due date (YYYY-MM-DD): `,
                    (value) => {
                        const [y, m, d] = value.split("-").map(Number);
                        const date = new Date(y, m - 1, d);

                        return (
                            /^\d{4}-\d{2}-\d{2}$/.test(value) &&
                            date.getFullYear() === y &&
                            date.getMonth() === m - 1 &&
                            date.getDate() === d
                        );
                    },
                    "Invalid date format."
                );

                let priority = await getValidInput(
                    `Current Priority: ${task.priority}\nEnter new priority (Low/Medium/High): `,
                    (v) =>
                        ["low", "medium", "high"].includes(
                            v.toLowerCase()
                        ),
                    "Invalid priority."
                );

                priority =
                    priority.charAt(0).toUpperCase() +
                    priority.slice(1).toLowerCase();

                await editTask(
                    currentUser.id,
                    Number(taskId),
                    title,
                    description,
                    dueDate,
                    priority,
                    task.status
                );

                break;
            }

            // ================= DELETE TASK =================
            case "4": {

                const taskId = await getValidInput(
                    "Enter task ID to delete: ",
                    (v) => !isNaN(v) && Number(v) > 0,
                    "Invalid task ID."
                );

                const confirm = readlineSync.question(
                    "Are you sure? (yes/no): "
                );

                if (confirm.toLowerCase() !== "yes") {
                    console.log("Delete cancelled.");
                    break;
                }

                await deleteTask(
                    currentUser.id,
                    Number(taskId)
                );

                break;
            }

            // ================= SEARCH TASK =================
            case "5": {

                const keyword = await getValidInput(
                    "Enter search keyword: ",
                    (v) => v.trim() !== "",
                    "Keyword cannot be empty."
                );

                await searchTasks(
                    currentUser.id,
                    keyword
                );

                break;
            }

            // ================= LOGOUT =================
            case "6": {
                console.log(
                    `Goodbye ${currentUser.name}!`
                );
                isLoggedIn = false;
                break;
            }

            default:
                console.log("Invalid choice.");
        }
    }
}


// ==================== MAIN MENU ====================

async function mainMenu() {

    let running = true;

    while (running) {

        console.log("\n===== Welcome to Todo App =====");
        console.log("1. Register");
        console.log("2. Login");
        console.log("3. Exit");

        const choice = readlineSync.question("Enter choice: ");

        switch (choice) {

            // ================= REGISTER =================
            case "1": {

                const name = await getValidInput(
                    "Enter name: ",
                    (v) => v.trim() !== "",
                    "Name cannot be empty."
                );

                const email = await getValidInput(
                    "Enter email: ",
                    (v) =>
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
                    "Invalid email format."
                );

                // CHECK DUPLICATE BEFORE PASSWORD
                const existingUser = await User.findOne({
                    where: {
                        email: email.trim().toLowerCase(),
                    },
                });

                if (existingUser) {
                    console.log("Email already exists.");
                    break;
                }

                const password = readlineSync.question(
                    "Enter password: ",
                    {
                        hideEchoBack: true
                    }
                );

                await registerUser(name, email, password);

                break;
            }

            // ================= LOGIN =================
            case "2": {

                const email = await getValidInput(
                    "Enter email: ",
                    (v) =>
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
                    "Invalid email format."
                );

                const password = readlineSync.question(
                    "Enter password: ",
                    {
                        hideEchoBack: true
                    }
                );

                const user = await loginUser(email, password);

                if (user) {
                    await todoMenu(user);
                }

                break;
            }

            // ================= EXIT =================
            case "3": {
                console.log("Goodbye!");
                running = false;
                break;
            }

            default:
                console.log("Invalid choice.");
        }
    }
}


// ==================== APP START ====================

async function startApp() {

    try {
        await initDB();
        await mainMenu();
    } catch (err) {
        console.log("Unexpected error:", err);
    } finally {
        await closeDB();
    }
}

startApp();