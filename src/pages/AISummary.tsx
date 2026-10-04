import { useState } from 'react';
import { phones } from '../data/phones';

export default function AISummary() {
  const [selectedPhone, setSelectedPhone] = useState(phones[0]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  function generate() {
    setGenerated(false);
    setLoading(true);
    setTimeout(() => { setLoading(false); setGenerated(true); }, 2200);
  }

  const bestFor = [
    { emoji: '📷', label: 'Photography', match: selectedPhone.specs.mainCamera.wide.includes('200MP') || selectedPhone.brand === 'Google' || selectedPhone.brand === 'Xiaomi' },
    { emoji: '🎮', label: 'Gaming', match: selectedPhone.specs.platform.chipset.includes('Snapdragon 8 Elite') || selectedPhone.specs.platform.chipset.includes('A18') },
    { emoji: '🔋', label: 'Battery Life', match: parseInt(selectedPhone.specs.battery.capacity) >= 5000 },
    { emoji: '💼', label: 'Productivity', match: selectedPhone.category.includes('S-Pen') || selectedPhone.brand === 'Apple' },
    { emoji: '💡', label: 'AI Features', match: selectedPhone.brand === 'Google' || selectedPhone.brand === 'Apple' || selectedPhone.brand === 'Samsung' },
    { emoji: '📶', label: '5G Connectivity', match: selectedPhone.fiveG },
  ].filter(b => b.match);

  const simpleSpecs = [
    { label: 'Screen', value: `${selectedPhone.specs.display.size} ${selectedPhone.specs.display.type}`, explain: 'A large, bright screen — great for watching videos and browsing.' },
    { label: 'Processor', value: selectedPhone.specs.platform.chipset, explain: 'This chip handles everything your phone does — the faster, the smoother.' },
    { label: 'Camera', value: selectedPhone.specs.mainCamera.wide, explain: 'The main camera. Higher megapixels usually means more detail in photos.' },
    { label: 'Battery', value: selectedPhone.specs.battery.capacity, explain: `Larger battery = longer use. ${parseInt(selectedPhone.specs.battery.capacity) >= 5000 ? 'This should easily last a full day.' : 'Should last most users a full day with moderate use.'}` },
    { label: 'Storage', value: selectedPhone.specs.memory.storage.split('/')[0].trim(), explain: 'How much space you have for apps, photos, and videos.' },
    { label: 'Charging', value: selectedPhone.specs.battery.chargingWired, explain: 'How fast it charges. Higher wattage = less time waiting.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">AI Phone Summary</h1>
        <p className="text-sm text-muted mt-1">Turn technical specifications into plain language you can understand.</p>
      </div>

      {/* AI notice */}
      <div className="flex items-start gap-3 p-3 bg-primary-light rounded-lg border border-primary/20 mb-6 text-xs">
        <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p className="text-primary/80"><span className="font-semibold text-primary">AI Prototype Insight</span> — AI-generated information is provided for informational purposes only and is not a verified manufacturer statement.</p>
      </div>

      {/* Phone selector */}
      <div className="bg-surface rounded-lg border border-edge p-4 mb-4">
        <label className="text-sm font-display font-semibold text-ink mb-2 block">Select Phone</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {phones.map(phone => (
            <button
              key={phone.id}
              onClick={() => { setSelectedPhone(phone); setGenerated(false); }}
              className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-colors ${selectedPhone.id === phone.id ? 'border-primary bg-primary-light' : 'border-edge hover:border-primary/40'}`}
            >
              <img src={phone.image} alt={phone.name} className="w-8 h-10 object-cover rounded bg-bg shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted">{phone.brand}</p>
                <p className="text-[11px] font-medium text-ink leading-tight truncate">{phone.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected phone summary */}
      <div className="bg-surface rounded-lg border border-edge p-4 mb-4 flex items-center gap-4">
        <img src={selectedPhone.image} alt={selectedPhone.name} className="w-16 h-20 object-cover rounded-lg bg-bg" />
        <div>
          <p className="text-sm text-muted">{selectedPhone.brand}</p>
          <h2 className="font-display text-lg font-bold text-ink">{selectedPhone.name}</h2>
          <p className="text-primary font-semibold text-sm">{selectedPhone.priceDisplay}</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={generate}
            disabled={loading}
            className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                Generate AI Summary
              </>
            )}
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-surface rounded-lg border border-edge p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted">Analyzing smartphone specifications...</p>
          <p className="text-xs text-muted mt-1">This takes just a moment.</p>
        </div>
      )}

      {generated && !loading && (
        <div className="space-y-5 animate-[fadeIn_0.4s_ease]">
          {/* Overview */}
          <div className="bg-surface rounded-lg border border-edge p-5">
            <h3 className="font-display font-bold text-ink mb-2">What is the {selectedPhone.brand} {selectedPhone.name}?</h3>
            <p className="text-sm text-muted leading-relaxed">{selectedPhone.summary} In simple terms: {selectedPhone.rating >= 4.7 ? 'This is one of the best smartphones available right now.' : selectedPhone.rating >= 4.4 ? 'This is a very good smartphone that delivers great value.' : 'This is a solid mid-range phone that covers all the basics well.'}</p>
          </div>

          {/* Best for */}
          <div className="bg-surface rounded-lg border border-edge p-5">
            <h3 className="font-display font-bold text-ink mb-3">Best For</h3>
            <div className="flex flex-wrap gap-2">
              {bestFor.map(b => (
                <div key={b.label} className="flex items-center gap-1.5 bg-primary-light rounded-full px-3 py-1.5 border border-primary/20">
                  <span>{b.emoji}</span>
                  <span className="text-xs font-semibold text-primary">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simplified specs */}
          <div className="bg-surface rounded-lg border border-edge p-5">
            <h3 className="font-display font-bold text-ink mb-3">Specs Explained Simply</h3>
            <div className="space-y-3">
              {simpleSpecs.map(spec => (
                <div key={spec.label} className="flex items-start gap-3 pb-3 border-b border-edge last:border-0 last:pb-0">
                  <div className="w-20 shrink-0">
                    <p className="text-xs font-medium text-muted">{spec.label}</p>
                    <p className="text-xs font-bold text-ink mt-0.5">{spec.value}</p>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{spec.explain}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pros / Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-success-light rounded-lg border border-success/20 p-4">
              <h4 className="font-display font-semibold text-success text-sm mb-2">What we love</h4>
              <ul className="space-y-1.5">{selectedPhone.pros.map(p => <li key={p} className="text-xs text-ink flex gap-2"><span className="text-success">✓</span>{p}</li>)}</ul>
            </div>
            <div className="bg-bg rounded-lg border border-edge p-4">
              <h4 className="font-display font-semibold text-muted text-sm mb-2">Things to think about</h4>
              <ul className="space-y-1.5">{selectedPhone.cons.map(c => <li key={c} className="text-xs text-ink flex gap-2"><span className="text-warning">!</span>{c}</li>)}</ul>
            </div>
          </div>

          {/* Verdict */}
          <div className="bg-surface rounded-lg border border-edge p-5">
            <h3 className="font-display font-bold text-ink mb-2">AI Verdict</h3>
            <p className="text-sm text-muted leading-relaxed">
              {selectedPhone.rating >= 4.8
                ? `The ${selectedPhone.brand} ${selectedPhone.name} is a top-tier flagship that sets the benchmark for its category. If budget is not a concern, this phone delivers the best experience money can buy in ${selectedPhone.releaseDate.split(' ')[1]}.`
                : selectedPhone.rating >= 4.5
                ? `The ${selectedPhone.brand} ${selectedPhone.name} is an excellent smartphone that excels in most areas. It offers flagship-level features at a price that's more accessible than the very top tier.`
                : `The ${selectedPhone.brand} ${selectedPhone.name} is a solid choice for its price range. It balances performance, features, and value well for everyday users.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
