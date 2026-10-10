# TaskFlow Enterprise — Production Deployment & DevOps Runbook

This guide covers deployment instructions, environment variable configurations, Docker container orchestration, database migrations, and production monitoring for TaskFlow Enterprise.

---

## 1. Prerequisites

- **Java Development Kit:** OpenJDK 21 LTS
- **Build Automation:** Apache Maven 3.9+
- **Frontend Runtime:** Node.js 20 LTS & npm 10+
- **Container Engine:** Docker 24+ & Docker Compose v2
- **Relational Database:** PostgreSQL 15+ (or internal H2 for lightweight evaluation)

---

## 2. Environment Configuration

Create a `.env` file at the root of the project using the provided `.env.example`:

```bash
# Server Environment
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod

# Relational Persistence
DB_URL=jdbc:postgresql://postgres:5432/taskflow_db
DB_USERNAME=taskflow_user
DB_PASSWORD=SecureProductionPassword123!

# Cryptographic Token Settings
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION_MS=86400000
JWT_REFRESH_EXPIRATION_MS=604800000

# CORS Allowed Origins
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://taskflow.yourdomain.com
```

---

## 3. Docker Compose Deployment (Recommended)

To launch the full enterprise stack with PostgreSQL, Spring Boot, and NGINX:

```bash
# 1. Build and boot all containers in detached mode
docker compose up -d --build

# 2. Inspect real-time container health
docker compose ps

# 3. Stream aggregate application logs
docker compose logs -f backend
```

---

## 4. Manual Bare-Metal / Cloud VM Deployment

### 4.1 Backend Service
```bash
cd backend
mvn clean package -DskipTests
java -jar target/taskflow-backend-1.0.0.jar --spring.profiles.active=prod
```

### 4.2 Frontend Web App
```bash
cd frontend
npm ci
npm run build
# Serve dist/ via NGINX or static web CDN
```

---

## 5. Health Check & Telemetry Endpoints

- **Liveness & Readiness Probe:** `GET http://localhost:8080/api/health`
- **Application Info:** `GET http://localhost:8080/actuator/info`
- **Prometheus Metrics:** `GET http://localhost:8080/actuator/prometheus`
