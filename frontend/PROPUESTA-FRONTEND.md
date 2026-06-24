# Propuesta de Frontend — Sistema de Subastas Online

> Trabajo universitario — Programación IV UTN FRVM
> Stack: React + Vite + Axios + Tailwind CSS
> Fecha: 22 de junio de 2026

---

## 1. Objetivo del frontend

Crear una interfaz web funcional, simple y bien estructurada que consuma el backend Spring Boot. El frontend debe:

- Separar responsabilidades: **HTTP normal vía Axios** para datos estáticos y **SSE vía EventSource** para tiempo real.
- Tener un **módulo de administración** donde se vean todas las subastas, con actualización en vivo de las activas y avisos de finalización/adjudicación.
- Ser defensible en la entrega: pocas dependencias, patrones claros, código legible.

---

## 2. Stack y dependencias

| Tecnología | Uso |
|---|---|
| React 18+ | UI por componentes |
| Vite | Build tool y dev server |
| Axios | Llamadas HTTP normales |
| Tailwind CSS | Estilos con utility classes |
| React Router DOM | Navegación entre páginas |
| lucide-react | Iconos livianos (opcional) |

### Dependencias a instalar

```bash
npm install axios react-router-dom lucide-react
npm install -D tailwindcss @tailwindcss/vite
```

---

## 3. Separación de responsabilidades: HTTP vs SSE

Regla de oro del frontend:

> **Todo lo que no sea tiempo real se pide por Axios. Solo las actualizaciones en vivo usan EventSource.**

| Tipo de dato | Tecnología | Ejemplo |
|---|---|---|
| Listado inicial de subastas | Axios `GET /api/subastas` | Catálogo al cargar |
| Detalle de una subasta | Axios `GET /api/subastas/{id}` | Página de detalle |
| Registrar puja | Axios `POST /api/pujas` | Botón "Pujar" |
| Nueva puja en tiempo real | SSE `nueva-puja` | Actualizar montoActual |
| Cambio de estado | SSE `cambio-estado` | Subasta pasa a ACTIVA/FINALIZADA |
| Notificación push | SSE `notificacion-nueva` | Campanita del usuario |

Esto evita polling, reduce carga en el servidor y respeta la arquitectura del backend.

---

## 4. Estructura de carpetas propuesta

```text
frontend/
├── public/
├── src/
│   ├── assets/                 # Imágenes estáticas
│   ├── components/
│   │   ├── common/             # Botones, inputs, badges reutilizables
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── Card.jsx
│   │   ├── layout/             # Navbar, sidebar, footer
│   │   │   ├── Navbar.jsx
│   │   │   └── AdminLayout.jsx
│   │   └── subastas/           # Componentes específicos de subastas
│   │       ├── SubastaCard.jsx
│   │       ├── SubastaList.jsx
│   │       ├── SubastaTimer.jsx
│   │       ├── SubastaEstadoBadge.jsx
│   │       └── PujaForm.jsx
│   ├── hooks/                  # Lógica reutilizable
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useSse.js
│   │   └── useSubastas.js
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── CatalogoPage.jsx
│   │   ├── SubastaDetailPage.jsx
│   │   ├── MisSubastasPage.jsx
│   │   ├── AdminDashboardPage.jsx
│   │   └── AdminSubastasPage.jsx
│   ├── services/
│   │   ├── api.js              # Axios configurado
│   │   ├── authService.js
│   │   ├── subastaService.js
│   │   ├── pujaService.js
│   │   ├── productoService.js
│   │   └── sseService.js       # Helper para abrir SSE con ticket
│   ├── context/
│   │   └── AuthContext.jsx     # Estado global de sesión
│   ├── router/
│   │   └── AppRouter.jsx       # Rutas públicas y protegidas
│   ├── utils/
│   │   └── formatters.js       # Formato de precios, fechas, tiempos
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── index.html
```

---

## 5. Servicios: HTTP con Axios

### `services/api.js`

