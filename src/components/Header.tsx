import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { phones } from '../data/phones';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof phones>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      setSearchResults(phones.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)).slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchResults([]);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-base font-medium transition-colors ${isActive ? 'text-primary' : 'text-ink hover:text-primary'}`;

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/phones?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }

  async function handleSignOut() {
    const { error } = await signOut();
    if (!error) navigate('/login');
  }

  const notifications = [
    { id: 1, text: 'Your comment on Pixel 9 Pro received a reply.', time: '2h ago', read: false },
    { id: 2, text: 'New community discussion: Best budget phones 2026.', time: '5h ago', read: false },
    { id: 3, text: 'Price updated: Galaxy S25 Ultra dropped to Rs. 449,999.', time: '1d ago', read: true },
  ];

  return (
    <>
      <header className="bg-surface border-b border-edge sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-14 gap-6 md:h-[72px] md:gap-7">
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <Logo size="sm" />
            </Link>

            {/* Main Nav */}
            <nav className="hidden md:flex items-center gap-5">
              <NavLink to="/" end className={({ isActive }) => `text-base font-medium transition-colors relative pb-0.5 ${isActive ? 'text-primary after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-primary after:rounded-full' : 'text-ink hover:text-primary'}`}>Home</NavLink>
              <NavLink to="/phones" className={navLinkClass}>Phones</NavLink>
              <NavLink to="/finder" className={navLinkClass}>Finder</NavLink>
              <NavLink to="/compare" className={navLinkClass}>Compare</NavLink>
              <NavLink to="/reviews" className={navLinkClass}>Reviews</NavLink>
              <NavLink to="/news" className={navLinkClass}>News</NavLink>
              <NavLink to="/blogs" className={navLinkClass}>Blogs</NavLink>
              <NavLink to="/community" className={navLinkClass}>Community</NavLink>
              <NavLink to="/brands" className={navLinkClass}>Brands</NavLink>
              <NavLink to="/upcoming" className={navLinkClass}>Upcoming</NavLink>
            </nav>

            <div className="flex-1" />

            {/* Search */}
            <div ref={searchRef} className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search phones, brands..."
                    className="w-64 h-8 px-3 text-sm border border-edge rounded-md bg-bg focus:outline-none focus:border-primary"
                  />
                  <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="ml-2 text-muted hover:text-ink">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)} className="p-2 text-muted hover:text-ink transition-colors" aria-label="Search">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              )}
              {searchResults.length > 0 && (
                <div className="absolute top-10 right-0 w-80 bg-surface border border-edge rounded-lg shadow-lg py-1 z-50">
                  {searchResults.map(phone => (
                    <Link
                      key={phone.id}
                      to={`/phones/${phone.slug}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-bg transition-colors"
                    >
                      <img src={phone.image} alt={phone.name} className="w-8 h-10 object-cover rounded bg-bg" />
                      <div>
                        <div className="text-sm font-medium text-ink">{phone.brand} {phone.name}</div>
                        <div className="text-xs text-muted">{phone.priceDisplay}</div>
                      </div>
                    </Link>
                  ))}
                  <div className="border-t border-edge mt-1 pt-1">
                    <button onClick={handleSearchSubmit} className="w-full text-left px-3 py-2 text-xs text-primary hover:bg-bg">
                      See all results for "{searchQuery}" →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 text-muted hover:text-ink transition-colors relative"
                aria-label="Notifications"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-danger rounded-full"></span>
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 w-80 bg-surface border border-edge rounded-lg shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-edge flex items-center justify-between">
                    <span className="text-sm font-display font-semibold text-ink">Notifications</span>
                    <span className="text-xs text-primary cursor-pointer">Mark all read</span>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 border-b border-edge last:border-0 ${!n.read ? 'bg-primary-light' : ''}`}>
                      <p className="text-xs text-ink">{n.text}</p>
                      <p className="text-xs text-muted mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User avatar */}
            <Link to={user ? '/profile' : '/login'} className="hidden sm:flex w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary/10 border border-primary/20 items-center justify-center text-primary hover:bg-primary/20 transition-colors" aria-label={user ? 'Open profile' : 'Sign in'}>
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </Link>
            {!user && <Link to="/register" className="hidden sm:inline text-xs font-medium text-primary hover:underline">Register</Link>}

            {/* Mobile menu button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-muted hover:text-ink">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
            </button>
          </div>
        </div>

        {/* Secondary Nav */}
        <div className="border-t border-edge bg-bg hidden md:block">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-7 h-10">
              <NavLink to="/phones?filter=latest" className="text-sm text-muted hover:text-primary transition-colors">Latest Phones</NavLink>
              <NavLink to="/upcoming" className="text-sm text-muted hover:text-primary transition-colors">Upcoming</NavLink>
              <NavLink to="/phones?filter=popular" className="text-sm text-muted hover:text-primary transition-colors">Popular</NavLink>
              <NavLink to="/brands" className="text-sm text-muted hover:text-primary transition-colors">Brands</NavLink>
              <NavLink to="/compare" className="text-sm text-muted hover:text-primary transition-colors">Compare Phones</NavLink>
              <NavLink to="/finder" className="text-sm text-muted hover:text-primary transition-colors">Phone Finder</NavLink>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-72 bg-surface shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-4 border-b border-edge flex items-center justify-between">
              <Logo size="sm" />
              <button onClick={() => setMobileMenuOpen(false)} className="text-muted">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <nav className="px-4 py-4 flex flex-col gap-1">
              {[['/', 'Home'], ['/phones', 'Phones'], ['/finder', 'Finder'], ['/compare', 'Compare'], ['/reviews', 'Reviews'], ['/news', 'News'], ['/blogs', 'Blogs'], ['/community', 'Community'], ['/brands', 'Brands'], ['/upcoming', 'Upcoming'], ['/ai-summary', 'AI Insights'], [user ? '/profile' : '/login', user ? 'Profile' : 'Login']].map(([to, label]) => (
                <Link key={to} to={to} onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-md text-sm text-ink hover:bg-bg hover:text-primary transition-colors font-medium">{label}</Link>
              ))}
              {user && <button onClick={handleSignOut} className="py-2.5 px-3 rounded-md text-left text-sm text-ink hover:bg-bg hover:text-primary transition-colors font-medium">Logout</button>}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
