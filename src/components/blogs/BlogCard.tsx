import { Link } from 'react-router-dom';
import { formatBlogDate, type Blog } from '../../data/blogs';

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-edge bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <Link to={`/blogs/${blog.id}`} className="block">
        {blog.coverImage ? (
          <div className="relative h-48 overflow-hidden bg-bg">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary shadow-sm backdrop-blur-sm">
              {blog.category}
            </span>
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center bg-bg px-4 text-center text-sm font-medium text-muted">
            Community story
          </div>
        )}

        <div className="p-4 md:p-5">
          <div className="mb-3 flex items-center justify-between gap-2 text-[11px] text-muted">
            <span>{blog.authorName}</span>
            <span>{formatBlogDate(blog.createdAt)}</span>
          </div>

          <h3 className="font-display text-lg font-bold leading-snug text-ink md:text-xl">
            {blog.title}
          </h3>

          <p className="mt-3 text-sm leading-6 text-muted">{blog.excerpt}</p>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-edge pt-3">
            <div className="flex gap-3 text-[11px] text-muted">
              <span>{blog.readingTime}</span>
              <span>•</span>
              <span>{blog.category}</span>
            </div>
            <span className="text-sm font-semibold text-primary">Read Article</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
