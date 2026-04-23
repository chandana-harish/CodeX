# Multiple Training Management System

Production-ready full stack Learning & Development platform built with a microservices architecture.

## Services

- `auth-service`: registration, login, JWT verification, role-based auth
- `user-service`: employee profile management
- `training-service`: training program creation and employee assignment
- `attendance-service`: attendance marking and reporting
- `frontend`: React + Tailwind dashboard

## Folder Structure

```text
.
|-- auth-service
|   |-- src
|   |   |-- config
|   |   |-- controllers
|   |   |-- middleware
|   |   |-- models
|   |   |-- routes
|   |   `-- utils
|   |-- .env
|   |-- .env.example
|   |-- Dockerfile
|   `-- package.json
|-- user-service
|   |-- src
|   |   |-- config
|   |   |-- controllers
|   |   |-- middleware
|   |   |-- models
|   |   |-- routes
|   |   `-- services
|   |-- .env
|   |-- .env.example
|   |-- Dockerfile
|   `-- package.json
|-- training-service
|   |-- src
|   |   |-- config
|   |   |-- controllers
|   |   |-- middleware
|   |   |-- models
|   |   |-- routes
|   |   `-- services
|   |-- .env
|   |-- .env.example
|   |-- Dockerfile
|   `-- package.json
|-- attendance-service
|   |-- src
|   |   |-- config
|   |   |-- controllers
|   |   |-- middleware
|   |   |-- models
|   |   |-- routes
|   |   `-- services
|   |-- .env
|   |-- .env.example
|   |-- Dockerfile
|   `-- package.json
|-- frontend
|   |-- src
|   |   |-- api
|   |   |-- components
|   |   |-- context
|   |   |-- pages
|   |   `-- utils
|   |-- .env
|   |-- .env.example
|   |-- Dockerfile
|   |-- nginx.conf
|   `-- package.json
`-- docker-compose.yml
```

## Run With Docker

```bash
docker compose up --build
```

Frontend:

- `http://localhost:3000`

Backend APIs:

- Auth: `http://localhost:4001`
- Users: `http://localhost:4002`
- Training: `http://localhost:4003`
- Attendance: `http://localhost:4004`

## Notes

- Each service uses its own MongoDB database.
- There is no API gateway.
- Services communicate through REST using Docker service DNS.
- Frontend calls each microservice directly through its exposed host port.
