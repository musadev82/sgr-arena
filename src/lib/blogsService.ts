import type { Blog } from '../data/blogs';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

export type SupabaseBlogRecord = Blog & {
  created_at?: string;
  updated_at?: string;
};

export async function fetchBlogsFromSupabase(): Promise<Blog[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  const client = getSupabaseClient();
  const { data, error } = await client.from('blogs').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase blog fetch failed:', error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    ...row,
    createdAt: row.created_at ?? row.createdAt,
    authorName: row.author_name ?? row.authorName,
    relatedSmartphoneId: row.related_smartphone_id ?? row.relatedSmartphoneId ?? null,
    coverImage: row.cover_image ?? row.coverImage ?? '',
    comments: Array.isArray(row.comments) ? row.comments : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    images: Array.isArray(row.images) ? row.images : [],
  })) as Blog[];
}

export async function upsertBlogToSupabase(blog: Blog) {
  if (!isSupabaseConfigured) {
    return null;
  }

  const client = getSupabaseClient();
  const payload = {
    id: blog.id,
    author_id: blog.authorId,
    author_name: blog.authorName,
    title: blog.title,
    category: blog.category,
    excerpt: blog.excerpt,
    description: blog.description,
    images: blog.images,
    cover_image: blog.coverImage,
    related_smartphone_id: blog.relatedSmartphoneId,
    tags: blog.tags,
    created_at: blog.createdAt,
    comments: blog.comments,
    reading_time: blog.readingTime,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await client.from('blogs').upsert(payload).select().single();

  if (error) {
    console.error('Supabase blog upsert failed:', error.message);
    return null;
  }

  return data;
}

export async function deleteBlogFromSupabase(blogId: string) {
  if (!isSupabaseConfigured) {
    return false;
  }

  const client = getSupabaseClient();
  const { error } = await client.from('blogs').delete().eq('id', blogId);

  if (error) {
    console.error('Supabase blog delete failed:', error.message);
    return false;
  }

  return true;
}
