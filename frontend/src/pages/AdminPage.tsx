import { useState, useEffect, useCallback } from 'react';
import AdminPanel from '../components/AdminPanel';
import { useSubastas } from '../hooks/useSubastas';
import { useSse } from '../hooks/useSse';
import { obtenerTicketAdmin } from '../services/sseService';
import * as adminService from '../services/adminService';
import api from '../services/api';
import { Spinner } from '../components/Spinner';
import type { Dispute, UserAccount, Auction } from '../types';

export default function AdminPage() {
  const { auctions, pujar } = useSubastas();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
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

  const handleResolveDispute = async (id: string, state: 'ADJUDICADA' | 'CANCELADA' | 'FINALIZADA', resolution: string) => {
    try {
      await api.put(`/api/disputas/${id}/resolver`, { estadoFinal: state, resolucionAdmin: resolution });
      setDisputes(prev => prev.map(d => d.id === id ? { ...d, estado: 'RESUELTA' as const, estadoFinalSubasta: state, resolucionAdmin: resolution } : d));
      addLog(`[${new Date().toLocaleTimeString()}] Disputa #${id} resuelta como ${state}`);
    } catch { /* fallback */ }
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
      {loadingUsers ? <Spinner /> : (
      <AdminPanel
        disputes={disputes}
        users={users}
        auctions={auctions}
        onResolveDispute={handleResolveDispute}
        onToggleUserStatus={handleToggleUserStatus}
        sseLogs={sseLogs}
      />
      )}
    </div>
  );
}
