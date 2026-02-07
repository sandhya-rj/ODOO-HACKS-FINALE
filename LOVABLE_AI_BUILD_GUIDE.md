# Lovable AI Quick Build Guide

> **Use this for rapid frontend implementation**  
> **Full details:** See `FRONTEND_DEMO_FLOW_DESIGN.md`

---

## 🎯 Build These 5 Screens

| # | Screen Name | Main Action | Backend Call | Alert Type |
|---|-------------|-------------|--------------|------------|
| 1 | **Home Dashboard** | Select persona | `GET /health` | None |
| 2 | **Learner Quiz** | Submit quiz | `POST /quiz/submit` | 🔴 LEARNER_STRUGGLE |
| 3 | **Learner Lesson** | Complete lesson | `POST /lesson/complete` | 🔵 LESSON_PACING_SLOW |
| 4 | **Instructor Dashboard** | View alerts | `GET /insights/mock-batch` | All 3 types |
| 5 | **System Status** | Check backend | `GET /health` | None (fallback) |

---

## 📱 Screen 1: Home Dashboard

**Components:**
- Header: "LearnSphere - Adaptive Insights Demo"
- 3 Persona Cards with buttons:
  - "Noah Davis - Struggling Learner" → [View as Learner]
  - "Michael Chen - Instructor" → [View Dashboard]
  - "System Overview" → [View Status]
- Health indicator: Green dot + "Backend Connected"

**On Load:**
```javascript
fetch('http://localhost:3000/health')
  .then(r => r.json())
  .then(d => showStatus(d.ok)); // Show green dot if true
```

---

## 📱 Screen 2: Learner Quiz

**Components:**
- Header: "Noah Davis - JavaScript Quiz"
- Info display: "Attempt #4 • Time: 2000s"
- Big button: "Submit Quiz Attempt"
- Alert area (hidden initially)

**On Button Click:**
```javascript
import { DEMO_PAYLOADS } from './demoIds';

fetch('http://localhost:3000/quiz/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(DEMO_PAYLOADS.quizSubmit_TriggerStruggle)
})
  .then(r => r.json())
  .then(data => {
    if (data.alert) {
      showRedAlert(data.alert.message); // "High retries or time spent"
    }
    showSuccess("Quiz submitted!");
  });
```

**Guaranteed Trigger:** ✅ Always returns LEARNER_STRUGGLE alert

---

## 📱 Screen 3: Learner Lesson

**Components:**
- Header: "Noah Davis - Introduction to JavaScript"
- Info display: "Expected: 14 min • Your time: 33 min" (red text)
- Big button: "Mark Lesson Complete"
- Alert area (hidden initially)

**On Button Click:**
```javascript
import { DEMO_PAYLOADS } from './demoIds';

fetch('http://localhost:3000/lesson/complete', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(DEMO_PAYLOADS.lessonComplete_TriggerSlowPacing)
})
  .then(r => r.json())
  .then(data => {
    if (data.alert) {
      showBlueAlert(data.alert.message); // "Learner taking unusually long"
    }
    showSuccess("Lesson completed!");
  });
```

**Guaranteed Trigger:** ✅ Always returns LESSON_PACING_SLOW alert

---

## 📱 Screen 4: Instructor Dashboard

**Components:**
- Header: "Instructor Dashboard - Michael Chen"
- 3 stat cards: "3 Active Alerts" | "1 High Severity" | "2 Courses"
- Alert feed (3 cards):
  - Alert 1: 🔴 Red border | "LEARNER_STRUGGLE" | "High retries..."
  - Alert 2: 🔵 Blue border | "LESSON_PACING_SLOW" | "Taking unusually long..."
  - Alert 3: 🔵 Blue border | "COURSE_DROPOFF" | "Below 50% completion..."
- Filter buttons: [All] [High] [Low]
- Refresh button

**On Page Load:**
```javascript
fetch('http://localhost:3000/insights/mock-batch')
  .then(r => r.json())
  .then(data => {
    displayAlerts(data.alerts); // Always 3 alerts
    updateStats(data.alerts);
  });
```

