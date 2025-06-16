import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';
import { writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

// === Cấu hình ngưỡng cho ảnh "quá khác biệt" ===
const MAX_SCORE = 500000;

// === Hàm vector hóa ảnh, hỗ trợ cả URL và local file ===
async function getImageVectorFromAnySource(source: string): Promise<number[]> {
  let imageBuffer: Buffer;

  if (source.startsWith('http')) {
    const response = await fetch(source);
    if (!response.ok) throw new Error('Cannot fetch image from URL');
    const arrayBuffer = await response.arrayBuffer();
    imageBuffer = Buffer.from(arrayBuffer);
  } else {
    imageBuffer = await sharp(source).toBuffer();
  }

  const vector = await sharp(imageBuffer)
    .resize(32, 32)
    .grayscale()
    .raw()
    .toBuffer();

  return Array.from(vector);
}

// === Tính điểm giống nhau giữa 2 ảnh (Euclidean distance) ===
function calculateSimilarity(vecA: number[], vecB: number[]): number {
  let sum = 0;
  for (let i = 0; i < vecA.length; i++) {
    const diff = vecA[i] - vecB[i];
    sum += diff * diff;
  }
  return sum;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('image') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // === Lưu ảnh người dùng vào thư mục tạm ===
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = crypto.randomUUID() + path.extname(file.name);
  const uploadPath = path.join(process.cwd(), 'public/uploads', filename);
  await writeFile(uploadPath, buffer);

  // === Vector hóa ảnh người dùng ===
  let userVector: number[];
  try {
    userVector = await getImageVectorFromAnySource(uploadPath);
  } catch {
    return NextResponse.json({ error: 'Failed to process uploaded image' }, { status: 500 });
  }

  // === Truy vấn tất cả phòng từ DB ===
  const properties = await db.property.findMany();
  const scored = [];

  for (const prop of properties) {
    try {
      const propVector = await getImageVectorFromAnySource(prop.image);
      const score = calculateSimilarity(userVector, propVector);
      scored.push({ prop, score });
    } catch (err) {
      console.warn(`⚠️ Không đọc được ảnh phòng: ${prop.name} (${prop.image})`);
    }
  }

  // === Tìm top 3 phòng giống nhất ===
  const topMatches = scored
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const isTooDifferent = topMatches.every(item => item.score > MAX_SCORE);

  // === Trả về gợi ý phù hợp hoặc thông báo ảnh quá khác biệt ===
  const recommendations = isTooDifferent
    ? [
        `🙁 Không tìm thấy phòng phù hợp. Ảnh bạn tải lên có thể không liên quan đến nội thất hoặc khách sạn. Vui lòng thử ảnh khác.`
      ]
    : topMatches.map(({ prop }) => `
### 🏡 Gợi ý phù hợp:
**${prop.name}** - ${prop.country}

![Ảnh phòng](${prop.image})

💰 Giá: $${prop.price} / đêm  
👥 Sức chứa: ${prop.guests} người  
🔗 [Xem chi tiết](http://localhost:3000/properties/${prop.id})
  `);

  return NextResponse.json({ recommendations });
}
