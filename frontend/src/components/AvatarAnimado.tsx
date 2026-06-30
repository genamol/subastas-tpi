interface AvatarProps { size?: number; }

// El Martillador — golpea el martillo con entusiasmo
function A1Martillador({ size = 64 }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes a1body { 0%,100%{transform:translateY(0)} 50%{transform:translateY(2px)} }
        @keyframes a1arm  { 0%,100%{transform:rotate(-30deg)} 50%{transform:rotate(20deg)} }
        @keyframes a1eye  { 0%,90%,100%{transform:scaleY(1)} 95%{transform:scaleY(0.1)} }
        .a1body { animation: a1body 0.5s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
        .a1arm  { animation: a1arm  0.5s ease-in-out infinite; transform-box:fill-box; transform-origin:50% 100%; }
        .a1eye  { animation: a1eye  3s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
      `}</style>
      <g className="a1body">
        <ellipse cx="32" cy="44" rx="12" ry="10" fill="#f59e0b"/>
        <circle cx="32" cy="26" r="13" fill="#fcd34d"/>
        <ellipse className="a1eye" cx="27" cy="25" rx="2.5" ry="2.5" fill="#1c1917"/>
        <ellipse className="a1eye" cx="37" cy="25" rx="2.5" ry="2.5" fill="#1c1917"/>
        <path d="M27 31 Q32 35 37 31" stroke="#92400e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <g className="a1arm">
          <rect x="40" y="30" width="4" height="14" rx="2" fill="#fbbf24"/>
          <rect x="36" y="27" width="12" height="6" rx="2" fill="#78350f"/>
        </g>
        <path d="M20 24 Q32 10 44 24" fill="#b45309" stroke="#92400e" strokeWidth="1"/>
      </g>
    </svg>
  );
}

// El Entusiasta — salta y festeja
function A2Entusiasta({ size = 64 }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes a2jump { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes a2arms { 0%,100%{transform:rotate(0deg)} 40%{transform:rotate(-25deg)} }
        @keyframes a2arml { 0%,100%{transform:rotate(0deg)} 40%{transform:rotate(25deg)} }
        .a2all  { animation: a2jump 0.7s ease-in-out infinite; transform-box:fill-box; transform-origin:center bottom; }
        .a2armr { animation: a2arms 0.7s ease-in-out infinite; transform-box:fill-box; transform-origin:50% 100%; }
        .a2arml { animation: a2arml 0.7s ease-in-out infinite; transform-box:fill-box; transform-origin:50% 100%; }
      `}</style>
      <g className="a2all">
        <ellipse cx="32" cy="45" rx="11" ry="9" fill="#10b981"/>
        <circle cx="32" cy="27" r="13" fill="#6ee7b7"/>
        <path d="M26 26 Q27 24 28 26" stroke="#065f46" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M36 26 Q37 24 38 26" stroke="#065f46" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M25 30 Q32 37 39 30" stroke="#065f46" strokeWidth="2" fill="#a7f3d0" strokeLinecap="round"/>
        <circle cx="22" cy="30" r="3" fill="#34d399" opacity="0.6"/>
        <circle cx="42" cy="30" r="3" fill="#34d399" opacity="0.6"/>
        <g className="a2armr">
          <rect x="43" y="38" width="4" height="10" rx="2" fill="#6ee7b7" transform="rotate(-20 45 38)"/>
        </g>
        <g className="a2arml">
          <rect x="17" y="38" width="4" height="10" rx="2" fill="#6ee7b7" transform="rotate(20 19 38)"/>
        </g>
      </g>
    </svg>
  );
}

