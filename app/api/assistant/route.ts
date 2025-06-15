import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
});

const formatProperties = (properties: any[]) => {
  return properties
    .map((prop) => `
### 🏡 ${prop.name}
![${prop.name}](${prop.image})

${prop.tagline}
- 🌍 Quốc gia: ${prop.country}
- 🏧 Loại: ${prop.category}
- 💰 Giá: $${prop.price}/đêm
- 👥 Sức chứa: ${prop.guests} khách, ${prop.bedrooms} phòng ngủ, ${prop.beds} giường, ${prop.baths} phòng tắm 

🔗 [Xem chi tiết](http://localhost:3000/properties/${prop.id})
`)
    .join('\n');
};

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    const properties = await db.property.findMany({
      take: 15,
      orderBy: { createdAt: 'desc' },
    });

    const historyContext = history?.length
      ? history.map((m: any, i: number) => `Lần ${i + 1}: ${m.text}`).join('\n')
      : 'Không có lịch sử.';

    const systemPrompt = `
Bạn là một trợ lý AI tư vấn chỗ ở.

Dưới đây là các yêu cầu trước đây từ người dùng:
${historyContext}

Dưới đây là yêu cầu mới: "${message}"

Hãy:
1. Phân tích toàn bộ nhu cầu của người dùng
2. Ưu tiên các lựa chọn phù hợp với xu hướng cũ
3. Gợi ý 3–5 chỗ ở phù hợp nhất từ danh sách dưới, kèm ảnh và link [Xem chi tiết].

${formatProperties(properties)}
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