Configuración base de Axios con `withCredentials: true` para que el navegador envíe automáticamente la cookie HttpOnly del refresh token.

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para adjuntar access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para refrescar token automáticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          'http://localhost:8080/api/auth/refresh',
          {},
          { withCredentials: true }
        );
        localStorage.setItem('access_token', response.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### `services/subastaService.js`

```javascript
import api from './api';

export const listarSubastas = (page = 0, size = 10) =>
  api.get(`/api/subastas?page=${page}&size=${size}`);

export const obtenerSubasta = (id) =>
  api.get(`/api/subastas/${id}`);

export const crearSubasta = (data) =>
  api.post('/api/subastas', data);

export const publicarSubasta = (id) =>
  api.put(`/api/subastas/${id}/publicar`);

export const cancelarSubasta = (id, motivo) =>
  api.put(`/api/subastas/${id}/cancelar`, { motivo });
```

### `services/pujaService.js`

```javascript
import api from './api';

export const registrarPuja = (subastaId, monto) =>
  api.post('/api/pujas', { subastaId, monto });
```

---

## 6. Servicio SSE con tickets efímeros

### `services/sseService.js`

Helper que:
1. Pide un ticket al backend.
2. Abre `EventSource` con el ticket en la URL.
3. Permite registrar handlers por nombre de evento.
4. Retorna función de cleanup.

```javascript
import api from './api';

export async function abrirCanalSse(rutaTicket, rutaStream, handlers) {
  const ticketResponse = await api.post(rutaTicket);
  const ticket = ticketResponse.data.ticket;

  const eventSource = new EventSource(
    `http://localhost:8080${rutaStream}?ticket=${ticket}`
  );

  Object.entries(handlers).forEach(([evento, callback]) => {
    eventSource.addEventListener(evento, (e) => {
      const data = JSON.parse(e.data);
      callback(data);
    });
  });

  eventSource.onerror = (error) => {
    console.error('SSE error:', error);
  };

  return () => {
    eventSource.close();
  };
}
```

### `hooks/useSse.js`

Hook reutilizable para cualquier canal SSE.

```javascript
import { useEffect, useRef } from 'react';
import { abrirCanalSse } from '../services/sseService';

export function useSse(rutaTicket, rutaStream, handlers, deps = []) {
  const cleanupRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    abrirCanalSse(rutaTicket, rutaStream, handlers).then((cleanup) => {
      if (isMounted) {
        cleanupRef.current = cleanup;
      } else {
        cleanup();
      }
    });

    return () => {
      isMounted = false;
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, deps);
}
```

---

## 7. Módulo de administración

### Páginas propuestas

| Ruta | Página | Descripción |
|---|---|---|
| `/admin` | `AdminDashboardPage` | Resumen: cantidad de subastas, usuarios, disputas |
| `/admin/subastas` | `AdminSubastasPage` | Listado de todas las subastas + SSE en vivo |

### `pages/AdminSubastasPage.jsx`

Comportamiento:
1. Al cargar: `GET /api/admin/subastas` (o `GET /api/subastas` si aún no existe el admin) para listar todas las subastas.
2. Abre SSE global admin: `GET /api/admin/subastas/stream`.
3. Escucha eventos:
   - `nueva-puja-admin`: actualiza `montoActual` de la subasta correspondiente y muestra quién pujó.
   - `cambio-estado-admin`: actualiza el estado de la subasta.
   - `subasta-adjudicada` (futuro): muestra alerta de ganador.

```jsx
import { useEffect, useState } from 'react';
import { useSse } from '../hooks/useSse';
import { listarSubastasAdmin } from '../services/adminService';
import { SubastaList } from '../components/subastas/SubastaList';

