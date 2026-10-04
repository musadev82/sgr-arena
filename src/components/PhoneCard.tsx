import { Link, useNavigate } from 'react-router-dom';
import type { Phone } from '../data/phones';

interface Props {
  phone: Phone;
  compact?: boolean;
  onCompare?: (phone: Phone) => void;
  inComparison?: boolean;
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'xs' }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const s = size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3';
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`${s} ${i <= full ? 'text-warning' : i === full + 1 && half ? 'text-warning opacity-60' : 'text-edge-dark'}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export { StarRating };

export default function PhoneCard({ phone, compact = false, onCompare, inComparison }: Props) {
  const navigate = useNavigate();

  if (compact) {
    return (
      <div className="bg-surface rounded-lg border border-edge hover:border-primary/40 hover:shadow-sm transition-all group">
        <Link to={`/phones/${phone.slug}`} className="block p-3">
          <div className="flex gap-3">
            <div className="w-14 h-18 bg-bg rounded-md overflow-hidden shrink-0 flex items-center justify-center" style={{ height: '72px' }}>
              <img src={phone.image} alt={phone.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted">{phone.brand}</p>
              <h3 className="text-sm font-display font-semibold text-ink truncate">{phone.name}</h3>
              <div className="mt-0.5">
                <span className="text-[9px] font-semibold text-muted uppercase tracking-wide">Est. Price</span>
                <p className="text-sm font-semibold text-primary leading-tight">{phone.priceDisplay.replace('Rs. ', '')}</p>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <StarRating rating={phone.rating} size="xs" />
                <span className="text-xs text-muted">{phone.rating}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-edge hover:border-primary/40 hover:shadow-md transition-all group flex flex-col">
      <Link to={`/phones/${phone.slug}`} className="block p-4">
        <div className="aspect-[4/5] bg-bg rounded-md overflow-hidden mb-3 relative">
          <img src={phone.image} alt={phone.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          {phone.fiveG && (
            <span className="absolute top-2 left-2 bg-success text-white text-[10px] font-bold px-1.5 py-0.5 rounded">5G</span>
          )}
        </div>
        <div>
          <p className="text-xs text-muted font-medium">{phone.brand}</p>
          <h3 className="font-display font-semibold text-ink text-sm mt-0.5 leading-snug">{phone.name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <StarRating rating={phone.rating} />
            <span className="text-xs text-muted">{phone.rating} ({phone.reviewCount.toLocaleString()})</span>
          </div>
          <div className="mt-1.5">
            <span className="text-[9px] font-semibold text-muted uppercase tracking-wide">Est. Price</span>
            <p className="text-base font-bold text-ink leading-tight">{phone.priceDisplay.replace('Rs. ', '')}</p>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5">
            {[
              ['Display', phone.displayShort],
              ['RAM', phone.ramShort],
              ['Camera', phone.cameraShort],
              ['Battery', phone.batteryShort],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center gap-1">
                <span className="text-[10px] text-muted">{label}:</span>
                <span className="text-[10px] text-ink font-medium truncate">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4 flex gap-2 mt-auto">
        <Link
          to={`/phones/${phone.slug}`}
          className="flex-1 text-center text-xs font-semibold py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          View Details
        </Link>
        <button
          onClick={() => onCompare ? onCompare(phone) : navigate(`/compare?add=${phone.slug}`)}
          className={`flex-1 text-center text-xs font-semibold py-2 rounded-md border transition-colors ${inComparison ? 'bg-success/10 text-success border-success/30' : 'border-edge text-muted hover:border-primary hover:text-primary'}`}
        >
          {inComparison ? '✓ Added' : 'Compare'}
        </button>
      </div>
    </div>
  );
}
