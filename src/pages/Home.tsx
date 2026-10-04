import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ── Hardcoded trending phones matching the reference exactly ──────────────────
const TRENDING = [
  {
    slug: 'apple-iphone-18-pro-max', name: 'iPhone 18 Pro Max', brand: 'Apple',
    badge: 'NEW', badgeClass: 'bg-red-500 text-white',
    image: 'https://images.unsplash.com/photo-1735224944268-35c748583704?w=360&h=480&fit=crop&auto=format',
    rating: 4.9, reviews: '2,431', price: '1,299,999',
    s1: '6.9" ProMotion', s2: '12GB RAM', s3: '48MP', s4: '5000mAh',
  },
  {
    slug: 'samsung-galaxy-s25-ultra', name: 'Galaxy S25 Ultra', brand: 'Samsung',
    badge: '5G', badgeClass: 'bg-green-600 text-white',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=360&h=480&fit=crop&auto=format',
    rating: 4.8, reviews: '12,430', price: '429,999',
    s1: '6.9" OLED', s2: '12GB RAM', s3: '200MP', s4: '5000mAh',
  },
  {
    slug: 'google-pixel-9-pro', name: 'Pixel 9 Pro', brand: 'Google',
    badge: 'Popular', badgeClass: 'bg-violet-500 text-white',
    image: 'https://images.unsplash.com/photo-1693822845595-862bacc31cf9?w=360&h=480&fit=crop&auto=format',
    rating: 4.6, reviews: '4,231', price: '359,999',
    s1: '6.3" OLED', s2: '12GB RAM', s3: '50MP', s4: '4700mAh',
  },
  {
    slug: 'samsung-galaxy-s25-plus', name: 'Galaxy S26', brand: 'Samsung',
    badge: 'Upcoming', badgeClass: 'bg-orange-500 text-white',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=360&h=480&fit=crop&auto=format',
    rating: 4.7, reviews: '3,980', price: '399,999',
    s1: '6.8" AMOLED', s2: '12GB RAM', s3: '200MP', s4: '5500mAh',
  },
  {
    slug: 'oneplus-13', name: 'OnePlus 13', brand: 'OnePlus',
    badge: '5G', badgeClass: 'bg-green-600 text-white',
    image: 'https://images.unsplash.com/photo-1634403665481-74948d815f03?w=360&h=480&fit=crop&auto=format',
    rating: 4.7, reviews: '3,980', price: '399,999',
    s1: '6.3" OLED', s2: '12GB RAM', s3: '50MP', s4: '5300mAh',
  },
  {
    slug: 'xiaomi-14t-pro', name: 'Xiaomi 14T Pro', brand: 'Xiaomi',
    badge: 'Best Value', badgeClass: 'bg-[#1677F5] text-white',
    image: 'https://images.unsplash.com/photo-1779094041736-77e8ea0a697d?w=360&h=480&fit=crop&auto=format',
    rating: 4.5, reviews: '2,761', price: '279,999',
    s1: '6.8" OLED', s2: '12GB RAM', s3: '50MP', s4: '5400mAh',
  },
];

// ── Brand logos ───────────────────────────────────────────────────────────────
const BRANDS = [
  { name: 'Apple',    logo: <BrandApple /> },
  { name: 'Samsung',  logo: <BrandSamsung /> },
  { name: 'Google',   logo: <BrandGoogle /> },
  { name: 'Xiaomi',   logo: <BrandXiaomi /> },
  { name: 'OnePlus',  logo: <BrandOnePlus /> },
  { name: 'Oppo',     logo: <BrandOppo /> },
  { name: 'Vivo',     logo: <BrandVivo /> },
  { name: 'Realme',   logo: <BrandRealme /> },
  { name: 'Motorola', logo: <BrandMotorola /> },
  { name: 'Huawei',   logo: <BrandHuawei /> },
];

