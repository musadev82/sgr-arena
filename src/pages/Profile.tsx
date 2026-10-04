import { useState } from 'react';
import { Link } from 'react-router-dom';
import { phones } from '../data/phones';
import PhoneCard from '../components/PhoneCard';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('Favorites');
  const [editing, setEditing] = useState(false);
  const accountName = user?.user_metadata?.full_name || 'SGR Arena User';
  const [profile, setProfile] = useState({ name: accountName, email: user?.email || '', bio: user?.user_metadata?.bio || 'No bio added yet.' });
  const [draft, setDraft] = useState(profile);

  const favoritePhones = [];
  const savedComparisons: Array<{ id: number; phones: typeof phones }> = [];
  const myPosts: Array<{ id: number; title: string; likes: number; comments: number; date: string }> = [];

  function saveProfile() {
    setProfile(draft);
    setEditing(false);
  }

  async function handleLogout() {
    const { error } = await signOut();
    if (!error) window.location.assign('/login');
  }

  const tabs = ['Favorites', 'Comparisons', 'Posts', 'Reviews'];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Profile header */}
      <div className="bg-surface rounded-xl border border-edge p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold font-display flex items-center justify-center shrink-0">
            {profile.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-ink mb-1 block">Name</label>
                  <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} className="w-full text-sm border border-edge rounded-md px-3 py-2 bg-bg focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink mb-1 block">Email</label>
                  <input value={draft.email} onChange={e => setDraft(d => ({ ...d, email: e.target.value }))} className="w-full text-sm border border-edge rounded-md px-3 py-2 bg-bg focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink mb-1 block">Bio</label>
                  <textarea value={draft.bio} onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))} rows={2} className="w-full text-sm border border-edge rounded-md px-3 py-2 bg-bg focus:outline-none focus:border-primary resize-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveProfile} className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-colors">Save</button>
                  <button onClick={() => { setEditing(false); setDraft(profile); }} className="px-4 py-2 border border-edge text-xs text-muted rounded-lg hover:border-primary hover:text-primary transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-display text-xl font-bold text-ink">{profile.name}</h1>
                <p className="text-sm text-muted mt-0.5">{profile.email}</p>
                <p className="text-sm text-ink mt-1">{profile.bio}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted">
                  <span><span className="font-bold text-ink">0</span> Reviews</span>
                  <span><span className="font-bold text-ink">0</span> Posts</span>
                  <span><span className="font-bold text-ink">0</span> Favorites</span>
                </div>
              </>
            )}
          </div>
          {!editing && (
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(true)} className="px-3 py-2 border border-edge text-xs text-muted rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Edit Profile
              </button>
              <button onClick={handleLogout} className="px-3 py-2 border border-edge text-xs text-muted rounded-lg hover:border-danger hover:text-danger transition-colors">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-edge mb-6">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-ink'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Favorites' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-ink">Favorite Phones</h2>
            <Link to="/phones" className="text-xs text-primary hover:underline">Browse phones →</Link>
          </div>
          {favoritePhones.length === 0 ? (
            <div className="bg-surface rounded-lg border border-edge p-12 text-center">
              <p className="text-muted text-sm">No favorite phones yet.</p>
              <Link to="/phones" className="text-xs text-primary hover:underline mt-2 inline-block">Browse phones →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {favoritePhones.map(phone => <PhoneCard key={phone.id} phone={phone} />)}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Comparisons' && (
        <div>
          <h2 className="font-display font-semibold text-ink mb-4">Saved Comparisons</h2>
          <div className="space-y-3">
            {savedComparisons.map(comp => (
              <Link key={comp.id} to={`/compare?phones=${comp.phones.map(p => p.slug).join(',')}`} className="flex items-center gap-3 bg-surface rounded-lg border border-edge p-4 hover:border-primary/40 transition-all block">
                <div className="flex items-center gap-3">
                  {comp.phones.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-2">
                      {i > 0 && <span className="text-xs text-muted font-bold">VS</span>}
                      <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded bg-bg" />
                      <div>
                        <p className="text-xs font-semibold text-ink">{p.brand} {p.name}</p>
                        <p className="text-xs text-primary">{p.priceDisplay}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <span className="ml-auto text-xs text-primary">View →</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Posts' && (
        <div>
          <h2 className="font-display font-semibold text-ink mb-4">My Community Posts</h2>
          <div className="space-y-3">
            {myPosts.map(post => (
              <Link key={post.id} to="/community" className="bg-surface rounded-lg border border-edge p-4 block hover:border-primary/40 transition-all">
                <h3 className="text-sm font-display font-semibold text-ink">{post.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                  <span className="ml-auto">{post.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Reviews' && (
        <div>
          <h2 className="font-display font-semibold text-ink mb-4">My Reviews</h2>
          <div className="bg-surface rounded-lg border border-edge p-12 text-center">
            <p className="text-muted text-sm">No reviews written yet.</p>
            <Link to="/phones" className="text-xs text-primary hover:underline mt-2 inline-block">Start reviewing phones →</Link>
          </div>
        </div>
      )}
    </div>
  );
}
