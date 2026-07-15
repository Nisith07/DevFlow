# DevFlow — Project Tasks Tracker

## Phase 1 — Scaffold & Refactor (Foundation) [x]
## Phase 2 — Projects (Backend + Frontend) [x]
## Phase 3 — Tasks (Backend + Frontend) [x]
## Phase 4 — Dashboard with Real Data [x]
## Phase 5 — Daily Planner [x]
## Phase 6 — Notes [x]
## Phase 7 — Activity Timeline [x]
## Phase 8 — Analytics [x]

## Phase 9 — AI Productivity Assistant [x]
- [x] Backend: Create `AIConversation` Mongoose model (`ai.model.js`) for persistent chat histories
- [x] Backend: Implement AI controller with dynamic formatted Markdown context parsing of user tasks, projects, planner entries, and notes
- [x] Backend: Implement structured action parser execution (supporting `create_task` and `create_planner` actions in-feed)
- [x] Backend: Connect to Google Gen AI (`@google/genai`) client with a reliable offline rule-based fallback mode
- [x] Frontend: Implement `useAI` hooks for session fetching, details, creating sessions, sending messages, and auto-invalidations
- [x] Frontend: Build reusable modern chat components in `AIAssistantPage.jsx` with suggestions shortcuts
- [x] Frontend: Wire AI Assistant route and add the Sparkles icon page link to the sidebar layout
- [x] Verification: Frontend builds cleanly, backend routes test starts without errors
