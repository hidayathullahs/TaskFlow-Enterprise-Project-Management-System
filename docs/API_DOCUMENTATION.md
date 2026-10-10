# TaskFlow Enterprise — REST API Specification & Developer Guide

This document provides complete documentation for the TaskFlow Enterprise REST API endpoints, authentication flows, error handling paradigms, and data schemas.

---

## 1. Architecture & Protocol Overview

- **Base URL:** `http://localhost:8080/api` (or production hostname)
- **Protocol:** HTTP/1.1 and HTTP/2 over TLS
- **Data Exchange Format:** `application/json; charset=UTF-8`
- **Swagger / OpenAPI Interactive UI:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI v3 JSON Specification:** `http://localhost:8080/v3/api-docs`

---

## 2. Authentication & Authorization

All protected endpoints require a JWT Bearer token in the `Authorization` header:

```http
Authorization: Bearer <your_jwt_access_token>
```

### Role-Based Access Control (RBAC) Matrix

| Role | Permissions |
| :--- | :--- |
| `ROLE_SUPER_ADMIN` | Global platform administration, cross-tenant management, audit history access |
| `ROLE_ADMIN` | Department/team admin, project creation, report export, user provisioning |
| `ROLE_PROJECT_MANAGER` | Project planning, task assignment, milestone scheduling, analytics review |
| `ROLE_TEAM_LEAD` | Sprint board management, task approval, squad resource allocation |
| `ROLE_DEVELOPER` | Task state progression, time logging, comment threads, file attachments |
| `ROLE_VIEWER` | Read-only access to published projects, dashboards, and shared reports |

---

## 3. API Endpoints Reference

### 3.1 Authentication Controller (`/api/auth`)

| Method | Endpoint | Description | Security |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Authenticate with credentials and receive JWT | Public |
| `POST` | `/api/auth/refresh-token` | Obtain a fresh access token using refresh token | Public |
| `POST` | `/api/auth/logout` | Revoke session and invalidate refresh token | Authenticated |
| `POST` | `/api/auth/forgot-password` | Request password reset verification link | Public |
| `POST` | `/api/auth/reset-password` | Set new password with reset token | Public |

#### Login Request Payload
```json
{
  "email": "sarah.chen@taskflow.internal",
  "password": "Password123!"
}
```

#### Login Response Payload
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "d8a1c97a-9a73-42e1-a20c-77296fbe0293",
  "type": "Bearer",
  "id": 1,
  "username": "sarah.chen",
  "email": "sarah.chen@taskflow.internal",
  "roles": ["ROLE_PROJECT_MANAGER"]
}
```

---

### 3.2 Task Management Controller (`/api/tasks`)

| Method | Endpoint | Description | Security |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Paginated search of tasks with filters | Authenticated |
| `GET` | `/api/tasks/{id}` | Retrieve comprehensive task details | Authenticated |
| `POST` | `/api/tasks` | Create a new enterprise task | `MANAGER`, `ADMIN` |
| `PUT` | `/api/tasks/{id}` | Update task attributes, status, and assignees | Authenticated |
| `PATCH` | `/api/tasks/{id}/status` | Fast status transition (e.g., TODO → DONE) | Authenticated |
| `DELETE` | `/api/tasks/{id}` | Soft delete or archive task | `ADMIN` |

---

### 3.3 Project Controller (`/api/projects`)

| Method | Endpoint | Description | Security |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | List projects with health metrics | Authenticated |
| `GET` | `/api/projects/{id}` | Fetch project details, squads, milestones | Authenticated |
| `POST` | `/api/projects` | Initialize a new enterprise project | `MANAGER`, `ADMIN` |
| `PUT` | `/api/projects/{id}` | Update project metadata and deadlines | `MANAGER`, `ADMIN` |
| `DELETE` | `/api/projects/{id}` | Archive project | `ADMIN` |
| `GET` | `/api/projects/{id}/stats` | Aggregate velocity, completion %, sprint KPI | Authenticated |

---

### 3.4 AI Intelligence Controller (`/api/ai`)

| Method | Endpoint | Description | Security |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/analyze-risk` | Calculate predictive delay probability | Authenticated |
| `POST` | `/api/ai/suggest-assignment` | Neural recommendation for task delegation | Authenticated |
| `POST` | `/api/ai/generate-summary` | Natural-language executive sprint digest | Authenticated |

---

### 3.5 Executive Reporting Controller (`/api/reports`)

| Method | Endpoint | Response Media Type | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reports/export/pdf` | `application/pdf` | Compiled executive PDF briefing via OpenPDF |
| `GET` | `/api/reports/export/excel` | `application/vnd.openxmlformats` | Multi-sheet analytics spreadsheet via Apache POI |
| `GET` | `/api/reports/export/csv` | `text/csv` | Raw workforce task telemetry stream |

---

### 3.6 Workforce & Team Controllers (`/api/users`, `/api/teams`, `/api/departments`)

| Method | Endpoint | Description | Security |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/me` | Current authenticated user profile | Authenticated |
| `GET` | `/api/users` | Directory of enterprise members | Authenticated |
| `GET` | `/api/teams` | Squads and cross-functional teams | Authenticated |
| `GET` | `/api/departments` | Corporate organizational departments | Authenticated |

---

## 4. Standard Response Formats

### Success Wrapper (`ApiResponse<T>`)
```json
{
  "success": true,
  "message": "Operation executed successfully",
  "data": { ... },
  "timestamp": "2026-10-10T21:05:00.000Z"
}
```

### Error Wrapper (`ErrorResponse`)
```json
{
  "timestamp": "2026-10-10T21:05:00.000Z",
  "status": 404,
  "error": "Not Found",
  "message": "Task with ID 42 was not found",
  "path": "/api/tasks/42"
}
```
