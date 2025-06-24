import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
});

const normalize = (text: string = '') =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^(tinh|thanh pho|tp)\s+/i, '')
    .trim();

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const properties = await db.property.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });

    // Tìm từ khóa địa điểm từ toàn bộ hội thoại
    const fullText = messages.map((m: any) => m.content).join(' ');
    const normalizedText = normalize(fullText);

    const filteredProperties = properties.filter((p) => {
      const combined = normalize(`${p.name} ${p.country}`);
      return normalizedText && combined.includes(normalizedText);
    });

    const relevantProperties =
      filteredProperties.length > 0 ? filteredProperties : properties;

    const systemPrompt = `
🧑‍💼 Bạn là một trợ lý ảo AI thân thiện trên nền tảng đặt khách sạn HomeAway.

🎯 Mục tiêu:
- Hiểu nhu cầu, hoàn cảnh, mục đích chuyến đi và tư vấn khách sạn phù hợp.
- Giao tiếp tự nhiên, không máy móc. Luôn gợi mở nếu người dùng chưa rõ ràng.
- Chỉ dùng dữ liệu khách sạn từ JSON bên dưới. Không bịa, không thêm thông tin không có.
- Duy trì ngữ cảnh đa lượt hội thoại (multi-turn). Ghi nhớ thông tin đã nói trước đó.

---

💡 Hành vi cần tuân thủ:

1. Hiểu **mục đích chuyến đi**:
   - Nghỉ dưỡng → thiên nhiên, yên tĩnh.
   - Công tác → trung tâm, thuận tiện.
   - Gia đình → nhiều phòng, thân thiện trẻ em.

2. Nhận biết **ngân sách**:
   - Nếu người dùng đề cập (ví dụ: "dưới 1 triệu", "rẻ thôi", "không quá 100$") → lọc giá phù hợp.

3. Nhận biết **nhóm người đi cùng**:
   - Cặp đôi, đi một mình, gia đình, nhóm bạn → lọc khách sạn phù hợp.

4. Nhận biết **địa điểm hoặc thời gian**:
   - Nếu chưa có → hãy hỏi lại người dùng "Bạn muốn ở đâu? Khi nào đi?"

5. Tránh lặp lại nguyên câu hỏi. Không nói điều hiển nhiên.

---

🗣️ Cách phản hồi:

- Nếu chưa đủ thông tin:
> 📌 Tôi cần thêm thông tin để tìm chỗ ở phù hợp. Bạn muốn ở đâu? Bao nhiêu người? Ngân sách khoảng bao nhiêu?

- Nếu đủ thông tin:
> ### 🏨 Danh sách khách sạn bạn cần:

1. [Tên khách sạn](link)  
   📍 Địa điểm: ...  
   💰 Giá: ...  
   📝 Mô tả: ...  
   ✅ Vì sao phù hợp

- Kết thúc nhẹ nhàng:
> ✨ Bạn muốn tôi hỗ trợ bước tiếp theo không? (lọc tiện nghi, đặt phòng...)

---

📦 Dữ liệu khách sạn:

${JSON.stringify(
  relevantProperties.map((p) => ({
    name: p.name,
    link: `https://homeaway.com/properties/${p.id}`,
    location: p.country,
    price: `$${p.price}/đêm`,
    description: p.description?.slice(0, 100) || '',
  })),
  null,
  2
)}
    `.trim();

    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 700,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    });

    return new Response(chat.choices[0].message.content, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err: any) {
    console.error('[Assistant Error]', err);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
