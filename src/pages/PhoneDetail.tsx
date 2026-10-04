import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { phones } from '../data/phones';
import { StarRating } from '../components/PhoneCard';
import { useAuth } from '../context/AuthContext';

interface Comment {
  id: number;
  author: string;
  avatar: string;
  text: string;
  date: string;
  likes: number;
}

const TABS = ['Overview', 'Specifications', 'Prices', 'Reviews', 'Community', 'AI Summary'];

export default function PhoneDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const phone = phones.find(p => p.slug === slug);
  const [activeTab, setActiveTab] = useState('Overview');
  const [mainImage, setMainImage] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const { user } = useAuth();

  if (!phone) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-muted">Phone not found.</p>
        <Link to="/phones" className="text-primary hover:underline text-sm mt-2 inline-block">← Back to Phones</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-muted mb-4">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/phones" className="hover:text-primary">Phones</Link>
        <span>/</span>
        <Link to={`/brands/${phone.brand.toLowerCase()}`} className="hover:text-primary">{phone.brand}</Link>
        <span>/</span>
        <span className="text-ink">{phone.name}</span>
      </nav>

      {/* Top section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        {/* Images */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-xl border border-edge overflow-hidden mb-3 aspect-[4/5]">
            <img src={phone.images[mainImage].url} alt={`${phone.name} - ${phone.images[mainImage].label}`} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2">
            {phone.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(i)}
                className={`flex-1 aspect-square rounded-lg border-2 overflow-hidden transition-colors ${mainImage === i ? 'border-primary' : 'border-edge hover:border-primary/40'}`}
              >
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-2">
            {phone.images.map((img, i) => (
              <span key={i} className={`text-[10px] ${mainImage === i ? 'text-primary font-medium' : 'text-muted'}`}>{img.label}</span>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted font-medium">{phone.brand}</p>
              <h1 className="font-display text-2xl font-bold text-ink mt-0.5">{phone.brand} {phone.name}</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <StarRating rating={phone.rating} />
                <span className="text-sm font-semibold text-ink">{phone.rating}</span>
                <span className="text-xs text-muted">({phone.reviewCount.toLocaleString()} reviews)</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFavorited(!favorited)}
                className={`p-2 rounded-lg border transition-colors ${favorited ? 'bg-red-50 border-red-200 text-red-500' : 'border-edge text-muted hover:border-primary hover:text-primary'}`}
                aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg className="w-4 h-4" fill={favorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-1">Est. Price</p>
            <span className="text-3xl font-bold font-display text-ink">{phone.priceDisplay.replace('Rs. ', '')}</span>
          </div>
          <p className="text-xs text-muted mt-1">Released: {phone.releaseDate}</p>

          <div className="flex gap-2 mt-4">
            <Link to={`/compare?phones=${phone.slug}`} className="flex-1 text-center py-2.5 border border-primary text-primary text-sm font-semibold rounded-lg hover:bg-primary-light transition-colors">
              Compare
            </Link>
            <Link to="/finder" className="flex-1 text-center py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors">
              Find Best Price
            </Link>
          </div>

          {/* Quick specs */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { icon: '📱', label: 'Display', value: phone.displayShort },
              { icon: '🔋', label: 'Battery', value: phone.batteryShort },
              { icon: '📷', label: 'Camera', value: phone.cameraShort },
              { icon: '💾', label: 'RAM', value: phone.ramShort },
              { icon: '💿', label: 'Storage', value: phone.storageShort },
              { icon: '📶', label: '5G', value: phone.fiveG ? 'Yes' : 'No' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-bg rounded-lg p-2.5 text-center border border-edge">
                <p className="text-base">{icon}</p>
                <p className="text-[10px] text-muted mt-0.5">{label}</p>
                <p className="text-xs font-semibold text-ink">{value}</p>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div className="flex gap-1.5 flex-wrap mt-4">
            {phone.category.map(cat => (
              <span key={cat} className="text-[11px] bg-primary-light text-primary px-2 py-0.5 rounded font-medium">{cat}</span>
            ))}
            <span className="text-[11px] bg-bg text-muted border border-edge px-2 py-0.5 rounded">{phone.color}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-edge mb-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-ink'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'Overview' && <OverviewTab phone={phone} />}
      {activeTab === 'Specifications' && <SpecsTab phone={phone} />}
      {activeTab === 'Prices' && <PricesTab phone={phone} />}
      {activeTab === 'Reviews' && <ReviewsTab phone={phone} />}
      {activeTab === 'Community' && <CommunityTab phone={phone} />}
      {activeTab === 'AI Summary' && <AISummaryTab phone={phone} />}

      {/* Comments section — always visible */}
      <CommentsSection phone={phone} isLoggedIn={Boolean(user)} navigate={navigate} />
    </div>
  );
}

function OverviewTab({ phone }: { phone: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-5">
        <div>
          <h2 className="font-display font-semibold text-ink mb-2">Summary</h2>
          <p className="text-sm text-muted leading-relaxed">{phone.summary}</p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-ink mb-2">Highlights</h2>
          <ul className="space-y-1.5">
            {phone.highlights.map((h: string) => (
              <li key={h} className="flex items-start gap-2 text-sm text-ink">
                <span className="text-primary mt-0.5">✓</span>{h}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-success-light rounded-lg p-4 border border-success/20">
          <h3 className="font-display font-semibold text-success mb-2 text-sm">Pros</h3>
          <ul className="space-y-1.5">
            {phone.pros.map((p: string) => (
              <li key={p} className="text-xs text-ink flex items-start gap-2"><span className="text-success">+</span>{p}</li>
            ))}
          </ul>
        </div>
        <div className="bg-bg rounded-lg p-4 border border-edge">
          <h3 className="font-display font-semibold text-muted mb-2 text-sm">Considerations</h3>
          <ul className="space-y-1.5">
            {phone.cons.map((c: string) => (
              <li key={c} className="text-xs text-ink flex items-start gap-2"><span className="text-warning">−</span>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SpecsTab({ phone }: { phone: any }) {
  const s = phone.specs;
  const sections = [
    { title: 'NETWORK', rows: [['Technology', s.network.technology], ['2G Bands', s.network.bands2g], ['3G Bands', s.network.bands3g], ['4G Bands', s.network.bands4g], ['5G Bands', s.network.bands5g], ['Speed', s.network.speed]] },
    { title: 'LAUNCH', rows: [['Announced', s.launch.announced], ['Status', s.launch.status], ['Release Date', s.launch.releaseDate]] },
    { title: 'BODY', rows: [['Dimensions', s.body.dimensions], ['Weight', s.body.weight], ['Build', s.body.build], ['SIM', s.body.sim], ['Water Resistance', s.body.waterResistance]] },
    { title: 'DISPLAY', rows: [['Type', s.display.type], ['Size', s.display.size], ['Resolution', s.display.resolution], ['Refresh Rate', s.display.refreshRate], ['Protection', s.display.protection], ['Brightness', s.display.brightness]] },
    { title: 'PLATFORM', rows: [['OS', s.platform.os], ['Chipset', s.platform.chipset], ['CPU', s.platform.cpu], ['GPU', s.platform.gpu]] },
    { title: 'MEMORY', rows: [['RAM', s.memory.ram], ['Internal Storage', s.memory.storage], ['Card Slot', s.memory.cardSlot]] },
    { title: 'MAIN CAMERA', rows: [['Wide', s.mainCamera.wide], ['Ultra-wide', s.mainCamera.ultrawide], ['Telephoto', s.mainCamera.telephoto], ['Video', s.mainCamera.video], ['Features', s.mainCamera.features]] },
    { title: 'SELFIE CAMERA', rows: [['Sensor', s.selfieCamera.sensor], ['Video', s.selfieCamera.video]] },
    { title: 'SOUND', rows: [['Loudspeaker', s.sound.loudspeaker], ['3.5mm Jack', s.sound.audio35mm]] },
    { title: 'CONNECTIVITY', rows: [['Wi-Fi', s.connectivity.wifi], ['Bluetooth', s.connectivity.bluetooth], ['GPS', s.connectivity.gps], ['NFC', s.connectivity.nfc], ['USB', s.connectivity.usb]] },
    { title: 'BATTERY', rows: [['Capacity', s.battery.capacity], ['Type', s.battery.type], ['Wired Charging', s.battery.chargingWired], ['Wireless Charging', s.battery.chargingWireless]] },
    { title: 'FEATURES', rows: s.features.map((f: string) => ['', f]) },
  ];

  return (
    <div className="space-y-0 bg-surface rounded-lg border border-edge overflow-hidden">
      {sections.map(section => (
        <div key={section.title}>
          <div className="px-4 py-2 bg-bg border-b border-edge">
            <h3 className="text-[11px] font-bold text-muted tracking-widest">{section.title}</h3>
          </div>
          {section.rows.map(([label, value]: [string, string], i: number) => (
            <div key={i} className="flex border-b border-edge last:border-0">
              {label && <div className="w-36 shrink-0 px-4 py-2.5 text-xs text-muted font-medium bg-bg/50">{label}</div>}
              <div className={`px-4 py-2.5 text-xs text-ink flex-1 ${!label ? 'before:content-["•"] before:mr-2 before:text-muted' : ''}`}>{value}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function PricesTab({ phone }: { phone: any }) {
  const fmt = (n: number) => n.toLocaleString('en-PK');
  const prices = [
    { source: 'Daraz', price: fmt(phone.price), updated: '2 days ago', official: true },
    { source: 'Samsung Official Store', price: fmt(phone.price), updated: '1 day ago', official: true },
    { source: 'Local Retailer (Karachi)', price: fmt(phone.price + 5000), updated: '3 days ago', official: false },
    { source: 'Telemart', price: fmt(phone.price - 2000), updated: '1 day ago', official: false },
    { source: 'PriceOye', price: fmt(phone.price + 1000), updated: 'Today', official: false },
  ];
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted">Estimated prices from various retailers. Prices may change. SGR Arena is not affiliated with these retailers.</p>
      {prices.map((r, i) => (
        <div key={i} className="bg-surface rounded-lg border border-edge p-4 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-display font-semibold text-ink">{r.source}</p>
              {r.official && <span className="text-[10px] bg-primary-light text-primary px-1.5 py-0.5 rounded font-medium">Official</span>}
            </div>
            <p className="text-xs text-muted mt-0.5">Updated: {r.updated}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wide">Est. Price</p>
            <p className="text-base font-bold text-ink">{r.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewsTab({ phone }: { phone: any }) {
  const reviews = [
    { author: 'Rohan M.', rating: 5, date: 'August 2026', title: 'Best smartphone I\'ve ever owned', content: `The ${phone.name} is simply exceptional. The camera system is in a class of its own, performance is flawless, and the display quality is breathtaking. Well worth every rupee.`, verified: true },
    { author: 'Priya S.', rating: 4, date: 'July 2026', title: 'Great device, some reservations', content: `Phenomenal camera and display. My only complaint is the size — it\'s quite large for one-handed use. Battery easily lasts a full day though. Would recommend for power users.`, verified: true },
    { author: 'Aditya K.', rating: 5, date: 'June 2026', title: 'Camera performance is unreal', content: `Switched from an older flagship and the difference is night and day. Night mode photos look incredible. The AI processing makes every shot better automatically.`, verified: false },
    { author: 'Nisha P.', rating: 4, date: 'June 2026', title: 'Solid upgrade, worth it', content: `Coming from two generations back, this feels like a massive leap. The charging speed is particularly impressive — goes from 0 to 100% surprisingly fast.`, verified: true },
  ];
  return (
    <div className="space-y-4">
      <div className="bg-surface rounded-lg border border-edge p-4 flex items-center gap-8">
        <div className="text-center">
          <p className="text-4xl font-bold font-display text-ink">{phone.rating}</p>
          <StarRating rating={phone.rating} />
          <p className="text-xs text-muted mt-1">{phone.reviewCount.toLocaleString()} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map(star => {
            const pct = star === 5 ? 68 : star === 4 ? 22 : star === 3 ? 6 : star === 2 ? 3 : 1;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-muted w-4 text-right">{star}</span>
                <div className="flex-1 h-1.5 bg-edge rounded-full overflow-hidden">
                  <div className="h-full bg-warning rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-muted w-8">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
      {reviews.map((r, i) => (
        <div key={i} className="bg-surface rounded-lg border border-edge p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-display font-semibold text-ink">{r.author}</span>
                {r.verified && <span className="text-[10px] bg-success-light text-success px-1.5 py-0.5 rounded font-medium">Verified Purchase</span>}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={r.rating} size="xs" />
                <span className="text-xs text-muted">{r.date}</span>
              </div>
            </div>
          </div>
          <h4 className="text-sm font-display font-semibold text-ink mt-2">{r.title}</h4>
          <p className="text-xs text-muted leading-relaxed mt-1">{r.content}</p>
        </div>
      ))}
    </div>
  );
}

function CommunityTab({ phone }: { phone: any }) {
  const [posts, setPosts] = useState([
    { id: 1, author: 'TechGeek2026', title: `Is ${phone.name} worth the upgrade?`, content: `Been using the previous model for 18 months. The improvements in camera and AI features are tempting me. Anyone else made the switch?`, likes: 45, liked: false, comments: 12, date: '3 days ago' },
    { id: 2, author: 'BudgetSavvy', title: `Best deals for ${phone.name} in Pakistan?`, content: `Looking for the best official price. Has anyone found a reliable source with good warranty?`, likes: 28, liked: false, comments: 8, date: '1 week ago' },
    { id: 3, author: 'CameraEnthusiast', title: 'Camera comparison vs competitors', content: `Shot the same scene with ${phone.name} and a competitor. Results are surprisingly close in daylight, but ${phone.name} wins clearly at night.`, likes: 87, liked: false, comments: 31, date: '2 weeks ago' },
  ]);

  function toggleLike(id: number) {
    setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">{posts.length} discussions about {phone.name}</p>
        <Link to="/community" className="text-xs text-primary hover:underline">Join community →</Link>
      </div>
      {posts.map(post => (
        <div key={post.id} className="bg-surface rounded-lg border border-edge p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">{post.author[0]}</div>
            <span className="text-xs font-medium text-ink">{post.author}</span>
            <span className="text-xs text-muted">{post.date}</span>
          </div>
          <h4 className="text-sm font-display font-semibold text-ink">{post.title}</h4>
          <p className="text-xs text-muted leading-relaxed mt-1">{post.content}</p>
          <div className="flex items-center gap-4 mt-3">
            <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1 text-xs transition-colors ${post.liked ? 'text-primary' : 'text-muted hover:text-primary'}`}>
              <svg className="w-3.5 h-3.5" fill={post.liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
              {post.likes}
            </button>
            <button className="flex items-center gap-1 text-xs text-muted hover:text-primary transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              {post.comments}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentsSection({ phone, isLoggedIn, navigate }: { phone: any; isLoggedIn: boolean; navigate: (to: string) => void }) {
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, author: 'Priya S.', avatar: 'PS', text: `Just got the ${phone.name} last week — absolutely love it! The display is stunning and battery easily lasts all day. Highly recommend.`, date: '2 days ago', likes: 24 },
    { id: 2, author: 'Rohan M.', avatar: 'RM', text: 'Camera performance in low light is incredible. Tried it against my previous phone and the difference is night and day. Worth every penny.', date: '4 days ago', likes: 18 },
    { id: 3, author: 'Aditya K.', avatar: 'AK', text: `Been using the ${phone.name} for a month now. Performance never stutters, even with heavy multitasking. Very happy with this purchase.`, date: '1 week ago', likes: 31 },
  ]);
  const [text, setText] = useState('');
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [focusedInput, setFocusedInput] = useState(false);

  function submit() {
    if (!text.trim()) return;
    setComments(prev => [
      { id: Date.now(), author: 'You', avatar: 'YO', text: text.trim(), date: 'Just now', likes: 0 },
      ...prev,
    ]);
    setText('');
  }

  function toggleLike(id: number) {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
    setComments(prev => prev.map(c => c.id === id ? { ...c, likes: likedIds.has(id) ? c.likes - 1 : c.likes + 1 } : c));
  }

  return (
    <div className="mt-10 pt-8 border-t border-edge">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display font-bold text-ink text-lg">
          Comments <span className="text-muted font-normal text-sm ml-1">({comments.length})</span>
        </h2>
      </div>

      {/* Comment input */}
      <div className="mb-7">
        {isLoggedIn ? (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold font-display flex items-center justify-center shrink-0">YO</div>
            <div className="flex-1">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                onFocus={() => setFocusedInput(true)}
                placeholder={`Share your thoughts on the ${phone.name}...`}
                rows={focusedInput ? 3 : 2}
                className="w-full text-sm border border-edge rounded-xl px-4 py-3 bg-bg focus:outline-none focus:border-primary resize-none transition-all placeholder:text-muted"
              />
              {focusedInput && (
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => { setFocusedInput(false); setText(''); }} className="px-4 py-1.5 text-xs text-muted border border-edge rounded-lg hover:border-primary hover:text-primary transition-colors">Cancel</button>
                  <button onClick={submit} disabled={!text.trim()} className="px-4 py-1.5 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Post Comment</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-bg rounded-xl border border-edge px-5 py-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-full bg-edge flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Sign in to leave a comment</p>
                <p className="text-xs text-muted">Join the conversation and share your experience with this phone.</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => navigate('/login')} className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-colors">
                Sign In
              </button>
              <button onClick={() => navigate('/register')} className="px-4 py-2 border border-edge text-xs font-medium text-ink rounded-lg hover:border-primary hover:text-primary transition-colors">
                Register
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Comment list */}
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-[10px] font-bold font-display flex items-center justify-center shrink-0 mt-0.5">{comment.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-display font-semibold text-ink">{comment.author}</span>
                <span className="text-xs text-muted">{comment.date}</span>
              </div>
              <p className="text-sm text-ink/80 leading-relaxed">{comment.text}</p>
              <button
                onClick={() => toggleLike(comment.id)}
                className={`flex items-center gap-1.5 mt-2 text-xs transition-colors ${likedIds.has(comment.id) ? 'text-primary' : 'text-muted hover:text-primary'}`}
              >
                <svg className="w-3.5 h-3.5" fill={likedIds.has(comment.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                {comment.likes + (likedIds.has(comment.id) ? 1 : 0)} Helpful
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AISummaryTab({ phone }: { phone: any }) {
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  function generate() {
    setLoading(true);
    setTimeout(() => { setLoading(false); setGenerated(true); }, 2000);
  }

  if (!generated) {
    return (
      <div className="bg-surface rounded-xl border border-edge p-8 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        </div>
        <h3 className="font-display font-bold text-ink">AI Phone Summary</h3>
        <p className="text-sm text-muted mt-2 leading-relaxed">Get a simple, easy-to-understand breakdown of the {phone.brand} {phone.name}'s specifications and who it's best for.</p>
        {loading ? (
          <div className="mt-4">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-muted">Analyzing smartphone specifications...</p>
          </div>
        ) : (
          <button onClick={generate} className="mt-4 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors">
            Generate AI Summary
          </button>
        )}
        <p className="text-[11px] text-muted mt-3">AI Prototype Insight — for informational purposes only</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-2 p-3 bg-primary-light rounded-lg border border-primary/20">
        <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        <span className="text-xs font-semibold text-primary">AI Prototype Insight</span>
        <span className="text-xs text-primary/70 ml-auto">Not a verified manufacturer statement</span>
      </div>
      <div>
        <h3 className="font-display font-bold text-ink mb-2">What is the {phone.name}?</h3>
        <p className="text-sm text-muted leading-relaxed">{phone.summary} In everyday terms, this means you get a phone that handles everything from heavy gaming to professional photography without breaking a sweat. The display is bright enough for outdoor use, and the battery should comfortably get most users through a full day.</p>
      </div>
      <div>
        <h3 className="font-display font-bold text-ink mb-3">Best For</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[['📷', 'Photography'], ['🎮', 'Gaming'], ['🔋', 'Battery Life'], ['💼', 'Everyday Use']].map(([emoji, label]) => (
            <div key={label} className="bg-bg rounded-lg p-3 text-center border border-edge">
              <p className="text-2xl mb-1">{emoji}</p>
              <p className="text-xs font-medium text-ink">{label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-success-light rounded-lg p-4 border border-success/20">
          <h4 className="font-display font-semibold text-success text-sm mb-2">Strengths</h4>
          <ul className="space-y-1.5">
            {phone.pros.map((p: string) => <li key={p} className="text-xs text-ink flex gap-2"><span className="text-success">✓</span>{p}</li>)}
          </ul>
        </div>
        <div className="bg-bg rounded-lg p-4 border border-edge">
          <h4 className="font-display font-semibold text-muted text-sm mb-2">Things to Consider</h4>
          <ul className="space-y-1.5">
            {phone.cons.map((c: string) => <li key={c} className="text-xs text-ink flex gap-2"><span className="text-warning">!</span>{c}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
