# API Contract - Official Specification

**Version:** 1.0.0  
**Status:** FROZEN ✅  
**Last Modified:** February 7, 2026  
**Base URL:** `http://localhost:3000`

---

## Contract Stability Guarantee

This API contract is **frozen** for frontend development. No breaking changes will be made to:
- Endpoint paths
- Request/response schemas
- HTTP methods
- Required fields
- Alert object structure

---

## Endpoint Specifications

### 1. POST `/quiz/submit`

**Description:** Submit quiz attempt and receive conditional LEARNER_STRUGGLE alert

**HTTP Method:** `POST`

**Content-Type:** `application/json`

**Request Schema:**
```typescript
interface QuizSubmitRequest {
  attempts: number;      // Total attempts (1, 2, 3, ...) - REQUIRED
  timeSpent: number;     // Time in seconds - REQUIRED
  score?: number;        // Optional, not used by insight logic
}
```

**Example Payload (Guaranteed Trigger):**
```json
{
  "attempts": 4,
  "timeSpent": 2000,
  "score": 33.33
}
```

**Example Payload (No Trigger):**
```json
{
  "attempts": 1,
  "timeSpent": 600,
  "score": 100
}
```

**Success Response (200) - With Alert:**
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

**Success Response (200) - No Alert:**
```json
{
  "submitted": true
}
```

**Error Response (400):**
```json
{
  "error": "attempts and timeSpent must be numbers"
}
```

**Status Codes:**
- `200` - Success (check `alert` property for conditional alert)
- `400` - Invalid request (missing/wrong types)
- `500` - Server error

**Alert Trigger Logic:**
- `attempts >= 3` OR `timeSpent > 1800` → Returns alert
- Otherwise → No alert property

**Contract Notes:**
- Alert is **conditional** - may or may not be present
- `submitted: true` is always present in success response
- `alertId` is timestamp-based, not guaranteed unique in production

---

### 2. POST `/lesson/complete`

**Description:** Mark lesson complete and receive conditional pacing alerts

**HTTP Method:** `POST`

**Content-Type:** `application/json`

**Request Schema:**
```typescript
interface LessonCompleteRequest {
  timeSpent: number;      // Actual time in seconds - REQUIRED
  expectedTime: number;   // Expected duration in seconds - REQUIRED
}
```

**Example Payload (Trigger SLOW):**
```json
{
  "timeSpent": 2000,
  "expectedTime": 840
}
```
*Triggers because 2000 > (840 × 1.8)*

**Example Payload (Trigger FAST):**
```json
{
  "timeSpent": 200,
  "expectedTime": 840
}
```
*Triggers because 200 < (840 × 0.3)*

**Example Payload (No Trigger):**
```json
{
  "timeSpent": 900,
  "expectedTime": 840
}
```
*No trigger: 252 < 900 < 1512*

**Success Response (200) - SLOW Alert:**
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

**Success Response (200) - FAST Alert:**
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

**Success Response (200) - No Alert:**
```json
{
  "completed": true
}
```

**Error Response (400):**
```json
{
  "error": "timeSpent and expectedTime required"
}
```

**Status Codes:**
- `200` - Success (check `alert` property for conditional alert)
- `400` - Invalid request (missing fields)
- `500` - Server error

**Alert Trigger Logic:**
- `timeSpent > expectedTime * 1.8` → LESSON_PACING_SLOW
- `timeSpent < expectedTime * 0.3` → LESSON_PACING_FAST
- Otherwise → No alert

**Contract Notes:**
- Alert is **conditional** - three possible outcomes
- Only one alert type returned per request (slow OR fast OR none)
- Both fields must be numeric and present

---

### 3. GET `/insights/mock-batch`

**Description:** Get sample alerts for testing/demo (instructor dashboard)

**HTTP Method:** `GET`

**Request:** No body or parameters required

**Success Response (200):**
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

**Status Codes:**
- `200` - Success (always returns alerts array)

**Contract Notes:**
- `alerts` array is **always present** (never null/undefined)
- Always returns 3 alerts (hard-coded for demo)
- Safe to call repeatedly (no side effects)
- Use for populating instructor dashboard in demo mode

---

### 4. GET `/health`

**Description:** Health check endpoint

**HTTP Method:** `GET`

**Request:** No body or parameters required

**Success Response (200):**
```json
{
  "ok": true
}
```

**Status Codes:**
- `200` - Backend is healthy

**Contract Notes:**
- Always returns `{ "ok": true }` if server is running
- No errors or variations
- Use for initial connection testing

---

## Alert Object Schema

All alerts (from any endpoint) follow this structure:

```typescript
interface Alert {
  alertId: string;       // Timestamp-based ID, e.g., "1707307200000"
  source: string;        // "quiz" | "lesson" | "mock"
  type: string;          // Alert type (see below)
  message: string;       // Human-readable message
  severity: string;      // "high" | "medium" | "low"
  createdAt: string;     // ISO 8601 timestamp
}
```

**Alert Types:**
- `LEARNER_STRUGGLE` - Multiple attempts or excessive time
- `LESSON_PACING_SLOW` - Took too long on lesson
- `LESSON_PACING_FAST` - Rushed through lesson
- `COURSE_DROPOFF` - Low completion rates (mock-batch only)