// ── News content ─────────────────────────────────────────────────────────────
const NEWS = [
  {
    id: 1, headline: 'iPhone 18 series officially revealed with stunning Burgundy finish',
    date: 'Sep 20, 2026', tag: 'Apple',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=320&h=220&fit=crop&auto=format',
    featured: true,
  },
  {
    id: 2, headline: 'Samsung Galaxy S26 Ultra leaks show major design changes',
    date: 'Sep 18, 2026', tag: 'Samsung',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=80&h=60&fit=crop&auto=format',
    featured: false,
  },
  {
    id: 3, headline: 'Google Pixel 10 Pro: AI features take center stage',
    date: 'Sep 16, 2026', tag: 'Google',
    image: 'https://images.unsplash.com/photo-1693822845595-862bacc31cf9?w=80&h=60&fit=crop&auto=format',
    featured: false,
  },
  {
    id: 4, headline: 'OnePlus 13 review: More power, better cameras',
    date: 'Sep 14, 2026', tag: 'OnePlus',
    image: 'https://images.unsplash.com/photo-1634403665481-74948d815f03?w=80&h=60&fit=crop&auto=format',
    featured: false,
  },
];

const REVIEWS_LIST = [
  { name: 'iPhone 18 Pro Max Review', score: '9.2', desc: 'A bold evolution with a stunning new Burgundy finish, powerful A19 chip and improved cameras.', author: 'By Rohan Mehta', date: 'Sep 20, 2026', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=120&h=90&fit=crop&auto=format', featured: true },
  { name: 'Galaxy S25 Ultra Review', score: '8.9', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=60&h=60&fit=crop&auto=format', featured: false },
  { name: 'Pixel 9 Pro Review', score: '8.6', image: 'https://images.unsplash.com/photo-1693822845595-862bacc31cf9?w=60&h=60&fit=crop&auto=format', featured: false },
  { name: 'OnePlus 13 Review', score: '8.4', image: 'https://images.unsplash.com/photo-1634403665481-74948d815f03?w=60&h=60&fit=crop&auto=format', featured: false },
];

const COMMUNITY = [
  { initials: 'TR', color: 'bg-blue-500', name: 'TechSavvyRaj', time: '2 hours ago', question: 'iPhone 18 — worth upgrading from iPhone 16?', replies: 142, comments: 38, tag: 'Apple', tagClass: 'bg-slate-100 text-slate-600' },
  { initials: 'PL', color: 'bg-purple-500', name: 'PhoneLover', time: '5 hours ago', question: 'Best camera phone under 300,000?', replies: 89, comments: 24, tag: 'Budget', tagClass: 'bg-green-100 text-green-700' },
  { initials: 'AF', color: 'bg-orange-500', name: 'AndroidFan', time: '1 day ago', question: 'Galaxy S25 Ultra vs iPhone 18 — which is better?', replies: 67, comments: 31, tag: 'Comparison', tagClass: 'bg-blue-100 text-blue-700' },
];

// ── Star rating ───────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/phones?search=${encodeURIComponent(searchQuery)}`);
  }

  const [finderBrand, setFinderBrand] = useState('');
  const [finderBudget, setFinderBudget] = useState('');
  const [finderRam, setFinderRam] = useState('');
  const [finderUse, setFinderUse] = useState('General');
  const [finderCamera, setFinderCamera] = useState(false);
  const [finderGaming, setFinderGaming] = useState(false);
  const [finderBattery, setFinderBattery] = useState(false);
  const [finder5G, setFinder5G] = useState(false);

  function handleFinder(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (finderBrand) params.set('brand', finderBrand);
    if (finderRam) params.set('minRam', finderRam);
    navigate(`/phones?${params.toString()}`);
  }

  const popularSearches = ['iPhone 18', 'Galaxy S25 Ultra', 'Pixel 10 Pro', 'OnePlus 13', 'Best camera phone'];

  return (
    <div className="min-h-screen bg-[#F7FAFE]">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#E2E8F0] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
          <div className="flex flex-col lg:flex-row gap-0 min-h-[300px]">

            {/* Left: search content */}
            <div className="flex flex-col justify-center py-10 lg:py-0 lg:w-[420px] xl:w-[480px] shrink-0 pr-8 xl:pr-12">
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#64748B] uppercase mb-3">
                Smarter Choices For A Connected Tomorrow
              </p>
              <h1 className="font-display font-bold text-[#0B1735] leading-[1.05] text-4xl xl:text-[46px]">
                Discover. Compare.<br />
                <span className="text-[#1677F5]">Understand.</span>
              </h1>
              <p className="text-sm text-[#64748B] mt-3 mb-5 leading-relaxed max-w-sm">
                Explore smartphone specifications, prices, reviews
                and AI-powered insights — all in one place.
              </p>
              <form onSubmit={handleSearch} className="flex items-center max-w-[400px] border border-[#E2E8F0] rounded-lg overflow-hidden shadow-sm bg-white">
                <svg className="ml-3 w-4 h-4 text-[#94A3B8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search phones, brands, specifications..."
                  className="flex-1 py-2.5 px-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none"
                />
                <button type="submit" className="px-4 py-2.5 bg-[#1677F5] text-white text-sm font-semibold shrink-0 hover:bg-[#0e5fd4] transition-colors">
                  Search
                </button>
              </form>
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <span className="text-[11px] text-[#64748B]">Popular searches:</span>
                {popularSearches.map(q => (
                  <button
                    key={q}
                    onClick={() => navigate(`/phones?search=${encodeURIComponent(q)}`)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-[#E2E8F0] bg-[#F7FAFE] text-[#64748B] hover:border-[#1677F5] hover:text-[#1677F5] transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Center: iPhone 18 showcase */}
            <div className="hidden lg:flex flex-col justify-center flex-1 relative px-8 xl:px-12">
              {/* Subtle gradient bg for center area */}
              <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-transparent via-blue-50/10 to-rose-50/30 pointer-events-none" />
              <div className="relative z-10">
                {/* Apple logo + branding */}
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-[#0B1735]" viewBox="0 0 814 1000" fill="currentColor">
                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.6-154.3-107.9C46.5 720.6 0 609.2 0 502.3c0-193.9 126.4-296.5 250.8-296.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
                  </svg>
                  <span className="text-sm font-semibold text-[#0B1735]">iPhone 18</span>
                </div>
                <h2 className="font-display font-bold text-[#0B1735] text-2xl xl:text-3xl leading-tight mb-1">
                  A Bolder Tomorrow
                </h2>
                <p className="text-sm text-[#0B1735]/80 mb-4 leading-relaxed">
                  Now in stunning<br />
                  <span className="font-semibold text-[#7D1830]">Burgundy.</span> More power.<br />
                  More possibilities.
                </p>
                <Link
                  to="/phones/apple-iphone-18-pro-max"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7D1830] text-white text-sm font-semibold rounded-lg hover:bg-[#6b1428] transition-colors shadow-md"
                >
                  Explore iPhone 18 →
                </Link>
              </div>
            </div>

            {/* Right: Phone image + spec rail */}
            <div className="hidden lg:flex items-stretch relative w-[420px] xl:w-[480px] shrink-0">
              {/* Background gradient (rose/lavender glow) */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 via-purple-50/30 to-blue-50/20" />
              {/* Radial glow behind phone */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 rounded-full bg-rose-300/25 blur-3xl" />
              </div>

              {/* Phone image */}
              <div className="relative z-10 flex-1 flex items-center justify-center py-4">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=340&h=480&fit=crop&auto=format"
                    alt="iPhone 18 Burgundy"
                    className="h-[260px] xl:h-[280px] w-auto object-contain drop-shadow-2xl"
                    style={{ filter: 'sepia(60%) hue-rotate(310deg) saturate(2) brightness(0.65)' }}
                  />
                  {/* Screen overlay showing "18" */}
                  <div className="absolute top-[14%] left-[18%] right-[18%] bottom-[8%] flex items-center justify-center pointer-events-none">
                    <span className="text-white/20 font-display font-black text-5xl select-none">18</span>
                  </div>
                </div>
              </div>

              {/* Spec rail */}
              <div className="relative z-10 flex flex-col justify-center gap-2 py-6 pr-4 w-[130px] xl:w-[150px] shrink-0">
                {[
                  { icon: '⬡', title: 'A19 Pro', sub: 'Chip', color: 'text-blue-500' },
                  { icon: '◎', title: 'Next-Gen', sub: 'Camera', color: 'text-purple-500' },
                  { icon: '◈', title: 'Burgundy', sub: 'Color', color: 'text-rose-600' },
                  { icon: '✦', title: 'Apple', sub: 'Intelligence', color: 'text-blue-400' },
                ].map(f => (
                  <div key={f.title} className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-lg px-2.5 py-2 border border-white/50 shadow-sm">
                    <span className={`text-base leading-none ${f.color}`}>{f.icon}</span>
                    <div>
                      <p className="text-[11px] font-bold text-[#0B1735] leading-none">{f.title}</p>
                      <p className="text-[10px] text-[#64748B] mt-0.5">{f.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature highlights ──────────────────────────────────────── */}
        <div className="border-t border-[#E2E8F0] bg-white">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E2E8F0]">
              {[
                { icon: <svg className="w-4 h-4 text-[#1677F5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>, label: 'Real Specifications', sub: 'Accurate & updated' },
                { icon: <svg className="w-4 h-4 text-[#1677F5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, label: 'Compare Phones', sub: 'Side by side analysis' },
                { icon: <svg className="w-4 h-4 text-[#1677F5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>, label: 'AI Insights', sub: 'Smart recommendations' },
                { icon: <svg className="w-4 h-4 text-[#1677F5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, label: 'Community', sub: 'Real user opinions' },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-3 px-6 py-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EBF3FD] flex items-center justify-center shrink-0">{f.icon}</div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#0F172A]">{f.label}</p>
                    <p className="text-[11px] text-[#64748B]">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 py-6 space-y-7">

        {/* ── BRANDS ───────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-[#0F172A] text-base">Explore by Brand</h2>
            <Link to="/brands" className="text-xs text-[#1677F5] hover:underline">View all brands →</Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-2">
            {BRANDS.map(b => (
              <Link
                key={b.name}
                to={`/phones?brand=${encodeURIComponent(b.name)}`}
                className="bg-white rounded-lg border border-[#E2E8F0] hover:border-[#1677F5]/40 hover:shadow-sm transition-all flex flex-col items-center justify-center gap-1.5 py-3 px-2"
              >
                <div className="h-8 w-full flex items-center justify-center">{b.logo}</div>
                <span className="text-[10px] font-medium text-[#64748B] text-center leading-none">{b.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── TRENDING ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-display font-bold text-[#0F172A] text-base flex items-center gap-1.5">
                🔥 Trending Phones
              </h2>
              <p className="text-[11px] text-[#64748B]">Most viewed this week</p>
            </div>
            <Link to="/phones" className="text-xs text-[#1677F5] hover:underline">View all →</Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {TRENDING.map(phone => (
              <div
                key={phone.slug}
                className="bg-white rounded-xl border border-[#E2E8F0] hover:border-[#1677F5]/30 hover:shadow-md transition-all flex flex-col overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/phones/${phone.slug}`)}
              >
                {/* Image area */}
                <div className="relative bg-[#F7FAFE] pt-2 pb-1 px-3 flex items-center justify-center" style={{ minHeight: 160 }}>
                  <span className={`absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded ${phone.badgeClass}`}>
                    {phone.badge}
                  </span>
                  <button
                    className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full border border-[#E2E8F0] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={e => e.stopPropagation()}
                  >
                    <svg className="w-3 h-3 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </button>
                  <img
                    src={phone.image}
                    alt={phone.name}
                    className="h-32 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Card body */}
                <div className="p-3 flex flex-col flex-1">
                  <p className="text-[10px] text-[#64748B] font-medium">{phone.brand}</p>
                  <h3 className="text-[12px] font-display font-bold text-[#0F172A] mt-0.5 leading-snug">{phone.name}</h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-1.5">
                    <Stars rating={phone.rating} />
                    <span className="text-[10px] text-[#64748B]">{phone.rating} ({phone.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="mt-2">
                    <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Est. Price</p>
                    <p className="text-sm font-bold text-[#0F172A] leading-tight">{phone.price}</p>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 mt-1.5">
                    <span className="text-[9px] text-[#94A3B8]">· {phone.s1}</span>
                    <span className="text-[9px] text-[#94A3B8]">· {phone.s2}</span>
                    <span className="text-[9px] text-[#94A3B8]">· {phone.s3}</span>
                    <span className="text-[9px] text-[#94A3B8]">· {phone.s4}</span>
                  </div>

                  {/* Buttons */}
                  <div className="mt-2 pt-2 border-t border-[#F1F5F9] grid grid-cols-2 gap-1.5" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/phones/${phone.slug}`)}
                      className="py-1.5 bg-[#1677F5] text-white text-[10px] font-semibold rounded-md hover:bg-[#0e5fd4] transition-colors text-center"
                    >
                      View Details
                    </button>
                    <Link
                      to={`/compare?add=${phone.slug}`}
                      className="py-1.5 border border-[#E2E8F0] text-[10px] font-medium text-[#64748B] rounded-md hover:border-[#1677F5] hover:text-[#1677F5] transition-colors text-center"
                    >
                      Compare
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── THREE-PANEL SECTION ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Finder */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-[#EBF3FD] rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#1677F5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <div>
                <h3 className="font-display font-bold text-[#0F172A] text-sm">Find Your Perfect Phone</h3>
                <p className="text-[11px] text-[#64748B]">Use smart filters to get personalized results.</p>
              </div>
            </div>
            <form onSubmit={handleFinder} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wide">Brand</label>
                  <select value={finderBrand} onChange={e => setFinderBrand(e.target.value)} className="mt-1 w-full text-xs border border-[#E2E8F0] rounded-md px-2.5 py-2 bg-[#F7FAFE] text-[#0F172A] focus:outline-none focus:border-[#1677F5]">
                    <option value="">All Brands</option>
                    {['Apple','Samsung','Google','OnePlus','Xiaomi','Oppo','Vivo','Realme','Motorola','Nothing','Huawei'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wide">Budget</label>
                  <select value={finderBudget} onChange={e => setFinderBudget(e.target.value)} className="mt-1 w-full text-xs border border-[#E2E8F0] rounded-md px-2.5 py-2 bg-[#F7FAFE] text-[#0F172A] focus:outline-none focus:border-[#1677F5]">
                    <option value="">Any Budget</option>
                    <option value="50000">Under Rs. 50K</option>
                    <option value="100000">Under Rs. 1L</option>
                    <option value="200000">Under Rs. 2L</option>
                    <option value="500000">Under Rs. 5L</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wide">Minimum RAM</label>
                  <select value={finderRam} onChange={e => setFinderRam(e.target.value)} className="mt-1 w-full text-xs border border-[#E2E8F0] rounded-md px-2.5 py-2 bg-[#F7FAFE] text-[#0F172A] focus:outline-none focus:border-[#1677F5]">
                    <option value="">Any RAM</option>
                    <option value="8">8GB+</option>
                    <option value="12">12GB+</option>
                    <option value="16">16GB+</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wide">Primary Use</label>
                  <select value={finderUse} onChange={e => setFinderUse(e.target.value)} className="mt-1 w-full text-xs border border-[#E2E8F0] rounded-md px-2.5 py-2 bg-[#F7FAFE] text-[#0F172A] focus:outline-none focus:border-[#1677F5]">
                    <option>General</option>
                    <option>Photography</option>
                    <option>Gaming</option>
                    <option>Business</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                {[['Best Camera', finderCamera, setFinderCamera], ['Gaming', finderGaming, setFinderGaming], ['Long Battery', finderBattery, setFinderBattery], ['5G Only', finder5G, setFinder5G]].map(([label, val, setter]) => (
                  <label key={label as string} className="flex items-center gap-1.5 text-xs text-[#64748B] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={val as boolean}
                      onChange={e => (setter as React.Dispatch<React.SetStateAction<boolean>>)(e.target.checked)}
                      className="accent-[#1677F5] w-3.5 h-3.5"
                    />
                    {label as string}
                  </label>
                ))}
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#1677F5] text-white text-sm font-semibold rounded-lg hover:bg-[#0e5fd4] transition-colors mt-1">
                Find Phones →
              </button>
            </form>
          </div>

          {/* AI Assistant */}
          <div className="bg-gradient-to-br from-[#0D1B4B] via-[#0F2A6E] to-[#0D1B4B] rounded-xl p-5 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-bold text-white font-display">SGR AI Assistant</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#1677F5] text-white rounded uppercase tracking-wide">NEW</span>
              </div>
              <p className="text-[11px] text-blue-200/80 mb-4">Your personal smartphone guide.</p>

              {/* AI robot illustration */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-500/20 border border-blue-400/20 flex items-center justify-center">
                    <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none">
                      <rect x="12" y="20" width="40" height="30" rx="8" fill="#1E40AF" opacity="0.8"/>
                      <rect x="20" y="10" width="24" height="14" rx="6" fill="#1D4ED8"/>
                      <circle cx="26" cy="17" r="3" fill="#60A5FA"/>
                      <circle cx="38" cy="17" r="3" fill="#60A5FA"/>
                      <rect x="4" y="28" width="8" height="14" rx="4" fill="#1E40AF" opacity="0.7"/>
                      <rect x="52" y="28" width="8" height="14" rx="4" fill="#1E40AF" opacity="0.7"/>
                      <rect x="20" y="50" width="8" height="10" rx="4" fill="#1E40AF" opacity="0.7"/>
                      <rect x="36" y="50" width="8" height="10" rx="4" fill="#1E40AF" opacity="0.7"/>
                      <rect x="20" y="32" width="24" height="10" rx="3" fill="#3B82F6" opacity="0.5"/>
                      <circle cx="26" cy="37" r="2" fill="#60A5FA"/>
                      <circle cx="32" cy="37" r="2" fill="#34D399"/>
                      <circle cx="38" cy="37" r="2" fill="#F472B6"/>
                      <text x="32" y="62" textAnchor="middle" fill="#60A5FA" fontSize="8" fontWeight="bold">AI</text>
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-[#0D1B4B] animate-pulse" />
                </div>
              </div>

              <div className="space-y-2.5 flex-1">
                {[
                  { icon: '◈', label: 'AI Phone Summary', sub: 'Get simple, clear explanations', color: 'text-blue-400' },
                  { icon: '⚡', label: 'Compare with AI', sub: 'See key differences instantly', color: 'text-cyan-400' },
                  { icon: '◎', label: 'Community Analysis', sub: 'Understand what users really think', color: 'text-green-400' },
                ].map(f => (
                  <div key={f.label} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className={`text-sm ${f.color}`}>{f.icon}</span>
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-white">{f.label}</p>
                      <p className="text-[10px] text-blue-200/70">{f.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/ai-summary" className="mt-4 block w-full py-2.5 bg-white text-[#0D1B4B] text-sm font-bold rounded-lg text-center hover:bg-blue-50 transition-colors">
                Try AI Assistant →
              </Link>
            </div>
          </div>

          {/* Comparisons */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-[#0F172A] text-sm">Popular Comparisons</h3>
              <Link to="/compare" className="text-[11px] text-[#1677F5] hover:underline">View all →</Link>
            </div>
            {/* VS card */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 flex flex-col items-center">
                <img
                  src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=120&h=140&fit=crop&auto=format"
                  alt="iPhone 18"
                  className="h-24 w-auto object-contain"
                  style={{ filter: 'sepia(60%) hue-rotate(310deg) saturate(2) brightness(0.65)' }}
                />
                <p className="text-[11px] font-semibold text-[#0F172A] mt-1 text-center">iPhone 18</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#F7FAFE] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-[#64748B]">VS</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <img
                  src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=120&h=140&fit=crop&auto=format"
                  alt="Galaxy S25 Ultra"
                  className="h-24 w-auto object-contain"
                />
                <p className="text-[11px] font-semibold text-[#0F172A] mt-1 text-center">Galaxy S25 Ultra</p>
              </div>
            </div>
            {/* Specs */}
            <div className="grid grid-cols-2 gap-1 mb-4 text-[10px]">
              {[['6.7" Display', '6.9" Display'], ['12GB RAM', '12GB RAM'], ['48MP Camera', '200MP Camera'], ['5000mAh Battery', '5000mAh Battery']].map(([a, b], i) => (
                <div key={i} className="contents">
                  <div className="flex items-center gap-1 text-[#64748B]">
                    <svg className="w-2.5 h-2.5 text-[#94A3B8]" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3"/></svg>
                    {a}
                  </div>
                  <div className="flex items-center gap-1 text-[#64748B]">
                    <svg className="w-2.5 h-2.5 text-[#1677F5]" fill="currentColor" viewBox="0 0 8 8"><path d="M1 4l2 2 4-4"/></svg>
                    {b}
                  </div>
                </div>
              ))}
            </div>
            <Link to="/compare" className="block w-full py-2.5 bg-[#1677F5] text-white text-sm font-semibold rounded-lg text-center hover:bg-[#0e5fd4] transition-colors">
              Compare Now →
            </Link>
          </div>
        </div>

        {/* ── NEWS + REVIEWS + COMMUNITY ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Latest News */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#EBF3FD] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#1677F5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                </div>
                <h3 className="font-display font-bold text-[#0F172A] text-sm">Latest News</h3>
              </div>
              <Link to="/news" className="text-[11px] text-[#1677F5] hover:underline">View all →</Link>
            </div>
            <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
              {/* Featured */}
              <div className="relative">
                <img src={NEWS[0].image} alt={NEWS[0].headline} className="w-full h-36 object-cover" />
                <span className="absolute bottom-2 left-2 text-[9px] font-bold px-1.5 py-0.5 bg-[#0F172A] text-white rounded">{NEWS[0].tag}</span>
              </div>
              <div className="p-3">
                <h4 className="text-[12px] font-semibold text-[#0F172A] leading-snug">{NEWS[0].headline}</h4>
                <p className="text-[10px] text-[#94A3B8] mt-1">{NEWS[0].date}</p>
              </div>
              <div className="border-t border-[#F1F5F9]">
                {NEWS.slice(1).map(n => (
                  <div key={n.id} className="flex items-center gap-3 px-3 py-2.5 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F7FAFE] transition-colors cursor-pointer">
                    <img src={n.image} alt={n.headline} className="w-10 h-10 object-cover rounded-md shrink-0 bg-[#F1F5F9]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-[#0F172A] leading-snug line-clamp-2">{n.headline}</p>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5">{n.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Latest Reviews */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#EBF3FD] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#1677F5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                </div>
                <h3 className="font-display font-bold text-[#0F172A] text-sm">Latest Reviews</h3>
              </div>
              <Link to="/reviews" className="text-[11px] text-[#1677F5] hover:underline">View all →</Link>
            </div>
            <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
              {/* Featured review */}
              <div className="p-3 border-b border-[#F1F5F9]">
                <div className="flex gap-3">
                  <img
                    src={REVIEWS_LIST[0].image}
                    alt={REVIEWS_LIST[0].name}
                    className="w-20 h-20 object-cover rounded-lg shrink-0 bg-[#F1F5F9]"
                    style={{ filter: 'sepia(60%) hue-rotate(310deg) saturate(2) brightness(0.65)' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm font-bold text-white bg-[#1677F5] rounded px-1.5 py-0.5 leading-none">{REVIEWS_LIST[0].score}/10</span>
                    </div>
                    <h4 className="text-[12px] font-semibold text-[#0F172A] leading-snug">{REVIEWS_LIST[0].name}</h4>
                    <p className="text-[10px] text-[#64748B] mt-1 leading-snug line-clamp-3">{REVIEWS_LIST[0].desc}</p>
                    <p className="text-[10px] text-[#94A3B8] mt-1">{REVIEWS_LIST[0].author} · {REVIEWS_LIST[0].date}</p>
                  </div>
                </div>
              </div>
              {/* Other reviews */}
              {REVIEWS_LIST.slice(1).map(r => (
                <div key={r.name} className="flex items-center gap-3 px-3 py-2.5 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F7FAFE] transition-colors cursor-pointer">
                  <img src={r.image} alt={r.name} className="w-10 h-10 object-cover rounded-md shrink-0 bg-[#F1F5F9]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-[#0F172A]">{r.name}</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#1677F5] shrink-0">{r.score}/10</span>
                </div>
              ))}
            </div>
          </div>

          {/* Community */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#EBF3FD] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#1677F5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <h3 className="font-display font-bold text-[#0F172A] text-sm">Community Discussions</h3>
              </div>
              <Link to="/community" className="text-[11px] text-[#1677F5] hover:underline">View all →</Link>
            </div>
            <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
              {COMMUNITY.map((post, i) => (
                <div key={i} className="p-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F7FAFE] transition-colors cursor-pointer">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${post.color} flex items-center justify-center shrink-0`}>
                      <span className="text-[10px] font-bold text-white">{post.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-[#0F172A]">{post.name}</span>
                        <span className="text-[10px] text-[#94A3B8] shrink-0">{post.time}</span>
                      </div>
                      <p className="text-[11px] text-[#0F172A] mt-1 leading-snug">{post.question}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 text-[10px] text-[#94A3B8]">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            {post.replies}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            {post.comments}
                          </span>
                        </div>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${post.tagClass}`}>{post.tag}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Brand logo components ─────────────────────────────────────────────────────

function BrandApple() {
  return (
    <svg viewBox="0 0 814 1000" className="h-7 w-auto" fill="#000">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.6-154.3-107.9C46.5 720.6 0 609.2 0 502.3c0-193.9 126.4-296.5 250.8-296.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
    </svg>
  );
}

function BrandSamsung() {
  return (
    <svg viewBox="0 0 200 44" className="h-5 w-auto" fill="#1428A0">
      <text x="0" y="36" fontFamily="Arial" fontWeight="700" fontSize="40" letterSpacing="-1">SAMSUNG</text>
    </svg>
  );
}

function BrandGoogle() {
  return (
    <svg viewBox="0 0 46 46" className="h-7 w-7">
      <path fill="#4285F4" d="M39.2 20H23v6h9.1C30.6 30.5 27.2 33 23 33c-5.5 0-10-4.5-10-10s4.5-10 10-10c2.4 0 4.6.9 6.3 2.4l4.2-4.2C30.6 8.7 27 7 23 7 14.2 7 7 14.2 7 23s7.2 16 16 16c9.2 0 15.3-6.5 15.3-15.5 0-1.1-.1-2.2-.1-3.5z"/>
      <path fill="#34A853" d="M7 23c0-2.2.5-4.4 1.3-6.3L4 13c-1.9 3-3 6.4-3 10s1.1 7 3 10l4.3-3.7C7.5 27.4 7 25.3 7 23z"/>
      <path fill="#FBBC04" d="M23 39c-4 0-7.6-1.4-10.4-3.7L8.3 39c3.8 3 8.6 5 14.7 5 5 0 9.5-1.7 13-4.5l-4.2-3.4C29.4 37.8 26.4 39 23 39z"/>
      <path fill="#EA4335" d="M23 7c3.3 0 6.3 1.1 8.7 3l4.2-4.2C32.4 3.2 28 1 23 1 16 1 9.8 4.9 6.6 11L11 14.7C13.7 10.1 18 7 23 7z"/>
    </svg>
  );
}

function BrandXiaomi() {
  return (
    <div className="w-10 h-7 rounded-lg bg-[#FF6900] flex items-center justify-center">
      <span className="text-white font-bold text-sm italic">mi</span>
    </div>
  );
}

function BrandOnePlus() {
  return (
    <span className="text-[#F5010C] font-black text-xl leading-none font-display">1+</span>
  );
}

function BrandOppo() {
  return (
    <svg viewBox="0 0 200 60" className="h-6 w-auto">
      <text x="0" y="48" fontFamily="Arial" fontWeight="700" fontSize="52" fill="#1D1D1F" letterSpacing="-1">OPPO</text>
    </svg>
  );
}

function BrandVivo() {
  return (
    <svg viewBox="0 0 200 60" className="h-6 w-auto">
      <text x="0" y="48" fontFamily="Arial" fontWeight="700" fontSize="52" fill="#415FFF" letterSpacing="-1">vivo</text>
    </svg>
  );
}

function BrandRealme() {
  return (
    <svg viewBox="0 0 240 60" className="h-5 w-auto">
      <text x="0" y="48" fontFamily="Arial" fontWeight="900" fontSize="52" fill="#FFD700" letterSpacing="-1">realme</text>
    </svg>
  );
}

function BrandMotorola() {
  return (
    <svg viewBox="0 0 60 60" className="h-8 w-8">
      <circle cx="30" cy="30" r="28" fill="#E1000F"/>
      <text x="30" y="40" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="28" fill="white">M</text>
    </svg>
  );
}

function BrandNothing() {
  return (
    <span className="text-[#0F172A] font-black text-[11px] tracking-[0.15em] uppercase leading-none">NOTHING</span>
  );
}

function BrandHuawei() {
  return (
    <svg viewBox="0 0 240 60" className="h-5 w-auto">
      <text x="0" y="48" fontFamily="Arial" fontWeight="700" fontSize="44" fill="#CF0A2C" letterSpacing="-1">Huawei</text>
    </svg>
  );
}
