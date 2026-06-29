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

const AVATAR_COUNT = 8;

export function getAvatar(): number {
  const stored = localStorage.getItem('avatar_index');
  const idx = Number(stored);
  return isNaN(idx) || idx < 0 || idx >= AVATAR_COUNT ? 0 : idx;
}

export function setAvatar(index: number): void {
  localStorage.setItem('avatar_index', String(index));
  localStorage.removeItem('foto_perfil');
}
