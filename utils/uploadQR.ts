// utils/uploadQR.ts
import { createClient } from '@supabase/supabase-js';
import * as QRCode from 'qrcode';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const BUCKET_NAME = 'qr-codes'; // bạn nhớ tạo bucket này trên Supabase Storage

export const uploadQR = async (url: string, filename?: string): Promise<string> => {
  try {
    const buffer = await QRCode.toBuffer(url);
    const name = filename ?? `qr-${Date.now()}.png`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(name, buffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true,
      });

    if (error || !data) {
      console.error('[UPLOAD_QR_ERROR]', error);
      throw new Error('QR image upload failed');
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(name);

    return publicUrlData?.publicUrl;
  } catch (err) {
    console.error('[QR_GENERATE_OR_UPLOAD_ERROR]', err);
    throw new Error('QR generation or upload failed');
  }
};
