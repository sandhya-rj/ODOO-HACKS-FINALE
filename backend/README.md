# Backend — LearnSphere

Adaptive learning insights backend module with real-time analytics and alert system.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Server starts on port 5000.

## Test Endpoints

**Health Check:**
```
GET /health
```

**Quiz Submission (with struggle detection):**
```
POST /quiz/submit
Body: { "attempts": 3, "timeSpent": 2100 }
```

**Lesson Completion (with pacing analysis):**
```
POST /lesson/complete
Body: { "timeSpent": 1800, "expectedTime": 600 }
```

**Mock Batch Demo (all features):**
```
GET /insights/mock-batch
```

**Course Dropoff Analysis:**
```
POST /insights/course-dropoff
Body: { "rates": [0.3, 0.4, 0.8, 0.6] }
```

## Features

- ✅ Learner struggle detection
- ✅ Lesson pacing analysis (too slow/too fast)
- ✅ Course-level dropoff detection
- ✅ Structured alert formatting with severity levels
- ✅ Input validation middleware
- ✅ Centralized error handling
- ✅ Role-based access control middleware

## Architecture

```
src/
├── app.js              # Express app configuration
├── server.js           # Server entry point
├── routes/             # API route definitions
├── controllers/        # Request handlers
├── services/           # Business logic (insight engine)
└── middleware/         # Validation, auth, error handling
```

## Environment Variables

Copy `.env.example` to `.env` and configure:
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens
