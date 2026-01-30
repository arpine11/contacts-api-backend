# Contacts Management API (Backend)

This project is a RESTful backend API for managing personal contacts.
It provides user authentication and authorization and ensures that each
user can create, view, and edit only their own contacts.

The backend is responsible for handling business logic, data storage,
and security rules.

---

## Core Concepts

- **Authentication**: verifies who the user is (login)
- **Authorization**: controls what the user is allowed to do
- **JWT (JSON Web Tokens)**: used to securely identify users
- **REST API**: backend communicates via HTTP requests and JSON responses

---

## Features

- User registration
- User login with JWT authentication
- Secure password storage using hashing
- Create new contacts
- Retrieve list of user’s contacts
- Edit existing contacts
- Strict data ownership enforcement (users can manage only their own contacts)

---

## Tech Stack

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **SQLite** – Lightweight relational database
- **better-sqlite3** – SQLite driver
- **JWT (jsonwebtoken)** – Authentication tokens
- **bcryptjs** – Password hashing
- **dotenv** – Environment variables
- **cors** – Enables frontend-backend communication

---

## Project Structure

contacts-api-backend/
├── server.js
├── .env
├── package.json
├── src/
│ ├── db/
│ │ └── database.js
│ ├── middleware/
│ │ └── auth.js
│ └── routes/
│ ├── auth.js
│ └── contacts.js


### Folder Explanation
- `server.js` – Entry point, starts the Express server
- `database.js` – Initializes database and tables
- `auth.js` – Middleware that verifies JWT tokens
- `auth.js (routes)` – Registration and login logic
- `contacts.js` – CRUD operations for contacts

---

## Database Design

### Users Table
| Field | Description |
|------|------------|
| id | Unique user ID |
| username | Unique username |
| password_hash | Hashed password |

### Contacts Table
| Field | Description |
|------|------------|
| id | Contact ID |
| user_id | Owner of the contact |
| name | Contact name |
| email | Contact email |
| phone | Contact phone |

Each contact is linked to a user using `user_id`.

---

## Setup Instructions

### 1. Install dependencies
```bash
