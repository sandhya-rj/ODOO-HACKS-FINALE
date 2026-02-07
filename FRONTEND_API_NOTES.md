# Frontend API Integration Guide

> **Backend Version:** 1.0  
> **Target Frontend:** Lovable AI (No-Code/Low-Code)  
> **Base URL:** `http://localhost:3000` (development)

---

## 🎯 Quick Start Checklist

- ✅ CORS enabled for all origins
- ✅ JSON request/response format
- ✅ No authentication required (demo mode)
- ✅ All endpoints return JSON-serializable data
- ✅ ISO timestamps (browser-compatible)
- ✅ Predictable error format

---

## 📡 API Endpoints

### 1. POST `/quiz/submit`

**Purpose:** Submit quiz attempt and check for LEARNER_STRUGGLE alert

**Required Headers:**
```http
Content-Type: application/json
```

**Request Body Schema:**
```typescript
{
  attempts: number;      // REQUIRED: Total attempt count (1, 2, 3, ...)
  timeSpent: number;     // REQUIRED: Time spent in seconds
  score?: number;        // OPTIONAL: Not used for insight logic
}
```

**Example Request (Using demo IDs):**
```json
POST /quiz/submit
Content-Type: application/json

{
  "attempts": 4,
  "timeSpent": 2000,
  "score": 33.33
}
```

**Response (No Alert):**
```json
{
  "submitted": true
}
```

**Response (LEARNER_STRUGGLE Triggered):**
```json
{
  "submitted": true,
  "alert": {
    "alertId": "1707307200000",
    "source": "quiz",
    "type": "LEARNER_STRUGGLE",
    "message": "High retries or time spent",
    "severity": "high",
    "createdAt": "2026-02-07T10:00:00.000Z"
  }
}
```

**HTTP Status Codes:**
- `200` - Success (with or without alert)
- `400` - Validation error (missing/invalid fields)
- `500` - Server error

**Trigger Conditions:**
- `attempts >= 3` OR `timeSpent > 1800` → LEARNER_STRUGGLE alert

**Lovable AI Notes:**
- Use number inputs for `attempts` and `timeSpent`
- Alert is **conditional** - check for `alert` property in response
- Display alert with appropriate severity styling (high = red/urgent)

---

### 2. POST `/lesson/complete`

**Purpose:** Mark lesson complete and check for LESSON_PACING alerts

**Required Headers:**
```http
Content-Type: application/json
```

**Request Body Schema:**
```typescript
{
  timeSpent: number;     // REQUIRED: Actual time spent in seconds
  expectedTime: number;  // REQUIRED: Expected duration in seconds
}
```

**Example Request (Using demo IDs):**
```json
POST /lesson/complete
Content-Type: application/json

{
  "timeSpent": 2000,
  "expectedTime": 840
}
```

**Response (No Alert):**
```json
{
  "completed": true
}
```

**Response (LESSON_PACING_SLOW Triggered):**
```json
{
  "completed": true,
  "alert": {
    "alertId": "1707307260000",
    "source": "lesson",
    "type": "LESSON_PACING_SLOW",
    "message": "Learner taking unusually long",
    "severity": "low",
    "createdAt": "2026-02-07T10:01:00.000Z"
  }
}
```

**Response (LESSON_PACING_FAST Triggered):**
```json
{
  "completed": true,
  "alert": {
    "alertId": "1707307320000",
    "source": "lesson",
    "type": "LESSON_PACING_FAST",
    "message": "Lesson likely skipped",
    "severity": "low",
    "createdAt": "2026-02-07T10:02:00.000Z"
  }
}
```

**HTTP Status Codes:**
- `200` - Success (with or without alert)
- `400` - Validation error (missing fields)
- `500` - Server error

**Trigger Conditions:**
- `timeSpent > expectedTime * 1.8` → LESSON_PACING_SLOW
- `timeSpent < expectedTime * 0.3` → LESSON_PACING_FAST

**Lovable AI Notes:**
- Both fields are **required** (backend validates)
- `expectedTime` comes from lesson data (see `demoIds.js`)
- Alert is **conditional** - may return slow, fast, or no alert
- For VIDEO lessons, use `durationSeconds` from seed data

**Quick Reference:**
```javascript
// Slow pacing example (lesson-js-intro: 840s expected)
{
  "timeSpent": 2000,      // > 840 * 1.8 = 1512
  "expectedTime": 840     // ✓ Triggers LESSON_PACING_SLOW
}

// Fast pacing example (lesson-js-intro: 840s expected)
{
  "timeSpent": 200,       // < 840 * 0.3 = 252
  "expectedTime": 840     // ✓ Triggers LESSON_PACING_FAST
}

// Normal pacing (no alert)
{
  "timeSpent": 900,       // Between thresholds
  "expectedTime": 840     // ✗ No alert
}
```

---

### 3. GET `/insights/mock-batch`

**Purpose:** Get sample alerts for demo/testing (instructor dashboard)

**Required Headers:**
```http
(none required)
```

**Request:**
```http
GET /insights/mock-batch
```

