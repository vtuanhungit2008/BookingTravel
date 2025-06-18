import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing QR code' }, { status: 400 });
  }

  try {
    const qr = await db.qRCode.findUnique({
      where: { code },
      include: {
        booking: {
          include: {
            property: true, // ✅ Lấy thông tin property để truy xuất ID
          },
        },
      },
    });

    if (!qr) {
      return NextResponse.json({ error: 'QR code không hợp lệ' }, { status: 404 });
    }

    // ✅ Nếu chưa quét lần nào thì cập nhật thời gian
    if (!qr.scannedAt) {
      await db.qRCode.update({
        where: { code },
        data: { scannedAt: new Date(),
          scanned:true,

         }
        ,
      });
    }

    const propertyId = qr.booking.property.id;

    return NextResponse.redirect(new URL(`/properties/${propertyId}`, req.url));
  } catch (err) {
    console.error('[QR_VERIFY_ERROR]', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
