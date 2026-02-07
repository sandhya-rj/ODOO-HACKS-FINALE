# LearnSphere Frontend

Production-grade SaaS frontend for the LearnSphere adaptive insights platform.

## Architecture

### Technology Stack
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** React Query + Context API
- **UI Components:** shadcn/ui (Radix UI primitives)

### Design Philosophy

This frontend follows **Odoo-inspired design principles**:

- ✅ **Clear Business Objects**: Every screen represents a real data model
- ✅ **Explicit State Management**: Draft → Published → Archived workflows
- ✅ **No Magic Behavior**: All actions are user-initiated and visible
- ✅ **Enterprise-Grade UI**: Clean, professional, accessible
- ✅ **Type Safety**: Full TypeScript coverage matching backend models

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── insights/       # Alert cards, insight displays
│   ├── layout/         # App layout, sidebar, navbar
│   └── ui/             # Base UI components (buttons, cards, etc.)
├── contexts/           # React Context providers
├── lib/                # Core utilities
│   ├── api.ts         # API client with type-safe endpoints
│   ├── types.ts       # TypeScript interfaces for backend models
│   └── utils.ts       # Helper functions
├── pages/              # Route pages
│   ├── demo/          # Demo flow pages (learner, instructor, system)
│   ├── courses/       # Course browsing and details
│   ├── instructor/    # Instructor dashboard and tools
│   └── my-learning/   # Learner portal
└── App.tsx            # Root app with routing
```

## Design System

### Color Palette

**Primary Colors:**
- Indigo/Royal Blue: `#4F46E5` (primary actions, headers)
- Soft Cyan: `#06B6D4` (accents, highlights)

**State Colors:**
- Success: `#10B981` (green)
- Warning: `#F59E0B` (amber)
- Danger: `#EF4444` (muted red)
- Info: `#3B82F6` (blue)

**Severity Indicators:**
- High: Red border/background (`red-200`, `red-50`)
- Medium: Amber border/background (`amber-200`, `amber-50`)
- Low: Blue border/background (`blue-200`, `blue-50`)

### Typography

- **Headings:** `font-bold`, slate-900
- **Body:** `text-sm` or `text-base`, slate-600
- **Metadata:** `text-xs`, slate-500

### Component Standards

**Cards:**
- Rounded corners: `rounded-lg`
- Soft shadows: `shadow-sm` on hover
- Border: `border-2 border-slate-200`
- Padding: `p-4` or `p-6`

**Buttons:**
- Primary: Indigo background, white text
- Secondary: Outline with hover state
- Size variants: `sm`, `md` (default), `lg`

**Status Badges:**
- Pill-shaped: `rounded-full`
- Color-coded by state
- Small text: `text-xs`

## API Integration

### Type-Safe Client

The `api.ts` client provides:
- ✅ Type-safe request/response interfaces
- ✅ Automatic JSON parsing
- ✅ Centralized error handling
- ✅ Environment-based base URL

**Example Usage:**

```typescript
import { api } from '@/lib/api';

// Health check
const health = await api.health.check();

// Submit quiz with alert response
const result = await api.quiz.submit({
  attempts: 4,
  timeSpent: 2000,
  score: 33.33
});

if (result.alert) {
  // Display alert to user
}
```

### Backend Models

All TypeScript interfaces in `lib/types.ts` mirror the Prisma schema:

- `User`, `UserRole`
- `Course`, `CourseStatus`
- `Lesson`, `LessonType`, `LessonProgress`
- `Quiz`, `QuizQuestion`, `QuizOption`, `QuizAttempt`
- `CourseEnrollment`
- `PointsLedger`, `Badge`
- `Insight`, `InsightType`, `InsightSeverity`

## Demo Flow

The demo showcases three personas:

### 1. Noah Davis - Struggling Learner
**Route:** `/demo/learner`

**Features:**
- Quiz submission (triggers LEARNER_STRUGGLE alert)
- Lesson completion (triggers LESSON_PACING_SLOW alert)
- Real-time alert display with severity indicators

### 2. Michael Chen - Instructor
**Route:** `/demo/instructor`

**Features:**
- Aggregated alert dashboard
- Severity filtering (high/medium/low)
- Statistics cards (active alerts, courses monitored)
- Alert feed with timestamps

