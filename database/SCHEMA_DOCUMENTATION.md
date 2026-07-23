# TaskFlow Database Architecture & ER Documentation

## 📐 ER & Entity Relationship Overview

The database design follows 3rd Normal Form (3NF) principles, optimized for high throughput, transactional integrity, and scalable queries.

```
+----------------+      1:N      +-----------------+      1:N      +-------------------+
|  departments   |-------------->|      users      |-------------->|     projects      |
+----------------+               +-----------------+               +-------------------+
        ^                                 |                                  |
        | 1:N                             | 1:N                              | 1:N
+----------------+               +-----------------+               +-------------------+
|     teams      |               |   user_tokens   |               |       tasks       |
+----------------+               +-----------------+               +-------------------+
        |                                                                    |
        | N:M (team_members)                                                 | 1:N
        v                                                                    v
+----------------+                                                 +-------------------+
|     users      |                                                 |   task_comments   |
+----------------+                                                 +-------------------+
                                                                             |
                                                                             | 1:N
                                                                             v
                                                                   +-------------------+
                                                                   | task_attachments  |
                                                                   +-------------------+
```

---

## 🗄️ Core Tables Summary

| Table | Purpose | Index Strategy | Cascade Behavior |
| :--- | :--- | :--- | :--- |
| `roles` | System roles (`ROLE_SUPER_ADMIN`, `ROLE_ADMIN`, `ROLE_PM`, etc.) | Unique on `name` | Prevent delete if bound |
| `permissions` | Granular permission definitions (`USER_CREATE`, `PROJECT_UPDATE`, etc.) | Unique on `name` | Cascade on join table |
| `departments` | Organizational departments (`ENG`, `PROD`, `QA`, etc.) | Unique on `code`, index on `status` | Nullify `manager_id` on user removal |
| `users` | Employee & Client user accounts | Unique on `email`, index on `status`, `department_id` | Nullify `department_id` & `reporting_manager_id` |
| `user_tokens` | JWT refresh tokens, Password Reset, & Email verification tokens | Index on `token_value`, composite index `(user_id, token_type)` | Cascade on user deletion |
| `projects` | Core projects, budgets, dates, and managers | Unique on `code`, index on `status`, `project_manager_id` | Nullify manager/department on delete |
| `tasks` | Project tasks, subtasks, kanban states, and work hours | Index on `project_id`, `status`, `assignee_id`, `due_date` | Cascade on project deletion |
| `task_timings` | Timer tracking records for employee workload | Index on `task_id`, `user_id` | Cascade on task deletion |
| `activity_logs` | Audit trail for enterprise compliance | Index on `user_id`, composite index `(entity_type, entity_id)` | Nullify `user_id` on user deletion |
| `notifications` | System & real-time WebSocket notifications | Composite index `(user_id, is_read)` | Cascade on user deletion |

---

## ⚙️ Key Constraints & Indexes

1. **Foreign Key Integrity**:
   - `ON DELETE CASCADE` applied to child entities (e.g. `tasks` -> `task_comments`, `task_attachments`, `task_checklists`).
   - `ON DELETE SET NULL` applied to supervisory references (e.g. `reporting_manager_id`, `project_manager_id`, `department_id`).
2. **Performance Indexes**:
   - High-cardinality search fields indexed (`email`, `project.code`, `department.code`).
   - Query filters indexed (`status`, `due_date`, `user_id`, `is_read`).
   - Foreign key columns explicitly indexed for high-performance join operations.
