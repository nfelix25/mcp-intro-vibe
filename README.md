# MCP Issue Tracker

A full-stack issue tracking application built with React, Fastify, SQLite, and BetterAuth.

## Features

- **User Authentication**: Sign up, sign in, and session management with BetterAuth
- **Issue Management**: Create, read, update, and delete issues
- **Filtering & Search**: Filter issues by status, assignee, tags, and search by text
- **Tags**: Organize issues with color-coded tags
- **User Assignment**: Assign issues to team members
- **Priority Levels**: Set issue priorities (low, medium, high)
- **Status Tracking**: Track issue progress (not started, in progress, done)
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Fastify**: Fast and efficient Node.js web framework
- **BetterAuth**: Modern authentication library
- **SQLite**: Lightweight database (via better-sqlite3)
- **Node.js**: JavaScript runtime

### Frontend
- **React**: UI library
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: UI component library
- **Axios**: HTTP client
- **Sonner**: Toast notifications

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mcp-intro-vibe
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Initialize the database:
```bash
cd ../backend
npm run init-db
```

## Running the Application

### Start the Backend

```bash
cd backend
npm run dev
```

The backend API will be available at `http://localhost:3000`

### Start the Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/sign-up/email` - Create a new account
- `POST /api/auth/sign-in/email` - Sign in to an account
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/get-session` - Get current session

### Issues
- `GET /api/issues` - List issues (with filtering)
- `POST /api/issues` - Create a new issue
- `GET /api/issues/:id` - Get issue by ID
- `PUT /api/issues/:id` - Update an issue
- `DELETE /api/issues/:id` - Delete an issue

### Tags
- `GET /api/tags` - List all tags
- `POST /api/tags` - Create a new tag
- `DELETE /api/tags/:id` - Delete a tag

### Users
- `GET /api/users` - List all users

### Health
- `GET /health` - Detailed health status
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=3000
BETTER_AUTH_SECRET=your-secret-key-change-in-production
BETTER_AUTH_URL=http://localhost:3000
```

## Database Schema

The application uses SQLite with the following main tables:

- **user**: User accounts (managed by BetterAuth)
- **session**: User sessions (managed by BetterAuth)
- **issue**: Issue tracking
- **tag**: Issue tags/labels
- **issue_tag**: Many-to-many relationship between issues and tags

## Project Structure

```
mcp-intro-vibe/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── connection.js
│   │   │   ├── init.js
│   │   │   └── schema.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── error.js
│   │   ├── routes/
│   │   │   ├── health.js
│   │   │   ├── issues.js
│   │   │   ├── tags.js
│   │   │   └── users.js
│   │   ├── utils/
│   │   │   └── validation.js
│   │   ├── auth.js
│   │   └── index.js
│   ├── database.sqlite
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── badge.jsx
│   │   │   │   ├── button.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   ├── label.jsx
│   │   │   │   ├── select.jsx
│   │   │   │   └── textarea.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── TagBadge.jsx
│   │   │   └── UserAvatar.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   └── utils.js
│   │   ├── pages/
│   │   │   ├── CreateIssuePage.jsx
│   │   │   ├── EditIssuePage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── IssueDetailPage.jsx
│   │   │   ├── IssuesPage.jsx
│   │   │   ├── SignInPage.jsx
│   │   │   └── SignUpPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── API.md
├── INSTRUCTIONS.md
├── TASKS.md
├── package.json
└── README.md
```

## Usage

1. **Create an Account**: Visit `http://localhost:5173` and click "Sign Up"
2. **Sign In**: Use your credentials to sign in
3. **Create Issues**: Click "New Issue" to create your first issue
4. **Organize with Tags**: Add tags to categorize issues
5. **Assign Work**: Assign issues to team members
6. **Track Progress**: Update issue status as work progresses
7. **Filter & Search**: Use filters to find specific issues

## Development

### Backend Development

The backend uses Node.js with `--watch` flag for auto-reload:

```bash
npm run dev
```

### Frontend Development

The frontend uses Vite's hot module replacement:

```bash
npm run dev
```

### Database Management

To reset the database:

```bash
cd backend
rm database.sqlite
npm run init-db
```

## Production Build

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

The built files will be in `frontend/dist/`.

## Security Considerations

- Change `BETTER_AUTH_SECRET` in production
- Use HTTPS in production
- Configure appropriate CORS origins
- Implement rate limiting for production use
- Regular security audits and dependency updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.
