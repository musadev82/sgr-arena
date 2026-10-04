import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { phones } from '../data/phones';
import PhoneCard from '../components/PhoneCard';

const BRANDS = ['Samsung', 'Apple', 'Google', 'OnePlus', 'Xiaomi', 'Nothing', 'Realme'];
const RAMS = ['4GB', '6GB', '8GB', '12GB', '16GB', '24GB'];
const STORAGES = ['64GB', '128GB', '256GB', '512GB', '1TB'];
const DISPLAY_SIZES = ['Under 6.2"', '6.2" – 6.5"', '6.5" – 6.8"', 'Over 6.8"'];
const BATTERIES = ['Under 4000mAh', '4000–5000mAh', '5000–6000mAh', 'Over 6000mAh'];
const OS_LIST = ['Android', 'iOS'];
const CAMERAS = ['48MP+', '50MP+', '100MP+', '200MP+'];
const PROCESSORS = ['Snapdragon 8 Elite', 'Apple A18 Pro', 'Tensor G4', 'Dimensity 9300+', 'Exynos 1580'];

export default function Finder() {
  const [searchParams] = useSearchParams();
  const initialBrand = searchParams.get('brand') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';

  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [priceRange, setPriceRange] = useState({ min: '', max: initialMaxPrice });
  const [selectedRam, setSelectedRam] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [fiveGOnly, setFiveGOnly] = useState(false);
  const [selectedOS, setSelectedOS] = useState('');
  const [waterResistance, setWaterResistance] = useState(false);

  const toggleBrand = (b: string) => setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);

  const resetFilters = () => {
    setSelectedBrands([]);
    setPriceRange({ min: '', max: '' });
    setSelectedRam('');
    setSelectedStorage('');
    setFiveGOnly(false);
    setSelectedOS('');
    setWaterResistance(false);
  };

  const activeFilters = [
    ...selectedBrands,
    priceRange.min ? `From Rs. ${parseInt(priceRange.min).toLocaleString()}` : '',
    priceRange.max ? `Under Rs. ${parseInt(priceRange.max).toLocaleString()}` : '',
    selectedRam ? `${selectedRam}+ RAM` : '',
    selectedStorage ? `${selectedStorage}+ Storage` : '',
    fiveGOnly ? '5G' : '',
    selectedOS ? selectedOS : '',
    waterResistance ? 'Water Resistant' : '',
  ].filter(Boolean);

  const results = useMemo(() => {
    return phones.filter(phone => {
      if (selectedBrands.length && !selectedBrands.includes(phone.brand)) return false;
      if (priceRange.min && phone.price < parseInt(priceRange.min)) return false;
      if (priceRange.max && phone.price > parseInt(priceRange.max)) return false;
      if (selectedRam) {
        const ram = parseInt(phone.specs.memory.ram);
        const req = parseInt(selectedRam);
        if (ram < req) return false;
      }
      if (fiveGOnly && !phone.fiveG) return false;
      if (selectedOS === 'iOS' && !phone.specs.platform.os.includes('iOS')) return false;
      if (selectedOS === 'Android' && !phone.specs.platform.os.includes('Android')) return false;
      if (waterResistance && !phone.specs.body.waterResistance.startsWith('IP6')) return false;
      return true;
    });
  }, [selectedBrands, priceRange, selectedRam, selectedStorage, fiveGOnly, selectedOS, waterResistance]);

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-edge pb-4 mb-4">
      <h3 className="text-xs font-display font-bold text-ink mb-3 uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Phone Finder</h1>
        <p className="text-sm text-muted mt-1">Filter phones by your exact requirements to find your perfect match.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <div className="w-60 shrink-0 hidden md:block">
          <div className="bg-surface rounded-lg border border-edge p-4 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-display font-semibold text-ink">Filters</span>
              {activeFilters.length > 0 && (
                <button onClick={resetFilters} className="text-xs text-danger hover:underline">Reset all</button>
              )}
            </div>

            <FilterSection title="Brand">
              <div className="space-y-1.5">
                {BRANDS.map(b => (
                  <label key={b} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} className="accent-primary" />
                    <span className={`text-sm ${selectedBrands.includes(b) ? 'text-primary font-medium' : 'text-ink group-hover:text-primary'}`}>{b}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Price (Rs.)">
              <div className="space-y-2">
                <input type="number" placeholder="Min price" value={priceRange.min} onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))} className="w-full text-xs border border-edge rounded-md px-2 py-1.5 bg-bg focus:outline-none focus:border-primary" />
                <input type="number" placeholder="Max price" value={priceRange.max} onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))} className="w-full text-xs border border-edge rounded-md px-2 py-1.5 bg-bg focus:outline-none focus:border-primary" />
                <div className="flex flex-wrap gap-1">
                  {[['50K', '50000'], ['1L', '100000'], ['2L', '200000']].map(([label, val]) => (
                    <button key={val} onClick={() => setPriceRange(p => ({ ...p, max: val }))} className={`text-[10px] px-2 py-0.5 rounded border ${priceRange.max === val ? 'border-primary text-primary bg-primary-light' : 'border-edge text-muted hover:border-primary hover:text-primary'}`}>
                      Under {label}
                    </button>
                  ))}
                </div>
              </div>
            </FilterSection>

            <FilterSection title="RAM">
              <div className="space-y-1.5">
                {['8GB', '12GB', '16GB'].map(r => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="ram" checked={selectedRam === r.replace('GB', '')} onChange={() => setSelectedRam(r.replace('GB', ''))} className="accent-primary" />
                    <span className="text-sm text-ink">{r}+</span>
                  </label>
                ))}
                {selectedRam && <button onClick={() => setSelectedRam('')} className="text-[10px] text-muted hover:text-danger">Clear</button>}
              </div>
            </FilterSection>

            <FilterSection title="Connectivity">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={fiveGOnly} onChange={e => setFiveGOnly(e.target.checked)} className="accent-primary" />
                <span className="text-sm text-ink">5G Only</span>
              </label>
            </FilterSection>

            <FilterSection title="Operating System">
              <div className="space-y-1.5">
                {OS_LIST.map(os => (
                  <label key={os} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="os" checked={selectedOS === os} onChange={() => setSelectedOS(os)} className="accent-primary" />
                    <span className="text-sm text-ink">{os}</span>
                  </label>
                ))}
                {selectedOS && <button onClick={() => setSelectedOS('')} className="text-[10px] text-muted hover:text-danger">Clear</button>}
              </div>
            </FilterSection>

            <div>
              <h3 className="text-xs font-display font-bold text-ink mb-3 uppercase tracking-wide">Features</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={waterResistance} onChange={e => setWaterResistance(e.target.checked)} className="accent-primary" />
                <span className="text-sm text-ink">Water Resistance (IP67+)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.map(f => (
                <span key={f} className="flex items-center gap-1 text-xs bg-primary-light text-primary px-2.5 py-1 rounded-full border border-primary/20">
                  {f}
                </span>
              ))}
              <button onClick={resetFilters} className="text-xs text-danger px-2.5 py-1 rounded-full border border-red-200 hover:bg-red-50 transition-colors">
                Clear all
              </button>
            </div>
          )}

          {/* Mobile filter button */}
          <div className="md:hidden mb-4">
            <div className="flex flex-wrap gap-2">
              {BRANDS.map(b => (
                <button key={b} onClick={() => toggleBrand(b)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedBrands.includes(b) ? 'bg-primary text-white border-primary' : 'border-edge text-muted hover:border-primary hover:text-primary'}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-ink">
              {results.length} phone{results.length !== 1 ? 's' : ''} found
              {activeFilters.length > 0 && <span className="text-muted font-normal"> matching your filters</span>}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="bg-surface rounded-lg border border-edge p-12 text-center">
              <p className="text-muted text-sm">No phones match your selected filters.</p>
              <button onClick={resetFilters} className="mt-3 text-xs text-primary hover:underline">Reset all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map(phone => <PhoneCard key={phone.id} phone={phone} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
