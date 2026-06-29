import React from 'react';

export interface AvatarInfo {
  id: number;
  nombre: string;
  descripcion: string;
  Component: React.FC<{ size?: number }>;
}

// 1 — El Martillador
const ElMartillador: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      @keyframes av1gavel{0%,100%{transform:rotate(-30deg)}50%{transform:rotate(15deg)}}
      .av1g{transform-box:fill-box;transform-origin:80% 75%;animation:av1gavel 0.75s ease-in-out infinite}
    `}</style>
    <circle cx="40" cy="40" r="39" fill="#F59E0B"/>
    {/* Hat */}
    <rect x="27" y="8" width="26" height="17" rx="3" fill="#1C1917"/>
    <rect x="21" y="23" width="38" height="5" rx="2.5" fill="#1C1917"/>
    <rect x="27" y="20" width="26" height="5" fill="#D97706"/>
    {/* Face */}
    <circle cx="40" cy="48" r="20" fill="#FEF3C7"/>
    {/* Eyes */}
    <ellipse cx="32" cy="44" rx="3.5" ry="3.5" fill="#1C1917"/>
    <ellipse cx="48" cy="44" rx="3.5" ry="3.5" fill="#1C1917"/>
    <circle cx="33.5" cy="42.5" r="1.3" fill="white"/>
    <circle cx="49.5" cy="42.5" r="1.3" fill="white"/>
    {/* Moustache */}
    <path d="M29 53 Q33 50 37 53 Q40 56 43 53 Q47 50 51 53" stroke="#92400E" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* Bow tie */}
    <polygon points="36,64 40,68 44,64 40,60" fill="#DC2626"/>
    <circle cx="40" cy="64" r="1.5" fill="#1C1917"/>
    {/* Gavel arm */}
    <g className="av1g">
      <rect x="10" y="44" width="28" height="5" rx="2.5" fill="#92400E"/>
      <rect x="6" y="35" width="10" height="20" rx="3" fill="#78350F"/>
    </g>
  </svg>
);

// 2 — El Entusiasta
const ElEntusiasta: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      @keyframes av2arm{0%,100%{transform:translateY(6px)}50%{transform:translateY(-10px)}}
      @keyframes av2bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
      @keyframes av2star{0%,100%{opacity:0.2;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}
      .av2arm{transform-box:fill-box;transform-origin:center bottom;animation:av2arm 0.55s ease-in-out infinite}
      .av2body{transform-box:fill-box;transform-origin:center bottom;animation:av2bob 0.55s ease-in-out infinite}
      .av2s1{transform-box:fill-box;transform-origin:center;animation:av2star 0.55s ease-in-out infinite}
      .av2s2{transform-box:fill-box;transform-origin:center;animation:av2star 0.55s ease-in-out infinite 0.18s}
    `}</style>
    <circle cx="40" cy="40" r="39" fill="#3B82F6"/>
    {/* Stars */}
    <text className="av2s1" x="8" y="22" fontSize="13" fill="white">★</text>
    <text className="av2s2" x="60" y="18" fontSize="11" fill="white">★</text>
    {/* Body */}
    <g className="av2body">
      <circle cx="40" cy="49" r="20" fill="#DBEAFE"/>
      {/* Eyes wide open */}
      <ellipse cx="32" cy="45" rx="4" ry="4.5" fill="#1C1917"/>
      <ellipse cx="48" cy="45" rx="4" ry="4.5" fill="#1C1917"/>
      <circle cx="33.5" cy="43" r="1.5" fill="white"/>
      <circle cx="49.5" cy="43" r="1.5" fill="white"/>
      {/* Big smile open */}
      <path d="M30 55 Q40 67 50 55" stroke="#1C1917" strokeWidth="2" fill="#F87171" strokeLinecap="round"/>
    </g>
    {/* Raised arm */}
    <g className="av2arm">
      <rect x="53" y="30" width="7" height="20" rx="3.5" fill="#DBEAFE"/>
      <ellipse cx="56.5" cy="26" rx="5" ry="6" fill="#DBEAFE"/>
      <rect x="54" y="14" width="4" height="13" rx="2" fill="#DBEAFE"/>
    </g>
  </svg>
);

