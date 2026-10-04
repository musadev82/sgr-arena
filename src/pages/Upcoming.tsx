import { upcomingPhones } from '../data/phones';

export default function Upcoming() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Upcoming Phones</h1>
        <p className="text-sm text-muted mt-1">Phones expected to launch soon — specs and prices based on leaks and official teasers.</p>
      </div>
      <div className="bg-warning-light border border-warning/30 rounded-lg p-3 mb-6 flex items-center gap-2 text-xs">
        <svg className="w-4 h-4 text-warning shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <span className="text-warning font-medium">Upcoming specs and prices are based on leaks and rumors. They may differ from official releases.</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingPhones.map(phone => (
          <div key={phone.id} className="bg-surface rounded-xl border border-edge hover:border-primary/40 hover:shadow-sm transition-all overflow-hidden">
            <div className="h-48 bg-bg overflow-hidden relative">
              <img src={phone.image} alt={phone.name} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-[10px] font-bold bg-warning text-white px-2 py-0.5 rounded">Coming Soon</span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-muted font-medium">{phone.brand}</p>
              <h3 className="font-display font-bold text-ink text-base">{phone.name}</h3>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted">Expected: <span className="text-ink font-medium">{phone.expectedLaunch}</span></p>
                <p className="text-xs text-primary font-semibold">{phone.expectedPrice}</p>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {phone.specs.map(spec => (
                  <span key={spec} className="text-[10px] bg-bg border border-edge text-muted px-2 py-0.5 rounded">{spec}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
