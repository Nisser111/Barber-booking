# Barber Booking

Local-first appointment booking for a barbershop: customers pick a service, date, and time slot; admins see and manage bookings and slot availability. The stack is two web apps, a NestJS API, MySQL, and an Nginx reverse proxy, all runnable with Docker Compose.

**Out of scope for v1:** payments, customer accounts, multi-location shops. See [PRD.md](PRD.md) for full product detail.

---

## Features

- **Customer app** — Browse services, choose a date and available slot, book with name and phone, view confirmation (and cancel when supported by the UI).
- **Admin app** — List appointments, update status, manage time slots and overrides.
- **API** — REST endpoints for services, slots, and bookings (TypeORM + MySQL).

---

## Stack

| Layer       | Technology                                                                       |
| ----------- | -------------------------------------------------------------------------------- |
| Customer UI | React 19, Vite, Redux Toolkit, React Router, Tailwind, shadcn-style UI (Base UI) |
| Admin UI    | Next.js 16, React 19, Tailwind, `basePath: /admin`                               |
| API         | NestJS 11, TypeORM, MySQL2, class-validator                                      |
| Data        | MySQL 8.4 (schema seed via `mysql/init.sql`)                                     |
| Proxy       | Nginx (`/`, `/admin`, `/api/` → internal services)                               |

Dockerfiles use **multi-stage** builds and target **`linux/amd64`** for consistent behavior across hosts.

---

## Architecture

```
Browser
   └── http://localhost:80  →  Nginx (barber-proxy)
         ├── /              →  client-frontend :3000
         ├── /admin         →  admin-frontend :3001
         └── /api/          →  backend-api :4000  →  MySQL :3306
```

The customer app calls the API with base path `/api` (same origin through the proxy). The admin app uses `API_URL=http://backend-api:4000` inside Docker.

**Compose service names and containers**

| Compose service   | Container name   |
| ----------------- | ---------------- |
| `proxy`           | `barber-proxy`   |
| `client-frontend` | `barber-client`  |
| `admin-frontend`  | `barber-admin`   |
| `backend-api`     | `barber-backend` |
| `mysql`           | `barber-mysql`   |

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/) v2

---

## Quick start

From the repository root:

```bash
docker compose up --build
```

Wait until MySQL is healthy (the API depends on it). Then open:

| URL                                                | Purpose                             |
| -------------------------------------------------- | ----------------------------------- |
| [http://localhost](http://localhost)               | Customer booking app                |
| [http://localhost/admin/](http://localhost/admin/) | Admin panel                         |
| [http://localhost/api/](http://localhost/api/)     | API (e.g. health or list endpoints) |

MySQL is exposed on host port **3306** for local tools (default dev credentials below).

---

## Common commands

```bash
# Run in background
docker compose up -d --build

# Stop stacks
docker compose down

# Reset database (removes named volume)
docker compose down -v

# Logs
docker compose logs -f backend-api

# Run a package script inside a service
docker compose exec backend-api npm run test
docker compose exec client-frontend npm run lint
docker compose exec admin-frontend npm run lint
```

Source trees are mounted into the Node containers for development; `node_modules` stay in anonymous volumes so installs happen inside the image/build.

---

## API overview (via proxy)

Base URL: `http://localhost/api/` (Nginx strips the `/api` prefix when forwarding to Nest).

| Area     | Examples                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------- |
| App      | `GET /` — root controller                                                                                           |
| Services | `GET /services`, `GET /services/:id`                                                                                |
| Slots    | `GET /slots`, `POST /slots`, `PUT /slots/:id`, `POST /slots/override`                                               |
| Bookings | `POST /bookings`, `GET /bookings`, `GET /bookings/:id`, `PATCH /bookings/:id/status`, `DELETE /bookings/:id/cancel` |

---

## Configuration

Database-related variables for the API are set in `docker-compose.yml` (compose network hostname `mysql`). Defaults:

| Variable      | Default           |
| ------------- | ----------------- |
| `DB_HOST`     | `mysql`           |
| `DB_PORT`     | `3306`            |
| `DB_NAME`     | `barber_booking`  |
| `DB_USER`     | `barber`          |
| `DB_PASSWORD` | `barber_password` |

MySQL root password in compose: `root_password`. Use proper secrets for any real deployment.

---

## Project layout

```
.
├── client-frontend/     # Customer SPA (Vite)
├── admin-frontend/      # Admin (Next.js, basePath /admin)
├── backend-api/         # NestJS REST API
├── mysql/
│   └── init.sql         # Initial schema / seed (runs on first DB init)
├── proxy/
│   ├── Dockerfile
│   └── nginx.conf       # Routes /, /admin, /api
├── docker-compose.yml
├── PRD.md               # Product requirements
├── RULES.md             # Collaboration / coding guidelines
└── README.md
```

---

## Local development without Compose

You need MySQL 8.x reachable with a database matching `init.sql`, Node **22** (aligned with Docker images), and matching env vars for `backend-api`. Run `npm ci` and `npm run start:dev` in `backend-api`, `npm run dev` in `client-frontend` (with a dev server proxy or `VITE_*` base URL pointing at the API), and `npm run dev -- -p 3001` in `admin-frontend` with `API_URL` pointing at the API. The intended happy path is **Docker Compose** so Nginx and service discovery match production-like wiring.

---

## Troubleshooting

- **Port 80 already in use** — Stop the other process or change the proxy port mapping in `docker-compose.yml`.
- **Stale or broken DB state** — `docker compose down -v` and bring the stack up again (re-runs `init.sql` on a fresh volume).
- **ARM Mac / Windows** — Images target `linux/amd64`; Docker will emulate if needed (first build may be slower).
