# WeRepair

Local development environment for **WeRepair** — we repair electrical and
mechanical devices, right at your premises, on call.

## Overview

- **Customers** report a faulty device through the web app. The complaint is
  registered instantly.
- **Automatic assignment** – once a complaint arrives, the service dispatches
  the nearest available electrician or mechanic.
- **On-site repair** – the technician is contacted, checks the device and fixes
  the issue as soon as possible. Customers track progress in real time.

## Stack

- **Frontend** (`frontend/`): React with TypeScript and Vite, served by nginx.
- **Containers** are orchestrated with Docker Compose in the repository root.

## Getting started

Requirements: Docker (with the Compose plugin).

```powershell
docker compose up --build
```

Then open <http://localhost:8080>.

## Project layout

```
frontend/    React + TypeScript SPA (built into static files, served by nginx)
docker-compose.yml   Defines the running containers (frontend now, more later)
```

## Adding new containers

Additional containers (backend API, database, …) are added to the compose file
as `services.<name>` blocks once their folders exist. See the comments in
`docker-compose.yml`.
