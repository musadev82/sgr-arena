drop policy if exists storage_blog_images_authenticated_insert on storage.objects;
drop policy if exists storage_blog_images_authenticated_update on storage.objects;
drop policy if exists storage_blog_images_authenticated_delete on storage.objects;

create policy storage_blog_images_authenticated_insert
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'blog-images'
    and array_length(storage.foldername(name), 1) = 2
    and storage.filename(name) <> ''
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1
      from public.blog_posts
      where blog_posts.id::text = (storage.foldername(name))[2]
        and blog_posts.author_id = auth.uid()
    )
  );

create policy storage_blog_images_authenticated_update
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'blog-images'
    and array_length(storage.foldername(name), 1) = 2
    and storage.filename(name) <> ''
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1
      from public.blog_posts
      where blog_posts.id::text = (storage.foldername(name))[2]
        and blog_posts.author_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'blog-images'
    and array_length(storage.foldername(name), 1) = 2
    and storage.filename(name) <> ''
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1
      from public.blog_posts
      where blog_posts.id::text = (storage.foldername(name))[2]
        and blog_posts.author_id = auth.uid()
    )
  );

create policy storage_blog_images_authenticated_delete
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'blog-images'
    and array_length(storage.foldername(name), 1) = 2
    and storage.filename(name) <> ''
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1
      from public.blog_posts
      where blog_posts.id::text = (storage.foldername(name))[2]
        and blog_posts.author_id = auth.uid()
    )
  );
