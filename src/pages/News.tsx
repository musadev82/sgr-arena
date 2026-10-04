import { useState } from 'react';
import { Link } from 'react-router-dom';
import { newsArticles } from '../data/phones';

const CATEGORIES = ['All', 'Smartphones', 'Apple', 'Samsung', 'Android', 'AI', 'Gaming', 'Industry'];

const extraArticles = [
  { id: 'n7', title: 'Snapdragon 8 Elite 2 Announced: What to Expect', category: 'Android', date: 'August 25, 2026', image: 'https://images.unsplash.com/photo-1649932542396-0a7838cd0596?w=600&h=400&fit=crop&auto=format', summary: 'Qualcomm has officially announced its next-gen mobile processor. Here\'s what flagship phones launching next year will look like under the hood.', author: 'Vikram Singh', readTime: '5 min', featured: false },
  { id: 'n8', title: 'Gaming Smartphones in 2026: Is There Still a Market?', category: 'Gaming', date: 'August 20, 2026', image: 'https://images.unsplash.com/photo-1621208586877-be0c9bc8a7c5?w=600&h=400&fit=crop&auto=format', summary: 'Dedicated gaming phones are struggling to justify their existence as regular flagships now offer comparable performance. We examine the state of mobile gaming hardware.', author: 'Karan Joshi', readTime: '6 min', featured: false },
  { id: 'n9', title: 'AI Camera Features: Marketing vs Reality', category: 'AI', date: 'August 15, 2026', image: 'https://images.unsplash.com/photo-1617696992381-16b65f34b3b1?w=600&h=400&fit=crop&auto=format', summary: 'Every phone claims AI-enhanced photography. We tested 8 flagships to see which AI features actually improve your photos versus which are just buzzwords.', author: 'Priya Sharma', readTime: '9 min', featured: false },
  { id: 'n10', title: 'Apple iPhone 17 Rumor Roundup: Everything We Know', category: 'Apple', date: 'August 10, 2026', image: 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=600&h=400&fit=crop&auto=format', summary: 'The iPhone 17 lineup is expected this September. Leaks point to an ultra-thin design, upgraded cameras, and a new chip that could redefine mobile performance.', author: 'Ananya Roy', readTime: '7 min', featured: false },
];

const allArticles = [...newsArticles, ...extraArticles];

export default function News() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? allArticles : allArticles.filter(a => a.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">News & Articles</h1>
        <p className="text-sm text-muted mt-1">Latest smartphone news, industry insights, and technology updates.</p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`text-xs px-4 py-1.5 rounded-full whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-primary text-white' : 'border border-edge text-muted bg-surface hover:border-primary hover:text-primary'}`}>
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted">No articles in this category yet.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Featured */}
          <div className="lg:col-span-3">
            <Link to="#" className="block bg-surface rounded-xl border border-edge overflow-hidden hover:border-primary/40 hover:shadow-md transition-all">
              <div className="aspect-video bg-bg overflow-hidden">
                <img src={filtered[0].image} alt={filtered[0].title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold bg-primary-light text-primary px-2 py-0.5 rounded uppercase tracking-wide">{filtered[0].category}</span>
                  <span className="text-xs text-muted">{filtered[0].date}</span>
                  <span className="text-xs text-muted">· {filtered[0].readTime} read</span>
                </div>
                <h2 className="font-display text-xl font-bold text-ink leading-snug">{filtered[0].title}</h2>
                <p className="text-sm text-muted mt-2 leading-relaxed">{filtered[0].summary}</p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">{filtered[0].author[0]}</div>
                  <span className="text-xs text-muted">By {filtered[0].author}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="font-display font-semibold text-sm text-muted uppercase tracking-wide">More Stories</h3>
            {filtered.slice(1, 5).map(article => (
              <Link key={article.id} to="#" className="flex gap-3 bg-surface rounded-lg border border-edge p-3 hover:border-primary/40 hover:shadow-sm transition-all">
                <div className="w-20 h-16 bg-bg rounded-md overflow-hidden shrink-0">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-primary">{article.category}</span>
                    <span className="text-[10px] text-muted">{article.readTime}</span>
                  </div>
                  <h4 className="text-xs font-display font-semibold text-ink leading-snug mt-0.5 line-clamp-2">{article.title}</h4>
                  <p className="text-[11px] text-muted mt-1">{article.date}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Grid of remaining */}
          <div className="lg:col-span-5">
            <h3 className="font-display font-semibold text-sm text-muted uppercase tracking-wide mb-4">All Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.slice(5).map(article => (
                <Link key={article.id} to="#" className="bg-surface rounded-lg border border-edge overflow-hidden hover:border-primary/40 hover:shadow-sm transition-all block">
                  <div className="h-36 bg-bg overflow-hidden">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-primary">{article.category}</span>
                      <span className="text-[10px] text-muted">{article.date}</span>
                    </div>
                    <h3 className="font-display font-semibold text-ink text-sm leading-snug line-clamp-2">{article.title}</h3>
                    <p className="text-[11px] text-muted mt-1.5 line-clamp-2">{article.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
