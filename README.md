<div align="center">

# Console Todo App

**A console-based CRUD application for task management — built on Node.js, Sequelize, and MySQL.**

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-ORM-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

`Batch 18` · `SDET Program` · `Simple CRUD Project`

</div>

<br>

<div align="center">

### 🎬 Demo

[![Watch the demo](https://img.shields.io/badge/▶_Watch_Full_Walkthrough-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](#)
<!-- 👆 Replace the # above with your uploaded video link (YouTube / Google Drive / Loom) -->

*A complete run-through of registration, login, and every task operation — recorded end to end.*

</div>

<br>

<details>
<summary><strong>📑 Table of Contents</strong></summary>
<br>

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Usage](#usage)
- [Validation Rules](#validation-rules)
- [Roadmap](#roadmap)
- [Author](#author)
- [License](#license)

</details>

---

## Overview

**Console Todo App** is a terminal-based task management system where users can register an account, log in securely, and manage a private list of tasks — creating, viewing, editing, deleting, and searching — all without leaving the command line.

The codebase is split by concern: connection and models live in one module, authentication logic in another, task logic in a third, and the console menus tie everything together. Data is persisted in MySQL via Sequelize, and passwords are never stored in plain text.

## Features

- **Authentication** — Register and log in with bcrypt-hashed passwords
- **Add Task** — Capture title, description, due date, and priority
- **View Tasks** — List every task belonging to the signed-in user
- **Edit Task** — Shows current values before prompting for updates
- **Delete Task** — Requires explicit confirmation before removal
- **Search Tasks** — Keyword search across title and description
- **Logout** — Returns to the main menu without closing the app
- **Validation Everywhere** — Every input is checked before it touches the database
- **Per-User Isolation** — Tasks are always scoped to the logged-in user

## Tech Stack

Built with a small, reliable set of tools:

| Technology | Role |
|---|---|
| **Node.js** | JavaScript runtime powering the application |
| **MySQL** | Relational database for persistent storage |
| **Sequelize** | ORM handling models, associations, and queries |
| **bcrypt** | One-way password hashing |
| **readline-sync** | Synchronous console input/output |
| **dotenv** | Loads configuration from the `.env` file |

## Project Structure

```
todo_app/
├── main.js         # Entry point — menus & input flows
├── db.js           # Sequelize connection & model definitions
├── user.js         # Register / Login business logic
├── task.js         # Task CRUD business logic
├── .env.example    # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A running [MySQL](https://www.mysql.com/) server

### Installation

```bash
git clone https://github.com/<your-username>/todo_app.git
cd todo_app
npm install
```

### Configuration

Create the database:

```sql
CREATE DATABASE todo_app;
```

Copy the environment template and fill in your own credentials — see [Environment Variables](#environment-variables) for what each value means:

```bash
cp .env.example .env
```

### Run

```bash
npm start
```

Tables are created automatically on first run — no manual migration needed.

## Environment Variables

The app never hardcodes credentials — everything database-related is read from a local `.env` file at runtime, courtesy of `dotenv`. Since `.env` holds real secrets, it's listed in `.gitignore` and never pushed to GitHub. Instead, the repository ships a `.env.example` template so anyone cloning the project knows exactly what to provide.

```dotenv
# Database Configuration
DB_HOST=localhost
DB_PORT=<your_database_port>
DB_NAME=<your_database_name>
DB_USER=<your_database_user>
DB_PASSWORD=<your_database_password>
```

| Variable | Description |
|---|---|
| `DB_HOST` | Hostname where your MySQL server is running (`localhost` for a local setup) |
| `DB_PORT` | Port MySQL is listening on — **`3306`** unless you've changed your MySQL install's default |
| `DB_NAME` | Name of the database the app should connect to |
| `DB_USER` | MySQL username with access to that database |
| `DB_PASSWORD` | Password for the above MySQL user |

> Copy `.env.example` to `.env` and replace each placeholder with your own values before running `npm start`.

## Database Schema

**User**

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `name` | STRING | Required |
| `email` | STRING | Required, unique |
| `password` | STRING | Hashed with bcrypt |

**Task**

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-increment |
| `userId` | INTEGER | Foreign key → `User.id` |
| `title` | STRING | Required |
| `description` | TEXT | Optional |
| `dueDate` | DATEONLY | Format `YYYY-MM-DD` |
| `priority` | ENUM | `Low`, `Medium`, `High` |
| `status` | ENUM | `Pending`, `Completed` |
| `createdAt` | DATETIME | Auto-managed by Sequelize |
| `updatedAt` | DATETIME | Auto-managed by Sequelize |

## Usage

```
===== Welcome to Todo App =====
1. Register
2. Login
3. Exit
Enter your choice:
```

After logging in:

```
===== Todo Menu =====
1. Add Task
2. View All Tasks
3. Edit Task
4. Delete Task
5. Search Tasks
6. Logout
Enter your choice:
```

`Logout` returns to the main menu; `Exit` closes the application and the database connection cleanly.

## Validation Rules

| Use Case | Message |
|---|---|
| Register | `Name cannot be empty.` |
| Register | `Invalid email format.` |
| Register | `Password must be at least 4 characters.` |
| Register | `Email already exists.` |
| Login | `Invalid email or password.` |
| Login | `Wrong credential` |
| Add / Edit Task | `Task title cannot be empty.` |
| Add / Edit Task | `Priority must be Low, Medium, or High.` |
| Edit Task | `Invalid date format.` |
| Edit Task | `Task not found.` |
| Delete Task | `Task not found.` |
| Delete Task | `Delete cancelled.` |
| Search Tasks | `No matching tasks found.` |


## Author

**Rakib Fahad**

[SDET — Batch 18]

---

<div align="center">

If this project was useful to you, consider giving it a ⭐

</div>
