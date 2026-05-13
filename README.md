# Nyoman Astika — Portfolio

A full-stack personal portfolio with a built-in CMS, built with **Next.js 16**, **Prisma 6**, **MongoDB**, and **Tailwind CSS v4**.

## Features

- **Public portfolio** — home, projects, blog, experience, and contact pages
- **Admin CMS** — manage projects, posts, experience entries, and contact messages
- **Rich text editor** — Tiptap-powered editor for blog posts and project content
- **Image uploads** — Cloudinary (admin uploads; configure env in production)
- **Dark / light mode** — system-aware theme toggle
- **Type-safe** — end-to-end TypeScript with Prisma-generated types

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Database | MongoDB (Atlas or self-hosted) |
| ORM | Prisma 6.19 + MongoDB (Prisma 7 requires SQL driver adapters; use v6 for Mongo until [supported](https://www.prisma.io/docs/orm/overview/databases/mongodb)) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| Auth | JWT via `jose` |
| Storage | Cloudinary |
| Fonts | Geist Sans, Geist Mono, JetBrains Mono (self-hosted) |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- MongoDB database ([MongoDB Atlas](https://www.mongodb.com/atlas) free tier works well)

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
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority"
JWT_SECRET="your-random-32-char-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
```

Or set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` instead of `CLOUDINARY_URL`. Get these from the [Cloudinary Console](https://console.cloudinary.com/) → **Dashboard** / **API Keys**.

`DATABASE_URL` must include the **MongoDB database name in the path** (e.g. `...mongodb.net/portfolio?...`). If the URI goes from the host straight to `?` without `/dbname`, Prisma returns **P1013**.

Generate a secure `JWT_SECRET`:
```bash
openssl rand -hex 32
```

### 3. Set up the database

Push the schema to your database:
```bash
pnpm db:push
```

> **MongoDB:** Prisma **Migrate** (`prisma migrate dev`, `migrate deploy`, …) is **not supported** for the `mongodb` provider. Use **`pnpm db:push`** to apply schema changes ([Prisma + MongoDB](https://www.prisma.io/docs/orm/overview/databases/mongodb)).

Create the default admin user (optional):
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
│   └── seed.ts           # Default admin user
└── public/
    └── fonts/            # Self-hosted Geist + JetBrains Mono fonts
```

## Database Scripts

| Command | Description |
|---|---|
| `pnpm db:generate` | Regenerate Prisma client after schema changes |
| `pnpm db:push` | Push schema changes to the database (no migration files) |
| `pnpm db:migrate` | Same as `db:push` — use this instead of `prisma migrate dev` |
| `pnpm migrate:dev` | Fails with a hint (MongoDB does not support Prisma Migrate) |
| `pnpm db:seed` | Create the default admin user if missing |
| `pnpm db:studio` | Open Prisma Studio (visual database browser) |

> Do **not** run `pnpm prisma migrate dev` against MongoDB; Prisma will error by design.

> Run `pnpm db:generate` any time you change `prisma/schema.prisma`.

## Deploying to Vercel

### 1. Push to GitHub

Make sure all changes are committed and pushed.

### 2. Import to Vercel

Go to [vercel.com/new](https://vercel.com/new), import your GitHub repository.

### 3. Cloudinary (image storage)

Create a free account at [cloudinary.com](https://cloudinary.com). In the **Dashboard**, use **API Environment variable** (`CLOUDINARY_URL`) or set **Cloud name**, **API Key**, and **API Secret** in Vercel (see below). Uploaded images go to the folder `portfolio/uploads`.

### 4. Set environment variables

In **Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | MongoDB URI including **database name in the path** (e.g. `...mongodb.net/portfolio?...`) — required by Prisma ([P1013](https://www.prisma.io/docs/orm/reference/error-reference#p1013) if missing) |
| `JWT_SECRET` | Random 32+ character string |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` |
| `CLOUDINARY_URL` | Optional single var from Cloudinary dashboard |
| `CLOUDINARY_CLOUD_NAME` | If not using `CLOUDINARY_URL` |
| `CLOUDINARY_API_KEY` | If not using `CLOUDINARY_URL` |
| `CLOUDINARY_API_SECRET` | If not using `CLOUDINARY_URL` |

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
