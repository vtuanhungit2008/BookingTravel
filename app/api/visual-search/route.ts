import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';
import { writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('image') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Lưu tạm file ảnh vào thư mục public/uploads
  const filename = crypto.randomUUID() + path.extname(file.name);
  const filePath = path.join(process.cwd(), 'public/uploads', filename);
  await writeFile(filePath, buffer);

  // 🧠 GIẢ LẬP: Lấy 3 phòng ngẫu nhiên từ DB
  const properties = await db.property.findMany({ take: 3, orderBy: { id: 'desc' } });

  const recommendations = properties.map((p) => `
### 🏡 Gợi ý phù hợp:
**${p.name}** - ${p.country}

![Ảnh phòng](${p.image})

💰 Giá: $${p.price} / đêm  
👥 Sức chứa: ${p.guests} người  
🔗 [Xem chi tiết](http://localhost:3000/properties/${p.id})
  `);

  return NextResponse.json({ recommendations });
}
