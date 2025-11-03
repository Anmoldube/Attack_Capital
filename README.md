# Omnicolm

## Overview
- **Description**: Omnicolm is a modern workspace management platform that centralizes customer interactions across channels like email, SMS, and social media. It features real-time messaging, channel integrations, and collaborative tools to streamline customer support workflows.
- **Tech Stack**: Next.js 14, React 18, TypeScript, Prisma, Convex, Tailwind CSS, shadcn/ui, Sonner, Lucide Icons
- **Highlights**:
  - Workspace-based collaboration with channel and member management
  - Real-time messaging with threads, reactions, and file attachments
  - OAuth support for Google and GitHub via Better Auth
  - Convex for event-driven real-time updates and background jobs
  - Prisma ORM with PostgreSQL for data persistence

## Features
1. **Unified Inbox**: Manage conversations across multiple channels (SMS, WhatsApp, Email, Twitter, Facebook) from a single interface.
2. **Workspace & Team Management**: Create workspaces, invite teammates, assign roles (Admin, Editor, Viewer).
3. **Channels & Conversations**: Create channels, start direct messages, manage threads, and add reactions.
4. **Contacts & Notes**: Maintain contact profiles, track communication, and add notes with visibility controls.
5. **Authentication**: Better Auth integration with Google/GitHub OAuth and custom credential flows.
6. **Notifications & Toasts**: Sonner-based toast notifications for success/error feedback.
7. **Rich Text Messaging**: Quill-powered editor for rich text, attachments, and scheduling messages.

## Getting Started
1. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```
2. **Set up environment variables**: Copy `.env.example` to `.env.local` and fill in Convex, OAuth, and database credentials.
3. **Database setup**:
   ```bash
   npx prisma migrate dev
   ```
4. **Convex setup**:
   ```bash
   npx convex dev
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```

## Scripts
- `npm run dev`: Start the Next.js development server.
- `npm run build`: Build the production bundle.
- `npm run start`: Start the production server.
- `npm run lint`: Run ESLint.
- `npm run lint:fix`: Fix lint issues.
- `npm run format`: Run Prettier in check mode.
- `npm run format:fix`: Format files with Prettier.

## Project Structure
```
src/
├── app/                # Next.js routes (auth, API endpoints, workspace views)
├── components/         # UI primitives and shared components
├── features/           # Domain-specific features (workspaces, channels, messages, members)
├── hooks/              # Custom React hooks
├── lib/                # Prisma client, auth utilities, Convex client helpers
├── config/             # Site metadata and config
└── middleware.ts       # Middleware for auth and routing
convex/                 # Convex functions for real-time data and actions
prisma/                 # Prisma schema and migrations
public/                 # Static assets
```

## Environment Variables
- `NEXT_TELEMETRY_DISABLED`: Disable Next.js telemetry.
- `CONVEX_DEPLOYMENT`: Convex deployment identifier (`dev:<deployment-name>`).
- `NEXT_PUBLIC_CONVEX_URL`: Public Convex URL.
- `DATABASE_URL`: PostgreSQL connection string.
- `AUTH_GOOGLE_CLIENT_ID` / `AUTH_GOOGLE_CLIENT_SECRET`: Google OAuth credentials.
- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`: GitHub OAuth credentials.
- `SITE_URL`: Deployed site URL.

## Deployment
- Deploy front-end on Vercel.
- Configure Convex production deployment and environment variables.
- Run `npm run build` and `npm run start` for production.

## License
- **MIT License**. See [LICENSE](./LICENSE).