**Response (Always):**
```json
{
  "alerts": [
    {
      "type": "LEARNER_STRUGGLE",
      "message": "High retries or time spent",
      "severity": "high"
    },
    {
      "type": "LESSON_PACING_SLOW",
      "message": "Learner taking unusually long",
      "severity": "low"
    },
    {
      "type": "COURSE_DROPOFF",
      "message": "Multiple lessons below 50% completion",
      "severity": "low"
    }
  ]
}
```

---

## 📱 Screen 5: System Status (Fallback)

**Components:**
- Header: "System Status"
- Backend status: Green ✓ or Red ✗ + "Connected/Disconnected"
- Button: "Check Connection"
- Sample data preview

**On Button Click:**
```javascript
fetch('http://localhost:3000/health')
  .then(r => r.json())
  .then(d => showStatus(d.ok ? "Connected" : "Error"));
```

---

## 🎨 Alert Card Styling

**High Severity (Red):**
```css
border: 2px solid #EF4444;
background: #FEE2E2;
icon: ⚠️
```

**Low Severity (Blue):**
```css
border: 2px solid #3B82F6;
background: #DBEAFE;
icon: ℹ️
```

---

## 📦 Required File: demoIds.js

**Location:** `frontend/src/demoIds.js` (already created)

**Import in components:**
```javascript
import { DEMO_IDS, DEMO_PAYLOADS } from './demoIds';

// Use pre-built payloads
const quizPayload = DEMO_PAYLOADS.quizSubmit_TriggerStruggle;
const lessonPayload = DEMO_PAYLOADS.lessonComplete_TriggerSlowPacing;
```

---

## 🎬 6-Step Demo Flow (90 seconds)

1. **Home** (10s) → Click "View as Learner"
2. **Quiz** (20s) → Click "Submit Quiz" → 🔴 Red alert appears
3. **Lesson** (20s) → Click "Complete Lesson" → 🔵 Blue alert appears
4. **Back to Home** (10s) → Click "View Dashboard"
5. **Instructor** (20s) → View 3 alerts in feed
6. **Filter** (10s) → Click "High Severity" → Only red alert shows

**Total:** 90 seconds, 100% success rate

---

## ✅ Pre-Flight Checklist

Before demo:
- [ ] Backend running on `http://localhost:3000`
- [ ] Test: `curl http://localhost:3000/health` returns `{"ok":true}`
- [ ] Test: `curl http://localhost:3000/insights/mock-batch` returns 3 alerts
- [ ] `demoIds.js` imported in all components
- [ ] All 5 screens navigate correctly
- [ ] Alert cards styled with correct colors
- [ ] Loading states on buttons

---

## 🚨 Troubleshooting

**Alert not showing?**
- Check: Does response have `alert` property?
- Check: `Content-Type: application/json` header present?
- Check: Using correct payload from `DEMO_PAYLOADS`?

**Backend not connecting?**
- Check: Backend terminal shows "Server running on port 3000"
- Check: `http://localhost:3000/health` in browser returns JSON
- Check: No CORS errors in browser console

**Wrong data?**
- Solution: Always use `DEMO_PAYLOADS` from `demoIds.js`
- Don't create custom payloads

---

## 📞 Quick Reference

**Backend URL:** `http://localhost:3000`

**Endpoints:**
- Health: `GET /health`
- Quiz: `POST /quiz/submit`
- Lesson: `POST /lesson/complete`
- Insights: `GET /insights/mock-batch`

**All payloads:** Import from `demoIds.js`

**All documentation:** See repo root:
- `API_CONTRACT.md`
- `FRONTEND_API_NOTES.md`
- `FRONTEND_DEMO_FLOW_DESIGN.md`

---

**Build Time Estimate:** 2-3 hours  
**Risk Level:** 🟢 None  
**Success Rate:** 100%

**LET'S BUILD! 🚀**
