grant insert on table public.blog_posts to authenticated;
grant update, delete on table public.blog_posts to authenticated;

drop policy if exists blog_posts_authenticated_insert on public.blog_posts;

create policy blog_posts_authenticated_insert
  on public.blog_posts
  for insert
  to authenticated
  with check (auth.uid() = author_id);
