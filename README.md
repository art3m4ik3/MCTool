# MC Tool

**MC Tool** — a collection of powerful, browser-based utilities for Minecraft server administrators and players.

---

## 🚀 Features

- **Wide range of tools**: MOTD generator, whitelist manager, server properties editor, color code converter, startup flags helper, plugin installer, and more.
- **SEO optimized**: Static sitemap & robots.txt (via `next-sitemap`), custom metadata (Open Graph, Twitter Cards), HSTS & security headers.
- **High performance**: Next.js v15 with App Router, HTTP/2 push, image optimization, caching headers.
- **Responsive UI**: Tailwind CSS + Radix UI components + Framer Motion animations.
- **TypeScript**: Full type-safety across client and server code.
- **Dockerized**: `Dockerfile` & `docker-compose.yml` for containerized builds and production deployment.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Sitemap & SEO**: next-sitemap, metadata API
- **Animations**: Framer Motion
- **Authentication**: (none — public utilities)
- **Containerization**: Docker, Docker Compose

---

## 📦 Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/mctool.git
   cd mctool
   ```
2. Install dependencies:
   ```bash
   bun i
   ```

### Development

```bash
bun run dev
```

### Production Build & Run

```bash
bun run build
bun run start
```

---

## 🐳 Docker

Build and run with Docker Compose:

```bash
docker-compose up --build
```

Or build and run only the web service:

```bash
docker build -t mctool .
docker run -p 3000:3000 mctool
```

---

## ⚙️ Configuration

- **Environment**: via `NODE_ENV=production`
- **Site URL**: set in `next-sitemap.config.js` (`siteUrl: 'https://mctool.pro'`)
- **Metadata**: defined in `app/layout.tsx`

---

## 📝 Scripts

- `bun run dev` — development server
- `bun run build` — build production bundle
- `bun run start` — start production server
- `bun run lint` — run Next.js linting
- `bun run postbuild` — generate sitemap & robots.txt
