# QUIEN DA MA$

Plataforma de subastas online en tiempo real desarrollada como Trabajo Práctico Integrador para la materia **Programación IV** — UTN FRVM.

[![Backend](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Frontend](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Deploy](https://img.shields.io/badge/Deploy-Railway-0B0D0E?logo=railway)](https://railway.app)

---

## Acceso

| | |
|---|---|
| **Aplicación web** | https://quiendamas.up.railway.app |
| **API REST** | https://worthy-respect-production-4be9.up.railway.app |
| **Documentación API** | https://worthy-respect-production-4be9.up.railway.app/swagger-ui.html |

---

## Stack

**Backend** — Java 17 · Spring Boot 3 · Spring Security 6 · Spring Data JPA · PostgreSQL · Lombok · Springdoc OpenAPI

**Frontend** — React 19 · TypeScript · Vite · Tailwind CSS 4 · Axios · React Router DOM

---

## Funcionalidades

- Autenticación con doble token JWT (Access Token 15 min + Refresh Token 7 días en cookie `HttpOnly`)
- Rate limiting por ventana deslizante sobre endpoints críticos
- Pujas en tiempo real mediante SSE con sistema de tickets efímeros
- Identidades censuradas durante subastas activas (privacidad de oferentes)
- Cierre automático programado (scheduler cada 30 segundos)
- Soft-close: pujas en el último minuto extienden el cierre 60 segundos
- Control de concurrencia con bloqueo pesimista (`SELECT FOR UPDATE`)
- Historial completo de cambios de estado por subasta
- Sistema de disputas con resolución por administrador
- Notificaciones en tiempo real por usuario
- Calificaciones entre participantes tras adjudicación
- Panel de administración con vista global en tiempo real

---

## Estructura del proyecto

```
/
├── backend/                        # API Spring Boot
│   └── src/main/java/.../
│       ├── controller/             # Endpoints REST
│       ├── service/impl/           # Lógica de negocio
│       ├── repository/             # Acceso a datos (JPA)
│       ├── model/ · dto/           # Entidades y DTOs
│       ├── event/                  # Patrón Observer (ApplicationEvents)
│       ├── security/               # JWT, rate limiting, tickets SSE
│       ├── scheduler/              # Cierre automático de subastas
│       └── exception/              # Manejo global de errores
└── frontend/                       # SPA React + TypeScript
    └── src/
        ├── pages/                  # Vistas principales
        ├── components/             # Componentes reutilizables
        ├── hooks/                  # useSse, useAuth, useSubastas
        ├── services/               # Clientes HTTP (Axios) y SSE
        ├── context/                # AuthContext, NotificacionesContext
        └── utils/                  # Mappers, privacidad, avatares
```

---

## Correr localmente

### Requisitos

- Java 17+
- Node.js 20+
- PostgreSQL 15+

### Backend

```bash
cd backend
```

Crear un archivo `.env` o configurar las variables de entorno (ver sección siguiente), luego:

```bash
./mvnw spring-boot:run
```

La API queda disponible en `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

---

## Variables de entorno

### Backend

| Variable | Descripción |
|---|---|
| `DB_URL` | URL JDBC de PostgreSQL |
| `DB_USERNAME` | Usuario de la base de datos |
| `DB_PASSWORD` | Contraseña de la base de datos |
| `JWT_SECRET` | Clave secreta para firma de tokens (mín. 32 caracteres) |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos separados por coma |
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

| Clase | Módulo |
|---|---|
| `CategoriaServiceImplTest` | Servicio de categorías |
| `ProductoServiceImplTest` | Servicio de productos |
| `SubastaServiceImplTest` | Servicio de subastas |

---

## Equipo

| Integrante | Contribuciones principales |
|---|---|
| **Genaro Molina** | Setup del proyecto, entidades JPA, repositorios, enums, seguridad, SSE, pujas, frontend |
| **Paulo Zito** | DTOs de Categoria, Producto y Subasta; servicios de Categoria; pruebas unitarias |
| **Maxi Zampa** | Historial de subastas, disputas, calificaciones, scheduler, revisión general |

---

*TPI — Programación IV — UTN FRVM — 2026*