// El Nervioso — tiembla sin parar
function A3Nervioso({ size = 64 }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes a3shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-2px)} 75%{transform:translateX(2px)} }
        @keyframes a3sweat { 0%,100%{opacity:0;transform:translateY(0)} 50%{opacity:1;transform:translateY(4px)} }
        @keyframes a3blink { 0%,85%,100%{transform:scaleY(1)} 90%{transform:scaleY(0.1)} }
        .a3body  { animation: a3shake 0.15s linear infinite; transform-box:fill-box; transform-origin:center; }
        .a3sweat { animation: a3sweat 1.5s ease-in-out infinite; transform-box:fill-box; transform-origin:center top; }
        .a3eye   { animation: a3blink 2s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
      `}</style>
      <g className="a3body">
        <ellipse cx="32" cy="45" rx="11" ry="9" fill="#8b5cf6"/>
        <circle cx="32" cy="27" r="13" fill="#c4b5fd"/>
        <ellipse className="a3eye" cx="27" cy="26" rx="2.5" ry="3" fill="#1c1917"/>
        <ellipse className="a3eye" cx="37" cy="26" rx="2.5" ry="3" fill="#1c1917"/>
        <path d="M24 21 L29 23" stroke="#6d28d9" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M35 23 L40 21" stroke="#6d28d9" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M26 32 Q29 30 32 32 Q35 34 38 32" stroke="#5b21b6" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <ellipse className="a3sweat" cx="43" cy="20" rx="2" ry="3" fill="#93c5fd" opacity="0.8"/>
      </g>
    </svg>
  );
}

// El Millonario — cuenta sus monedas con aire de superioridad
function A4Millonario({ size = 64 }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes a4coin  { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-4px) rotate(180deg)} }
        @keyframes a4blink { 0%,80%,100%{transform:scaleY(1)} 85%{transform:scaleY(0.1)} }
        @keyframes a4hat   { 0%,100%{transform:rotate(0)} 50%{transform:rotate(3deg)} }
        .a4coin  { animation: a4coin  1.2s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
        .a4eye   { animation: a4blink 4s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
        .a4hat   { animation: a4hat   2s ease-in-out infinite; transform-box:fill-box; transform-origin:center bottom; }
      `}</style>
      <ellipse cx="32" cy="45" rx="12" ry="9" fill="#1e40af"/>
      <rect x="28" y="40" width="8" height="10" rx="1" fill="#fbbf24"/>
      <circle cx="32" cy="27" r="13" fill="#fde68a"/>
      <ellipse className="a4eye" cx="27.5" cy="26" rx="2.5" ry="2.5" fill="#1c1917"/>
      <ellipse className="a4eye" cx="36.5" cy="26" rx="2.5" ry="2.5" fill="#1c1917"/>
      <circle cx="36.5" cy="26" r="4" fill="none" stroke="#92400e" strokeWidth="1"/>
      <line x1="40" y1="28" x2="43" y2="32" stroke="#92400e" strokeWidth="1"/>
      <path d="M26 31 Q29 29 32 31 Q35 29 38 31" stroke="#92400e" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle className="a4coin" cx="44" cy="34" r="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
      <text className="a4coin" x="44" y="37" textAnchor="middle" fontSize="5" fill="#92400e" fontWeight="bold">$</text>
      <g className="a4hat">
        <rect x="22" y="11" width="20" height="13" rx="2" fill="#1e3a8a"/>
        <rect x="18" y="23" width="28" height="3" rx="1.5" fill="#1e3a8a"/>
      </g>
    </svg>
  );
}