// 3 — El Nervioso
const ElNervioso: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      @keyframes av3sw1{0%{transform:translateY(-2px);opacity:0}30%{opacity:1}100%{transform:translateY(22px);opacity:0}}
      @keyframes av3sw2{0%{transform:translateY(-2px);opacity:0}30%{opacity:1}100%{transform:translateY(18px);opacity:0}}
      @keyframes av3shake{0%,100%{transform:translateX(-1.5px)}50%{transform:translateX(1.5px)}}
      .av3sw1{animation:av3sw1 1.1s ease-in infinite}
      .av3sw2{animation:av3sw2 1.1s ease-in infinite 0.35s}
      .av3face{transform-box:fill-box;transform-origin:center;animation:av3shake 0.18s linear infinite}
    `}</style>
    <circle cx="40" cy="40" r="39" fill="#F97316"/>
    {/* Price going up text */}
    <text x="9" y="16" fontSize="9" fill="white" fontWeight="bold" opacity="0.9">$$$↑↑</text>
    {/* Sweat drops */}
    <ellipse className="av3sw1" cx="61" cy="24" rx="3" ry="5" fill="#93C5FD"/>
    <ellipse className="av3sw2" cx="69" cy="30" rx="2.5" ry="4.5" fill="#93C5FD"/>
    {/* Face */}
    <g className="av3face">
      <circle cx="40" cy="47" r="21" fill="#FEF3C7"/>
      {/* Worried brows */}
      <path d="M27 37 Q33 33 38 37" stroke="#1C1917" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M42 37 Q47 33 53 37" stroke="#1C1917" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Eyes */}
      <ellipse cx="32" cy="43" rx="3.5" ry="3.5" fill="#1C1917"/>
      <ellipse cx="48" cy="43" rx="3.5" ry="3.5" fill="#1C1917"/>
      <circle cx="33.5" cy="41.5" r="1.2" fill="white"/>
      <circle cx="49.5" cy="41.5" r="1.2" fill="white"/>
      {/* Nervous wavy mouth */}
      <path d="M29 53 Q33 50 37 53 Q40 56 43 53 Q47 50 51 53" stroke="#1C1917" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </g>
  </svg>
);

// 4 — El Millonario
const ElMillonario: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      @keyframes av4spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes av4coin{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}
      .av4orbit{transform-box:fill-box;transform-origin:40px 40px;animation:av4spin 1.8s linear infinite}
      .av4coin2{transform-box:fill-box;transform-origin:40px 40px;animation:av4spin 1.8s linear infinite 0.6s}
      .av4coin3{transform-box:fill-box;transform-origin:40px 40px;animation:av4spin 1.8s linear infinite 1.2s}
    `}</style>
    <circle cx="40" cy="40" r="39" fill="#8B5CF6"/>
    {/* Monocle / top hat */}
    <rect x="27" y="8" width="26" height="16" rx="3" fill="#1C1917"/>
    <rect x="21" y="22" width="38" height="5" rx="2.5" fill="#1C1917"/>
    <rect x="27" y="19" width="26" height="5" fill="#7C3AED"/>
    {/* Face */}
    <circle cx="40" cy="49" r="19" fill="#EDE9FE"/>
    {/* Monocle on eye */}
    <circle cx="47" cy="44" r="6" stroke="#D97706" strokeWidth="2" fill="none"/>
    <line x1="51" y1="49" x2="54" y2="54" stroke="#D97706" strokeWidth="2"/>
    {/* Eyes */}
    <ellipse cx="32" cy="44" rx="3.5" ry="3.5" fill="#1C1917"/>
    <ellipse cx="47" cy="44" rx="3" ry="3" fill="#1C1917"/>
    <circle cx="33.5" cy="42.5" r="1.2" fill="white"/>
    {/* Smug smile */}
    <path d="M32 55 Q40 60 46 55" stroke="#1C1917" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Orbiting coins */}
    <g className="av4orbit">
      <circle cx="40" cy="9" r="5" fill="#FCD34D"/>
      <text x="37" y="13" fontSize="7" fill="#92400E" fontWeight="bold">$</text>
    </g>
    <g className="av4coin2">
      <circle cx="40" cy="9" r="4" fill="#FCD34D"/>
      <text x="38" y="12" fontSize="6" fill="#92400E" fontWeight="bold">$</text>
    </g>
    <g className="av4coin3">
      <circle cx="40" cy="9" r="3.5" fill="#FCD34D"/>
      <text x="38.5" y="12" fontSize="5" fill="#92400E" fontWeight="bold">$</text>
    </g>
  </svg>
);

