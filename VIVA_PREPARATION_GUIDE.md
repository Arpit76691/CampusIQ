# CampusIQ — College Project Viva & Architecture Preparation Guide

> **Project Name**: CampusIQ — Distributed Competitive Learning & Automated Skill Benchmarking Platform  
> **Architecture Pattern**: Event-Driven Reactive Microservices Architecture  
> **Backend Stack**: Java 21, Spring Boot 3.4, Spring Cloud Gateway, Apache Kafka, Redis 7, PostgreSQL 16, Docker  
> **Frontend Stack**: React 18, Vite, Monaco Editor (VS Code Engine), StompJS / SockJS  

---

## 🏛️ 1. High-Level Architecture Overview

```
                                  [ Client Browser ]
                     (React 18 + Vite + Monaco Code Editor)
                                        │
                         HTTP REST / Bearer JWT / WebSockets
                                        ▼
                   ┌────────────────────────────────────────┐
                   │    Spring Cloud API Gateway (:8080)    │
                   │  - Single Authoritative CORS Handler   │
                   │  - JWT Verification & Header Injection │
                   └───────┬────────────────────────┬───────┘
                           │                        │
             ┌─────────────┼─────────────┐          │
             ▼             ▼             ▼          ▼
       [Auth Service] [Contest Svc] [Submit Svc] [Notification]
          (:8081)        (:8082)       (:8083)       (:8087)
             │             │             │              │
      (PostgreSQL)   (PostgreSQL)        │ (Kafka Producer)
                                         ▼
                            Kafka: submission-events
                                         │
                                         ▼
                             [Evaluation Service (:8084)]
                              (Docker Execution Sandbox)
                                         │
                                         ▼ (Kafka Producer)
                            Kafka: evaluation-results
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
             [Leaderboard Svc (:8085)]       [Analytics Svc (:8086)]
             (Redis ZSet O(log N) Leaderboard)  (Institutional Metrics)
                         │
                         ▼ (STOMP WebSockets)
             [Live Leaderboard Update in Monaco Editor]
```

---

## 🎯 2. Top 10 Viva Questions & Model Answers

### Q1: Why did you choose a Microservices Architecture instead of a Monolith?
* **Answer**:
  In a collegiate coding contest, traffic is highly bursty. In the final 5 minutes of a contest, hundreds of students submit code simultaneously. 
  In a monolith, CPU-heavy code compilation would consume all server threads and crash the web server. 
  By decoupling the system into 7 microservices:
  1. The **Submission Service** simply receives code and immediately returns an acknowledgement.
  2. The **Evaluation Service** runs in an isolated container pool without blocking the gateway or contest browsing.
  3. The **Leaderboard Service** reads events asynchronously without stressing the relational database.

---

### Q2: Why Apache Kafka? Why not direct HTTP REST between Submission and Evaluation?
* **Answer**:
  1. **Asynchronous Decoupling & Spike Leveling**: If 500 students submit code in 10 seconds, HTTP REST would cause thread pool starvation and `504 Gateway Timeouts`. Kafka acts as a durable message buffer, queuing submissions so the Evaluation service consumes them at its safe processing capacity.
  2. **Fan-Out (Pub-Sub)**: A single evaluation result event is consumed simultaneously by:
     - The **Leaderboard Service** (to update user ranks).
     - The **Analytics Service** (to aggregate department pass rates).
     - The **Notification Service** (to push alerts to the user).
  3. **Fault Tolerance**: If the Evaluation service temporarily restarts, no submissions are lost; they remain safely queued in Kafka partitions.

---

### Q3: Why did you use Redis Sorted Sets (`ZSet`) instead of querying PostgreSQL with `ORDER BY score DESC`?
* **Answer**:
  1. **Time Complexity**:
     - PostgreSQL `SELECT * ... ORDER BY score DESC` requires sorting disk-based records, resulting in $O(N \log N)$ or heavy indexing overhead on every single submission.
     - Redis `ZSet` stores rankings in an in-memory SkipList + Hash Map, allowing rank calculation (`ZREVRANK`) and range queries (`ZREVRANGE`) in $O(\log N)$ time.
  2. **Concurrency**: Under live contest conditions with multiple submissions per second, Redis handles 100,000+ operations/second entirely in RAM.

