# CampusIQ — Distributed Competitive Learning & Skill Benchmarking Platform
## Comprehensive Technical Project Report

**Department:** Computer Science & Engineering  
**Project Title:** CampusIQ: A Microservices-Based Distributed Coding & Real-Time Skill Benchmarking Platform  
**Developer / Student Name:** Arpit Verma  
**GitHub Repository:** [https://github.com/Arpit76691/CampusIQ](https://github.com/Arpit76691/CampusIQ)  
**Academic Year:** 2026–2027  

---

## 1. Executive Summary & Abstract

**CampusIQ** is an enterprise-grade, distributed competitive programming and skill evaluation platform engineered specifically for collegiate institutions. Unlike monolithic coding portals, CampusIQ is architected around an **event-driven, distributed microservices topology** built on **Spring Boot 3 (Java 21)**, **Apache Kafka**, **Redis**, **PostgreSQL**, **Docker**, and a modern **React 18** client powered by the **Microsoft Monaco Editor** (the engine behind VS Code).

The platform solves core institutional problems:
1. **Automated Skill Benchmarking:** Tracking department and batch-wise competency metrics across Data Structures & Algorithms, Database Systems, Computer Networks, and Full Stack Development.
2. **Scalable Contest Hosting:** Decoupling submission intake from compilation and code execution via Apache Kafka event streaming, preventing server bottlenecks during high-concurrency campus contests.
3. **Sub-Second Standings Dissemination:** Utilizing Redis In-Memory Sorted Sets ($O(\log N)$ updates) and bidirectional STOMP over SockJS WebSockets to push live leaderboard rankings to students' browsers in real time.

---

## 2. High-Level Architecture

CampusIQ employs an **Event-Driven Architecture (EDA)** paired with an **API Gateway Pattern**. Every service runs in an isolated Docker container with strict networking boundaries.

```
                                    ┌────────────────────────────────────────────────────────┐
                                    │               Client Layer (Browser)                   │
                                    │   React 18 SPA + Monaco Editor + SockJS / STOMP WS    │
                                    └───────────────────────────┬────────────────────────────┘
                                                                │ HTTP / REST / WebSocket
                                                                ▼
                                    ┌────────────────────────────────────────────────────────┐
                                    │             campusiq-gateway (Port 8080)              │
                                    │    Spring Cloud Gateway • Authoritative CORS • JWT     │
                                    └───────┬──────────────┬───────────────┬───────────────┬─┘
                                            │              │               │               │
                     ┌──────────────────────┘              │               │               └──────────────────────┐
                     ▼                                     ▼               ▼                                      ▼
         ┌───────────────────────┐             ┌────────────────┐ ┌──────────────────┐             ┌───────────────────────┐
         │  campusiq-auth: 8081  │             │campusiq-contest│ │campusiq-analytics│             │campusiq-notification  │
         │  PostgreSQL • BCrypt  │             │   Port 8082    │ │    Port 8086     │             │       Port 8087       │
         └───────────────────────┘             └───────┬────────┘ └────────▲─────────┘             └──────────▲────────────┘
                                                       │                   │                                  │
                                                       ▼                   │                                  │
                                          ┌────────────────────────┐       │                                  │
                                          │campusiq-submission:8083│       │                                  │
                                          │ Ingestion & Validation │       │                                  │
                                          └────────────┬───────────┘       │                                  │
                                                       │                   │                                  │
                                                       ▼ (Kafka Producer)  │                                  │
                                   =============================================                      │
                                             Apache Kafka Message Broker                               │
                                       Topics: submission-events, evaluation-results                  │
                                   =============================================                      │
                                                       │                                              │
                                                       ▼ (Kafka Consumer)                             │
                                          ┌────────────────────────┐                                  │
                                          │campusiq-evaluation:8084│                                  │
                                          │ Test Suite Compilation │                                  │
                                          └────────────┬───────────┘                                  │
                                                       │                                              │
                                                       ▼ (Kafka Producer)                             │
                                          ┌────────────────────────┐                                  │
                                          │campusiq-leaderboard:8085──────────────────────────────────┘
                                          │  Redis ZSet • STOMP WS │
                                          └────────────────────────┘
```

---

## 3. Microservice Specifications & Breakdown

| Microservice | Port | Database / Storage | Key Responsibilities |
|---|---|---|---|
| **`api-gateway`** | `8080` | Stateless (In-Memory) | Central entry point, CORS deduplication, Route validation, JWT extraction and downstream request decoration (`X-User-Id`, `X-User-Role`). |
| **`auth-service`** | `8081` | PostgreSQL (`campusiq_auth`) | User management, BCrypt hashing, JWT issuance (Access + Refresh tokens), Role-based authorization (`STUDENT`, `FACULTY`, `ADMIN`). |
| **`contest-service`** | `8082` | PostgreSQL (`campusiq_contest`) | Contest scheduling, problem management (description, constraints, testcases), contest lifecycle management. |
| **`submission-service`**| `8083` | PostgreSQL (`campusiq_submission`)| Submission ingestion, persistence, payload validation, emitting `submission-events` to Kafka. |
| **`evaluation-service`**| `8084` | Stateless Worker | Consumes `submission-events` from Kafka, evaluates code outputs against test suites, publishes `evaluation-results`. |
| **`leaderboard-service`**| `8085` | Redis In-Memory Cache | Consumes `evaluation-results`, updates Redis Sorted Sets (`ZSet`), broadcasts live ranking deltas via STOMP WebSocket. |
| **`analytics-service`**| `8086` | PostgreSQL (`campusiq_analytics`)| Aggregate metrics: average platform scores, batch percentiles, contest participation rates. |
| **`notification-service`**| `8087`| PostgreSQL (`campusiq_notification`)| In-app event alerts, score notifications, contest commencement warnings. |
| **`frontend`** | `80` | Nginx Alpine / React SPA | Single-page application, Microsoft Monaco Editor workspace, testcase runner, live standings drawer. |

---

## 4. Key Engineering Challenges & Critical Solutions

### 4.1. Browser Polyfill & Vite Production Crash (`global is not defined`)
* **Problem:** In modern browser ESM (ECMAScript Module) environments, Node.js runtime globals like `global` do not exist. When compiling `sockjs-client` for production, bare references to `global` caused an immediate `Uncaught ReferenceError: global is not defined` crash at runtime, rendering a blank white screen.
* **Solution:**
  1. Updated `vite.config.js` with compile-time symbol replacement:
     ```javascript
     define: {
       global: 'globalThis'
     }
     ```
  2. Injected an early-stage runtime bootstrap in `index.html` executing before module initialization:
     ```html
     <script>
       if (typeof global === 'undefined') {
         globalThis.global = globalThis;
       }
     </script>
     ```

### 4.2. API Gateway CORS Conflict (`Multiple Values in Access-Control-Allow-Origin`)
* **Problem:** When frontend requests passed through the API Gateway, both the Gateway's `globalcors` filter and downstream microservice controllers emitted CORS headers. The browser received concatenated headers:
  `Access-Control-Allow-Origin: http://localhost, *`
  which violates the W3C Fetch Standard when `Access-Control-Allow-Credentials: true` is enabled.
* **Solution:**
  1. Established the **API Gateway as the single authoritative CORS policy owner** using `allowedOriginPatterns` (`http://localhost`, `http://localhost:*`, `http://127.0.0.1`).
  2. Implemented `DedupeResponseHeader=Access-Control-Allow-Origin Access-Control-Allow-Credentials, RETAIN_FIRST` in Gateway default filters.
  3. Disabled local CORS filters in downstream Spring Security configs and removed `@CrossOrigin` controller annotations.

### 4.3. Resilient Case-Insensitive Authentication & Sanitization
* **Problem:** PostgreSQL exact `VARCHAR` matching rejected logins when users or mobile auto-capitalizers typed mixed-case emails (e.g., `Tester@campusiq.com`). Additionally, un-trimmed whitespace caused Jakarta Bean Validation `@Email` to return HTTP 400 Bad Request.
* **Solution:**
  1. Updated `UserRepository` with Spring Data JPA query:
     ```java
     Optional<User> findByEmailIgnoreCase(String email);
     ```
  2. Implemented Jackson deserialization sanitizers in `LoginRequest.java` and `RegisterRequest.java` to automatically normalize inputs via `.trim().toLowerCase()`.
  3. Integrated a Spring Boot `CommandLineRunner` (`DataInitializer.java`) to seed verified demo accounts on application boot.

---

## 5. Interactive Problem Solver & Coding Workspace

The platform integrates an in-browser development environment powered by **Microsoft Monaco Editor** (`@monaco-editor/react`):
* **Multi-Language Boilerplate Engine:** Instant language switching across **Java 21**, **Python 3.12**, **C++ 20**, and **JavaScript (Node.js)** with pre-configured class/method signatures.
* **Split-Pane Layout:** Left side displays problem metadata, constraints ($1 \le N \le 10^5$), and sample test cases; right side houses the Monaco editor and the interactive test console.
* **Local Test Execution Console:** Tabbed runner allowing students to test solutions against built-in sample cases or supply custom standard input (`stdin`).
* **Live Standings Slide-Over Drawer:** Real-time leaderboard view connected to STOMP topic `/topic/leaderboard/{contestId}` showing rank shifts as peers submit code.

---

## 6. Verification & Test Audit Trail

All 13 system containers are operational and verified:

```powershell
NAMES                   STATUS                 PORTS
campusiq-frontend       Up (healthy)           0.0.0.0:80->80/tcp
campusiq-gateway        Up (healthy)           0.0.0.0:8080->8080/tcp
campusiq-auth           Up (healthy)           0.0.0.0:8081->8081/tcp
campusiq-contest        Up (healthy)           0.0.0.0:8082->8082/tcp
campusiq-submission     Up (healthy)           0.0.0.0:8083->8083/tcp
campusiq-evaluation     Up (healthy)           0.0.0.0:8084->8084/tcp
campusiq-leaderboard    Up (healthy)           0.0.0.0:8085->8085/tcp
campusiq-analytics      Up (healthy)           0.0.0.0:8086->8086/tcp
campusiq-notification   Up (healthy)           0.0.0.0:8087->8087/tcp
campusiq-kafka          Up (healthy)           0.0.0.0:9092->9092/tcp
campusiq-zookeeper      Up (healthy)           0.0.0.0:2181->2181/tcp
campusiq-postgres       Up (healthy)           0.0.0.0:5432->5432/tcp
campusiq-redis          Up (healthy)           0.0.0.0:6379->6379/tcp
```

### End-to-End Test Matrix:
* **Authentication:** `POST /api/auth/login` ➔ **HTTP 200 OK** (JWT Access Token + Refresh Token returned).
* **Identity Verification:** `GET /api/auth/me` ➔ **HTTP 200 OK** (`userId: 3`, `role: FACULTY`, `name: Fullstack Tester`).
* **Contest Retrieval:** `GET /api/contests` ➔ **HTTP 200 OK** (Contest schema and problem metadata loaded).
* **Code Submission:** `POST /api/submissions` ➔ **HTTP 201 Created** (Submission queued into Kafka topic `submission-events`).
* **WebSocket Handshake:** `GET /ws/info` ➔ **HTTP 200 OK** (`{"websocket": true}` verified).
* **Real-time Leaderboard:** `GET /api/leaderboard/1` ➔ **HTTP 200 OK** (`score: 148.0`, `rank: 1`).

---

## 7. Educational & Institutional Value

1. **Anti-Plagiarism Readiness:** Structured to integrate AST-based code comparison across submissions within the same contest.
2. **Standardized Accreditation Metrics:** Generates department-wide quantitative evidence of student programming competencies for accreditation bodies (e.g., NAAC / NBA / ABET).
3. **High Concurrency Resilience:** The Kafka message queue ensures that even if 500+ students submit code simultaneously in the final minute of a contest, no submissions are lost or timed out.

---

## 8. Conclusion

**CampusIQ** demonstrates a complete, production-aligned implementation of modern software engineering practices. By integrating Spring Boot microservices, asynchronous event messaging through Apache Kafka, Redis caching, and a reactive frontend with Monaco Editor, the project bridges the gap between theoretical computing coursework and scalable real-world platform architecture.