// El Astuto — guiña el ojo y sonríe con malicia
function A5Astuto({ size = 64 }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes a5wink { 0%,70%,100%{transform:scaleY(1)} 75%,85%{transform:scaleY(0.1)} 80%{transform:scaleY(0.05)} }
        @keyframes a5lean { 0%,100%{transform:rotate(0)} 50%{transform:rotate(-4deg)} }
        @keyframes a5brow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-1px)} }
        .a5body { animation: a5lean 2s ease-in-out infinite; transform-box:fill-box; transform-origin:center bottom; }
        .a5wink { animation: a5wink 3s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
        .a5brow { animation: a5brow 2s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
      `}</style>
      <g className="a5body">
        <ellipse cx="32" cy="45" rx="11" ry="9" fill="#dc2626"/>
        <circle cx="32" cy="27" r="13" fill="#fca5a5"/>
        <ellipse cx="27" cy="26" rx="2.5" ry="2.5" fill="#1c1917"/>
        <ellipse className="a5wink" cx="37" cy="26" rx="2.5" ry="2.5" fill="#1c1917"/>
        <g className="a5brow">
          <path d="M34 21 Q37 19 40 21" stroke="#991b1b" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </g>
        <path d="M24 21 Q27 20 30 21" stroke="#991b1b" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M26 31 Q32 36 39 30" stroke="#991b1b" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M20 22 Q32 11 44 22" fill="#b91c1c" stroke="#991b1b" strokeWidth="1"/>
        <rect x="37" y="12" width="8" height="3" rx="1.5" fill="#b91c1c"/>
      </g>
    </svg>
  );
}

// El Campeón — celebra con los brazos en alto
function A6Campeon({ size = 64 }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes a6pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        @keyframes a6star  { 0%,100%{transform:rotate(0) scale(1)} 50%{transform:rotate(20deg) scale(1.2)} }
        @keyframes a6blink { 0%,88%,100%{transform:scaleY(1)} 92%{transform:scaleY(0.1)} }
        .a6body  { animation: a6pulse 0.8s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
        .a6star  { animation: a6star  1.6s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
        .a6eye   { animation: a6blink 2.5s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
      `}</style>
      <g className="a6body">
        <ellipse cx="32" cy="46" rx="13" ry="9" fill="#f97316"/>
        <rect x="12" y="32" width="5" height="12" rx="2.5" fill="#fdba74" transform="rotate(-30 14 32)"/>
        <rect x="47" y="32" width="5" height="12" rx="2.5" fill="#fdba74" transform="rotate(30 50 32)"/>
        <circle cx="32" cy="27" r="13" fill="#fed7aa"/>
        <ellipse className="a6eye" cx="27" cy="26" rx="2.5" ry="2.5" fill="#1c1917"/>
        <ellipse className="a6eye" cx="37" cy="26" rx="2.5" ry="2.5" fill="#1c1917"/>
        <path d="M24 30 Q32 38 40 30" stroke="#c2410c" strokeWidth="2" fill="#fff7ed" strokeLinecap="round"/>
        <path d="M19 22 L22 14 L27 20 L32 12 L37 20 L42 14 L45 22 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
        <text className="a6star" x="50" y="18" fontSize="10" textAnchor="middle">⭐</text>
      </g>
    </svg>
  );
}

