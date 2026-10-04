import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(''); }
  }

  return (
    <footer className="bg-surface border-t border-edge mt-12">
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Logo size="md" />
            <p className="text-[11px] text-muted mt-1 mb-3 leading-none font-medium">Summarized Gadget Review</p>
            <p className="text-xs text-muted leading-relaxed">Your trusted source for smartphone specifications, reviews, comparisons and AI-powered insights.</p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-4">
              {[
                { label: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { label: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { label: 'Instagram', path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0122 7.5v9A5.5 5.5 0 0116.5 22h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2z' },
                { label: 'YouTube', path: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
                { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
              ].map(s => (
                <a key={s.label} href="#" aria-label={s.label} className="w-7 h-7 rounded-md bg-bg border border-edge flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-display font-bold text-ink mb-3 uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-2">
              {[['Home', '/'], ['Phones', '/phones'], ['Finder', '/finder'], ['Compare', '/compare'], ['Reviews', '/reviews'], ['News', '/news'], ['Community', '/community'], ['Brands', '/brands'], ['Upcoming', '/upcoming']].map(([label, to]) => (
                <li key={label}><Link to={to} className="text-xs text-muted hover:text-primary transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* AI Features */}
          <div>
            <h4 className="text-xs font-display font-bold text-ink mb-3 uppercase tracking-wide">AI Features</h4>
            <ul className="space-y-2">
              {[['AI Phone Summary', '/ai-summary'], ['AI Comparison', '/ai-community'], ['Community Analysis', '/ai-community'], ['Smart Recommendations', '/finder']].map(([label, to]) => (
                <li key={label}><Link to={to} className="text-xs text-muted hover:text-primary transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-display font-bold text-ink mb-3 uppercase tracking-wide">Support</h4>
            <ul className="space-y-2">
              {[['About Us', '/'], ['Contact', '/'], ['Privacy Policy', '/'], ['Terms of Service', '/'], ['Feedback', '/'], ['Help Center', '/']].map(([label, to]) => (
                <li key={label}><Link to={to} className="text-xs text-muted hover:text-primary transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h4 className="text-xs font-display font-bold text-ink mb-1 uppercase tracking-wide">Subscribe to Updates</h4>
            <p className="text-[11px] text-muted mb-3">Get the latest phone news and reviews.</p>
            {subscribed ? (
              <div className="bg-success-light rounded-lg p-3 border border-success/20">
                <p className="text-xs font-semibold text-success">✓ Subscribed!</p>
                <p className="text-[11px] text-muted mt-0.5">You'll receive the latest updates.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full text-xs border border-edge rounded-lg px-3 py-2.5 bg-bg focus:outline-none focus:border-primary"
                  required
                />
                <button type="submit" className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-edge pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted">© 2026 SGR Arena. All rights reserved.</p>
          <p className="text-xs text-muted">Summarized Gadget Review</p>
        </div>
      </div>
    </footer>
  );
}
