export function censorName(name: string): string {
  if (!name) return 'Anónimo';
  return name
    .split(' ')
    .map(part => {
      if (part.length <= 1) return part;
      if (part.length === 2) return part[0] + '*';
      return part.slice(0, 2) + '***';
    })
    .join(' ');
}

export const AVATARES = [
  { bg: '#F59E0B', label: 'Ámbar' },
  { bg: '#10B981', label: 'Esmeralda' },
  { bg: '#3B82F6', label: 'Azul' },
  { bg: '#8B5CF6', label: 'Violeta' },
  { bg: '#EF4444', label: 'Rojo' },
  { bg: '#06B6D4', label: 'Cian' },
  { bg: '#F97316', label: 'Naranja' },
  { bg: '#14B8A6', label: 'Teal' },
  { bg: '#6366F1', label: 'Índigo' },
  { bg: '#EC4899', label: 'Rosa' },
  { bg: '#84CC16', label: 'Lima' },
  { bg: '#0EA5E9', label: 'Cielo' },
];

export function getAvatar(): number {
  const stored = localStorage.getItem('avatar_index');
  const idx = Number(stored);
  return isNaN(idx) || idx < 0 || idx >= AVATARES.length ? 0 : idx;
}

export function setAvatar(index: number): void {
  localStorage.setItem('avatar_index', String(index));
  // Remove old foto_perfil so avatar takes precedence
  localStorage.removeItem('foto_perfil');
}
