import AdminPanel from '../components/AdminPanel';
import { Dispute, UserAccount, Auction } from '../types';

interface AdminPageProps {
  disputes: Dispute[];
  users: UserAccount[];
  auctions: Auction[];
  onResolveDispute: (id: string, state: 'ADJUDICADA' | 'CANCELADA' | 'FINALIZADA', resolution: string) => void;
  onToggleUserStatus: (id: string) => void;
  sseLogs: string[];
}

export default function AdminPage({
  disputes,
  users,
  auctions,
  onResolveDispute,
  onToggleUserStatus,
  sseLogs
}: AdminPageProps) {
  return (
    <div className="animate-fade-in">
      <AdminPanel
        disputes={disputes}
        users={users}
        auctions={auctions}
        onResolveDispute={onResolveDispute}
        onToggleUserStatus={onToggleUserStatus}
        sseLogs={sseLogs}
      />
    </div>
  );
}