// 5 — El Astuto
const ElAstuto: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      @keyframes av5eyes{0%,45%,100%{transform:translateX(0)}15%,30%{transform:translateX(-5px)}60%,80%{transform:translateX(4px)}}
      @keyframes av5hat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
      .av5eyes{transform-box:fill-box;transform-origin:center;animation:av5eyes 2.5s ease-in-out infinite}
      .av5hat{transform-box:fill-box;transform-origin:center bottom;animation:av5hat 1.5s ease-in-out infinite}
    `}</style>
    <circle cx="40" cy="40" r="39" fill="#10B981"/>
    {/* Detective hat */}
    <g className="av5hat">
      <ellipse cx="40" cy="22" rx="22" ry="5" fill="#1C1917"/>
      <rect x="25" y="8" width="30" height="16" rx="4" fill="#1C1917"/>
      <rect x="25" y="18" width="30" height="4" fill="#065F46"/>
    </g>
    {/* Face */}
    <circle cx="40" cy="49" r="20" fill="#D1FAE5"/>
    {/* Eyebrows — raised suspiciously */}
    <path d="M27 39 Q32 36 37 39" stroke="#1C1917" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M43 39 Q48 36 53 39" stroke="#1C1917" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Sliding eyes */}
    <g className="av5eyes">
      <ellipse cx="32" cy="45" rx="4" ry="4" fill="#1C1917"/>
      <ellipse cx="48" cy="45" rx="4" ry="4" fill="#1C1917"/>
      <circle cx="33" cy="43.5" r="1.3" fill="white"/>
      <circle cx="49" cy="43.5" r="1.3" fill="white"/>
    </g>
    {/* Sly smirk */}
    <path d="M33 57 Q42 62 50 55" stroke="#1C1917" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Magnifying glass */}
    <circle cx="14" cy="65" r="6" stroke="#1C1917" strokeWidth="2.5" fill="none"/>
    <line x1="18" y1="69" x2="23" y2="74" stroke="#1C1917" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// 6 — El Campeón
const ElCampeon: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      @keyframes av6trophy{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-8px) rotate(5deg)}}
      @keyframes av6glow{0%,100%{opacity:0.4}50%{opacity:1}}
      @keyframes av6star{0%,100%{transform:scale(0.7) rotate(0deg)}50%{transform:scale(1.3) rotate(20deg)}}
      .av6trophy{transform-box:fill-box;transform-origin:center bottom;animation:av6trophy 0.9s ease-in-out infinite}
      .av6star1{transform-box:fill-box;transform-origin:center;animation:av6star 0.9s ease-in-out infinite}
      .av6star2{transform-box:fill-box;transform-origin:center;animation:av6star 0.9s ease-in-out infinite 0.3s}
      .av6glow{animation:av6glow 0.9s ease-in-out infinite}
    `}</style>
    <circle cx="40" cy="40" r="39" fill="#F59E0B"/>
    {/* Sparkles */}
    <text className="av6star1" x="7" y="20" fontSize="13" fill="white">✦</text>
    <text className="av6star2" x="61" y="16" fontSize="11" fill="white">✦</text>
    {/* Trophy */}
    <g className="av6trophy">
      <rect x="35" y="6" width="10" height="3" rx="1.5" fill="#D97706"/>
      <path d="M28 9 Q28 20 40 22 Q52 20 52 9 Z" fill="#FCD34D"/>
      <rect x="37" y="22" width="6" height="7" rx="1" fill="#D97706"/>
      <rect x="32" y="29" width="16" height="3" rx="1.5" fill="#D97706"/>
      {/* Trophy handles */}
      <path d="M28 12 Q22 15 24 20 Q26 22 28 18" stroke="#D97706" strokeWidth="2" fill="none"/>
      <path d="M52 12 Q58 15 56 20 Q54 22 52 18" stroke="#D97706" strokeWidth="2" fill="none"/>
    </g>
    {/* Face below trophy */}
    <circle cx="40" cy="54" r="18" fill="#FEF3C7"/>
    {/* Proud eyes */}
    <path d="M28 50 Q32 47 36 50" stroke="#1C1917" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M44 50 Q48 47 52 50" stroke="#1C1917" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Big winner smile */}
    <path d="M29 58 Q40 68 51 58" stroke="#1C1917" strokeWidth="2.5" fill="#F87171" strokeLinecap="round"/>
  </svg>
);

