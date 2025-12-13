# JWT AuthApp - Cloud and DevOps basics demo app

Ez a projekt egy egyszerű JWT-alapú autentikációs rendszer, amely
.NET API-ból és Angular frontendből áll, Docker konténerekben fut,
CI/CD pipeline-nal és alap monitoring megoldással kiegészítve.

A projekt oktatási / beadandó célra készült.

# Technológiai stack

### Backend
- ASP.NET Core (.NET 9)
- Entity Framework Core (SQLite)
- JWT alapú autentikáció
- Swagger (OpenAPI)
- Health Checks
- Prometheus metrikák (`/metrics`)

### Frontend
- Angular (v19)
- Angular Material
- JWT token kezelés
- Nginx statikus kiszolgálás

### DevOps / Infrastructure
- Docker & Docker Compose
- GitHub Actions CI/CD
- GitHub Container Registry (GHCR)
- Prometheus
- Grafana


# Projekt felépítése

├── API/                    # ASP.NET Core Web API
├── client/                 # Angular frontend
├── Dockerfile              # API Docker image
├── Dockerfile.frontend     # Frontend (Nginx) Docker image
├── docker-compose.yml      # Lokális futtatás + monitoring
├── prometheus.yml          # Prometheus konfiguráció
├── default.conf            # Nginx SPA konfiguráció
└── .github/workflows/      # CI/CD pipeline


# Futattás lokálisan (Docker Compose)

### Előfeltételek
- Docker Desktop
- Docker Compose


# Elérhető szolgáltatások

App: http://localhost:4200

Prometheus: http://localhost:9090

Grafana: http://localhost:3000
    felhasználónév: admin
    jelszó: adminpass


# Autentikáció
Az API JWT-alapú autentikációt használ.
A védett endpointok csak érvényes Bearer tokennel érhetők el.

A token a frontend login folyamata során kerül kiadásra,
és HTTP Authorization headerben kerül továbbításra.

# Monitoring

Az ASP.NET API Prometheus-kompatibilis metrikákat publikál a `/metrics` endpointon.

A Prometheus ezeket a metrikákat gyűjti,
a Grafana pedig dashboardokon jeleníti meg az adatokat.

Példák:
- HTTP kérések száma
- Request/sec
- Válaszidők
- Process CPU és memória használat

# CI/CD Pipeline

A projekt GitHub Actions alapú CI/CD pipeline-t használ.

A pipeline:
1. .NET API buildelése és unit tesztelése
2. Angular frontend build
3. Docker image-ek készítése
4. Image-ek publikálása GitHub Container Registry-be
5. E2E tesztelés Docker Compose segítségével