---

### Q4: How does Authentication and Role-Based Access Control (RBAC) work?
* **Answer**:
  1. User authenticates via `POST /api/auth/login`.
  2. **Auth Service** verifies BCrypt hashed password and issues an HMAC-SHA512 signed JWT token containing claims: `userId`, `email`, `role` (`ADMIN`, `FACULTY`, `STUDENT`).
  3. When client makes requests, the **API Gateway's `JwtAuthFilter`** intercepts the request, validates token signature, extracts the claims, and mutates the downstream request headers with:
     - `X-User-Id`
     - `X-User-Email`
     - `X-User-Role`
  4. Downstream services inspect `@RequestHeader("X-User-Role")` to permit or forbid administrative actions (e.g., only `FACULTY` or `ADMIN` can create contests).

---

### Q5: What CORS issue did you encounter, and how did you resolve it?
* **Answer**:
  When downstream Spring Boot microservices (like Auth or Contest) and Spring Cloud Gateway both had `@CrossOrigin` or `CorsFilter` enabled, browsers rejected requests with the error:
  `The 'Access-Control-Allow-Origin' header contains multiple values 'http://localhost, *', but only one is allowed`.
  
  **Our Resolution**:
  1. Made the **API Gateway the single authoritative CORS handler** in `application.yml`.
  2. Added the Gateway filter `DedupeResponseHeader=Access-Control-Allow-Origin Access-Control-Allow-Credentials, RETAIN_FIRST`.
  3. Removed local `@CrossOrigin` annotations from downstream microservices so only the Gateway manages origin handshakes.

---

### Q6: How does the Monaco Code Editor integrate into the platform?
* **Answer**:
  We integrated Microsoft Monaco Editor (the open-source core of VS Code) using `@monaco-editor/react`. 
  - Supports dark mode (`vs-dark`), line numbering, automatic layout, and syntax highlighting across **Java 21**, **Python 3.12**, **C++ 20**, and **JavaScript (Node.js)**.
  - Dynamically loads blank starter skeletons (`// Write your solution here`) based on the active problem.
  - Features an interactive **Custom Testcase Runner** where students or evaluators can input custom arrays/strings and receive immediate evaluated outputs, runtime (ms), and memory metrics.

---

### Q7: How does real-time leaderboard update work in the frontend?
* **Answer**:
  We use **WebSockets with STOMP over SockJS**.
  1. When evaluation completes, the Leaderboard service broadcasts the new standings to the STOMP destination `/topic/leaderboard/{contestId}`.
  2. The React frontend subscribes to this topic via `StompClient`.
  3. When an update arrives, React state (`leaderboardList`) is updated in place, causing the live podium and table to animate without reloading the page.

---

### Q8: What database engine is used and how is multi-tenancy structured?
* **Answer**:
  PostgreSQL 16 Alpine running in a container.
  - Tables include `users` (credentials & roles), `contests` (schedule, difficulty, subject), `problems` (statements, points, constraints), and `submissions` (code, language, execution status, score).
  - Multi-tenant roles: `Role.ADMIN`, `Role.FACULTY`, `Role.STUDENT`.

---

### Q9: How are microservices deployed and orchestrated?
* **Answer**:
  All 13 nodes are managed via Docker Compose:
  - 7 Java Spring Boot microservice containers
  - 1 Nginx React frontend container
  - 1 PostgreSQL 16 container
  - 1 Redis 7 container
  - 1 Apache Kafka 7.6 container
  - 1 Zookeeper container
  The entire cluster starts with health check dependencies (`depends_on: postgres: condition: service_healthy`) ensuring zero race conditions.

---

### Q10: What are the key performance metrics of CampusIQ?
* **Answer**:
  - **Sub-50ms** Gateway routing overhead.
  - **$O(\log N)$** leaderboard ranking via Redis Sorted Sets.
  - **Zero-blocking** code submissions via Kafka event streaming.
  - **Fast Frontend**: React SPA production bundle builds in under 350ms with Vite.
