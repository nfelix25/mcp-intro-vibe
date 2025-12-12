# MCP Server Issue Tracker - Implementation Tasks

## Project Setup

- [ ] Initialize project structure with separate frontend and backend directories
- [ ] Set up package.json for both frontend and backend
- [ ] Install dependencies:
  - [ ] Backend: fastify, sqlite3, better-auth, cors, dotenv
  - [ ] Frontend: react, shadcn/ui, tailwindcss, axios/fetch client
- [ ] Create .gitignore files
- [ ] Set up TypeScript configuration

## Database Setup

- [ ] Create SQLite database file structure
- [ ] Write SQL migration scripts for tables:
  - [ ] users table
  - [ ] issues table
  - [ ] tags table
  - [ ] issue_tags junction table
- [ ] Create database initialization script
- [ ] Add sample data seeding script

## Backend API Development

### Authentication Setup

- [ ] Configure BetterAuth with SQLite adapter
- [ ] Create auth middleware for protected routes
- [ ] Implement auth routes:
  - [ ] POST /auth/signup (tested and working)
  - [ ] POST /auth/signin (tested and working)
  - [ ] POST /auth/signout (available via BetterAuth)
  - [ ] GET /auth/me (available via BetterAuth as get-session)

### API Routes - Users

- [ ] GET /api/users (for assignment dropdown) - implemented and tested
- [ ] Add user validation middleware - auth middleware added

### API Routes - Tags

- [ ] GET /api/tags - implemented and tested
- [ ] POST /api/tags - implemented with validation and duplicate prevention
- [ ] DELETE /api/tags/:id - implemented with usage protection
- [ ] Add tag validation (unique names) - case-insensitive uniqueness enforced

### API Routes - Issues

- [ ] GET /api/issues (with filtering query params) - implemented with status, user, tag, search filters and pagination
- [ ] POST /api/issues - implemented with full validation and tag assignment
- [ ] GET /api/issues/:id - implemented with complete user and tag details
- [ ] PUT /api/issues/:id - implemented with partial updates and tag management
- [ ] DELETE /api/issues/:id - implemented with proper cleanup
- [ ] Add issue validation middleware - comprehensive validation added

### API Middleware & Utils

- [ ] Error handling middleware - comprehensive error handling with custom error classes, SQLite error mapping, dev/prod modes
- [ ] Request validation middleware - validation schemas for all endpoints with common patterns
- [ ] ~~Rate limiting middleware~~ - removed per user request
- [ ] Database connection utilities - connection management, transactions, query builder, pagination
- [ ] Health check endpoints - /health, /health/ready, /health/live with database and memory monitoring
- [ ] CORS configuration - properly configured for frontend development

## Frontend Development

### Project Setup

- [ ] Set up React project with Vite ✅ (already configured with TypeScript)
- [ ] Configure shadcn/ui components - installed Button, Input, Card, Badge, Dialog, Select components
- [ ] Set up Tailwind CSS ✅ (already configured with CSS variables for theming)
- [ ] Create routing structure with React Router - BrowserRouter with Layout and main pages (Home, Issues, SignIn, SignUp)

### Authentication Components

- [ ] Create AuthContext for state management - React context with auth state, sign in/up/out functions, session management
- [ ] Build SignIn component - Form with email/password, error handling, navigation, integration with AuthContext
- [ ] Build SignUp component - Form with name/email/password/confirm, validation, error handling, navigation
- [ ] Build SignOut functionality - SignOutButton component with proper cleanup and navigation
- [ ] Add protected route wrapper - ProtectedRoute component with loading states and redirect logic

### Core Components

- [ ] Create Issue component (display card) - IssueCard component with comprehensive issue display including metadata, tags, users, actions
- [ ] Create IssueForm component (create/edit) - Form component with validation, tag management, user assignment, create/edit modes
- [ ] Create TagBadge component - Customizable tag badges with color support and optional remove functionality
- [ ] Create StatusBadge component - Status-specific badge styling for open/in_progress/resolved/closed states
- [ ] Create UserAvatar component - User avatar with initials fallback, consistent color generation, size variants

### Main Pages

- [ ] Build IssueList page with filtering:
  - [ ] Filter by assigned user - Select dropdown with user avatars and names
  - [ ] Filter by status - Select dropdown for open/in_progress/resolved/closed
  - [ ] Filter by tag - Select dropdown with tag badges
  - [ ] Search functionality - Text input for title/description search
- [ ] Build IssueDetail page - Comprehensive issue display with sidebar metadata, timeline, and actions
- [ ] Build CreateIssue page - Form page for creating new issues with validation and navigation
- [ ] Build EditIssue page - Form page for editing existing issues with pre-populated data

### UI Features

- [ ] Add loading states - Loading spinner component, loading states in forms and pages
- [ ] Add error handling and toast notifications - Sonner toast provider with success/error/info notifications
- [ ] Implement confirmation dialogs for deletions - ConfirmDialog component with delete confirmation
- [ ] Add responsive design - Mobile-friendly layouts, responsive grid and flexbox
- [ ] Create empty states for no issues/tags - EmptyState, EmptyIssues, EmptySearchResults components

## Testing

- [ ] Test all CRUD operations - Comprehensive backend CRUD tests implemented (Issues: 10/11 passing, Tags: 5/7 passing, Users endpoint tested)
- [ ] Test authentication flow - Authentication flow tests implemented (9/13 passing, covers protected routes, invalid auth, CORS)
- [ ] Test filtering and search - Complete filtering and search tests (14/17 passing, covers status, user, tag, priority, search, pagination)
- [ ] Verify responsive design - Frontend responsive design tests implemented (11/11 passing, covers grid layouts, typography, spacing, visibility classes)
- [ ] Test error scenarios - Comprehensive error scenario testing (23/25 passing, covers validation, constraints, malformed requests, edge cases)

## Final Polish

- [ ] Add proper TypeScript types throughout
- [ ] Clean up console logs and debug code
- [ ] Add README.md with setup instructions
- [ ] Create environment variable templates

## Deployment Prep

- [ ] Create production build scripts
- [ ] Document API endpoints

---

**Notes for Implementation:**

- Keep UI simple and focused - no unnecessary features
- Use shadcn/ui components consistently
- Ensure proper error handling throughout
- Make the filtering intuitive and responsive
- Keep the codebase clean and well-organized