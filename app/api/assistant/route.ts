import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db';


const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
});

// 👉 Link đến property
const formatProperties = (properties: any[]) => {
  return properties
    .map((prop, i) => {
      return `
🏡 ${prop.name}
 ${prop.tagline}
- Quốc gia: ${prop.country}
- Loại: ${prop.category}
- Giá: $${prop.price}/đêm
- Thông tin khác: $${prop.description}
- Sức chứa: ${prop.guests} khách, ${prop.bedrooms} phòng ngủ, ${prop.beds} giường, ${prop.baths} phòng tắm
🔗 [Xem chi tiết](http://localhost:3000/properties/${prop.id})`;
    })
    .join('');
};

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const properties = await prisma.property.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    const systemPrompt = `
Bạn là trợ lý AI chuyên tư vấn chỗ ở. Dưới đây là danh sách chỗ ở hiện có:

${formatProperties(properties)}

Khi người dùng hỏi, hãy đề xuất các lựa chọn phù hợp kèm link [Xem chi tiết].
`;

    const chat = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });

    return NextResponse.json({ reply: chat.choices[0].message.content });
  } catch (err) {
    console.error('[Assistant Error]', err);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
