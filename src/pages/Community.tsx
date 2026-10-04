import { useState } from 'react';
import { communityPosts } from '../data/phones';

const SECTIONS = ['Trending', 'Latest', 'Phone Reviews', 'Questions'];
const TOPICS = ['All', 'Samsung', 'Apple', 'Android', 'Camera', 'Battery', 'Gaming', 'Price'];

type Post = typeof communityPosts[0] & { commentOpen?: boolean; commentText?: string };

export default function Community() {
  const [activeSection, setActiveSection] = useState('Trending');
  const [activeTopic, setActiveTopic] = useState('All');
  const [posts, setPosts] = useState<Post[]>(communityPosts.map(p => ({ ...p, commentOpen: false, commentText: '' })));
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', topic: 'Samsung' });

  const filtered = activeTopic === 'All' ? posts : posts.filter(p => p.topic === activeTopic);

  const toggleLike = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };
  const toggleSave = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
  };
  const toggleComment = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, commentOpen: !p.commentOpen } : p));
  };

  function submitPost() {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    const post: Post = {
      id: `c${Date.now()}`,
      author: 'You',
      avatar: 'YO',
      date: 'Just now',
      title: newPost.title,
      content: newPost.content,
      likes: 0,
      comments: 0,
      saved: false,
      liked: false,
      topic: newPost.topic,
      commentOpen: false,
      commentText: '',
    };
    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', topic: 'Samsung' });
    setNewPostOpen(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Community</h1>
          <p className="text-sm text-muted mt-1">Join discussions, share experiences, and ask questions.</p>
        </div>
        <button onClick={() => setNewPostOpen(true)} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors">
          + New Post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content */}
        <div className="lg:col-span-3">
          {/* Section tabs */}
          <div className="flex gap-1 mb-4 border-b border-edge overflow-x-auto">
            {SECTIONS.map(s => (
              <button key={s} onClick={() => setActiveSection(s)} className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${activeSection === s ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-ink'}`}>
                {s}
              </button>
            ))}
          </div>

          {/* Topic filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {TOPICS.map(t => (
              <button key={t} onClick={() => setActiveTopic(t)} className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors ${activeTopic === t ? 'bg-primary text-white' : 'border border-edge text-muted hover:border-primary hover:text-primary'}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-3">
            {filtered.map(post => (
              <div key={post.id} className="bg-surface rounded-lg border border-edge p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-display font-semibold text-ink">{post.author}</span>
                      <span className="text-xs text-muted">{post.date}</span>
                      <span className="text-[10px] bg-bg border border-edge text-muted px-2 py-0.5 rounded-full">{post.topic}</span>
                    </div>
                    <h3 className="text-sm font-display font-semibold text-ink mt-1.5">{post.title}</h3>
                    <p className="text-xs text-muted leading-relaxed mt-1">{post.content}</p>

                    <div className="flex items-center gap-4 mt-3">
                      <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 text-xs transition-colors ${post.liked ? 'text-primary' : 'text-muted hover:text-primary'}`}>
                        <svg className="w-3.5 h-3.5" fill={post.liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                        {post.likes}
                      </button>
                      <button onClick={() => toggleComment(post.id)} className={`flex items-center gap-1.5 text-xs transition-colors ${post.commentOpen ? 'text-primary' : 'text-muted hover:text-primary'}`}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        {post.comments} Reply
                      </button>
                      <button onClick={() => toggleSave(post.id)} className={`flex items-center gap-1.5 text-xs transition-colors ml-auto ${post.saved ? 'text-primary' : 'text-muted hover:text-primary'}`}>
                        <svg className="w-3.5 h-3.5" fill={post.saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                        {post.saved ? 'Saved' : 'Save'}
                      </button>
                    </div>

                    {post.commentOpen && (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          className="flex-1 text-xs border border-edge rounded-md px-3 py-2 bg-bg focus:outline-none focus:border-primary"
                          onKeyDown={e => { if (e.key === 'Enter') toggleComment(post.id); }}
                        />
                        <button onClick={() => toggleComment(post.id)} className="px-3 py-2 text-xs bg-primary text-white rounded-md hover:bg-primary-dark">Reply</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-surface rounded-lg border border-edge p-4">
            <h3 className="font-display font-semibold text-sm text-ink mb-3">Community Stats</h3>
            <div className="space-y-2">
              {[['Total Members', '12,481'], ['Posts Today', '243'], ['Active Now', '89'], ['Total Discussions', '48,920']].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-muted">{label}</span>
                  <span className="text-xs font-bold text-ink">{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-surface rounded-lg border border-edge p-4">
            <h3 className="font-display font-semibold text-sm text-ink mb-3">Trending Topics</h3>
            <div className="flex flex-wrap gap-1.5">
              {['Samsung', 'iPhone 17', 'Camera', 'Battery', '5G', 'Budget', 'AI', 'Gaming'].map(tag => (
                <button key={tag} onClick={() => setActiveTopic(tag === 'iPhone 17' ? 'Apple' : tag)} className="text-[11px] px-2.5 py-1 rounded-full bg-bg border border-edge text-muted hover:border-primary hover:text-primary transition-colors">
                  #{tag}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-surface rounded-lg border border-edge p-4">
            <h3 className="font-display font-semibold text-sm text-ink mb-3">Top Contributors</h3>
            <div className="space-y-2.5">
              {[['TechSavvyRaj', 'TR', 342], ['PixelPerfect99', 'PP', 289], ['BudgetPhoneHunter', 'BH', 221], ['OnePlusAddict', 'OA', 198]].map(([name, avatar, posts]) => (
                <div key={name as string} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">{avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-ink truncate">{name}</p>
                    <p className="text-[10px] text-muted">{posts} posts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New post modal */}
      {newPostOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setNewPostOpen(false)}>
          <div className="bg-surface rounded-xl border border-edge p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-ink">New Post</h3>
              <button onClick={() => setNewPostOpen(false)} className="text-muted hover:text-ink">×</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-ink mb-1 block">Topic</label>
                <select value={newPost.topic} onChange={e => setNewPost(p => ({ ...p, topic: e.target.value }))} className="w-full text-sm border border-edge rounded-md px-3 py-2 bg-bg focus:outline-none focus:border-primary">
                  {['Samsung', 'Apple', 'Android', 'Camera', 'Battery', 'Gaming', 'Price', 'General'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-ink mb-1 block">Title</label>
                <input value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} placeholder="What's your discussion about?" className="w-full text-sm border border-edge rounded-md px-3 py-2 bg-bg focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-medium text-ink mb-1 block">Content</label>
                <textarea value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} placeholder="Share your thoughts..." rows={4} className="w-full text-sm border border-edge rounded-md px-3 py-2 bg-bg focus:outline-none focus:border-primary resize-none" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setNewPostOpen(false)} className="flex-1 py-2 border border-edge text-sm text-muted rounded-lg hover:border-primary hover:text-primary transition-colors">Cancel</button>
                <button onClick={submitPost} className="flex-1 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors">Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
