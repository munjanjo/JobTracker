# Job Tracker

Web app for tracking job applications. Add the jobs you applied to, move them between stages on a kanban board and keep a history of every status change.

## Features

- Registration and login (cookie-based auth with ASP.NET Core Identity)
- Each user can only see and edit their own applications
- Kanban board with drag and drop between stages: Saved, Applied, Screening, Technical interview, Offer, Rejected, Withdrawn
- Status history with timestamps and optional notes for every change
- Filter applications by status and search by company or position

## Stack

- ASP.NET Core Web API (.NET 10), ASP.NET Core Identity
- PostgreSQL, Entity Framework Core
- React, Vite, Tailwind CSS
- Docker Compose

## Project structure

```
src/JobTracker.Api/   ASP.NET Core API (controllers, EF Core DbContext, migrations)
frontend/             React app (Vite dev server proxies /api to the backend)
docker-compose.yml    PostgreSQL and API containers
```

## Running locally

Requires .NET 10 SDK, Docker and Node.js.

```bash
# database
cp .env.example .env
docker compose up -d db

# API (http://localhost:5056)
cd src/JobTracker.Api
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;Port=5433;Database=jobtracker;Username=jobtracker;Password=change_me"
dotnet run

# frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

Migrations are applied on startup in Development. Swagger UI is at `/swagger`.

To run the API in Docker as well: `docker compose up -d --build` (API on http://localhost:8080).

## API

```
POST   /api/auth/register
POST   /api/auth/login?useCookies=true
POST   /api/auth/logout
GET    /api/applications
POST   /api/applications
GET    /api/applications/{id}
PATCH  /api/applications/{id}/status
GET    /api/applications/{id}/history
```
