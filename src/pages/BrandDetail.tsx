import { useParams, Link } from 'react-router-dom';
import { brands, phones } from '../data/phones';
import PhoneCard from '../components/PhoneCard';

export default function BrandDetail() {
  const { id } = useParams();
  const brand = brands.find(b => b.id === id);
  const brandPhones = phones.filter(p => p.brand === brand?.name);

  if (!brand) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-muted">Brand not found.</p>
        <Link to="/brands" className="text-primary hover:underline text-sm mt-2 inline-block">← Back to Brands</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1 text-xs text-muted mb-4">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/brands" className="hover:text-primary">Brands</Link>
        <span>/</span>
        <span className="text-ink">{brand.name}</span>
      </nav>
      <div className="bg-surface rounded-xl border border-edge p-6 mb-6 flex items-center gap-5">
        <div className="text-5xl">{brand.logo}</div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{brand.name}</h1>
          <p className="text-sm text-muted mt-1">{brand.country} · Founded {brand.founded}</p>
          <p className="text-sm text-muted">Popular model: <span className="text-ink font-medium">{brand.popular}</span></p>
        </div>
      </div>

      <h2 className="font-display font-bold text-ink mb-4">{brand.name} Smartphones ({brandPhones.length})</h2>
      {brandPhones.length === 0 ? (
        <div className="bg-surface rounded-lg border border-edge p-12 text-center">
          <p className="text-muted text-sm">No phones listed for {brand.name} yet.</p>
          <Link to="/phones" className="text-xs text-primary hover:underline mt-2 inline-block">Browse all phones →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brandPhones.map(phone => <PhoneCard key={phone.id} phone={phone} />)}
        </div>
      )}
    </div>
  );
}
