import { createClient } from '@supabase/supabase-js';

// Tên bucket lưu ảnh
const bucket = 'data_bookingtravel/img';

// Tạo Supabase client duy nhất
export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

// Upload ảnh từ client (file input)
export const uploadImage = async (file: File) => {
  const timestamp = Date.now();
  const newName = `${timestamp}-${file.name}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(newName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error || !data) throw new Error('Image upload failed');

  return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
};

// Upload ảnh từ Buffer (dùng trong server, API routes)
export const uploadImageLocal = async (image: Buffer, nameImage: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(nameImage, image, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error || !data) throw new Error('Image upload failed');

  return supabase.storage.from(bucket).getPublicUrl(nameImage).data.publicUrl;
};
