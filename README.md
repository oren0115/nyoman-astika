# Nyoman Astika — Portfolio

A full-stack personal portfolio with a built-in CMS, built with **Next.js 16**, **Prisma**, **PostgreSQL**, and **Tailwind CSS v4**.

## Features

- **Public portfolio** — home, projects, blog, experience, and contact pages
- **Admin CMS** — manage projects, posts, experience entries, and contact messages
- **Rich text editor** — Tiptap-powered editor for blog posts and project content
- **Image uploads** — Vercel Blob in production, local disk in development
- **Dark / light mode** — system-aware theme toggle
- **Type-safe** — end-to-end TypeScript with Prisma-generated types

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Database | PostgreSQL (Neon / Supabase / local) |
| ORM | Prisma 7 with `@prisma/adapter-pg` |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| Auth | JWT via `jose` |
| Storage | Vercel Blob (production) / local (development) |
| Fonts | Geist Sans, Geist Mono, JetBrains Mono (self-hosted) |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database (local or cloud)

### 1. Clone and install

```bash
git clone https://github.com/oren0115/portfolio.git
cd portfolio
pnpm install
```

> `pnpm install` automatically runs `prisma generate` via the `postinstall` script.

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in the required values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db"
JWT_SECRET="your-random-32-char-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate a secure `JWT_SECRET`:
```bash
openssl rand -hex 32
```

### 3. Set up the database

Push the schema to your database:
```bash
pnpm db:push
```

Seed with sample data (optional):
```bash
pnpm db:seed
```

Default admin credentials after seeding:
- **Email:** `admin@portfolio.dev`
- **Password:** `admin123456`

> ⚠️ Change the admin password immediately after first login.

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the CMS.

## Project Structure

```
portfolio/
├── app/
│   ├── (admin)/          # Auth + CMS pages (login, admin/*)
│   ├── (public)/         # Portfolio pages (home, projects, blog, experience, contact)
│   └── api/              # API routes (auth, projects, posts, experience, upload)
├── components/
│   ├── admin/            # Admin UI components
│   ├── public/           # Public-facing UI components
│   └── ui/               # Base shadcn/ui components
├── lib/
│   ├── services/         # Database service functions
│   ├── validations/      # Zod schemas
│   ├── auth.ts           # JWT session helpers
│   ├── prisma.ts         # Prisma client singleton
│   └── site-config.ts    # Site metadata (name, links, etc.)
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Sample data seed
└── public/
    └── fonts/            # Self-hosted Geist + JetBrains Mono fonts
```

## Database Scripts

| Command | Description |
|---|---|
| `pnpm db:generate` | Regenerate Prisma client after schema changes |
| `pnpm db:push` | Push schema changes to the database (no migration files) |
| `pnpm db:migrate` | Create a migration file and apply it |
| `pnpm db:seed` | Seed the database with sample data |
| `pnpm db:studio` | Open Prisma Studio (visual database browser) |

> Run `pnpm db:generate` any time you change `prisma/schema.prisma`.

## Deploying to Vercel

### 1. Push to GitHub

Make sure all changes are committed and pushed.

### 2. Import to Vercel

Go to [vercel.com/new](https://vercel.com/new), import your GitHub repository.

### 3. Set up Vercel Blob (image storage)

In your Vercel project dashboard → **Storage** → **Create Blob Store** → connect it to your project. The `BLOB_READ_WRITE_TOKEN` env variable is added automatically.

### 4. Set environment variables

In **Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string with `?sslmode=verify-full` |
| `JWT_SECRET` | Random 32+ character string |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` |
| `BLOB_READ_WRITE_TOKEN` | Auto-added by Vercel Blob |

### 5. Deploy

Vercel will automatically build and deploy. The `postinstall` script runs `prisma generate` during each build.

After the first deployment, push your schema:
```bash
pnpm db:push
```

## Customization

Edit `lib/site-config.ts` to update your name, title, description, and social links:

```ts
export const siteConfig = {
  name: "Your Name",
  title: "Your Name — Developer & Designer",
  description: "Your tagline here.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "",
  author: {
    name: "Your Name",
    email: "you@example.com",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
  },
};
```

## License

MIT