// 7 — El Tacaño
const ElTacano: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      @keyframes av7hug{0%,100%{transform:scaleX(1)}50%{transform:scaleX(1.05)}}
      @keyframes av7eye{0%,100%{transform:scaleY(1)}30%,70%{transform:scaleY(0.3)}}
      @keyframes av7sweat{0%,100%{transform:translateY(0);opacity:0}40%{opacity:0.9}100%{transform:translateY(12px);opacity:0}}
      .av7bag{transform-box:fill-box;transform-origin:center;animation:av7hug 0.7s ease-in-out infinite}
      .av7leye{transform-box:fill-box;transform-origin:center;animation:av7eye 2s ease-in-out infinite}
      .av7reye{transform-box:fill-box;transform-origin:center;animation:av7eye 2s ease-in-out infinite 0.05s}
      .av7sw{animation:av7sweat 2s ease-in infinite 0.5s}
    `}</style>
    <circle cx="40" cy="40" r="39" fill="#6B7280"/>
    {/* Sweat */}
    <ellipse className="av7sw" cx="62" cy="26" rx="2.5" ry="4.5" fill="#93C5FD"/>
    {/* Arms hugging */}
    <ellipse cx="18" cy="50" rx="7" ry="13" fill="#D1D5DB" transform="rotate(20 18 50)"/>
    <ellipse cx="62" cy="50" rx="7" ry="13" fill="#D1D5DB" transform="rotate(-20 62 50)"/>
    {/* Face */}
    <circle cx="40" cy="43" r="20" fill="#E5E7EB"/>
    {/* Squinting worried eyes */}
    <g className="av7leye"><ellipse cx="32" cy="39" rx="4" ry="2.5" fill="#1C1917"/></g>
    <g className="av7reye"><ellipse cx="48" cy="39" rx="4" ry="2.5" fill="#1C1917"/></g>
    <circle cx="33" cy="38" r="1" fill="white"/>
    <circle cx="49" cy="38" r="1" fill="white"/>
    {/* Tight frown */}
    <path d="M31 51 Q40 47 49 51" stroke="#1C1917" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Money bag hugged */}
    <g className="av7bag">
      <ellipse cx="40" cy="60" rx="10" ry="10" fill="#FCD34D"/>
      <rect x="37" y="48" width="6" height="5" rx="2" fill="#FCD34D"/>
      <text x="36" y="63" fontSize="10" fill="#92400E" fontWeight="bold">$</text>
    </g>
  </svg>
);

// 8 — El Observador
const ElObservador: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      @keyframes av8scan{0%,100%{transform:translateX(-6px)}50%{transform:translateX(6px)}}
      @keyframes av8blink{0%,88%,100%{transform:scaleY(1)}93%{transform:scaleY(0.05)}}
      @keyframes av8bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
      .av8binos{transform-box:fill-box;transform-origin:center;animation:av8scan 2s ease-in-out infinite}
      .av8leye{transform-box:fill-box;transform-origin:center;animation:av8blink 3s ease-in-out infinite}
      .av8reye{transform-box:fill-box;transform-origin:center;animation:av8blink 3s ease-in-out infinite 0.1s}
      .av8body{transform-box:fill-box;transform-origin:center bottom;animation:av8bob 1.5s ease-in-out infinite}
    `}</style>
    <circle cx="40" cy="40" r="39" fill="#0891B2"/>
    {/* Body */}
    <g className="av8body">
      <circle cx="40" cy="48" r="20" fill="#CFFAFE"/>
      {/* Eyebrows raised */}
      <path d="M26 36 Q32 32 38 36" stroke="#1C1917" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M42 36 Q48 32 54 36" stroke="#1C1917" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Mouth - amazed O */}
      <ellipse cx="40" cy="57" rx="5" ry="4" fill="#1C1917"/>
    </g>
    {/* Binoculars - scanning */}
    <g className="av8binos">
      <rect x="19" y="39" width="42" height="14" rx="4" fill="#164E63"/>
      {/* Left lens */}
      <circle cx="28" cy="46" r="7" fill="#0E7490"/>
      <circle cx="28" cy="46" r="5" fill="#22D3EE"/>
      {/* Right lens */}
      <circle cx="52" cy="46" r="7" fill="#0E7490"/>
      <circle cx="52" cy="46" r="5" fill="#22D3EE"/>
      {/* Center bridge */}
      <rect x="33" y="43" width="14" height="6" rx="2" fill="#164E63"/>
      {/* Eyes visible in lenses */}
      <g className="av8leye"><ellipse cx="28" cy="46" rx="3" ry="3.5" fill="#1C1917"/><circle cx="29.2" cy="44.5" r="1" fill="white"/></g>
      <g className="av8reye"><ellipse cx="52" cy="46" rx="3" ry="3.5" fill="#1C1917"/><circle cx="53.2" cy="44.5" r="1" fill="white"/></g>
    </g>
  </svg>
);

