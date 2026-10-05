import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatBlogDate, type BlogComment } from '../../data/blogs';

interface BlogCommentsProps {
  comments: BlogComment[];
  onAddComment: (text: string) => Promise<void> | void;
  currentUserName: string;
  isAuthenticated: boolean;
}

export default function BlogComments({ comments, onAddComment, currentUserName, isAuthenticated }: BlogCommentsProps) {
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!commentText.trim()) {
      setError('Please write a comment before posting.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onAddComment(commentText.trim());
      setCommentText('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10 rounded-2xl border border-edge bg-surface p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold text-ink">Comments</h3>
          <p className="mt-1 text-sm text-muted">{comments.length} comment{comments.length === 1 ? '' : 's'}</p>
        </div>
      </div>

      {comments.length === 0 ? (
        <p className="rounded-xl border border-dashed border-edge bg-bg p-4 text-sm text-muted">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.commentId} className="flex gap-3 border-b border-edge pb-4 last:border-b-0 last:pb-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-bold text-primary">
                {comment.avatar ? (
                  <img src={comment.avatar} alt={comment.userName} className="h-full w-full object-cover" />
                ) : (
                  comment.userName.charAt(0).toUpperCase()
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-ink">{comment.userName}</span>
                  <span className="text-xs text-muted">{formatBlogDate(comment.createdAt)}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{comment.commentText}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isAuthenticated ? (
        <div className="mt-6 border-t border-edge pt-5 text-sm text-muted">
          <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link> or{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">create an account</Link> to post a comment.
        </div>
      ) : <form onSubmit={handleSubmit} className="mt-6 border-t border-edge pt-5">
        <label htmlFor="comment" className="mb-2 block text-sm font-medium text-ink">
          Write a comment...
        </label>

        <textarea
          id="comment"
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          rows={5}
          placeholder="Share your thoughts on this article..."
          className="w-full rounded-xl border border-edge bg-bg px-3 py-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        />

        {error && <p className="mt-2 text-sm text-danger">{error}</p>}

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs text-muted">Posting as {currentUserName}</span>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>}
    </div>
  );
}
