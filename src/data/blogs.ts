export type BlogCategory =
  | 'Reviews'
  | 'Buying Guides'
  | 'Comparisons'
  | 'Technology'
  | 'Tips & Tricks'
  | 'Camera'
  | 'Other';

export interface BlogComment {
  commentId: string;
  blogId: string;
  authorId: string;
  userName: string;
  commentText: string;
  createdAt: string;
  isOwn?: boolean;
}

export interface BlogImage {
  id: string;
  url: string;
  storagePath: string | null;
  altText: string | null;
  displayOrder: number;
}

export interface Blog {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  description: string;
  images: BlogImage[];
  coverImage: string;
  relatedSmartphoneId: string | null;
  tags: string[];
  createdAt: string;
  comments: BlogComment[];
  readingTime: string;
}

export const blogCategories: Array<'All' | BlogCategory> = [
  'All',
  'Reviews',
  'Buying Guides',
  'Comparisons',
  'Technology',
  'Tips & Tricks',
  'Camera',
  'Other',
];

export const mockCurrentUser = {
  id: 'mock-user-1',
  name: 'Demo User',
  avatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
};

export function formatBlogDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function estimateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}
