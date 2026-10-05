import type { User } from '@supabase/supabase-js';
import type { Blog, BlogComment, BlogImage, BlogCategory } from '../data/blogs';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

import { estimateReadingTime } from '../data/blogs';

interface BlogPostRow {
  id: string;
  author_id: string;
  title: string;
  category: string;
  excerpt: string | null;
  content: string;
  related_phone_id: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

interface BlogImageRow {
  id: string;
  blog_id: string;
  image_url: string;
  storage_path: string | null;
  alt_text: string | null;
  display_order: number;
  created_at: string;
}

interface BlogCommentRow {
  id: string;
  blog_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface BlogInput {
  title: string;
  category: BlogCategory;
  excerpt: string | null;
  content: string;
  relatedPhoneId: string | null;
}

export interface BlogImageSelection {
  id: string;
  url: string;
  name: string;
  file?: File;
  storagePath?: string | null;
}

function requireClient() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.');
  }

  return getSupabaseClient();
}

function userLabel(user: User | null | undefined, authorId: string): string {
  if (user?.id === authorId) {
    return user.user_metadata?.full_name || user.email || 'SGR Arena User';
  }

  return 'SGR Arena User';
}

function mapImages(rows: BlogImageRow[]): BlogImage[] {
  return [...rows]
    .sort((left, right) => left.display_order - right.display_order)
    .map((row) => ({
      id: row.id,
      url: row.image_url,
      storagePath: row.storage_path,
      altText: row.alt_text,
      displayOrder: row.display_order,
    }));
}

function mapComments(rows: BlogCommentRow[], user?: User | null): BlogComment[] {
  return [...rows]
    .sort((left, right) => Date.parse(right.created_at) - Date.parse(left.created_at))
    .map((row) => ({
      commentId: row.id,
      blogId: row.blog_id,
      authorId: row.author_id,
      userName: userLabel(user, row.author_id),
      commentText: row.content,
      createdAt: row.created_at,
      isOwn: user?.id === row.author_id,
    }));
}

function mapBlog(row: BlogPostRow, images: BlogImage[], comments: BlogComment[], user?: User | null): Blog {
  return {
    id: row.id,
    authorId: row.author_id,
    authorName: userLabel(user, row.author_id),
    title: row.title,
    category: row.category as BlogCategory,
    excerpt: row.excerpt || row.content.slice(0, 160),
    description: row.content,
    images,
    coverImage: images[0]?.url ?? '',
    relatedSmartphoneId: row.related_phone_id,
    tags: [],
    createdAt: row.created_at,
    comments,
    readingTime: estimateReadingTime(row.content),
  };
}

async function fetchImages(blogIds: string[]): Promise<BlogImageRow[]> {
  if (blogIds.length === 0) return [];

  const { data, error } = await requireClient().from('blog_images').select('*').in('blog_id', blogIds).order('display_order');
  if (error) throw new Error(`Could not load blog images: ${error.message}`);
  return (data ?? []) as BlogImageRow[];
}

async function fetchComments(blogId: string): Promise<BlogCommentRow[]> {
  const { data, error } = await requireClient().from('blog_comments').select('*').eq('blog_id', blogId).order('created_at', { ascending: false });
  if (error) throw new Error(`Could not load blog comments: ${error.message}`);
  return (data ?? []) as BlogCommentRow[];
}

export async function fetchBlogsFromSupabase(user?: User | null): Promise<Blog[]> {
  const { data, error } = await requireClient().from('blog_posts').select('*').eq('status', 'published').order('created_at', { ascending: false });
  if (error) throw new Error(`Could not load blogs: ${error.message}`);

  const posts = (data ?? []) as BlogPostRow[];
  const images = await fetchImages(posts.map((post) => post.id));
  return posts.map((post) => mapBlog(post, mapImages(images.filter((image) => image.blog_id === post.id)), [], user));
}

export async function fetchBlogById(blogId: string, user?: User | null): Promise<Blog | null> {
  const { data, error } = await requireClient().from('blog_posts').select('*').eq('id', blogId).eq('status', 'published').maybeSingle();
  if (error) throw new Error(`Could not load blog: ${error.message}`);
  if (!data) return null;

  const row = data as BlogPostRow;
  const [imageRows, commentRows] = await Promise.all([fetchImages([blogId]), fetchComments(blogId)]);
  return mapBlog(row, mapImages(imageRows), mapComments(commentRows, user), user);
}

async function uploadImages(userId: string, blogId: string, selections: BlogImageSelection[], startOrder = 0) {
  const client = requireClient();
  const uploadedPaths: string[] = [];
  const records: Array<Omit<BlogImageRow, 'id' | 'created_at'>> = [];

  try {
    for (const [index, selection] of selections.entries()) {
      if (!selection.file) continue;

      const safeName = selection.file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
      const path = `${userId}/${blogId}/${crypto.randomUUID()}-${safeName}`;
      const { error } = await client.storage.from('blog-images').upload(path, selection.file, {
        contentType: selection.file.type,
        upsert: false,
      });
      if (error) throw new Error(`Could not upload ${selection.file.name}: ${error.message}`);

      uploadedPaths.push(path);
      const { data } = client.storage.from('blog-images').getPublicUrl(path);
      records.push({
        blog_id: blogId,
        image_url: data.publicUrl,
        storage_path: path,
        alt_text: selection.name,
        display_order: startOrder + index,
      });
    }

    return { records, uploadedPaths };
  } catch (error) {
    const originalError = error instanceof Error ? error : new Error('Blog image upload failed.');
    if (uploadedPaths.length > 0) {
      const { error: cleanupError } = await client.storage.from('blog-images').remove(uploadedPaths);
      if (cleanupError) {
        throw new Error(`${originalError.message} Storage cleanup failed: ${cleanupError.message}`);
      }
    }
    throw originalError;
  }
}