**Severity Levels:**
- `high` - Urgent attention needed (LEARNER_STRUGGLE)
- `medium` - Monitor situation (LESSON_DIFFICULT)
- `low` - Informational (pacing, dropoff)

**Timestamp Format:**
- ISO 8601: `"2026-02-07T10:00:00.000Z"`
- Parseable by JavaScript `Date` constructor
- Always UTC timezone

---

## HTTP Status Code Reference

| Code | Meaning | When It Happens |
|------|---------|-----------------|
| 200 | Success | Request processed successfully |
| 400 | Bad Request | Missing required fields or wrong types |
| 500 | Server Error | Unexpected backend error |

**Error Response Format (400):**
```json
{
  "error": "Human-readable error message"
}
```

---

## CORS & Headers

**CORS Configuration:**
- ✅ Enabled for all origins
- ✅ Methods: GET, POST, OPTIONS
- ✅ Headers: Content-Type, Authorization (future)

**Required Request Headers:**
```http
Content-Type: application/json
```

**Response Headers:**
```http
Content-Type: application/json
Access-Control-Allow-Origin: *
```

---

## Data Type Guarantees

### Numbers
- All numeric fields are JavaScript `number` type
- No `NaN`, `Infinity`, or `null` in numeric fields
- Integers for counts (attempts), decimals allowed for time/score

### Strings
- All string fields are non-null
- Empty strings are not used (field omitted instead)
- Timestamps are ISO 8601 format

### Booleans
- `submitted`, `completed`, `ok` fields are always boolean
- Never `"true"` or `1` (always actual boolean)

### Objects
- Alert objects follow exact schema above
- No additional fields (stable structure)

### Arrays
- `/insights/mock-batch` always returns array
- Empty arrays `[]` may be used in future (currently always 3 items)

---

## Frontend Integration Guarantees

### ✅ What You Can Rely On

1. **Stable Endpoints** - Paths will not change
2. **Consistent Schemas** - Request/response structures frozen
3. **JSON Serialization** - All data is JSON-compatible
4. **ISO Timestamps** - Browser-parseable dates
5. **CORS Enabled** - No browser blocking
6. **Error Format** - Always `{ "error": "message" }`

### ⚠️ What May Change (Non-Breaking)

1. **Alert Messages** - Wording may improve
2. **AlertId Format** - May switch to UUIDs
3. **Response Times** - Performance optimizations
4. **Additional Fields** - New optional fields (additive only)

### ❌ What Will NOT Change (Breaking)

1. **Required Fields** - No new required fields in requests
2. **Field Types** - Number stays number, string stays string
3. **HTTP Methods** - POST stays POST, GET stays GET
4. **Alert Structure** - Core 6 fields remain

---

## Example Integration Code

### Fetch Wrapper (TypeScript)

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

async function apiCall<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`http://localhost:3000${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error, status: response.status };
    }

    return { data, status: response.status };
  } catch (err) {
    return { error: 'Network error', status: 0 };
  }
}

// Usage
const result = await apiCall('/quiz/submit', {
  method: 'POST',
  body: JSON.stringify({ attempts: 3, timeSpent: 1800 }),
});

if (result.error) {
  console.error(result.error);
} else if (result.data.alert) {
  console.log('Alert triggered:', result.data.alert);
}
```

### React Hook Example

```typescript
function useQuizSubmit() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<Alert | null>(null);

  const submit = async (attempts: number, timeSpent: number) => {
    setLoading(true);
    const response = await fetch('http://localhost:3000/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attempts, timeSpent }),
    });

    const data = await response.json();
    setLoading(false);

    if (data.alert) {
      setAlert(data.alert);
    }

    return data.submitted;
  };

  return { submit, loading, alert };
}
```

---

## Testing Contract Compliance

### Test 1: Health Check
```bash
curl http://localhost:3000/health
# Expected: {"ok":true}
```

### Test 2: Quiz Submit (Trigger)
```bash
curl -X POST http://localhost:3000/quiz/submit \
  -H 'Content-Type: application/json' \
  -d '{"attempts":4,"timeSpent":2000}'
# Expected: {"submitted":true,"alert":{...}}
```

### Test 3: Lesson Complete (No Trigger)
```bash
curl -X POST http://localhost:3000/lesson/complete \
  -H 'Content-Type: application/json' \
  -d '{"timeSpent":900,"expectedTime":840}'
# Expected: {"completed":true}
```

### Test 4: Mock Batch
```bash
curl http://localhost:3000/insights/mock-batch
# Expected: {"alerts":[...]} (array of 3)
```

### Test 5: Validation Error
```bash
curl -X POST http://localhost:3000/quiz/submit \
  -H 'Content-Type: application/json' \
  -d '{"attempts":"not-a-number"}'
# Expected: 400 {"error":"attempts and timeSpent must be numbers"}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-07 | Initial frozen contract |

---

**Approved By:** Backend Team  
**Status:** ✅ PRODUCTION READY (Demo Mode)  
**Next Review:** Post-Hackathon
