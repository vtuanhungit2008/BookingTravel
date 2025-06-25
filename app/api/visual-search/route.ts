import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

// === Tính vector ảnh từ nguồn (URL hoặc local path) ===
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

// === Khoảng cách Euclidean cơ bản ===
function calculateSimilarity(vecA: number[], vecB: number[]): number {
  let sum = 0;
  for (let i = 0; i < vecA.length; i++) {
    const diff = vecA[i] - vecB[i];
    sum += diff * diff;
  }
  return sum;
}

// === Chuyển khoảng cách thành % giống nhau ===
function similarityScore(vecA: number[], vecB: number[]): number {
  const maxDistance = Math.sqrt(255 * 255 * vecA.length); // max distance
  const distance = Math.sqrt(calculateSimilarity(vecA, vecB));
  return 1 - distance / maxDistance; // từ 0 đến 1
}

// === Xử lý POST ===
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('image') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // === Lưu ảnh người dùng tạm vào thư mục không bị hot reload ===
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = path.join(process.cwd(), '.next/cache/tmp');
  await mkdir(uploadDir, { recursive: true });

  const filename = crypto.randomUUID() + path.extname(file.name);
  const uploadPath = path.join(uploadDir, filename);
  await writeFile(uploadPath, buffer);

  // === Vector hóa ảnh người dùng ===
  let userVector: number[];
  try {
    userVector = await getImageVectorFromAnySource(uploadPath);
  } catch {
    await unlink(uploadPath).catch(() => {});
    return NextResponse.json({ error: 'Failed to process uploaded image' }, { status: 500 });
  }

  // === Truy vấn danh sách phòng và tính điểm tương đồng ===
  const properties = await db.property.findMany();
  const matched: { prop: any; score: number }[] = [];

  for (const prop of properties) {
    try {
      const propVector = await getImageVectorFromAnySource(prop.image);
      const score = similarityScore(userVector, propVector);
      if (score >= 0.7) {
        matched.push({ prop, score });
      }
    } catch {
      console.warn(`⚠️ Không thể xử lý ảnh phòng: ${prop.name}`);
    }
  }

  // === Xóa ảnh tạm ===
  await unlink(uploadPath).catch(() => {
    console.warn('⚠️ Không thể xóa ảnh tạm:', uploadPath);
  });

  // === Nếu không có phòng nào đủ điểm ===
  if (matched.length === 0) {
    return NextResponse.json({
      message: '🙁 Không tìm thấy phòng nào có ảnh giống từ 70% trở lên. Vui lòng thử lại với ảnh khác.'
    });
  }

  // === Bổ sung phòng ngẫu nhiên nếu < 3 phòng giống ===
  if (matched.length < 3) {
    const matchedIds = new Set(matched.map((m) => m.prop.id));
    const others = properties.filter((p) => !matchedIds.has(p.id));
    const shuffled = others.sort(() => 0.5 - Math.random());

    for (let i = 0; i < 3 - matched.length && i < shuffled.length; i++) {
      matched.push({
        prop: shuffled[i],
        score: 0 // không đủ giống, chỉ bổ sung cho đủ 3
      });
    }
  }

  // === Trả về đúng 3 kết quả, ưu tiên theo độ giống ===
  matched.sort((a, b) => b.score - a.score);

  return NextResponse.json({
    matched: matched.slice(0, 3).map(({ prop, score }) => ({
      id: prop.id,
      name: prop.name,
      image: prop.image,
      country: prop.country,
      price: prop.price,
      guests: prop.guests,
      similarity: score > 0 ? Math.round(score * 100) + '%' : 'Không đánh giá'
    }))
  });
}
