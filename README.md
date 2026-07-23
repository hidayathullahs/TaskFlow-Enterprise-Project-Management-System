# TaskFlow - Enterprise Project Management System (Production Delivery Specification)

TaskFlow is a production-grade, multi-tenant ready Enterprise Project Management Platform built from scratch with **Java 21**, **Spring Boot 3.2.5**, **Spring Security 6**, **MySQL 8.0**, **STOMP WebSockets**, **Apache POI**, **OpenPDF**, **Vite**, and **React 18 + Tailwind CSS**.

---

## 🏗️ 1. Enterprise System Architecture

```
 ┌───────────────────────────────────────────────────────────────────────────┐
 │                   React 18 + Vite Production Frontend                     │
 │          (Tailwind CSS, MUI, Lucide Icons, Axios Interceptors)            │
 └─────────────────────────────────────┬─────────────────────────────────────┘
                                       │ HTTPS / WSS
                                       ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │                   Nginx Reverse Proxy & Load Balancer                     │
 │          (Static Asset Server + SPA Router + WebSocket Proxy)             │
 └─────────────────────────────────────┬─────────────────────────────────────┘
                                       │
                                       ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │                    Spring Boot 3 API Gateway & Security                   │
 │      (Stateless JWT Auth, Refresh Token Rotation, Rate Limiter, CORS)    │
 └──────────┬────────────────┬─────────────────┬─────────────────┬───────────┘
            │                │                 │                 │
            ▼                ▼                 ▼                 ▼
 ┌──────────────────┐ ┌──────────────┐ ┌───────────────┐ ┌───────────────┐
 │ Spring Data JPA  │ │ Apache POI   │ │ OpenPDF       │ │ STOMP Broker  │
 │  & Hibernate     │ │ Excel Engine │ │ PDF Generator │ │ Push Engine   │
 └──────────┬───────┘ └──────────────┘ └───────────────┘ └───────────────┘
            │
            ▼
 ┌──────────────────┐
 │  MySQL 8.0 DB    │
 │ (Soft Delete,    │
 │  UUIDs, Auditing)│
 └──────────────────┘
```

---

## 🔑 2. Default Seed Credentials

Default seeded organization super administrator:
- **Email**: `admin@taskflow.com`
- **Password**: `Password@123`
- **Role**: `ROLE_SUPER_ADMIN`

---

## ⚡ 3. Quick Start & Docker Deployment

### Option A: Complete Docker Compose Production Stack
To spin up MySQL 8.0, Spring Boot 3 Backend, and React Nginx Frontend simultaneously:

```bash
docker-compose up --build -d
```
- **Frontend App**: `http://localhost`
- **Backend Swagger OpenAPI**: `http://localhost:8080/swagger-ui.html`
- **MySQL DB Port**: `localhost:3306`

### Option B: Local Developer Mode

#### 1. Backend (Spring Boot 3 + Java 21)
```bash
cd backend
mvn spring-boot:run
```

#### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 📑 4. Core REST API Module Matrix

| Module | Base Path | Key Functionality |
| :--- | :--- | :--- |
| **Authentication** | `/api/v1/auth` | Login, Register, Refresh Token, OTP Verification, Password Policy |
| **Executive Dashboard** | `/api/v1/dashboard` | Real-time KPI Stats, Project Doughnut, Productivity Bar, Priority Radar |
| **HR & Directory** | `/api/v1/users` | Employee Directory, Skill Search, Org Hierarchy Tree |
| **Departments** | `/api/v1/departments` | Department CRUD & Budget Analytics |
| **Teams** | `/api/v1/teams` | Cross-Functional Team Management & Lead Assignments |
| **File Engine** | `/api/v1/files` | Disk Storage, Secure Upload, Streaming Download & Inline Preview |
| **Project Portfolio** | `/api/v1/projects` | Lifecycle Management, Code Generation (`TF-001`), Milestones, Budget |
| **Tasks & Kanban** | `/api/v1/tasks` | Task Numbering (`TF-101`), Kanban Columns, Time Tracking, Comments |
| **Reports & Export** | `/api/v1/reports` | Multi-sheet Excel (`.xlsx`), OpenPDF status reports (`.pdf`), CSV export |
| **Notifications** | `/api/v1/notifications` | STOMP WebSockets, Alert Drawer, Unread Badge Counter |
| **AI Intelligence** | `/api/v1/ai` | ML-Ready Risk Prediction, Workload Heatmap, Smart Recommendations |

---

## 🔐 5. Security & Compliance Controls
- **Dual UUID Architecture**: Hides database Auto-Increment Primary Keys behind RFC-4122 UUIDs (`public_id`) on all REST responses.
- **Soft Delete Pattern**: Prevents accidental data deletion using `is_deleted`, `deleted_at`, and `deleted_by`.
- **JWT Protection**: Short-lived JWT access tokens paired with DB-persisted refresh token rotation.
- **Optimistic Locking**: `@Version` annotation on all entities prevents concurrent edit overwrites.