export function AdminSubastasPage() {
  const [subastas, setSubastas] = useState([]);

  useEffect(() => {
    listarSubastasAdmin().then((res) => setSubastas(res.data.content));
  }, []);

  useSse(
    '/api/tickets/notificaciones',
    '/api/admin/subastas/stream',
    {
      'nueva-puja-admin': (puja) => {
        setSubastas((prev) =>
          prev.map((s) =>
            s.id === puja.subastaId
              ? { ...s, montoActual: puja.montoActual }
              : s
          )
        );
      },
      'cambio-estado-admin': ({ subastaId, estado }) => {
        setSubastas((prev) =>
          prev.map((s) => (s.id === subastaId ? { ...s, estado } : s))
        );
      },
    },
    []
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel de Subastas</h1>
      <SubastaList subastas={subastas} vista="admin" />
    </div>
  );
}
```

### Componentes para admin

- `SubastaList`: muestra cards o tabla.
- `SubastaEstadoBadge`: colores según estado:
  - `BORRADOR` → gris
  - `PUBLICADA` → azul
  - `ACTIVA` → verde
  - `FINALIZADA` → negro
  - `ADJUDICADA` → violeta
  - `EN_DISPUTA` → rojo
  - `CANCELADA` → rojo suave
- `SubastaTimer`: cuenta regresiva para subastas ACTIVAS.

---

## 8. Qué agregar a una subasta en el frontend

Además de los campos que ya tiene (`precioBase`, `montoActual`, `incrementoMinimo`, `fechaInicio`, `fechaCierre`, `estado`), en la UI se deberían mostrar/visualizar:

### Campos visuales recomendados

| Campo UI | Descripción | Origen |
|---|---|---|
| Imagen del producto | Foto principal del producto | `Producto.imagenes[0]` |
| Nombre del producto | Título visible | `Producto.nombre` |
| Categoría | Badge con nombre | `Producto.categoria.nombre` |
| Vendedor | Nombre del vendedor | `Subasta.vendedorNombre` |
| Tiempo restante | Contador regresivo | Calculado en frontend con `fechaCierre` |
| Estado badge | Color según estado | `Subasta.estado` |
| Precio actual destacado | Número grande | `Subasta.montoActual` |
| Precio base | Texto secundario | `Subasta.precioBase` |
| Incremento mínimo | Info para pujar | `Subasta.incrementoMinimo` |
| Últimas pujas | Lista pequeña | SSE `nueva-puja` |
| Botón de puja rápida | `montoActual + incrementoMinimo` | Cálculo local |

### Estados de subasta con colores

```javascript
const estadoColores = {
  BORRADOR: 'bg-gray-200 text-gray-800',
  PUBLICADA: 'bg-blue-100 text-blue-800',
  ACTIVA: 'bg-green-100 text-green-800',
  FINALIZADA: 'bg-black text-white',
  ADJUDICADA: 'bg-purple-100 text-purple-800',
  EN_DISPUTA: 'bg-red-100 text-red-800',
  CANCELADA: 'bg-red-50 text-red-600',
};
```

### Funcionalidades extra que suman en la defensa

1. **Contador regresivo en vivo**: cuando llega a cero, se puede pedir el estado actualizado por HTTP.
2. **Puja rápida**: botón "Pujar $X" donde X ya incluye el incremento mínimo.
3. **Toast de notificación**: cuando llega una `notificacion-nueva` por SSE, mostrar un toast.
4. **Indicador "vas ganando"**: si el usuario autenticado es el último oferente.
5. **Filtros en catálogo**: por categoría, estado, precio.

---

## 9. Flujo de autenticación en el frontend

1. Usuario hace login.
2. Backend responde con `AuthResponse` (access token en body) y cookie HttpOnly (refresh token).
3. Frontend guarda `access_token` en `localStorage`.
4. Axios lo adjunta en cada request.
5. Si el access token expira (401), Axios hace `POST /api/auth/refresh` automáticamente usando la cookie.
6. Si el refresh falla, redirige a `/login`.

### `context/AuthContext.jsx`

Mantiene:
- `usuario` actual.
- `login(credentials)`.
- `logout()`.
- helpers: `isAdmin()`, `isSeller()`.

---

## 10. Rutas protegidas

```text
/              → Catálogo (público)
/login         → Login
/register      → Registro
/subastas/:id  → Detalle de subasta (público)
/mis-subastas  → Solo USER/SELLER
/mis-pujas     → Solo USER/SELLER
/admin         → Solo ADMIN
/admin/subastas→ Solo ADMIN
```

`AppRouter.jsx` usa `Navigate` y verifica roles desde el contexto de auth.

---

## 11. Plan de implementación paso a paso

### Fase 1 — Setup (1 día)
1. Crear proyecto Vite + React.
2. Instalar dependencias (axios, react-router-dom, tailwindcss, lucide-react).
3. Configurar Tailwind con Vite.
4. Crear `services/api.js` con interceptores.
5. Crear `AuthContext` básico.

### Fase 2 — Auth (1 día)
6. Página `LoginPage`.
7. Página `RegisterPage`.
8. Guardar access token.
9. Logout.

### Fase 3 — Catálogo público (1-2 días)
10. Página `CatalogoPage`.
11. Componente `SubastaCard`.
12. Componente `SubastaEstadoBadge`.
13. Componente `SubastaTimer`.
14. Paginación.

### Fase 4 — Detalle de subasta con SSE (2 días)
15. Página `SubastaDetailPage`.
16. Hook `useSse`.
17. Conectar a `GET /api/subastas/{id}/stream`.
18. Mostrar pujas en tiempo real.
19. Formulario de puja.

### Fase 5 — Módulo Admin (2 días)
20. `AdminLayout` con sidebar.
21. `AdminDashboardPage`.
22. `AdminSubastasPage` con listado HTTP.
23. Conectar SSE global admin (`/api/admin/subastas/stream`).
24. Actualizar listado en vivo con pujas y cambios de estado.
25. Alertas visuales de finalización/adjudicación.

### Fase 6 — Notificaciones push (1 día)
26. Hook `useNotificacionesSse`.
27. Campanita/badge de notificaciones en `Navbar`.
28. Toast al recibir `notificacion-nueva`.

### Fase 7 — Pulido (1 día)
29. Manejo de errores y estados de carga.
30. Responsive básico.
31. README con instrucciones de ejecución.

**Tiempo estimado total:** 9-11 días hábiles con 1-2 personas.

---

## 12. Consideraciones para la defensa

- Explicar por qué se usó **SSE y no WebSockets**: unidireccional, más simple, suficiente para el caso de uso.
- Mostrar el **flujo ticket → EventSource** como solución a la limitación de headers custom en `EventSource`.
- Destacar la **separación HTTP/SSE** como buena práctica de arquitectura frontend.
- Mostrar el **cleanup del `useEffect`** para evitar fugas de memoria y conexiones huérfanas.
- Explicar el **refresh automático de token** con cookie HttpOnly.

### Seguridad (OWASP) — Puntos para la defensa

| Aspecto | Implementación |
|---|---|
| **Login sin indicios** | El backend responde siempre `"Email o contraseña incorrectos"` sin distinguir si falló el email o la password. No revela existencia de cuentas (OWASP A07). |
| **Registro sin verificación** | El registro es inmediato. No hay confirmación por mail. Los roles USER+SELLER se asignan automáticamente. Nivel universitario simple. |
| **Sin recuperación de contraseña** | No existe endpoint de recuperación. Por seguridad, evita vectores de ataque por mail (phishing, enumeración). |
| **Sin campo teléfono** | La entidad `Usuario` no tiene campo `teléfono`. No hay verificación por SMS. |
| **Rate limiting** | El backend limita login (10/min por IP) y register (5/min por IP) para prevenir fuerza bruta. |
| **Doble token** | Access token 15 min en memoria, refresh token 7 días en cookie HttpOnly. Refresh con rotación y blacklist. |
| **CORS explícito** | Solo `localhost:5173`, nunca `*` con credenciales. |

---

## 13. Próximos pasos

1. ~~Aprobar esta propuesta.~~ ✅
2. ~~Pasar un mock de la UI~~ ✅ — mock de AI Studio limpiado y copiado a `src/`
3. Comenzar implementación por fases.

---

## 14. Estado de implementación

> Actualizado: 23 de junio de 2026

### Stack real

| Tecnología | Propuesto | Actual |
|---|---|---|
| Lenguaje | JavaScript | **TypeScript** |
| Framework | React + Vite | React 19 + Vite 6 |
| Estilos | Tailwind CSS | Tailwind CSS 4 |
| HTTP | Axios | Axios 1.18 |
| Router | React Router DOM | React Router DOM 7 |
| Iconos | lucide-react | lucide-react 0.546 |

### Fase 1 — Auth ✅ Completado

| Archivo | Estado |
|---|---|
| `services/api.ts` | ✅ Axios con interceptores JWT, refresh automático, `withCredentials: true` |
| `services/authService.ts` | ✅ Tipos `LoginRequest`, `RegisterRequest`, `AuthResponse` + funciones |
| `context/AuthContext.tsx` | ✅ Login/register/logout, parseo de roles desde JWT, `isAdmin()`, `isSeller()` |
| `pages/LoginPage.tsx` | ✅ Formulario login con Link a register |
| `pages/RegisterPage.tsx` | ✅ Registro con confirmación de roles USER+SELLER |
| `router/AppRouter.tsx` | ✅ `ProtectedRoute`, `AdminRoute`, rutas públicas |

### Por hacer

| Fase | Tareas | Estado |
|---|---|---|
| Fase 2 — Partir App.tsx | `CatalogoPage`, `SubastaDetailPage`, `MisPujasPage`, `CrearSubastaPage` | ❌ |
| Fase 3 — Conectar HTTP | Reemplazar `initialData.ts` por endpoints reales | ❌ |
| Fase 4 — SSE real | `sseService.ts`, `useSse.ts`, reemplazar simulación | ❌ |
| Fase 5 — Adaptar AdminPanel | Conectar disputas, usuarios, SSE admin | ❌ |
| Fase 6 — Pulido | Tipos `number`, borrar `balance`, errores, loaders | ❌ |

### Autenticación implementada

- **Login**: `POST /api/auth/login` → access token en `localStorage`, refresh token en cookie `HttpOnly`.
- **Registro**: `POST /api/auth/register` → backend asigna `USER` + `SELLER` automáticamente.
- **Admin**: el JWT contiene `roles: ["ADMIN"]`. El contexto lo detecta con `isAdmin()`.
- **Refresh**: Axios intercepta 401 y hace `POST /api/auth/refresh` usando la cookie automáticamente.

> Nota: esta propuesta es un esqueleto intencionalmente simple y académico. No incluye Redux, Zustand, React Query ni otras librerías avanzadas para mantener el proyecto dentro del nivel de Programación IV.
