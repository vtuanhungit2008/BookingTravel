// app/api/assistant/route.ts
import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
});

// Format danh sách chỗ ở
const formatProperties = (properties: any[]) => {
  return properties
    .map((prop) => `
🏡 ${prop.name}
${prop.tagline}
- Quốc gia: ${prop.country}
- Loại: ${prop.category}
- Giá: $${prop.price}/đêm
- Sức chứa: ${prop.guests} khách, ${prop.bedrooms} phòng ngủ, ${prop.beds} giường, ${prop.baths} phòng tắm
🔗 [Xem chi tiết](http://localhost:3000/properties/${prop.id})
`)
    .join('\n');
};

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const userMessage = message.toLowerCase();

    const properties = await db.property.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    // Lọc sơ bộ nếu có từ khóa đơn giản
    const filtered = properties.filter((p) => {
      return (
        (userMessage.includes('việt nam') && p.country.toLowerCase().includes('vietnam')) ||
        (userMessage.includes('giá rẻ') && p.price < 500) ||
        (userMessage.includes('nhiều người') && p.guests >= 4)
      );
    });

    const systemPrompt = `
Bạn là một trợ lý AI chuyên tư vấn chỗ ở. Người dùng có thể hỏi về mức giá, số người, quốc gia hoặc mô tả nhu cầu. Hãy gợi ý 3-5 chỗ phù hợp nhất từ danh sách dưới đây, đính kèm [Xem chi tiết].

${formatProperties(filtered.length ? filtered : properties)}
`;

    const chat = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo', // Hoặc gpt-4, mistral
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
