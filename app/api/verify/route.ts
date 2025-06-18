import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Thiếu mã QR' }, { status: 400 });
  }

  const qr = await db.qRCode.findUnique({
    where: { code },
    include: { booking: true },
  });

  if (!qr) {
    return NextResponse.json({ error: 'Mã QR không hợp lệ' }, { status: 404 });
  }

  if (!qr.scanned) {
    await db.qRCode.update({
      where: { code },
      data: {
        scanned: true,
        scannedAt: new Date(),
      },
    });
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/booking/${qr.bookingId}`);
}