export const AVATARES_ANIMADOS: AvatarInfo[] = [
  { id: 0, nombre: 'El Martillador', descripcion: 'El rematador de pura cepa', Component: ElMartillador },
  { id: 1, nombre: 'El Entusiasta', descripcion: '¡Siempre tiene la mano arriba!', Component: ElEntusiasta },
  { id: 2, nombre: 'El Nervioso', descripcion: 'Los precios lo hacen sudar', Component: ElNervioso },
  { id: 3, nombre: 'El Millonario', descripcion: 'Las monedas orbitan a su alrededor', Component: ElMillonario },
  { id: 4, nombre: 'El Astuto', descripcion: 'Sus ojos no se pierden nada', Component: ElAstuto },
  { id: 5, nombre: 'El Campeón', descripcion: 'Siempre levanta el trofeo', Component: ElCampeon },
  { id: 6, nombre: 'El Tacaño', descripcion: 'Abraza sus monedas con cariño', Component: ElTacano },
  { id: 7, nombre: 'El Observador', descripcion: 'Mira antes de pujar', Component: ElObservador },
];

export function getAvatarAnimado(index: number): AvatarInfo {
  const idx = ((index % AVATARES_ANIMADOS.length) + AVATARES_ANIMADOS.length) % AVATARES_ANIMADOS.length;
  return AVATARES_ANIMADOS[idx];
}
