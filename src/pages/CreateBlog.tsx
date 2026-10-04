import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogCategories, estimateReadingTime, mockCurrentUser, type Blog, type BlogCategory, upsertBlog } from '../data/blogs';
import { phones } from '../data/phones';

interface ImagePreview {
  id: string;
  url: string;
  name: string;
}

const createSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `blog-${Date.now()}`;

export default function CreateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BlogCategory>('Reviews');
  const [excerpt, setExcerpt] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [relatedSmartphoneId, setRelatedSmartphoneId] = useState('');
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [aiMessage, setAiMessage] = useState('');

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const nextImages = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setImages((current) => [...current, ...nextImages]);
    event.target.value = '';
  };

  const removeImage = (id: string) => {
    setImages((current) => current.filter((image) => image.id !== id));
  };

  const handleAiAction = (action: 'Improve with AI' | 'Simplify' | 'Expand Description') => {
    setAiMessage(`${action}: AI assistance will be connected during the backend integration phase.`);
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedExcerpt = excerpt.trim() || trimmedDescription.slice(0, 160) + (trimmedDescription.length > 160 ? '...' : '');

    if (!trimmedTitle || !trimmedDescription) {
      setAiMessage('Please add a blog title and article content before publishing.');
      return;
    }

    const newBlog: Blog = {
      id: createSlug(trimmedTitle),
      authorId: mockCurrentUser.id,
      authorName: mockCurrentUser.name,
      title: trimmedTitle,
      category,
      excerpt: trimmedExcerpt,
      description: trimmedDescription,
      images: images.map((image) => image.url),
      coverImage: images[0]?.url ?? '',
      relatedSmartphoneId: relatedSmartphoneId || null,
      tags: tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
      comments: [],
      readingTime: estimateReadingTime(trimmedDescription),
    };

    upsertBlog(newBlog);
    navigate(`/blogs/${newBlog.id}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Create</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">Create Blog</h1>
        </div>
        <Link to="/blogs" className="text-sm font-medium text-primary hover:underline">
          ← Back to Blogs
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="rounded-2xl border border-edge bg-surface p-5 shadow-sm md:p-6">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">Blog Title</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter your blog title"
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
                  placeholder="battery, camera, setup, opinion"
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
              <label className="mb-2 block text-sm font-medium text-ink">Short Description / Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                rows={4}
                placeholder="Write a short summary of your article."
                className="w-full rounded-xl border border-edge bg-bg px-3 py-3 text-base text-ink outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">Full Article / Description</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={18}
                placeholder="Write your detailed smartphone blog here. Share your experience, comparison, guide, opinion, or hands-on review in full detail."
                className="w-full rounded-xl border border-edge bg-bg px-3 py-3 text-base leading-7 text-ink outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">Add Images</label>
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
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                Publish Blog
              </button>
              <Link
                to="/blogs"
                className="rounded-lg border border-edge bg-surface px-4 py-2.5 text-sm font-semibold text-muted transition hover:border-danger hover:text-danger"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-edge bg-surface p-5 shadow-sm md:p-6">
          <h2 className="font-display text-xl font-bold text-ink">AI Description Assistant</h2>
          <p className="mt-2 text-sm text-muted">AI assistance will be connected during the backend integration phase.</p>

          <div className="mt-5 space-y-3">
            {['Improve with AI', 'Expand Description', 'Simplify'].map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => handleAiAction(action as 'Improve with AI' | 'Simplify' | 'Expand Description')}
                className="w-full rounded-xl border border-edge bg-bg px-3 py-2.5 text-left text-sm font-medium text-ink transition hover:border-primary hover:text-primary"
              >
                {action}
              </button>
            ))}
          </div>

          {aiMessage && (
            <div className="mt-5 rounded-xl border border-primary/20 bg-primary-light p-3 text-sm text-primary">
              {aiMessage}
            </div>
          )}

          <div className="mt-5 rounded-xl border border-dashed border-edge bg-bg p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Current author</p>
            <div className="mt-3 flex items-center gap-3">
              <img src={mockCurrentUser.avatar} alt={mockCurrentUser.name} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-ink">{mockCurrentUser.name}</p>
                <p className="text-xs text-muted">Mock authenticated editor</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
