# Frontend Demo Quick Reference

> **Source:** `backend/prisma/seed.js` (UNCHANGED)  
> **Full Contract:** See `FRONTEND_DEMO_CONTRACT.json`

---

## 🎯 Demo User IDs

| User | ID Variable | Email | Role | Use Case |
|------|------------|-------|------|----------|
| Noah Davis | `learner4.id` | noah.davis@student.com | LEARNER | **Struggling** (3 quiz attempts, slow pacing) |
| Emma Wilson | `learner1.id` | emma.wilson@student.com | LEARNER | **Successful** (completed course, 100% quiz) |
| James Martinez | `learner2.id` | james.martinez@student.com | LEARNER | **Improving** (2 attempts: 66%→100%) |
| Michael Chen | `instructor.id` | michael.chen@learnsphere.com | INSTRUCTOR | **Course Admin** |

---

## 📚 Resource IDs

### Courses
- `course-javascript-fundamentals`
- `course-react-essentials`

### Quizzes
- `quiz-js-fundamentals`
- `quiz-react-essentials`

### Lessons (with duration)
**JavaScript Course:**
- `lesson-js-intro` (840s, VIDEO)
- `lesson-js-variables` (1020s, VIDEO)
- `lesson-js-functions` (null, DOCUMENT)
- `lesson-js-objects` (1260s, VIDEO)
- `lesson-js-es6` (1440s, VIDEO)

**React Course:**
- `lesson-react-intro` (960s, VIDEO)
- `lesson-react-components` (1140s, VIDEO)
- `lesson-react-state` (null, DOCUMENT)
- `lesson-react-effects` (1320s, VIDEO)
- `lesson-react-advanced` (null, IMAGE)

---

## 🚨 Guaranteed Insight Triggers

### 1️⃣ LEARNER_STRUGGLE (Quiz)
**Trigger:** ≥3 attempts OR >1800s time spent

```json
POST /api/quiz/submit
{
  "userId": "learner4.id",
  "quizId": "quiz-js-fundamentals",
  "attemptNumber": 4,
  "score": 33.33,
  "answers": [
    {"questionId": "q1-question-1", "selectedOptionId": "q1q1-opt1"},
    {"questionId": "q1-question-2", "selectedOptionId": "q1q2-opt1"},
    {"questionId": "q1-question-3", "selectedOptionId": "q1q3-opt1"}
  ]
}
```

**Why it triggers:** Noah Davis already has 3 attempts (seeded). This 4th attempt guarantees the alert.

---

### 2️⃣ LESSON_PACING_SLOW
**Trigger:** timeSpent > expectedTime × 1.8

```json
POST /api/lesson/complete
{
  "userId": "learner4.id",
  "lessonId": "lesson-js-intro",
  "timeSpentSeconds": 2000,
  "isCompleted": true
}
```

**Calculation:**
- Expected: 840s
- Threshold: 840 × 1.8 = **1512s**
- Provided: 2000s
- ✅ **2000 > 1512** → TRIGGERS

**Alternative:**
```json
{
  "userId": "learner4.id",
  "lessonId": "lesson-js-variables",
  "timeSpentSeconds": 2500,
  "isCompleted": false
}
```
- Threshold: 1020 × 1.8 = **1836s**
- ✅ **2500 > 1836** → TRIGGERS

---

### 3️⃣ COURSE_DROPOFF
**Trigger:** ≥2 lessons with <50% completion rate

```http
GET /api/insights/course/course-javascript-fundamentals
```

**Analysis:**
| Lesson | Completed | Enrolled | Rate | Dropoff? |
|--------|-----------|----------|------|----------|
| lesson-js-intro | 3 | 3 | 100% | ❌ |
| lesson-js-variables | 2 | 3 | 67% | ❌ |
| lesson-js-functions | 1 | 3 | **33%** | ✅ |
| lesson-js-objects | 1 | 3 | **33%** | ✅ |
| lesson-js-es6 | 1 | 3 | **33%** | ✅ |

**Result:** 3 lessons below 50% → ✅ **TRIGGERS**

Alternative: `course-react-essentials` also triggers (3 lessons at 0-50%)

---

## 📋 Insight Configuration

| Insight | Threshold | Config Value |
|---------|-----------|--------------|
| LEARNER_STRUGGLE | attempts ≥ 3 | `STRUGGLE_ATTEMPTS = 3` |
| LEARNER_STRUGGLE | timeSpent > 1800s | `STRUGGLE_TIME = 1800` |
| LESSON_PACING_SLOW | timeSpent > expected × 1.8 | `PACING_SLOW_FACTOR = 1.8` |
| LESSON_PACING_FAST | timeSpent < expected × 0.3 | `PACING_FAST_FACTOR = 0.3` |
| COURSE_DROPOFF | ≥2 lessons <50% | `COURSE_DROPOFF_RATE = 0.5` |

---

## ✅ Frontend Testing Checklist

- [ ] **Struggling Learner UI** → Use `learner4.id` (Noah Davis)
- [ ] **Successful Learner UI** → Use `learner1.id` (Emma Wilson)
- [ ] **Quiz Struggle Alert** → Submit quiz with payload above
- [ ] **Lesson Pacing Alert** → Complete lesson with 2000s time
- [ ] **Course Dropoff Insight** → GET JavaScript Fundamentals insights
- [ ] **Instructor Dashboard** → Login as `instructor.id` (Michael Chen)
- [ ] **Normal Flow (No Alerts)** → Use `learner1.id` with normal times

---

## 🎬 Copy-Paste Test Commands

### Test Learner Struggle
```bash
curl -X POST http://localhost:3000/api/quiz/submit \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "learner4.id",
    "quizId": "quiz-js-fundamentals",
    "attemptNumber": 4,
    "score": 33.33
  }'
```

### Test Lesson Pacing Slow
```bash
curl -X POST http://localhost:3000/api/lesson/complete \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "learner4.id",
    "lessonId": "lesson-js-intro",
    "timeSpentSeconds": 2000,
    "isCompleted": true
  }'
```

### Test Course Dropoff
```bash
curl -X GET http://localhost:3000/api/insights/course/course-javascript-fundamentals
```

---

## ⚠️ Important Notes

1. **User IDs:** Replace `learner4.id` with actual UUID from your database after seeding
2. **No Seed Changes:** All IDs come from existing seed data (unchanged)
3. **Guaranteed Triggers:** All scenarios above are mathematically guaranteed to trigger
4. **LESSON_PACING_FAST:** Not triggered by current seed (no rushing learners)

---

**Generated:** February 7, 2026  
**Validated Against:** `backend/prisma/seed.js`
