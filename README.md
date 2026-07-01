# QUIEN DA MA$

Plataforma de subastas online en tiempo real — Trabajo Práctico Integrador de **Programación IV**, UTN FRVM 2026.

[![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/17/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Deploy](https://img.shields.io/badge/Deploy-Railway-0B0D0E?logo=railway)](https://railway.app)

---

## Demo en vivo

- **Aplicación web:** https://quiendamas.up.railway.app
- **API REST:** https://worthy-respect-production-4be9.up.railway.app
- **Documentación (Swagger):** https://worthy-respect-production-4be9.up.railway.app/swagger-ui.html

---

## Stack tecnológico

| Capa | Tecnologías |
|---|---|
| **Backend** | Java 17 · Spring Boot 3 · Spring Security 6 · Spring Data JPA · PostgreSQL |
| **Seguridad** | JWT (doble token) · BCrypt · Rate Limiting · CORS |
| **Tiempo real** | SSE (Server-Sent Events) · Spring Application Events (Observer) |
| **Frontend** | React 19 · TypeScript · Vite · Tailwind CSS 4 · Axios · React Router DOM |
| **Deploy** | Railway (backend + frontend + PostgreSQL) |

---

## Funcionalidades

- Registro e inicio de sesión con roles (`USER`, `SELLER`, `ADMIN`)
- Autenticación con doble token JWT — Access Token (15 min) + Refresh Token (7 días) en cookie `HttpOnly`
- Rate limiting con ventana deslizante sobre endpoints críticos
- Pujas en tiempo real mediante SSE con sistema de tickets efímeros
- Identidades censuradas durante subastas activas (privacidad de oferentes)
- Cierre automático programado cada 30 segundos (scheduler)
- **Soft-close:** una puja en el último minuto extiende el cierre 60 segundos
- Control de concurrencia con bloqueo pesimista (`SELECT FOR UPDATE`)
- Historial completo de cambios de estado por subasta
- Sistema de disputas con resolución por administrador
- Notificaciones push en tiempo real por usuario
- Calificaciones entre participantes tras adjudicación
- Panel de administración con vista global en tiempo real

---

## Estructura del proyecto

```
/
├── backend/
│   └── src/main/java/com/subastas/tpi/
│       ├── controller/        # Endpoints REST
│       ├── service/impl/      # Lógica de negocio
│       ├── repository/        # Acceso a datos (JPA)
│       ├── model/ · dto/      # Entidades JPA y DTOs
│       ├── event/             # Patrón Observer (ApplicationEvents)
│       ├── security/          # JWT · rate limiting · tickets SSE
│       ├── scheduler/         # Cierre automático de subastas
│       └── exception/         # Manejo global de errores
└── frontend/
    └── src/
        ├── pages/             # Vistas principales
        ├── components/        # Componentes reutilizables
        ├── hooks/             # useSse · useAuth · useSubastas
        ├── services/          # Clientes Axios y SSE
        ├── context/           # AuthContext · NotificacionesContext
        └── utils/             # Mappers · privacidad · avatares
```

---

## Correr localmente

### Requisitos previos

- Java 17+
- Node.js 20+
- PostgreSQL 15+

### 1. Base de datos

```bash
psql -U postgres -c "CREATE DATABASE subastas_db;"
```

### 2. Backend

Configurar las variables de entorno (ver sección [Variables de entorno](#variables-de-entorno)), luego:

```bash
cd backend
./mvnw spring-boot:run
```

API disponible en `http://localhost:8080`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App disponible en `http://localhost:5173`.

---

## Variables de entorno

### Backend

| Variable | Descripción |
|---|---|
| `DB_URL` | URL JDBC de la base de datos PostgreSQL |
| `DB_USERNAME` | Usuario de la base de datos |
| `DB_PASSWORD` | Contraseña de la base de datos |
| `JWT_SECRET` | Clave secreta para firma de tokens JWT (mín. 32 caracteres) |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos, separados por coma |
| `SPRING_PROFILES_ACTIVE` | Perfil activo (`prod` en producción) |

### Frontend

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API REST |

---

## Tests

```bash
cd backend
./mvnw test
```

| Clase de prueba | Módulo cubierto |
|---|---|
| `CategoriaServiceImplTest` | Servicio de categorías |
| `ProductoServiceImplTest` | Servicio de productos |
| `SubastaServiceImplTest` | Servicio de subastas |

---

## Equipo

| Integrante | Contribuciones principales |
|---|---|
| **Genaro Molina** | Setup del proyecto · entidades JPA · repositorios · enums · excepciones · `DataInitializer` · configuración de deploy |
| **Paulo Zito** | DTOs de Categoría, Producto y Subasta · servicios de Categoría · pruebas unitarias |
| **Maxi Zampa** | Seguridad y autenticación · tiempo real SSE · pujas · historial de subastas · cableado del frontend |

---

*TPI — Programación IV — UTN FRVM — 2026*
