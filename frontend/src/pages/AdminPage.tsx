import { useState, useEffect, useCallback } from 'react';
import AdminPanel from '../components/AdminPanel';
import { useSubastas } from '../hooks/useSubastas';
import { useSse } from '../hooks/useSse';
import { obtenerTicketAdmin } from '../services/sseService';
import * as adminService from '../services/adminService';
import * as disputaService from '../services/disputaService';
import * as categoriaService from '../services/categoriaService';
import type { Categoria } from '../services/categoriaService';
import { Spinner } from '../components/Spinner';
import type { Dispute, UserAccount } from '../types';

export default function AdminPage() {
  const { auctions } = useSubastas();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [sseLogs, setSseLogs] = useState<string[]>([]);

  const addLog = useCallback((msg: string) => {
    setSseLogs(prev => [msg, ...prev].slice(0, 50));
  }, []);

  useSse(obtenerTicketAdmin, '/api/admin/subastas/stream', {
    'nueva-puja-admin': (data: unknown) => {
      const p = data as { subastaId: number; ofertanteNombre: string; monto: number };
      addLog(`[${new Date().toLocaleTimeString()}] ${p.ofertanteNombre} pujó $${p.monto} en subasta #${p.subastaId}`);
    },
    'cambio-estado-admin': (data: unknown) => {
      const e = data as { subastaId: number; estado: string };
      addLog(`[${new Date().toLocaleTimeString()}] Subasta #${e.subastaId} → ${e.estado}`);
    },
  });

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingDisputes, setLoadingDisputes] = useState(true);

  useEffect(() => {
    categoriaService.listarCategorias().then(setCategorias).catch(() => {});
  }, []);

  useEffect(() => {
    adminService.listarUsuarios().then(res => {
      setUsers(res.content.map((u: { id: number; nombre: string; email: string; bloqueado: boolean; roles: string[]; createdAt: string }) => ({
        id: String(u.id),
        name: u.nombre,
        email: u.email,
        roles: u.roles as ('USER' | 'SELLER' | 'ADMIN')[],
        rating: 0,
        status: u.bloqueado ? 'BLOCKED' as const : 'ACTIVE' as const,
        createdAt: u.createdAt,
      })));
      setLoadingUsers(false);
    }).catch(() => { setLoadingUsers(false); });
  }, []);

  useEffect(() => {
    disputaService.listarDisputasAdmin(0, 50).then(res => {
      setDisputes(res.items.map(d => ({ ...d, subastaTitle: `Subasta #${d.subastaId}` })));
      setLoadingDisputes(false);
    }).catch(() => { setLoadingDisputes(false); });
  }, []);

  const handleResolveDispute = async (id: string, state: 'ADJUDICADA' | 'CANCELADA' | 'FINALIZADA', resolution: string) => {
    try {
      await disputaService.resolverDisputa(id, resolution);
      setDisputes(prev => prev.map(d => d.id === id ? { ...d, estado: 'RESUELTA' as const, estadoFinalSubasta: state, resolucionAdmin: resolution } : d));
      addLog(`[${new Date().toLocaleTimeString()}] Disputa #${id} resuelta`);
    } catch { /* fallback */ }
  };

  const handleCrearCategoria = async (nombre: string) => {
    const nueva = await categoriaService.crearCategoria(nombre);
    setCategorias(prev => [...prev, nueva]);
  };

  const handleActualizarCategoria = async (id: number, nombre: string) => {
    const actualizada = await categoriaService.actualizarCategoria(id, nombre);
    setCategorias(prev => prev.map(c => c.id === id ? actualizada : c));
  };

  const handleEliminarCategoria = async (id: number) => {
    await categoriaService.eliminarCategoria(id);
    setCategorias(prev => prev.filter(c => c.id !== id));
  };

  const handleToggleUserStatus = async (id: string) => {
    try {
      const user = users.find(u => u.id === id);
      if (!user) return;
      if (user.status === 'BLOCKED') {
        await adminService.desbloquearUsuario(Number(id));
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'ACTIVE' as const } : u));
        addLog(`[${new Date().toLocaleTimeString()}] Usuario #${id} desbloqueado`);
      } else {
        await adminService.bloquearUsuario(Number(id));
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'BLOCKED' as const } : u));
        addLog(`[${new Date().toLocaleTimeString()}] Usuario #${id} bloqueado`);
      }
    } catch { /* fallback */ }
  };

  return (
    <div className="animate-fade-in">
      {loadingUsers || loadingDisputes ? <Spinner /> : (
      <AdminPanel
        disputes={disputes}
        users={users}
        auctions={auctions}
        categorias={categorias}
        onResolveDispute={handleResolveDispute}
        onToggleUserStatus={handleToggleUserStatus}
        onCrearCategoria={handleCrearCategoria}
        onActualizarCategoria={handleActualizarCategoria}
        onEliminarCategoria={handleEliminarCategoria}
        sseLogs={sseLogs}
      />
      )}
    </div>
  );
}