**Response:**
```json
{
  "alerts": [
    {
      "alertId": "1707307380000",
      "source": "mock",
      "type": "LEARNER_STRUGGLE",
      "message": "High retries or time spent",
      "severity": "high",
      "createdAt": "2026-02-07T10:03:00.000Z"
    },
    {
      "alertId": "1707307381000",
      "source": "mock",
      "type": "LESSON_PACING_SLOW",
      "message": "Learner taking unusually long",
      "severity": "low",
      "createdAt": "2026-02-07T10:03:01.000Z"
    },
    {
      "alertId": "1707307382000",
      "source": "mock",
      "type": "COURSE_DROPOFF",
      "message": "Multiple lessons below 50% completion",
      "severity": "low",
      "createdAt": "2026-02-07T10:03:02.000Z"
    }
  ]
}
```

**HTTP Status Codes:**
- `200` - Success (always returns array, may be empty)

**Lovable AI Notes:**
- **Safe for demo mode** - no database impact
- Use this to populate instructor dashboard without real data
- Alerts array is **always present** (never null)
- Each alert has same structure as conditional alerts above

---

### 4. GET `/health`

**Purpose:** Check if backend is running

**Required Headers:**
```http
(none required)
```

**Request:**
```http
GET /health
```

**Response:**
```json
{
  "ok": true
}
```

**HTTP Status Codes:**
- `200` - Backend is healthy

**Lovable AI Notes:**
- Use for connection testing
- Always returns `{ "ok": true }` if backend is up
- Add to app initialization to verify backend connectivity

---

## 🎨 Alert Object Structure

All alerts follow this consistent structure:

```typescript
interface Alert {
  alertId: string;       // Timestamp-based unique ID
  source: string;        // "quiz" | "lesson" | "mock"
  type: string;          // "LEARNER_STRUGGLE" | "LESSON_PACING_SLOW" | "LESSON_PACING_FAST" | "COURSE_DROPOFF"
  message: string;       // Human-readable description
  severity: string;      // "high" | "medium" | "low"
  createdAt: string;     // ISO 8601 timestamp
}
```

**Severity Mapping:**
- `"high"` - LEARNER_STRUGGLE (red alert icon)
- `"medium"` - LESSON_DIFFICULT (orange/yellow warning)
- `"low"` - Pacing issues, dropoff (blue info)

---

## ⚠️ Common Frontend Mistakes to Avoid

### 1. ❌ Sending Strings Instead of Numbers
```javascript
// WRONG
{
  "attempts": "3",        // String
  "timeSpent": "1800"     // String
}

// CORRECT
{
  "attempts": 3,          // Number
  "timeSpent": 1800       // Number
}
```

### 2. ❌ Assuming Alert Always Exists
```javascript
// WRONG
const alertType = response.alert.type; // May be undefined!

// CORRECT
const alertType = response.alert?.type;
// OR
if (response.alert) {
  console.log(response.alert.type);
}
```

### 3. ❌ Not Handling 400 Validation Errors
```javascript
// WRONG
const data = await fetch('/quiz/submit', { ... }).then(r => r.json());

// CORRECT
const response = await fetch('/quiz/submit', { ... });
if (!response.ok) {
  const error = await response.json();
  console.error('Validation error:', error.error);
  return;
}
const data = await response.json();
```

### 4. ❌ Hardcoding IDs Instead of Using demoIds.js
```javascript
// WRONG
const userId = "some-random-id"; // Doesn't exist in seed

// CORRECT
import { DEMO_IDS } from './demoIds';
const userId = DEMO_IDS.users.strugglingLearner.id;
```

### 5. ❌ Forgetting Content-Type Header
```javascript
// WRONG
fetch('/quiz/submit', {
  method: 'POST',
  body: JSON.stringify({ attempts: 3, timeSpent: 1800 })
});

// CORRECT
fetch('/quiz/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ attempts: 3, timeSpent: 1800 })
});
```

---

## 🧪 Testing Strategy for Lovable AI

### Phase 1: Connection Test
```javascript
// Verify backend is running
const health = await fetch('http://localhost:3000/health').then(r => r.json());
console.log(health.ok); // Should be true
```

### Phase 2: Mock Data Test
```javascript
// Get sample alerts without triggering logic
const demo = await fetch('http://localhost:3000/insights/mock-batch').then(r => r.json());
console.log(demo.alerts.length); // Should be 3
```

### Phase 3: Conditional Alert Test
```javascript
// Test alert triggering
const result = await fetch('http://localhost:3000/quiz/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    attempts: 4,      // > 3, should trigger
    timeSpent: 2000   // > 1800, should trigger
  })
}).then(r => r.json());

console.log(result.alert); // Should exist
console.log(result.alert.type); // "LEARNER_STRUGGLE"
```

### Phase 4: No Alert Test
```javascript
// Verify no false positives
const result = await fetch('http://localhost:3000/quiz/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    attempts: 1,      // < 3
    timeSpent: 600    // < 1800
  })
}).then(r => r.json());

console.log(result.alert); // Should be undefined
console.log(result.submitted); // Should be true
```

---

## 🔒 Security Notes (Demo Mode)

**Current State:**
- ✅ CORS enabled for all origins (development)
- ✅ No authentication required
- ✅ No rate limiting