### 3. System Status
**Route:** `/demo/system`

**Features:**
- Backend health monitoring
- Sample data preview
- Technology stack display
- Connection status indicators

## Development

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Setup

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env and set VITE_API_URL

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_API_URL=http://localhost:3000
VITE_ENV=development
```

### Available Scripts

```bash
npm run dev          # Start dev server (port 8080)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
```

## Component Examples

### Alert Card

```tsx
import { AlertCard } from '@/components/insights/AlertCard';

<AlertCard alert={{
  alertId: '123',
  source: 'quiz',
  type: 'LEARNER_STRUGGLE',
  message: 'High retries or time spent',
  severity: 'high',
  createdAt: new Date().toISOString()
}} />
```

### Status Badge

```tsx
import { StatusBadge } from '@/components/ui/status-badge';

<StatusBadge status="PUBLISHED" size="sm" />
<StatusBadge status="in-progress" size="md" />
```

## Production Readiness

### Type Safety
- ✅ Full TypeScript coverage
- ✅ Strict mode enabled
- ✅ No `any` types in business logic
- ✅ Interfaces match backend models

### Error Handling
- ✅ API errors caught and displayed
- ✅ Loading states for async operations
- ✅ Fallback UI for failed requests
- ✅ User-friendly error messages

### Accessibility
- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Keyboard navigation support
- ✅ Color contrast ratios meet WCAG AA

### Performance
- ✅ Code splitting with React lazy loading
- ✅ Optimized bundle size
- ✅ Efficient re-renders (React.memo where needed)
- ✅ Debounced search inputs

## Design Principles Checklist

### Odoo-Style Compliance

- ✅ **Real Business Objects**: Every screen maps to a backend model
- ✅ **Clear State Indicators**: Draft, Published, Archived, In-Progress
- ✅ **Explicit Actions**: No hidden automation, all actions are button clicks
- ✅ **Visual State Explanation**: Status badges, progress indicators
- ✅ **No Mock-Only UI**: All components designed for real API integration
- ✅ **Enterprise-Grade Polish**: Professional appearance, no toy UI
- ✅ **Composable Components**: Reusable across different contexts
- ✅ **Type-Safe Props**: No prop drilling without clear interfaces

## Future Enhancements

### Phase 1 (Immediate)
- [ ] Add authentication layer
- [ ] Implement course CRUD operations
- [ ] Build lesson content editor
- [ ] Add quiz builder interface

### Phase 2 (Near-term)
- [ ] Real-time notifications with WebSocket
- [ ] Advanced analytics dashboard
- [ ] Gamification UI (badges, leaderboards)
- [ ] Mobile responsive optimizations

### Phase 3 (Long-term)
- [ ] Dark mode support
- [ ] Multi-language support (i18n)
- [ ] Advanced filtering and search
- [ ] Export/import functionality

## Code Quality

### Standards

- **Linting:** ESLint with TypeScript rules
- **Formatting:** Prettier (configured in .prettierrc)
- **Naming:** camelCase for variables, PascalCase for components
- **File naming:** PascalCase for components, camelCase for utilities

### Best Practices

1. **Component Organization:**
   - One component per file
   - Props interface defined above component
   - Helper functions below component

2. **State Management:**
   - Use React Query for server state
   - Use Context API for global UI state
   - Keep component state local when possible

3. **API Calls:**
   - Always use the `api` client from `lib/api.ts`
   - Handle loading and error states
   - Display user feedback on success/failure

4. **Styling:**
   - Tailwind utility classes preferred
   - Use `cn()` helper for conditional classes
   - Follow design system color palette

## Documentation

- **API Integration:** See `API_CONTRACT.md` and `FRONTEND_API_NOTES.md`
- **Demo Flow:** See `FRONTEND_DEMO_FLOW_DESIGN.md`
- **Backend Models:** See `backend/prisma/schema.prisma`

## Support

For questions or issues:
1. Check existing documentation in project root
2. Review TypeScript interfaces in `lib/types.ts`
3. Inspect API responses in browser DevTools
4. Consult backend API contract documentation

---

**Status:** ✅ Production-Ready  
**Last Updated:** February 7, 2026  
**Maintainer:** LearnSphere Development Team
