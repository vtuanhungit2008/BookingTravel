import { createClient } from '@supabase/supabase-js';
import image from '../data_test/00-Linux-1200x900.png'
const bucket = 'data_bookingtravel';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);


export const uploadImage = async (image: File) => {
  const timestamp = Date.now();
  // const newName = `/users/${timestamp}-${image.name}`;
  const newName = `${timestamp}-${image.name}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(newName, image, {
      cacheControl: '3600',
    });


    
  if (!data) throw new Error('Image upload failed');
  console.log(supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl);
  return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
};


export const uploadImageLocal = async (image: Buffer, nameImage: string) => {


  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(nameImage, image, {
      cacheControl: '3600',
    });


    
  console.log(supabase.storage.from(bucket).getPublicUrl(nameImage).data.publicUrl);
  return supabase.storage.from(bucket).getPublicUrl(nameImage).data.publicUrl;
};