**Production Recommendations (Future):**
- Add authentication middleware
- Restrict CORS to specific domains
- Add rate limiting
- Validate user/course/lesson IDs against database

**For Hackathon Demo:**
- Current setup is **safe and appropriate**
- Focus on UI/UX, not security
- Document that auth is "future enhancement"

---

## 📊 Response Time Expectations

All endpoints should respond **< 100ms** (local dev):
- `/health` - Instant (~5ms)
- `/insights/mock-batch` - Fast (~10ms)
- `/quiz/submit` - Fast (~15ms, no DB writes)
- `/lesson/complete` - Fast (~15ms, no DB writes)

**If response is slow:**
- Check backend is running: `GET /health`
- Check console for errors
- Verify JSON payload is valid

---

## 🎯 Which Endpoints Return Alerts?

| Endpoint | Alert Type | Conditional? | Use Case |
|----------|------------|--------------|----------|
| `/quiz/submit` | LEARNER_STRUGGLE | ✅ Yes | Learner submits quiz |
| `/lesson/complete` | LESSON_PACING_SLOW/FAST | ✅ Yes | Learner completes lesson |
| `/insights/mock-batch` | All types | ❌ No (always) | Instructor dashboard demo |
| `/health` | None | ❌ Never | Connection check |

**Conditional = Alert may or may not be present in response**

---

## 🚀 Integration Example (Lovable AI)

### Example: Quiz Submission Flow

```javascript
// Component: QuizSubmitButton.jsx
import { DEMO_IDS, DEMO_PAYLOADS } from './demoIds';

async function handleQuizSubmit() {
  try {
    // Use pre-built payload for guaranteed trigger
    const response = await fetch('http://localhost:3000/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DEMO_PAYLOADS.quizSubmit_TriggerStruggle)
    });

    if (!response.ok) {
      const error = await response.json();
      showError(error.error);
      return;
    }

    const data = await response.json();
    
    // Check for conditional alert
    if (data.alert) {
      showAlert({
        type: data.alert.type,
        message: data.alert.message,
        severity: data.alert.severity
      });
    }
    
    showSuccess('Quiz submitted!');
  } catch (err) {
    console.error('Network error:', err);
    showError('Could not connect to backend');
  }
}
```

### Example: Lesson Completion Flow

```javascript
// Component: LessonCompleteButton.jsx
import { DEMO_IDS } from './demoIds';

async function handleLessonComplete(lessonId, timeSpent) {
  // Get expected time from lesson data
  const lesson = DEMO_IDS.lessons.javascriptCourse.intro;
  
  const response = await fetch('http://localhost:3000/lesson/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timeSpent: timeSpent,           // User's actual time
      expectedTime: lesson.durationSeconds  // From seed data
    })
  });

  const data = await response.json();
  
  if (data.alert) {
    // Show pacing alert if triggered
    if (data.alert.type === 'LESSON_PACING_SLOW') {
      showWarning('You took longer than expected. Need help?');
    } else if (data.alert.type === 'LESSON_PACING_FAST') {
      showWarning('Did you skip the lesson?');
    }
  }
}
```

### Example: Instructor Dashboard

```javascript
// Component: InstructorDashboard.jsx

async function loadAlerts() {
  const response = await fetch('http://localhost:3000/insights/mock-batch');
  const data = await response.json();
  
  // Always safe - alerts is always an array
  setAlerts(data.alerts);
  
  // Group by severity
  const highSeverity = data.alerts.filter(a => a.severity === 'high');
  setUrgentAlerts(highSeverity);
}
```

---

## ✅ Pre-Launch Checklist

Before going live with frontend:

- [ ] Backend running on `http://localhost:3000`
- [ ] `/health` endpoint returns `{ "ok": true }`
- [ ] `demoIds.js` imported into frontend project
- [ ] Test quiz submit with both triggering and non-triggering payloads
- [ ] Test lesson complete with slow/fast/normal pacing
- [ ] Verify alerts display correctly when triggered
- [ ] Verify no errors when alerts are not triggered
- [ ] Test instructor dashboard with `/insights/mock-batch`
- [ ] All fetch calls include `Content-Type: application/json` header
- [ ] Error handling implemented for 400/500 responses

---

## 🎬 Live Demo Script

**Scenario 1: Struggling Learner (Noah Davis)**
1. Submit quiz with `attempts: 4` → Shows LEARNER_STRUGGLE alert
2. Complete lesson with `timeSpent: 2000` → Shows LESSON_PACING_SLOW alert
3. Demonstrate alert severity and messaging

**Scenario 2: Successful Learner (Emma Wilson)**
1. Submit quiz with `attempts: 1` → No alert
2. Complete lesson with normal time → No alert
3. Show clean, alert-free experience

**Scenario 3: Instructor Dashboard**
1. Load `/insights/mock-batch` → Show all alert types
2. Demonstrate alert filtering/sorting
3. Show actionable insights for instructor

---

**Last Updated:** February 7, 2026  
**Backend Status:** ✅ FROZEN - Ready for Frontend Integration  
**Contact:** See API team for questions
