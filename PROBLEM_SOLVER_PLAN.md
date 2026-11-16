# CampusIQ — Student Code Editor & Problem Solver Workspace Plan

## 1. Overview
The Student Code Editor & Problem Solver Workspace transforms CampusIQ from a dashboard-only application into an interactive competitive programming platform (similar to LeetCode, Codeforces, and HackerRank). 

Students can select a contest/problem, write code in multiple languages within an in-browser VS Code-powered editor, run sample test cases, submit solutions to the microservices backend, and observe live standings update in real time via STOMP WebSockets.

---

## 2. Architecture & Workflow

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CampusIQ React Client                         │
│  ┌───────────────────────────────┐  ┌────────────────────────────────┐ │
│  │     Left: Problem Panel       │  │    Right: Monaco Code Editor   │ │
│  │ - Title, Tags, Difficulty     │  │ - Language Select (Java, Py...)│ │
│  │ - Problem Description         │  │ - Starter Templates            │ │
│  │ - Constraints & Test Samples  │  │ - Custom Input / Output        │ │
│  └───────────────────────────────┘  └────────────────────────────────┘ │
│                │                                   │                   │
│         GET /api/contests/:id               POST /api/submissions      │
└────────────────┼───────────────────────────────────┼───────────────────┘
                 │                                   │
                 ▼                                   ▼
        [API Gateway :8080]                 [API Gateway :8080]
                 │                                   │
                 ▼                                   ▼
        [Contest Service :8082]            [Submission Service :8083]
                                                     │
                                                     ▼ (Kafka: submission-events)
                                           [Evaluation Service :8084]
                                                     │
                                                     ▼ (Kafka: evaluation-results)
                                           [Leaderboard Service :8085]
                                                     │
                                                     ▼ (STOMP: /topic/leaderboard/:id)
                                           [Live WebSocket Update in Browser]
```

---

## 3. Technology Stack & Packages
- **Editor Engine**: `@monaco-editor/react` (Microsoft Monaco Editor — the core of VS Code).
- **Icons & Styling**: CSS Grid / Flexbox matching CampusIQ dark mode design tokens.
- **Languages Supported**:
  - Java (Default)
  - Python (3.x)
  - C++ (GCC)
  - JavaScript (Node.js)
- **API Client**: Axios (with Authorization Bearer JWT header).
- **Real-time Pipeline**: SockJS + `@stomp/stompjs` via existing `WSContext`.

---

## 4. Implementation Phases

### Phase 1: Environment & Dependency Setup
- Install `@monaco-editor/react` in `frontend/package.json`.
- Verify bundle build size and Vite integration.

### Phase 2: Component Architecture
1. **`ProblemSolver.jsx` (Main Container)**:
   - Split-pane layout (resizable or side-by-side flex).
   - Problem metadata header (timer, contest link, breadcrumb).
2. **`ProblemDescription.jsx` (Left Panel)**:
   - Problem statement formatted in Markdown/HTML.
   - Input format, Output format, Constraints.
   - Example test cases with "Copy Input" helper.
3. **`CodeEditor.jsx` (Right Panel - Top)**:
   - Monaco editor instance.
   - Language selector dropdown (Java, Python, C++, JS).
   - Theme toggle (VS Dark, High Contrast).
   - Default boilerplate code templates for each language.
   - "Reset Code" button.
4. **`TestConsole.jsx` (Right Panel - Bottom)**:
   - Tabbed interface: "Test Cases" / "Custom Testcase" / "Execution Result".
   - Runtime verdict display (Accepted, Compilation Error, Wrong Answer).
   - Memory & execution time metrics.
5. **`LiveRankDrawer.jsx` (Overlay / Collapsible)**:
   - Floating mini-leaderboard connected to `/topic/leaderboard/{contestId}` showing current user rank and top 5 contenders.

### Phase 3: Backend API Integration
- Connect **"Enter Now"** button on `Dashboard.jsx` to `/contest/:id`.
- Wire `App.jsx` route: `<Route path="/contest/:id" element={<PrivateRoute><ProblemSolver /></PrivateRoute>} />`.
- Connect "Run Code" / "Submit" to `POST /api/submissions`.
- Listen for real-time verdict updates on STOMP topic.

### Phase 4: Testing & Verification
- Test code submission with test user.
- Verify Kafka pipeline execution end-to-end.
- Verify zero browser console errors and smooth 60fps editor scrolling.

---

## 5. Security & Safety Principles
- Clean client-side sanitization of submitted payloads.
- Authentication token passed via Authorization header.
- Zero secrets committed to Git.
- **Git Push Policy**: Do NOT push to GitHub automatically; require explicit user review and confirmation.