export async function createBlogPost(userId: string, input: BlogInput, images: BlogImageSelection[]): Promise<string> {
  const client = requireClient();
  const { data, error } = await client.from('blog_posts').insert({
    author_id: userId,
    title: input.title,
    category: input.category,
    excerpt: input.excerpt,
    content: input.content,
    related_phone_id: input.relatedPhoneId,
    status: 'published',
  }).select('id').single();
  if (error || !data) throw new Error(`Could not create blog: ${error?.message ?? 'No blog ID returned.'}`);

  let uploadedPaths: string[] = [];
  try {
    const uploadResult = await uploadImages(userId, data.id, images);
    uploadedPaths = uploadResult.uploadedPaths;
    const { records } = uploadResult;
    if (records.length > 0) {
      const { error: imageError } = await client.from('blog_images').insert(records);
      if (imageError) throw new Error(`Could not save blog images: ${imageError.message}`);
    }
    return data.id;
  } catch (error) {
    const originalError = error instanceof Error ? error : new Error('Blog image processing failed.');
    const rollbackErrors: string[] = [];

    if (uploadedPaths.length > 0) {
      const { error: storageRollbackError } = await client.storage.from('blog-images').remove(uploadedPaths);
      if (storageRollbackError) rollbackErrors.push(`Storage cleanup failed: ${storageRollbackError.message}`);
    }

    const { error: blogRollbackError } = await client.from('blog_posts').delete().eq('id', data.id);
    if (blogRollbackError) rollbackErrors.push(`Blog rollback failed: ${blogRollbackError.message}`);

    if (rollbackErrors.length > 0) {
      throw new Error(`${originalError.message} ${rollbackErrors.join(' ')}`);
    }

    throw originalError;
  }
}

export async function updateBlogPost(blogId: string, input: BlogInput): Promise<void> {
  const { error } = await requireClient().from('blog_posts').update({
    title: input.title,
    category: input.category,
    excerpt: input.excerpt,
    content: input.content,
    related_phone_id: input.relatedPhoneId,
  }).eq('id', blogId);
  if (error) throw new Error(`Could not update blog: ${error.message}`);
}

export async function syncBlogImages(blogId: string, userId: string, selections: BlogImageSelection[]): Promise<void> {
  const client = requireClient();
  const { data, error } = await client.from('blog_images').select('*').eq('blog_id', blogId).order('display_order');
  if (error) throw new Error(`Could not load existing blog images: ${error.message}`);

  const current = (data ?? []) as BlogImageRow[];
  const retainedIds = new Set(selections.filter((selection) => !selection.file).map((selection) => selection.id));
  const removed = current.filter((image) => !retainedIds.has(image.id));
  const removedPaths = removed.map((image) => image.storage_path).filter((path): path is string => Boolean(path));

  if (removedPaths.length > 0) {
    const { error: storageError } = await client.storage.from('blog-images').remove(removedPaths);
    if (storageError) throw new Error(`Could not remove blog images: ${storageError.message}`);
  }
  if (removed.length > 0) {
    const { error: rowError } = await client.from('blog_images').delete().in('id', removed.map((image) => image.id));
    if (rowError) throw new Error(`Could not remove blog image records: ${rowError.message}`);
  }

  for (const [displayOrder, selection] of selections.entries()) {
    if (selection.file) continue;
    const { error: orderError } = await client.from('blog_images').update({ display_order: displayOrder }).eq('id', selection.id);
    if (orderError) throw new Error(`Could not update blog image order: ${orderError.message}`);
  }

  const { records } = await uploadImages(userId, blogId, selections, 0);
  if (records.length > 0) {
    const { error: imageError } = await client.from('blog_images').insert(records);
    if (imageError) throw new Error(`Could not save new blog images: ${imageError.message}`);
  }
}

export async function deleteBlogPost(blogId: string): Promise<void> {
  const client = requireClient();
  const { data, error } = await client.from('blog_images').select('storage_path').eq('blog_id', blogId);
  if (error) throw new Error(`Could not prepare blog deletion: ${error.message}`);

  const paths = ((data ?? []) as Pick<BlogImageRow, 'storage_path'>[])
    .map((image) => image.storage_path)
    .filter((path): path is string => Boolean(path));
  if (paths.length > 0) {
    const { error: storageError } = await client.storage.from('blog-images').remove(paths);
    if (storageError) throw new Error(`Could not remove blog images: ${storageError.message}`);
  }

  const { error: deleteError } = await client.from('blog_posts').delete().eq('id', blogId);
  if (deleteError) throw new Error(`Could not delete blog: ${deleteError.message}`);
}

export async function createBlogComment(blogId: string, userId: string, content: string, user: User | null): Promise<BlogComment> {
  const { data, error } = await requireClient().from('blog_comments').insert({ blog_id: blogId, author_id: userId, content }).select('*').single();
  if (error || !data) throw new Error(`Could not post comment: ${error?.message ?? 'No comment returned.'}`);
  return mapComments([data as BlogCommentRow], user)[0];
}
