# Frontend — Sistema de Subastas Online

UTN FRVM — Programación IV

## Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- Axios (HTTP)
- EventSource nativo (SSE)
- React Router DOM

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

El servidor de desarrollo corre en `http://localhost:5173` y se comunica con el backend en `http://localhost:8080`.

## Build

```bash
npm run build
```

## Estructura

```
src/
├── components/       # Componentes reutilizables
├── pages/            # Pantallas (a migrar desde App.tsx)
├── services/         # Axios + SSE
├── hooks/            # useAuth, useSse
├── context/          # AuthContext
├── types.ts          # Tipos TypeScript
└── App.tsx           # Punto de entrada (mock a cablear)
```
