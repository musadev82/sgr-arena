import { Link } from 'react-router-dom';
import { brands, phones } from '../data/phones';

export default function Brands() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Smartphone Brands</h1>
        <p className="text-sm text-muted mt-1">Browse smartphones by manufacturer.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
        {brands.map(brand => (
          <Link key={brand.id} to={`/brands/${brand.id}`} className="bg-surface rounded-lg border border-edge hover:border-primary/40 hover:shadow-sm transition-all p-4 text-center block">
            <div className="text-3xl mb-2"><img src={brand.logo} alt={`${brand.name} logo`} className="h-[1em] w-[1em] mx-auto object-contain" /></div>
            <h3 className="font-display font-bold text-ink text-sm">{brand.name}</h3>
            <p className="text-xs text-muted mt-0.5">{brand.country}</p>
            <p className="text-xs text-primary font-medium mt-1">{brand.models} model{brand.models !== 1 ? 's' : ''}</p>
          </Link>
        ))}
      </div>

      {/* Brand phones preview */}
      {brands.filter(b => b.models > 0).map(brand => {
        const brandPhones = phones.filter(p => p.brand === brand.name);
        if (brandPhones.length === 0) return null;
        return (
          <div key={brand.id} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl"><img src={brand.logo} alt={`${brand.name} logo`} className="h-[1em] w-[1em] object-contain" /></span>
                <h2 className="font-display font-bold text-ink">{brand.name}</h2>
                <span className="text-xs text-muted">({brandPhones.length} phones)</span>
              </div>
              <Link to={`/brands/${brand.id}`} className="text-xs text-primary hover:underline">View all →</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {brandPhones.map(phone => (
                <Link key={phone.id} to={`/phones/${phone.slug}`} className="bg-surface rounded-lg border border-edge hover:border-primary/40 hover:shadow-sm transition-all p-3 shrink-0 w-40 block">
                  <img src={phone.image} alt={phone.name} className="w-full aspect-[3/4] object-cover rounded-md bg-bg mb-2" />
                  <p className="text-xs font-display font-semibold text-ink leading-tight">{phone.name}</p>
                  <p className="text-xs text-primary font-semibold mt-0.5">{phone.priceDisplay}</p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
