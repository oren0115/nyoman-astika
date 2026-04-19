# Portfolio CMS

A modern, full-stack Portfolio CMS built with Next.js 16, TypeScript, Prisma, PostgreSQL, and shadcn/ui.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Database | PostgreSQL + Prisma ORM v7 |
| UI | shadcn/ui + Tailwind CSS v4 |
| Icons | Phosphor Icons |
| Auth | JWT (jose) + bcryptjs |
| Editor | TipTap rich text editor |
| Validation | Zod |

## Project Structure

```
portfolio/
├── app/
│   ├── (public)/          # Public-facing pages
│   │   ├── page.tsx       # Homepage (hero, featured projects/posts)
│   │   ├── projects/      # Projects list + detail
│   │   └── blog/          # Blog list + detail
│   ├── (admin)/           # Protected admin area
│   │   ├── login/         # Login page
│   │   └── admin/
│   │       ├── page.tsx   # Dashboard
│   │       ├── projects/  # CRUD projects
│   │       └── posts/     # CRUD blog posts
│   └── api/               # REST API routes
│       ├── auth/          # login, logout, me
│       ├── projects/      # GET, POST, PUT, DELETE
│       └── posts/         # GET, POST, PUT, DELETE
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── public/            # Public layout components
│   └── admin/             # Admin components & forms
├── lib/
│   ├── prisma.ts          # Prisma client (v7 adapter)
│   ├── auth.ts            # JWT sign/verify/session
│   ├── utils.ts           # cn, slugify, formatDate
│   ├── site-config.ts     # Site metadata config
│   ├── validations/       # Zod schemas
│   └── services/          # Data access layer
├── prisma/
│   ├── schema.prisma      # DB models
│   └── seed.ts            # Sample data seed
├── types/
│   └── index.ts           # Shared TypeScript types
└── proxy.ts               # Route protection (Next.js 16)
```

## Getting Started

### 1. Prerequisites

- Node.js 18+
- PostgreSQL running locally (or remote)
- pnpm

### 2. Setup Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/portfolio_db"
JWT_SECRET="your-super-secret-key-min-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Setup Database

```bash
# Create the database (in psql or pgAdmin)
createdb portfolio_db

# Push schema to database
pnpm db:push

# OR use migrations (recommended for production)
pnpm db:migrate

# Seed with sample data
pnpm db:seed
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Admin Login

After seeding, log in at `/login`:
- Email: `admin@portfolio.dev`
- Password: `admin123456`

> **Change the default password immediately after first login.**

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm typecheck    # TypeScript type checking
pnpm lint         # ESLint
pnpm format       # Prettier

pnpm db:generate  # Regenerate Prisma client
pnpm db:push      # Push schema (no migrations)
pnpm db:migrate   # Create and run migrations
pnpm db:seed      # Seed sample data
pnpm db:studio    # Open Prisma Studio (GUI)
```

## Features

### Public Website
- Homepage with hero section + featured projects/posts
- Projects list with tech stack badges
- Project detail with rich content
- Blog list with tags
- Blog detail with formatted content
- Responsive (mobile-first)
- Dark mode support

### Admin CMS
- JWT-based authentication (httpOnly cookie)
- Protected routes via `proxy.ts`
- Dashboard with stats overview
- CRUD for Projects (title, slug, description, tech stack, links, status)
- CRUD for Blog Posts (title, slug, excerpt, content, tags, status)
- TipTap rich text editor
- Tag input with keyboard support
- Auto-slug generation from title
- Pagination, search, status filter
- Delete confirmation dialogs

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/logout` | — | Logout |
| GET | `/api/auth/me` | ✓ | Get current user |
| GET | `/api/projects` | — | List projects |
| POST | `/api/projects` | ✓ | Create project |
| GET | `/api/projects/:id` | — | Get project |
| PUT | `/api/projects/:id` | ✓ | Update project |
| DELETE | `/api/projects/:id` | ✓ | Delete project |
| GET | `/api/posts` | — | List posts |
| POST | `/api/posts` | ✓ | Create post |
| GET | `/api/posts/:id` | — | Get post |
| PUT | `/api/posts/:id` | ✓ | Update post |
| DELETE | `/api/posts/:id` | ✓ | Delete post |

## Customization

### Site Config
Edit `lib/site-config.ts` to update:
- Your name, email
- GitHub, LinkedIn, Twitter links
- Site title and description

### Colors
The theme uses shadcn/ui's default color palette. Do not modify CSS variables in `globals.css` to maintain design consistency.

### Adding Content Types
1. Add model to `prisma/schema.prisma`
2. Create validation in `lib/validations/`
3. Create service in `lib/services/`
4. Create API route in `app/api/`
5. Create admin page in `app/(admin)/admin/`
6. Create public page in `app/(public)/`

## Deployment

### Production Checklist
- [ ] Set strong `JWT_SECRET` (32+ chars)
- [ ] Set correct `DATABASE_URL`
- [ ] Set `NEXT_PUBLIC_APP_URL` to your domain
- [ ] Run `pnpm db:migrate` for production migrations
- [ ] Change admin password after first login
- [ ] Configure `remotePatterns` in `next.config.mjs` for your image CDN
