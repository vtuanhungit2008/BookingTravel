import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';

// ✅ Revalidate thông báo mỗi 30 giây nếu cần
export const revalidate = 30;

// GET: Lấy thông báo
export async function GET() {
  try {
    const announcements = await db.announcement.findMany({
      where: { visible: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json(announcements);
  } catch (err) {
    console.error('[Announcements Error]', err);
    return NextResponse.json({ error: 'Lỗi khi lấy thông báo' }, { status: 500 });
  }
}

// POST: Tạo thông báo
export async function POST(req: NextRequest) {
  try {
    const { title, content, type, visible = true } = await req.json();

    if (!title || !content || !type) {
      return NextResponse.json({ error: 'Thiếu dữ liệu bắt buộc' }, { status: 400 });
    }

    const newAnnouncement = await db.announcement.create({
      data: { title, content, type, visible },
    });

    return NextResponse.json(newAnnouncement);
  } catch (err) {
    console.error('[Create Announcement Error]', err);
    return NextResponse.json({ error: 'Lỗi server khi tạo thông báo' }, { status: 500 });
  }
}
