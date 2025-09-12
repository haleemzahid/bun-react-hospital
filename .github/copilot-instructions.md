# Copilot Instructions for Hospital Management System

## Architecture Overview

This is a **full-stack Bun application** combining React frontend and Bun server in a single codebase. The application uses Bun's native HTTP server with integrated routing in `src/index.tsx` - this file serves both as the server entry point AND defines all API routes.

### Key Architecture Patterns

- **Single-file server + API**: `src/index.tsx` contains both server setup and all API routes using Bun's `serve()` with object-based routing
- **Client-side routing**: Custom router in `src/router/Router.tsx` using React state (no external routing library)
- **Embedded database**: SQLite database via Prisma located at `src/prisma/dev.db`
- **Path aliases**: Use `@/*` for `./src/*` imports (configured in `tsconfig.json`)

## Development Workflow

### Essential Commands
- `bun dev` - Development server with hot reload
- `bun install` - Install dependencies 
- `bun build` - Production build
- `npx prisma db push` - Apply schema changes to database
- `npx prisma studio` - Visual database browser

### Database Integration
- Prisma client imported as `prisma` from `@/database/data`
- Schema defines Patient, Doctor, Appointment entities with relations
- All API routes include Prisma relations using `include` option for data fetching
- Database connection is PostgreSQL in production, SQLite in development

## Code Patterns

### API Route Structure
API routes are defined as object methods in `src/index.tsx`:
```typescript
'/api/patients': {
  async GET() {
    const patients = await prisma.patient.findMany({
      include: { appointments: { include: { doctor: true } } }
    });
    return Response.json(patients);
  },
  async POST(req) {
    const data = await req.json();
    // ... create logic
  }
}
```

### Frontend Service Layer
- Services in `src/services/api.ts` use native `fetch()` with empty `API_BASE`
- Each entity has its own service object (`patientService`, `doctorService`, etc.)
- No API client library - uses browser fetch with proper error handling

### Component Organization
- Layout components: `src/components/layout/` (Navigation, PageLayout, FeatureCard)
- UI components: `src/components/ui/` (Button, Input, Select, Icons, Loading)
- Pages: `src/pages/` (HomePage, PatientsPage, DoctorsPage, AppointmentsPage)
- All use named exports, barrel exports via `index.ts` files

### Styling System
- TailwindCSS v4+ with Bun plugin integration
- Mobile-first responsive design patterns
- Consistent spacing and color scheme throughout

## Project-Specific Conventions

### File Organization
- Database schema: `src/prisma/schema.prisma` 
- Database client: `src/database/data.ts`
- Types: `src/types/index.ts` (mirrors Prisma models)
- Static assets: `src/` directory (logo.svg, react.svg)

### Error Handling
- API routes use try-catch with generic error messages
- Frontend services throw errors for non-ok responses
- No global error boundary - handle errors at component level

### State Management  
- Local React state only (useState, useEffect)
- No global state management library
- Navigation state managed in Router component

## Integration Points

### Bun-Specific Features
- `bunfig.toml` configures static serving and TailwindCSS plugin
- Hot reload enabled in development via `development.hmr: true`
- Environment variables prefixed with `BUN_PUBLIC_*` are client-accessible

### Build Process
- Single build command produces browser-ready bundle
- Source maps enabled for debugging
- Production builds minified with environment variables

When working with this codebase, remember that it's a **monolithic full-stack Bun app** where the server and client code coexist. Always consider both sides when making changes to shared types or data structures.