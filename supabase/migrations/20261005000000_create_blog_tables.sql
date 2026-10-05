create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  category text not null default 'General',
  excerpt text,
  content text not null,
  related_phone_id text,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_status_check check (status in ('draft', 'published'))
);

create index if not exists blog_posts_author_id_idx on public.blog_posts (author_id);
create index if not exists blog_posts_created_at_idx on public.blog_posts (created_at);
create index if not exists blog_posts_status_idx on public.blog_posts (status);

create table if not exists public.blog_images (
  id uuid primary key default gen_random_uuid(),
  blog_id uuid not null references public.blog_posts (id) on delete cascade,
  image_url text not null,
  storage_path text,
  alt_text text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists blog_images_blog_id_idx on public.blog_images (blog_id);
create index if not exists blog_images_display_order_idx on public.blog_images (display_order);

create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  blog_id uuid not null references public.blog_posts (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_comments_blog_id_idx on public.blog_comments (blog_id);
create index if not exists blog_comments_author_id_idx on public.blog_comments (author_id);
create index if not exists blog_comments_created_at_idx on public.blog_comments (created_at);

alter table public.blog_posts enable row level security;
alter table public.blog_images enable row level security;
alter table public.blog_comments enable row level security;

drop policy if exists blog_posts_public_read on public.blog_posts;
drop policy if exists blog_posts_authenticated_insert on public.blog_posts;
drop policy if exists blog_posts_authenticated_update on public.blog_posts;
drop policy if exists blog_posts_authenticated_delete on public.blog_posts;

create policy blog_posts_public_read
  on public.blog_posts
  for select
  to anon, authenticated
  using (status = 'published');

create policy blog_posts_authenticated_insert
  on public.blog_posts
  for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy blog_posts_authenticated_update
  on public.blog_posts
  for update
  to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy blog_posts_authenticated_delete
  on public.blog_posts
  for delete
  to authenticated
  using (auth.uid() = author_id);

create or replace function public.is_blog_owner(target_blog_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.blog_posts
    where blog_posts.id = target_blog_id
      and blog_posts.author_id = auth.uid()
  );
$$;

drop policy if exists blog_images_public_read on public.blog_images;
drop policy if exists blog_images_authenticated_insert on public.blog_images;
drop policy if exists blog_images_authenticated_update on public.blog_images;
drop policy if exists blog_images_authenticated_delete on public.blog_images;

create policy blog_images_public_read
  on public.blog_images
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.blog_posts
      where blog_posts.id = blog_images.blog_id
        and blog_posts.status = 'published'
    )
  );

create policy blog_images_authenticated_insert
  on public.blog_images
  for insert
  to authenticated
  with check (public.is_blog_owner(blog_id));

create policy blog_images_authenticated_update
  on public.blog_images
  for update
  to authenticated
  using (public.is_blog_owner(blog_id))
  with check (public.is_blog_owner(blog_id));

create policy blog_images_authenticated_delete
  on public.blog_images
  for delete
  to authenticated
  using (public.is_blog_owner(blog_id));

drop policy if exists blog_comments_public_read on public.blog_comments;
drop policy if exists blog_comments_authenticated_insert on public.blog_comments;
drop policy if exists blog_comments_authenticated_update on public.blog_comments;
drop policy if exists blog_comments_authenticated_delete on public.blog_comments;

create policy blog_comments_public_read
  on public.blog_comments
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.blog_posts
      where blog_posts.id = blog_comments.blog_id
        and blog_posts.status = 'published'
    )
  );

create policy blog_comments_authenticated_insert
  on public.blog_comments
  for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy blog_comments_authenticated_update
  on public.blog_comments
  for update
  to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy blog_comments_authenticated_delete
  on public.blog_comments
  for delete
  to authenticated
  using (auth.uid() = author_id);

create or replace function public.set_blog_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row
  execute function public.set_blog_updated_at();

drop trigger if exists blog_comments_set_updated_at on public.blog_comments;
create trigger blog_comments_set_updated_at
  before update on public.blog_comments
  for each row
  execute function public.set_blog_updated_at();
