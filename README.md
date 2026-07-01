# 🔨 QUIEN DA MA$

> Plataforma de subastas online en tiempo real — TPI Programación IV · UTN FRVM

**Integrantes:** Genaro Molina · Paulo Zito · Maxi Zampa

---

## Demo

| | URL |
|---|---|
| **Frontend** | https://quiendamas.up.railway.app/ |
| **API REST** | https://worthy-respect-production-4be9.up.railway.app/ |
| **Swagger UI** | https://worthy-respect-production-4be9.up.railway.app/swagger-ui.html |

---

## Stack tecnológico

**Backend**
- Java 17 · Spring Boot 3 · Spring Security 6 · Spring Data JPA
- PostgreSQL · Lombok · Springdoc OpenAPI (Swagger)
- Autenticación JWT (doble token: Access 15 min + Refresh 7 días en cookie HttpOnly)
- SSE (Server-Sent Events) con sistema de tickets efímeros
- Rate limiting con ventana deslizante (`ConcurrentHashMap<String, Deque<Instant>>`)
- Bloqueo pesimista (`SELECT FOR UPDATE`) para control de concurrencia en pujas

**Frontend**
- React 19 · TypeScript · Vite
- Tailwind CSS 4 · Axios · React Router DOM · lucide-react
- `EventSource` nativo para SSE

---

## Funcionalidades principales

- Registro e inicio de sesión con roles (`USER`, `SELLER`, `ADMIN`)
- Publicación de productos con imágenes
- Creación y publicación de subastas con precio base e incremento mínimo
- Pujas en tiempo real vía SSE (precios y participantes censurados durante la subasta)
- Cierre automático con scheduler cada 30 segundos (ADJUDICADA / FINALIZADA)
- **Soft-close**: pujas en el último minuto extienden el cierre 60 segundos
- Sistema de disputas con resolución por administrador
- Calificaciones entre usuarios tras adjudicación
- Notificaciones en tiempo real (ganador, vendedor, disputas)
- Panel de administración con SSE global
- Avatares animados por usuario

---

## Estructura del monorepo

```
proyecto/
├── backend/        # Spring Boot (Java 17)
│   └── src/
│       ├── main/java/com/subastas/tpi/
│       │   ├── controller/
│       │   ├── service/impl/
│       │   ├── repository/
│       │   ├── model/ · dto/ · event/ · security/ · scheduler/
│       │   └── exception/ · config/
│       └── test/java/com/subastas/tpi/impl/
└── frontend/       # React + Vite + TypeScript
    └── src/
        ├── pages/ · components/ · hooks/
        ├── services/ · context/ · utils/
        └── types.ts
```

---

## Correr localmente

### Requisitos previos
- Java 17+
- Node.js 20+
- PostgreSQL 15+

### Backend

```bash
cd backend

# Crear base de datos
psql -U postgres -c "CREATE DATABASE subastas_db;"

# Variables de entorno (o editar application.yaml)
export JWT_SECRET=claveSecretaSuperSeguraParaLaUtnFrvmProgramacionCuatro2026

./mvnw spring-boot:run
# API disponible en http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App disponible en http://localhost:5173
```

---

## Variables de entorno (producción)

```env
# Backend
DB_URL=jdbc:postgresql://<host>:<port>/<db>
DB_USERNAME=...
DB_PASSWORD=...
JWT_SECRET=...
CORS_ALLOWED_ORIGINS=https://quiendamas.up.railway.app,http://localhost:5173
SPRING_PROFILES_ACTIVE=prod

# Frontend
VITE_API_URL=https://worthy-respect-production-4be9.up.railway.app
```

---

## Seguridad — OWASP Top 10 2021

| Riesgo | Implementación |
|---|---|
| A01 Broken Access Control | `@PreAuthorize` + verificación de ownership en servicios |
| A02 Cryptographic Failures | BCrypt · JWT HMAC-SHA · Refresh Token en cookie `HttpOnly` |
| A03 Injection | Consultas JPA parametrizadas · `@Valid` en todos los `@RequestBody` |
| A04 Insecure Design | Fechas y montos determinados por el servidor |
| A05 Security Misconfiguration | CORS con origen explícito · stack traces ocultos al cliente |
| A07 Authentication Failures | Doble token · blacklist de refresh tokens · rate limiting |

---

## Pruebas

```bash
cd backend
./mvnw test
```

Clases de prueba: `CategoriaServiceImplTest` · `ProductoServiceImplTest` · `SubastaServiceImplTest`

---

## Repositorio

https://github.com/genamol/subastas-tpi
