grant select on table public.blog_posts to anon, authenticated;

drop policy if exists blog_posts_public_read on public.blog_posts;

create policy blog_posts_public_read
  on public.blog_posts
  for select
  to anon, authenticated
  using (status = 'published');
