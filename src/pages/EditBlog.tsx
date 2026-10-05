import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { blogCategories, type BlogCategory } from '../data/blogs';
import { phones } from '../data/phones';
import { useAuth } from '../context/AuthContext';
import { fetchBlogById, syncBlogImages, updateBlogPost, type BlogImageSelection } from '../lib/blogsService';

interface ImagePreview {
  id: string;
  url: string;
  name: string;
  file?: File;
  storagePath?: string | null;
}

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [existingBlog, setExistingBlog] = useState<Awaited<ReturnType<typeof fetchBlogById>>>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BlogCategory>('Reviews');
  const [excerpt, setExcerpt] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [relatedSmartphoneId, setRelatedSmartphoneId] = useState('');
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    fetchBlogById(id ?? '', user)
      .then((blog) => {
        if (!active) return;
        if (!blog || blog.authorId !== user?.id) {
          setError('Blog not found or you do not have permission to edit it.');
          return;
        }
        setExistingBlog(blog);
        setTitle(blog.title);
        setCategory(blog.category);
        setExcerpt(blog.excerpt);
        setDescription(blog.description);
        setTagsInput(blog.tags.join(', '));
        setRelatedSmartphoneId(blog.relatedSmartphoneId ?? '');
        setImages(blog.images.map((image) => ({
          id: image.id,
          url: image.url,
          name: image.altText || `${blog.title} image`,
          storagePath: image.storagePath,
        })));
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
  }, [id, user]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const nextImages = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));

    setImages((current) => [...current, ...nextImages]);
    event.target.value = '';
  };

  const removeImage = (imageId: string) => {
    setImages((current) => current.filter((image) => image.id !== imageId));
  };

  const handleSubmit = async () => {
    if (!existingBlog || !user) return;

    setIsSubmitting(true);
    setError('');
    try {
      await updateBlogPost(existingBlog.id, {
        title: title.trim() || existingBlog.title,
        category,
        excerpt: excerpt.trim() || existingBlog.excerpt,
        content: description.trim() || existingBlog.description,
        relatedPhoneId: relatedSmartphoneId || null,
      });
      const selectedImages: BlogImageSelection[] = images.map((image) => image);
      await syncBlogImages(existingBlog.id, user.id, selectedImages);
      navigate(`/blogs/${existingBlog.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not save this blog.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-12 text-center text-sm text-muted">Loading blog...</div>;
  }

  if (error || !existingBlog) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Blog not found</h1>
        <p className="mt-3 text-sm text-danger">{error || 'This blog could not be loaded.'}</p>
        <Link to="/blogs" className="mt-4 inline-block text-primary hover:underline">
          Return to blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Edit</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">Edit Blog</h1>
        </div>
        <Link to={`/blogs/${existingBlog.id}`} className="text-sm font-medium text-primary hover:underline">
          View article
        </Link>
      </div>

      <div className="rounded-2xl border border-edge bg-surface p-5 shadow-sm md:p-6">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Blog Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-edge bg-bg px-3 py-3 text-base text-ink outline-none transition focus:border-primary"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">Category</label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as BlogCategory)}
                className="w-full rounded-xl border border-edge bg-bg px-3 py-3 text-base text-ink outline-none transition focus:border-primary"
              >
                {blogCategories.filter((item) => item !== 'All').map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">Tags</label>
              <input
                value={tagsInput}
                onChange={(event) => setTagsInput(event.target.value)}
                className="w-full rounded-xl border border-edge bg-bg px-3 py-3 text-base text-ink outline-none transition focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Related Smartphone (Optional)</label>
            <select
              value={relatedSmartphoneId}
              onChange={(event) => setRelatedSmartphoneId(event.target.value)}
              className="w-full rounded-xl border border-edge bg-bg px-3 py-3 text-base text-ink outline-none transition focus:border-primary"
            >
              <option value="">None</option>
              {phones.map((phone) => (
                <option key={phone.id} value={phone.id}>
                  {phone.brand} {phone.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Short Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              rows={4}
              className="w-full rounded-xl border border-edge bg-bg px-3 py-3 text-base text-ink outline-none transition focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Full Description / Article</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={18}
              className="w-full rounded-xl border border-edge bg-bg px-3 py-3 text-base leading-7 text-ink outline-none transition focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Blog Images</label>
            <div className="rounded-xl border border-dashed border-edge bg-bg p-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="w-full cursor-pointer text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {images.map((image) => (
                  <div key={image.id} className="relative overflow-hidden rounded-xl border border-edge bg-bg">
                    <img src={image.url} alt={image.name} className="h-32 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute right-2 top-2 rounded-full bg-surface/90 px-2 py-1 text-[10px] font-semibold text-ink"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              to={`/blogs/${existingBlog.id}`}
              className="rounded-lg border border-edge bg-bg px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
            >
              Cancel
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-primary/20 bg-primary-light p-3 text-sm text-primary">
          Editing as {user?.user_metadata?.full_name || user?.email || 'SGR Arena User'}.
        </div>
      </div>
    </div>
  );
}
