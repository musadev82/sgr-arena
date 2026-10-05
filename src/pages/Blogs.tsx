import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/blogs/BlogCard';
import { blogCategories, type Blog } from '../data/blogs';
import { useAuth } from '../context/AuthContext';
import { fetchBlogsFromSupabase } from '../lib/blogsService';

export default function Blogs() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | string>('All');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    fetchBlogsFromSupabase(user)
      .then((nextBlogs) => {
        if (active) setBlogs(nextBlogs);
      })
      .catch((loadError: Error) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const filteredBlogs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
      const matchesQuery =
        !query ||
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query) ||
        blog.description.toLowerCase().includes(query) ||
        blog.category.toLowerCase().includes(query) ||
        blog.authorName.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [blogs, searchTerm, selectedCategory]);

  const featuredBlog = filteredBlogs[0];
  const cardBlogs = featuredBlog ? filteredBlogs.filter((blog) => blog.id !== featuredBlog.id) : filteredBlogs;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Insights</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink md:text-4xl">Blogs</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
            Share your smartphone experience, reviews, guides, and technology insights with the SGR Arena community.
          </p>
        </div>

        <Link
          to="/blogs/create"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Create Blog
        </Link>
      </div>

      {loading && <div className="rounded-2xl border border-edge bg-surface px-6 py-10 text-center text-sm text-muted">Loading blogs...</div>}
      {!loading && error && <div className="rounded-2xl border border-danger/20 bg-danger/5 px-6 py-10 text-center text-sm text-danger">{error}</div>}

      {!loading && !error && filteredBlogs.length > 0 && featuredBlog && (
        <section className="mb-8 overflow-hidden rounded-3xl border border-edge bg-surface shadow-sm md:flex">
          {featuredBlog.coverImage ? (
            <div className="relative h-72 w-full md:h-auto md:w-[52%]">
              <img src={featuredBlog.coverImage} alt={featuredBlog.title} className="h-full w-full object-cover" />
              <span className="absolute left-4 top-4 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                {featuredBlog.category}
              </span>
            </div>
          ) : null}

          <div className="flex flex-1 flex-col justify-center p-5 md:p-8">
            <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] text-muted md:text-xs">
              <span>{featuredBlog.authorName}</span>
              <span>•</span>
              <span>{new Date(featuredBlog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span>{featuredBlog.readingTime}</span>
            </div>

            <h2 className="font-display text-2xl font-bold leading-tight text-ink md:text-3xl">{featuredBlog.title}</h2>
            <p className="mt-4 text-sm leading-7 text-muted md:text-base">{featuredBlog.excerpt}</p>

            <Link
              to={`/blogs/${featuredBlog.id}`}
              className="mt-6 inline-flex w-fit items-center justify-center rounded-lg border border-primary bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              Read Article
            </Link>
          </div>
        </section>
      )}

      {!loading && !error && <div className="mb-6 rounded-2xl border border-edge bg-surface p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20L16.65 16.65" strokeLinecap="round" />
            </svg>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title, topic, or author"
              className="w-full rounded-lg border border-edge bg-bg py-2.5 pl-10 pr-3 text-sm text-ink outline-none transition focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {blogCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'border border-edge bg-bg text-muted hover:border-primary/40 hover:text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>}

      {!loading && !error && (filteredBlogs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-edge bg-surface px-6 py-10 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">No Blogs Yet</h2>
          <p className="mt-4 max-w-xl mx-auto text-base leading-7 text-muted">
            Share your smartphone experience, review, guide, comparison, or technology insight with the SGR Arena community.
          </p>
          <Link
            to="/blogs/create"
            className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Create Your First Blog
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cardBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ))}
    </div>
  );
}
