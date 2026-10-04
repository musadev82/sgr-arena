import { useState } from 'react';
import { Link } from 'react-router-dom';
import { phones } from '../data/phones';
import { StarRating } from '../components/PhoneCard';

const CATEGORIES = ['All', 'Flagship', 'Mid-range', 'Budget', 'Gaming', 'Camera'];
const REVIEW_CATEGORIES = ['Flagship', 'Flagship', 'Flagship', 'Flagship', 'Flagship', 'Flagship', 'Mid-range', 'Mid-range'];

function getReviewCategories(phone: typeof phones[number]) {
  const categories = new Set(phone.category);
  const reviewCategories: string[] = [];

  for (const category of ['Flagship', 'Mid-range', 'Budget', 'Gaming']) {
    if (categories.has(category)) reviewCategories.push(category);
  }
  if (categories.has('Camera') || categories.has('Photography')) reviewCategories.push('Camera');

  return reviewCategories;
}

const reviews = phones.slice(0, 8).map((phone, i) => ({
  ...phone,
  reviewTitle: `${phone.brand} ${phone.name} Review`,
  reviewSummary: phone.summary,
  scores: {
    performance: [9.2, 9.8, 9.0, 9.1, 9.2, 8.8, 8.2, 8.5][i],
    camera: [9.5, 9.4, 9.8, 8.8, 9.6, 8.5, 7.8, 8.2][i],
    display: [9.6, 9.7, 9.3, 9.5, 9.4, 9.2, 8.8, 8.9][i],
    battery: [8.8, 8.5, 8.7, 9.4, 9.0, 8.6, 9.0, 9.2][i],
    design: [9.4, 9.6, 9.0, 9.0, 9.2, 9.0, 8.4, 8.6][i],
  },
  reviewer: ['Rohan Mehta', 'Priya Sharma', 'Aditya Kumar', 'Nisha Patel', 'Vikram Singh', 'Ananya Roy', 'Karan Joshi', 'Divya Nair'][i],
  reviewDate: ['Sep 1, 2026', 'Aug 24, 2026', 'Aug 15, 2026', 'Aug 5, 2026', 'Jul 28, 2026', 'Jul 15, 2026', 'Jul 10, 2026', 'Jun 30, 2026'][i],
  category: REVIEW_CATEGORIES[i] || phone.category[0] || 'Uncategorized',
  reviewCategories: Array.from(new Set([REVIEW_CATEGORIES[i], ...getReviewCategories(phone)].filter(Boolean))),
}));

export default function Reviews() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? reviews : reviews.filter(r => r.reviewCategories.includes(activeCategory));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Phone Reviews</h1>
        <p className="text-sm text-muted mt-1">Expert reviews with detailed scoring and real-world testing.</p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`text-xs px-4 py-1.5 rounded-full whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-primary text-white' : 'border border-edge text-muted bg-surface hover:border-primary hover:text-primary'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Featured review */}
      {filtered.length > 0 ? <div className="bg-surface rounded-xl border border-edge overflow-hidden mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-2 bg-bg">
            <img src={filtered[0]?.image} alt={filtered[0]?.name} className="w-full h-56 md:h-full object-cover" />
          </div>
          <div className="md:col-span-3 p-6">
            <span className="text-[11px] font-semibold bg-primary-light text-primary px-2 py-0.5 rounded">Featured Review</span>
            <h2 className="font-display text-xl font-bold text-ink mt-2">{filtered[0]?.reviewTitle}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <StarRating rating={filtered[0]?.rating || 0} />
              <span className="text-sm font-bold text-ink">{filtered[0]?.rating}/5</span>
            </div>
            <p className="text-sm text-muted mt-3 leading-relaxed line-clamp-3">{filtered[0]?.reviewSummary}</p>
            {/* Score bars */}
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {filtered[0] && Object.entries(filtered[0].scores).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted w-20 capitalize">{key}</span>
                  <div className="flex-1 h-1 bg-edge rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${val * 10}%` }} />
                  </div>
                  <span className="text-[10px] font-semibold text-ink">{val}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-muted">By {filtered[0]?.reviewer} · {filtered[0]?.reviewDate}</div>
              <Link to={`/phones/${filtered[0]?.slug}`} className="text-xs font-semibold text-primary hover:underline">Read Full Review →</Link>
            </div>
          </div>
        </div>
      </div> : (
        <div className="bg-surface rounded-xl border border-edge p-10 text-center mb-6">
          <p className="text-sm font-medium text-ink">No reviews available in this category.</p>
          <p className="text-xs text-muted mt-1">Try selecting another review category.</p>
        </div>
      )}

      {/* Review grid */}
      {filtered.length > 1 && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.slice(1).map(review => (
          <div key={review.id} className="bg-surface rounded-lg border border-edge overflow-hidden hover:border-primary/40 hover:shadow-sm transition-all">
            <div className="h-36 bg-bg overflow-hidden">
              <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-semibold bg-bg text-muted px-2 py-0.5 rounded border border-edge">{review.category}</span>
              </div>
              <h3 className="font-display font-bold text-ink text-sm leading-snug">{review.reviewTitle}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <StarRating rating={review.rating} size="xs" />
                <span className="text-xs font-bold text-ink">{review.rating}</span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1">
                {Object.entries(review.scores).slice(0, 3).map(([key, val]) => (
                  <div key={key} className="text-center bg-bg rounded p-1">
                    <p className="text-[10px] text-muted capitalize">{key}</p>
                    <p className="text-xs font-bold text-ink">{val}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-[11px] text-muted">{review.reviewer}</p>
                <Link to={`/phones/${review.slug}`} className="text-xs text-primary hover:underline font-medium">Read Review →</Link>
              </div>
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
}
