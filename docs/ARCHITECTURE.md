# TaskFlow Enterprise — System Architecture Blueprint

This document defines the high-level system architecture, component boundaries, domain interactions, and data flows for the TaskFlow Enterprise Project Management System.

---

## 1. System Topology Overview

TaskFlow Enterprise utilizes a decoupled modern multi-tier architecture consisting of a single-page application (SPA) frontend, an enterprise Spring Boot REST & WebSocket core, and an enterprise persistence layer.

```mermaid
graph TD
    User["Web & Mobile Clients"] -->|"HTTPS / WSS"| Gateway["Vite React SPA / NGINX"]
    Gateway -->|"REST /api/*"| SpringBoot["Spring Boot 3 Core Service"]
    SpringBoot -->|"Security Filter Chain"| JwtAuth["JWT Stateless Auth / RBAC"]
    SpringBoot -->|"WebSocket STOMP"| SockJS["Real-Time Event Broker"]
    SpringBoot -->|"Hibernate / JPA"| DB[("PostgreSQL / H2 Database")]
    SpringBoot -->|"OpenPDF / Apache POI"| DocEngine["Document Generation Engine"]
    SpringBoot -->|"AI Heuristics Core"| AiEngine["Predictive Analytics Engine"]
```

---

## 2. Technology Stack & Framework Selection

### 2.1 Backend Architecture
- **Language & Runtime:** Java 21 LTS (Modern Switch Expressions, Virtual Threads ready, Pattern Matching)
- **Application Framework:** Spring Boot 3.x
- **Persistence:** Spring Data JPA with Hibernate ORM
- **Security:** Spring Security 6 with stateless JWT Bearer token authentication & PBKDF2 / BCrypt password hashing
- **Messaging:** Spring WebSocket with SockJS and STOMP sub-protocol for microsecond sprint updates
- **Document Generation:** OpenPDF (PDF executive briefings) & Apache POI (Excel spreadsheets)
- **API Documentation:** SpringDoc OpenAPI v3 / Swagger UI

### 2.2 Frontend Architecture
- **Library:** React 18 (Concurrent Mode, Hooks, Functional Components)
- **Build Tool:** Vite 5 with Hot Module Replacement (HMR)
- **Routing:** React Router v6 with declarative nested layout routing and authenticated route guards
- **Iconography:** Lucide React
- **Styling:** Modular CSS Design System with CSS Custom Properties, hardware-accelerated transforms, and glassmorphism tokens

---

## 3. Data Flow & Security Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor Client as React Frontend
    participant Filter as JwtAuthenticationFilter
    participant Controller as REST Controller
    participant Service as Business Service
    participant Repo as JPA Repository
    participant DB as Database

    Client->>Filter: HTTP Request + Bearer JWT Token
    Filter->>Filter: Validate Signature & Expiration
    alt Token Valid
        Filter->>Controller: Forward to Mapped Endpoint
        Controller->>Service: Execute Domain Business Logic
        Service->>Repo: Query Entities / Perform Mutating Ops
        Repo->>DB: SQL Execution via Connection Pool
        DB-->>Repo: Query Result Sets
        Repo-->>Service: Managed Domain Entities
        Service-->>Controller: Return DTOs (TaskResponse, etc.)
        Controller-->>Client: HTTP 200 OK (ApiResponse wrapper)
    else Token Invalid / Expired
        Filter-->>Client: HTTP 401 Unauthorized (JwtAuthenticationEntryPoint)
    end
```

---

## 4. Key Subsystems

### 4.1 Real-Time Collaborative Sync
- Task status changes trigger WebSocket notifications broadcast over topic destinations (e.g. `/topic/tasks`, `/topic/projects/{id}`).
- Connected clients update their local Kanban sprint state immediately without requiring manual page reloads.

### 4.2 Document Export Pipeline
- Executive reports dynamically stream binary content directly to the HTTP response output stream, preventing high memory overhead on large tenant datasets.
- Includes audit trails detailing exporting user, timestamp, and query parameters.
