import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BlogComments from '../components/blogs/BlogComments';
import { deleteBlog, formatBlogDate, getBlogById, mockCurrentUser, type Blog } from '../data/blogs';
import { phones } from '../data/phones';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(getBlogById(id ?? ''));

  const isOwner = blog?.authorId === mockCurrentUser.id;

  const handleAddComment = (text: string) => {
    if (!blog) return;

    const newComment = {
      commentId: `comment-${Date.now()}`,
      blogId: blog.id,
      userId: mockCurrentUser.id,
      userName: mockCurrentUser.name,
      commentText: text,
      createdAt: new Date().toISOString(),
      avatar: mockCurrentUser.avatar,
    };

    setBlog({
      ...blog,
      comments: [...blog.comments, newComment],
    });
  };

  const handleDelete = () => {
    if (!blog || !window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    deleteBlog(blog.id);
    navigate('/blogs');
  };

  if (!blog) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Blog not found</h1>
        <Link to="/blogs" className="mt-4 inline-block text-primary hover:underline">
          Return to blogs
        </Link>
      </div>
    );
  }

  const relatedPhone = blog.relatedSmartphoneId ? phones.find((phone) => phone.id === blog.relatedSmartphoneId) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/blogs" className="hover:text-primary">Blogs</Link>
        <span>/</span>
        <span className="text-ink">{blog.title}</span>
      </div>

      <article className="mx-auto max-w-4xl">
        <div className="mb-4 inline-flex rounded-full bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          {blog.category}
        </div>

        <h1 className="font-display text-3xl font-bold leading-tight text-ink md:text-5xl">{blog.title}</h1>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span>{blog.authorName}</span>
          <span>•</span>
          <span>{formatBlogDate(blog.createdAt)}</span>
          <span>•</span>
          <span>{blog.readingTime}</span>
        </div>

        {blog.coverImage ? (
          <img src={blog.coverImage} alt={blog.title} className="mt-7 h-[260px] w-full rounded-2xl object-cover md:h-[420px]" />
        ) : (
          <div className="mt-7 flex h-[220px] items-center justify-center rounded-2xl border border-dashed border-edge bg-bg text-sm text-muted md:h-[320px]">
            No cover image added yet
          </div>
        )}

        {relatedPhone && (
          <div className="mt-6 rounded-xl border border-edge bg-bg px-4 py-3 text-sm text-muted">
            Related smartphone: <span className="font-semibold text-ink">{relatedPhone.brand} {relatedPhone.name}</span>
          </div>
        )}

        <div className="mt-8 space-y-6 text-base leading-8 text-muted md:text-lg">
          <p>{blog.description}</p>
        </div>

        {blog.images.length > 1 && (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {blog.images.slice(1).map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`${blog.title} gallery ${index + 1}`}
                className="h-64 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        )}

        {blog.tags.length > 0 && (
          <div className="mt-10">
            <h3 className="font-display text-xl font-bold text-ink">Tags</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-edge bg-bg px-3 py-1.5 text-xs font-medium text-muted">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-edge bg-surface p-5 md:p-6">
          <h3 className="font-display text-xl font-bold text-ink">AI Comment Insights</h3>
          <p className="mt-2 text-sm text-muted">AI comment analysis will be available after backend integration.</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {['Common Topics', 'Positive Points', 'Negative Points', 'Sentiment', 'Overall Community Opinion'].map((label) => (
              <div key={label} className="rounded-xl border border-dashed border-edge bg-bg p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
                <p className="mt-2 text-sm text-ink">Waiting for backend analysis</p>
              </div>
            ))}
          </div>
        </div>

        <BlogComments comments={blog.comments} onAddComment={handleAddComment} currentUserName={mockCurrentUser.name} />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Link to="/blogs" className="text-sm font-medium text-primary hover:underline">← Back to all blogs</Link>

          {isOwner && (
            <div className="flex items-center gap-2">
              <Link to={`/blogs/${blog.id}/edit`} className="rounded-lg border border-edge bg-bg px-3.5 py-2 text-sm font-medium text-ink hover:border-primary hover:text-primary">
                Edit Blog
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg border border-danger/20 bg-danger/5 px-3.5 py-2 text-sm font-medium text-danger hover:bg-danger hover:text-white"
              >
                Delete Blog
              </button>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
