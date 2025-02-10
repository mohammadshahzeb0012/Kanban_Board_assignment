kanban-backend/

# Kanban Board Backend Documentation

This document provides an overview and detailed explanation of the Kanban board backend project. It covers the overall file structure, database configuration, models, controllers, middleware, routes, and example JSON payloads (requests and successful responses) for API endpoints.

## Project Overview

This backend project is built using Node.js, Express, and MongoDB (with Mongoose) and implements a simple Kanban board application. The application supports:

- **User Authentication and Authorization:**  
  Users can register and log in. Each user is assigned a personal Kanban board.
  
- **Board and Lists:**  
  Users can create, update, and delete lists on their board.
  
- **Tasks/Cards:**  
  Users can create, update, delete, and drag-and-drop tasks within lists.
  
- **Authentication:**  
  Implemented using JWT tokens. Secure routes are protected via middleware.

---

## API Endpoints and Example JSON Payloads

### 1. User Registration
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "jane.doe@example.com",
  "password": "StrongPassword123"
}
```

**Successful Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "645fefc74b2e8a0012345678",
    "email": "jane.doe@example.com"
  },
  "board": {
    "_id": "645ff0d24b2e8a0012345679",
    "title": "My Kanban Board",
    "owner": "645fefc74b2e8a0012345678",
    "lists": [],
    "createdAt": "2025-02-06T15:30:10.000Z",
    "updatedAt": "2025-02-06T15:30:10.000Z"
  }
}
```

### 2. User Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "jane.doe@example.com",
  "password": "StrongPassword123"
}
```

**Successful Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "645fefc74b2e8a0012345678",
    "email": "jane.doe@example.com"
  },
  "board": {
    "_id": "645ff0d24b2e8a0012345679",
    "title": "My Kanban Board",
    "owner": "645fefc74b2e8a0012345678",
    "lists": [
      {
        "_id": "645ff1a94b2e8a0012345680",
        "title": "To Do",
        "tasks": [],
        "createdAt": "2025-02-06T15:35:05.000Z",
        "updatedAt": "2025-02-06T15:35:05.000Z"
      }
    ],
    "createdAt": "2025-02-06T15:30:10.000Z",
    "updatedAt": "2025-02-06T15:30:10.000Z"
  }
}
```

### 3. Create a New List
**Endpoint:** `POST /api/lists`

**Requires Authorization header:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "In Progress"
}
```

**Successful Response:**
```json
{
  "_id": "645ff2c94b2e8a0012345681",
  "title": "In Progress",
  "board": "645ff0d24b2e8a0012345679",
  "tasks": [],
  "createdAt": "2025-02-06T15:40:25.000Z",
  "updatedAt": "2025-02-06T15:40:25.000Z"
}
```

### 4. Update a List Title
**Endpoint:** `PUT /api/lists/:id`

**Request Body:**
```json
{
  "title": "Review",
  "id": "645ff2c94b2e8a0012345681"
}
```

**Successful Response:**
```json
{
  "_id": "645ff2c94b2e8a0012345681",
  "title": "Review",
  "board": "645ff0d24b2e8a0012345679",
  "tasks": [],
  "createdAt": "2025-02-06T15:40:25.000Z",
  "updatedAt": "2025-02-06T15:45:00.000Z"
}
```

### 5. Move a Task (Drag-and-Drop)
**Endpoint:** `POST /api/tasks/move`

**Requires Authorization header**

**Request Body:**
```json
{
  "taskId": "645ff3d54b2e8a0012345682",
  "newListId": "645ff1a94b2e8a0012345680"
}
```

**Successful Response:**
```json
{
  "_id": "645ff3d54b2e8a0012345682",
  "title": "Design Homepage v2",
  "description": "Refine the design after feedback.",
  "dueDate": "2025-02-11T00:00:00.000Z",
  "priority": "Medium",
  "list": "645ff1a94b2e8a0012345680",
  "createdAt": "2025-02-06T15:45:45.000Z",
  "updatedAt": "2025-02-06T15:55:00.000Z"
}
```