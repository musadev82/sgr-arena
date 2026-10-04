import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { phones } from '../data/phones';
import PhoneCard from '../components/PhoneCard';

const BRANDS = ['All', 'Apple', 'Samsung', 'Google', 'Xiaomi', 'OnePlus', 'Oppo', 'Vivo', 'Realme', 'Motorola', 'Nothing', 'Huawei'];
const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function Phones() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialFilter = searchParams.get('filter') || '';
  const requestedBrand = searchParams.get('brand')?.trim() || '';
  const urlBrand = BRANDS.find(option => option.toLowerCase() === requestedBrand.toLowerCase()) || 'All';

  const [search, setSearch] = useState(initialSearch);
  const [brand, setBrand] = useState(urlBrand);
  const [sort, setSort] = useState(initialFilter === 'popular' ? 'popular' : 'latest');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRam, setMinRam] = useState('');
  const [fiveGOnly, setFiveGOnly] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setBrand(urlBrand);
  }, [urlBrand]);

  function selectBrand(nextBrand: string) {
    setBrand(nextBrand);
    setSearchParams(previous => {
      if (nextBrand === 'All') previous.delete('brand');
      else previous.set('brand', nextBrand);
      return previous;
    });
  }

  const filtered = useMemo(() => {
    let result = [...phones];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (brand !== 'All') result = result.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    if (maxPrice) result = result.filter(p => p.price <= parseInt(maxPrice));
    if (minRam) result = result.filter(p => parseInt(p.specs.memory.ram) >= parseInt(minRam));
    if (fiveGOnly) result = result.filter(p => p.fiveG);
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'popular') result.sort((a, b) => b.reviewCount - a.reviewCount);
    else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [search, brand, sort, maxPrice, minRam, fiveGOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">{brand === 'All' ? 'Smartphones' : `${brand} Phones`}</h1>
        <p className="text-sm text-muted mt-1">{brand === 'All' ? 'Browse smartphones by brand, price, specifications and release date.' : `Showing ${brand} phones.`}</p>
      </div>

      {/* Search + Sort bar */}
      <div className="bg-surface rounded-lg border border-edge p-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search smartphones..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-edge rounded-md bg-bg focus:outline-none focus:border-primary"
            />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} className="text-sm border border-edge rounded-md px-3 py-2 bg-bg focus:outline-none focus:border-primary">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div className="flex items-center gap-1 border border-edge rounded-md overflow-hidden">
            <button onClick={() => setView('grid')} className={`px-3 py-2 ${view === 'grid' ? 'bg-primary text-white' : 'bg-bg text-muted hover:text-ink'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button onClick={() => setView('list')} className={`px-3 py-2 ${view === 'list' ? 'bg-primary text-white' : 'bg-bg text-muted hover:text-ink'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Brand tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {BRANDS.map(b => (
            <button key={b} onClick={() => selectBrand(b)} className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${brand === b ? 'bg-primary text-white' : 'bg-surface border border-edge text-muted hover:border-primary hover:text-primary'}`}>
              {b}
            </button>
          ))}
        </div>
        <select value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="text-xs border border-edge rounded-md px-2 py-1.5 bg-surface text-muted focus:outline-none focus:border-primary">
          <option value="">Any Price</option>
          <option value="50000">Under Rs. 50K</option>
          <option value="100000">Under Rs. 1L</option>
          <option value="200000">Under Rs. 2L</option>
          <option value="500000">Under Rs. 5L</option>
        </select>
        <select value={minRam} onChange={e => setMinRam(e.target.value)} className="text-xs border border-edge rounded-md px-2 py-1.5 bg-surface text-muted focus:outline-none focus:border-primary">
          <option value="">Any RAM</option>
          <option value="8">8GB+</option>
          <option value="12">12GB+</option>
          <option value="16">16GB+</option>
        </select>
        <label className="flex items-center gap-1.5 text-xs text-muted cursor-pointer select-none">
          <input type="checkbox" checked={fiveGOnly} onChange={e => setFiveGOnly(e.target.checked)} className="accent-primary" />
          5G Only
        </label>
        {(brand !== 'All' || maxPrice || minRam || fiveGOnly || search) && (
          <button onClick={() => { selectBrand('All'); setMaxPrice(''); setMinRam(''); setFiveGOnly(false); setSearch(''); }} className="text-xs text-danger hover:underline">
            Reset filters
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-muted mb-4">{filtered.length} smartphone{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Grid / List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <p className="text-sm font-medium">{brand === 'All' ? 'No phones match your filters.' : `No phones found for ${brand}.`}</p>
          <p className="text-xs mt-1">Try adjusting or resetting your filters.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(phone => (
            <PhoneCard key={phone.id} phone={phone} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(phone => (
            <ListRow key={phone.id} phone={phone} />
          ))}
        </div>
      )}
    </div>
  );
}

function ListRow({ phone }: { phone: import('../data/phones').Phone }) {
  return (
    <div className="bg-surface rounded-lg border border-edge hover:border-primary/40 hover:shadow-sm transition-all">
      <Link to={`/phones/${phone.slug}`} className="flex items-center gap-4 p-3">
        <img src={phone.image} alt={phone.name} className="w-12 h-16 object-cover rounded-md bg-bg shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-muted">{phone.brand}</p>
          <h3 className="text-sm font-display font-semibold text-ink">{phone.name}</h3>
          <p className="text-xs text-muted">{phone.releaseDate}</p>
        </div>
        <div className="hidden sm:grid grid-cols-4 gap-4 text-xs text-muted">
          <div><p className="font-medium text-ink">{phone.displayShort}</p><p>Display</p></div>
          <div><p className="font-medium text-ink">{phone.ramShort}</p><p>RAM</p></div>
          <div><p className="font-medium text-ink">{phone.cameraShort}</p><p>Camera</p></div>
          <div><p className="font-medium text-ink">{phone.batteryShort}</p><p>Battery</p></div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-ink">{phone.priceDisplay}</p>
          <p className="text-xs text-success">{phone.fiveG ? '5G' : '4G'}</p>
        </div>
      </Link>
    </div>
  );
}
