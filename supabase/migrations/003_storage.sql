-- ============================================
-- SiamLuxe — Storage Buckets
-- ============================================

-- Create salon-photos bucket (public read, admin write)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'salon-photos',
  'salon-photos',
  true,
  10485760, -- 10MB max per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- Create salon-videos bucket (public read, admin write)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'salon-videos',
  'salon-videos',
  true,
  52428800, -- 50MB max per file
  ARRAY['video/mp4', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: salon-photos
CREATE POLICY "Public read access for salon photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'salon-photos');

CREATE POLICY "Admins can upload salon photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'salon-photos'
    AND public.is_admin()
  );

CREATE POLICY "Admins can update salon photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'salon-photos'
    AND public.is_admin()
  );

CREATE POLICY "Admins can delete salon photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'salon-photos'
    AND public.is_admin()
  );

-- Storage policies: salon-videos
CREATE POLICY "Public read access for salon videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'salon-videos');

CREATE POLICY "Admins can upload salon videos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'salon-videos'
    AND public.is_admin()
  );

CREATE POLICY "Admins can update salon videos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'salon-videos'
    AND public.is_admin()
  );

CREATE POLICY "Admins can delete salon videos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'salon-videos'
    AND public.is_admin()
  );
