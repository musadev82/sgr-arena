import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { phones } from '../data/phones';
import type { Phone } from '../data/phones';
import { StarRating } from '../components/PhoneCard';

export default function Compare() {
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState<Phone[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const slugs = searchParams.get('phones')?.split(',') || [];
    const initial = slugs.map(s => phones.find(p => p.slug === s)).filter(Boolean) as Phone[];
    if (initial.length) setSelected(initial);
    const addSlug = searchParams.get('add');
    if (addSlug) {
      const phone = phones.find(p => p.slug === addSlug);
      if (phone) setSelected([phone]);
    }
  }, []);

  const addPhone = (phone: Phone) => {
    if (selected.length < 4 && !selected.find(p => p.id === phone.id)) {
      setSelected([...selected, phone]);
      setSearch('');
    }
  };
  const removePhone = (id: string) => setSelected(selected.filter(p => p.id !== id));
  const swapPhones = (i: number, j: number) => {
    const next = [...selected];
    [next[i], next[j]] = [next[j], next[i]];
    setSelected(next);
  };

  const searchResults = search.length > 1
    ? phones.filter(p => (p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())) && !selected.find(s => s.id === p.id)).slice(0, 5)
    : [];

  const rows = [
    { label: 'Price', get: (p: Phone) => p.priceDisplay, highlight: true },
    { label: 'Rating', get: (p: Phone) => `${p.rating}/5 (${p.reviewCount.toLocaleString()})` },
    { label: 'Release', get: (p: Phone) => p.releaseDate },
    { label: 'Display', get: (p: Phone) => p.specs.display.type },
    { label: 'Size', get: (p: Phone) => p.specs.display.size },
    { label: 'Resolution', get: (p: Phone) => p.specs.display.resolution },
    { label: 'Refresh Rate', get: (p: Phone) => p.specs.display.refreshRate },
    { label: 'Processor', get: (p: Phone) => p.specs.platform.chipset },
    { label: 'OS', get: (p: Phone) => p.specs.platform.os },
    { label: 'RAM', get: (p: Phone) => p.specs.memory.ram },
    { label: 'Storage', get: (p: Phone) => p.specs.memory.storage },
    { label: 'Main Camera', get: (p: Phone) => p.specs.mainCamera.wide },
    { label: 'Ultra-wide', get: (p: Phone) => p.specs.mainCamera.ultrawide },
    { label: 'Telephoto', get: (p: Phone) => p.specs.mainCamera.telephoto },
    { label: 'Selfie Camera', get: (p: Phone) => p.specs.selfieCamera.sensor },
    { label: 'Battery', get: (p: Phone) => p.specs.battery.capacity },
    { label: 'Wired Charging', get: (p: Phone) => p.specs.battery.chargingWired },
    { label: 'Wireless Charging', get: (p: Phone) => p.specs.battery.chargingWireless },
    { label: 'Weight', get: (p: Phone) => p.specs.body.weight },
    { label: 'Dimensions', get: (p: Phone) => p.specs.body.dimensions },
    { label: '5G', get: (p: Phone) => p.fiveG ? '✓ Yes' : 'No' },
    { label: 'Water Resistance', get: (p: Phone) => p.specs.body.waterResistance },
    { label: 'NFC', get: (p: Phone) => p.specs.connectivity.nfc },
    { label: 'USB', get: (p: Phone) => p.specs.connectivity.usb },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Compare Phones</h1>
        <p className="text-sm text-muted mt-1">Select up to 4 phones to compare specifications side by side.</p>
      </div>

      {/* Phone selectors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[0, 1, 2, 3].map(i => {
          const phone = selected[i];
          return (
            <div key={i} className="bg-surface rounded-lg border-2 border-dashed border-edge min-h-[120px] flex flex-col items-center justify-center p-3 relative hover:border-primary/40 transition-colors">
              {phone ? (
                <>
                  <button onClick={() => removePhone(phone.id)} className="absolute top-2 right-2 w-5 h-5 rounded-full bg-edge text-ink text-xs flex items-center justify-center hover:bg-danger hover:text-white transition-colors">×</button>
                  {i > 0 && (
                    <button onClick={() => swapPhones(i, i - 1)} className="absolute top-2 left-2 w-5 h-5 rounded-full bg-edge text-ink text-xs flex items-center justify-center hover:bg-primary hover:text-white transition-colors">⇄</button>
                  )}
                  <img src={phone.image} alt={phone.name} className="w-12 h-16 object-cover rounded-md bg-bg" />
                  <p className="text-xs font-display font-semibold text-ink text-center mt-2 leading-tight">{phone.brand} {phone.name}</p>
                  <p className="text-xs text-primary font-semibold mt-0.5">{phone.priceDisplay}</p>
                  <StarRating rating={phone.rating} size="xs" />
                </>
              ) : (
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-edge flex items-center justify-center mx-auto mb-2 text-muted">+</div>
                  <p className="text-xs text-muted">Add Phone {i + 1}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Search to add */}
      {selected.length < 4 && (
        <div className="relative mb-6 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search and add a phone..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-edge rounded-md bg-surface focus:outline-none focus:border-primary"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-surface border border-edge rounded-lg shadow-lg py-1 z-10 mt-1">
              {searchResults.map(p => (
                <button key={p.id} onClick={() => addPhone(p)} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-bg transition-colors text-left">
                  <img src={p.image} alt={p.name} className="w-8 h-10 object-cover rounded bg-bg" />
                  <div>
                    <p className="text-sm font-medium text-ink">{p.brand} {p.name}</p>
                    <p className="text-xs text-muted">{p.priceDisplay}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick-add suggestions */}
      {selected.length < 2 && (
        <div className="mb-6">
          <p className="text-xs text-muted mb-2">Popular comparisons:</p>
          <div className="flex flex-wrap gap-2">
            {[
              [phones[0], phones[1]],
              [phones[2], phones[0]],
              [phones[3], phones[4]],
            ].map(([a, b], i) => (
              <button key={i} onClick={() => setSelected([a, b])} className="text-xs px-3 py-1.5 rounded-full border border-edge bg-surface text-muted hover:border-primary hover:text-primary transition-colors">
                {a.name} vs {b.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comparison table */}
      {selected.length >= 2 ? (
        <div className="overflow-x-auto">
          <table className="w-full bg-surface rounded-lg border border-edge overflow-hidden">
            <thead>
              <tr className="border-b border-edge">
                <th className="w-36 px-4 py-3 text-left text-xs font-medium text-muted bg-bg">Specification</th>
                {selected.map(phone => (
                  <th key={phone.id} className="px-4 py-3 text-center">
                    <img src={phone.image} alt={phone.name} className="w-12 h-16 object-cover rounded-md bg-bg mx-auto mb-1" />
                    <p className="text-xs font-display font-bold text-ink">{phone.brand}</p>
                    <p className="text-xs font-display font-bold text-ink">{phone.name}</p>
                    <p className="text-sm font-bold text-primary mt-0.5">{phone.priceDisplay}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => {
                const values = selected.map(p => row.get(p));
                const unique = new Set(values).size > 1;
                return (
                  <tr key={ri} className={`border-b border-edge last:border-0 ${ri % 2 === 0 ? 'bg-bg/30' : ''}`}>
                    <td className="px-4 py-2.5 text-xs font-medium text-muted bg-bg/50">{row.label}</td>
                    {selected.map((phone, pi) => {
                      const val = values[pi];
                      const best = row.highlight && values.indexOf(val) === 0;
                      return (
                        <td key={phone.id} className={`px-4 py-2.5 text-xs text-center ${unique ? 'font-semibold text-ink' : 'text-muted'} ${best ? 'text-success' : ''}`}>
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-surface rounded-lg border border-edge p-12 text-center">
          <p className="text-muted text-sm">Add at least 2 phones above to see the comparison.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {phones.slice(0, 5).map(p => (
              <button key={p.id} onClick={() => addPhone(p)} className="text-xs px-3 py-1.5 rounded-full border border-primary text-primary hover:bg-primary-light transition-colors">
                + {p.brand} {p.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
