import { useState, useEffect } from 'react';
import { Clock, TrendingUp, Gavel, Award } from 'lucide-react';
import { Auction } from '../types';

interface AuctionCardProps {
  auction: Auction;
  onSelect: (auction: Auction) => void;
  onQuickBid: (auctionId: string) => void;
  currentUserName: string;
}

export default function AuctionCard({ auction, onSelect, onQuickBid, currentUserName }: AuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isEnded, setIsEnded] = useState<boolean>(false);

  useEffect(() => {
    function updateTimer() {
      const difference = new Date(auction.endTime).getTime() - Date.now();
      
      if (difference <= 0) {
        setTimeLeft('¡Finalizado!');
        setIsEnded(true);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      let parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      setTimeLeft(parts.join(' '));
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [auction.endTime]);

  const latestBid = auction.bids.length > 0 ? auction.bids[0] : null;
  const isWinning = latestBid ? latestBid.bidderName === currentUserName : false;

  const differenceMs = new Date(auction.endTime).getTime() - Date.now();
  const endingSoon = differenceMs > 0 && differenceMs < 1000 * 60 * 20;

  return (
    <div 
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 ${
        isWinning ? 'border-emerald-500/30 ring-2 ring-emerald-500/5' : 'border-border/80'
      }`}
      id={`auction-card-${auction.id}`}
    >
      {isWinning && (
        <div className="absolute top-3 left-3 z-10 flex items-center space-x-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
          <Award className="h-3.5 w-3.5 animate-bounce" />
          <span>Vas Ganando</span>
        </div>
      )}

      <div 
        onClick={() => onSelect(auction)}
        className="relative aspect-video w-full cursor-pointer overflow-hidden bg-main"
      >
        <img 
          src={auction.image} 
          alt={auction.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-75 transition-opacity" />
        
        <span className="absolute top-3 right-3 rounded-lg bg-surface/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-amber-400 border border-border">
          {auction.category}
        </span>

        <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 rounded-lg bg-main/85 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white">
          <Clock className={`h-3.5 w-3.5 ${endingSoon ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
          <span className={endingSoon ? 'text-rose-400 font-bold' : ''}>
            {timeLeft}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between text-xs text-text-secondary">
          <span className="flex items-center space-x-1.5">
            <img 
              src={auction.seller.avatar} 
              alt={auction.seller.name} 
              className="h-5 w-5 rounded-full object-cover border border-border"
            />
            <span className="font-medium truncate max-w-[120px] text-text-primary">{auction.seller.name}</span>
          </span>
          <span className="text-amber-400 font-semibold">{auction.seller.rating} ★</span>
        </div>

        <h3 
          onClick={() => onSelect(auction)}
          className="mb-1.5 line-clamp-1 cursor-pointer font-display text-base font-bold text-text-primary hover:text-amber-400 transition-colors"
        >
          {auction.title}
        </h3>

        <p className="mb-4 line-clamp-2 text-xs text-text-secondary leading-relaxed">
          {auction.description}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border/60 pt-3">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              {auction.bidsCount === 0 ? 'Precio Base' : 'Oferta Actual'}
            </span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="font-mono text-base font-extrabold text-amber-400">
                ${auction.currentPrice.toLocaleString('es-ES')}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Total Pujas
            </span>
            <span className="text-xs font-bold text-text-primary block mt-1">
              {auction.bidsCount} {auction.bidsCount === 1 ? 'puja' : 'pujas'}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <button
            onClick={() => onSelect(auction)}
            className="flex-1 rounded-xl border border-border bg-input py-2 text-center text-xs font-semibold text-text-primary hover:bg-input hover:text-white transition-colors"
          >
            Ver Detalle
          </button>

          {!isEnded ? (
            <button
              onClick={() => onQuickBid(auction.id)}
              className="flex items-center justify-center space-x-1 rounded-xl bg-amber-500 hover:bg-amber-400 px-3.5 py-2 text-xs font-bold text-[#0A0A0C] shadow-sm shadow-amber-500/10 transition-colors active:scale-95 cursor-pointer"
            >
              <Gavel className="h-3.5 w-3.5" />
              <span>+${auction.minIncrement}</span>
            </button>
          ) : (
            <span className="rounded-xl bg-input border border-border px-3.5 py-2 text-center text-xs font-semibold text-text-muted">
              Finalizado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