// El Tacaño — abraza sus monedas celosamente
function A7Tacano({ size = 64 }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes a7hug  { 0%,100%{transform:rotate(0)} 50%{transform:rotate(-5deg)} }
        @keyframes a7eye  { 0%,100%{transform:scaleY(1) scaleX(1)} 50%{transform:scaleY(0.7) scaleX(1.1)} }
        @keyframes a7coin { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        .a7body { animation: a7hug  1.5s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
        .a7eye  { animation: a7eye  1.5s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
        .a7coin { animation: a7coin 1.5s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
      `}</style>
      <g className="a7body">
        <ellipse cx="32" cy="46" rx="10" ry="8" fill="#6b7280"/>
        <path d="M21 40 Q18 50 25 52" stroke="#9ca3af" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M43 40 Q46 50 39 52" stroke="#9ca3af" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <g className="a7coin">
          <ellipse cx="32" cy="52" rx="7" ry="3" fill="#fbbf24"/>
          <ellipse cx="32" cy="49" rx="7" ry="3" fill="#fcd34d"/>
          <ellipse cx="32" cy="46" rx="7" ry="3" fill="#fbbf24"/>
        </g>
        <circle cx="32" cy="26" r="13" fill="#d1d5db"/>
        <ellipse className="a7eye" cx="27" cy="25" rx="3" ry="2.5" fill="#1c1917"/>
        <ellipse className="a7eye" cx="37" cy="25" rx="3" ry="2.5" fill="#1c1917"/>
        <text x="27" y="27" textAnchor="middle" fontSize="4" fill="#fbbf24">$</text>
        <text x="37" y="27" textAnchor="middle" fontSize="4" fill="#fbbf24">$</text>
        <path d="M27 32 L37 32" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

// El Observador — mira de un lado a otro atentamente
function A8Observador({ size = 64 }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes a8look  { 0%,40%{transform:translateX(-2px)} 60%,100%{transform:translateX(2px)} }
        @keyframes a8glass { 0%,40%{transform:translateX(-1px)} 60%,100%{transform:translateX(1px)} }
        @keyframes a8head  { 0%,40%{transform:rotate(-4deg)} 60%,100%{transform:rotate(4deg)} }
        .a8head  { animation: a8head  2.4s ease-in-out infinite; transform-box:fill-box; transform-origin:center bottom; }
        .a8eyes  { animation: a8look  2.4s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
        .a8glass { animation: a8glass 2.4s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
      `}</style>
      <ellipse cx="32" cy="46" rx="11" ry="8" fill="#0891b2"/>
      <rect x="29" y="37" width="6" height="5" rx="1" fill="#cffafe"/>
      <g className="a8head">
        <circle cx="32" cy="26" r="13" fill="#cffafe"/>
        <g className="a8glass">
          <circle cx="27" cy="26" r="5" fill="none" stroke="#0e7490" strokeWidth="1.5"/>
          <circle cx="37" cy="26" r="5" fill="none" stroke="#0e7490" strokeWidth="1.5"/>
          <line x1="32" y1="26" x2="32" y2="26" stroke="#0e7490" strokeWidth="1.5"/>
          <line x1="22" y1="25" x2="20" y2="24" stroke="#0e7490" strokeWidth="1.5"/>
          <line x1="42" y1="25" x2="44" y2="24" stroke="#0e7490" strokeWidth="1.5"/>
        </g>
        <g className="a8eyes">
          <ellipse cx="27" cy="26" rx="2" ry="2" fill="#164e63"/>
          <ellipse cx="37" cy="26" rx="2" ry="2" fill="#164e63"/>
        </g>
        <path d="M27 33 Q32 31 37 33" stroke="#0e7490" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M23 20 Q27 18 30 20" stroke="#0e7490" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M34 20 Q37 18 41 20" stroke="#0e7490" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

export interface AvatarInfo {
  id: number;
  nombre: string;
  descripcion: string;
  Component: React.ComponentType<AvatarProps>;
}

export const AVATARES_ANIMADOS: AvatarInfo[] = [
  { id: 0, nombre: 'El Martillador', descripcion: 'Golpea con fuerza. Siempre cierra el trato.', Component: A1Martillador },
  { id: 1, nombre: 'El Entusiasta',  descripcion: '¡Cada subasta es la mejor de su vida!',     Component: A2Entusiasta },
  { id: 2, nombre: 'El Nervioso',    descripcion: 'Sudando frío pero pujando igual.',           Component: A3Nervioso },
  { id: 3, nombre: 'El Millonario',  descripcion: 'El precio nunca es un problema.',            Component: A4Millonario },
  { id: 4, nombre: 'El Astuto',      descripcion: 'Espera el último segundo para pujar.',       Component: A5Astuto },
  { id: 5, nombre: 'El Campeón',     descripcion: 'Ganar es su estado natural.',                Component: A6Campeon },
  { id: 6, nombre: 'El Tacaño',      descripcion: 'Puja lo mínimo. Siempre lo mínimo.',        Component: A7Tacano },
  { id: 7, nombre: 'El Observador',  descripcion: 'Lo analiza todo antes de moverse.',          Component: A8Observador },
];

export function getAvatarAnimado(idx: number): AvatarInfo {
  const i = ((idx % AVATARES_ANIMADOS.length) + AVATARES_ANIMADOS.length) % AVATARES_ANIMADOS.length;
  return AVATARES_ANIMADOS[i];
}
