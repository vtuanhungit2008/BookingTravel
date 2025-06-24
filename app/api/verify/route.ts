import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
            property: true,
            guest: true,
            profile: true,
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
        data: {
          scannedAt: new Date(),
          scanned: true,
        },
      });

      // ✅ Lấy thông tin người nhận
      const guest = qr.booking.guest;
      const profile = qr.booking.profile;
      const email = guest?.email || profile?.email;
      const fullName = guest?.fullName || profile?.firstName || 'Quý khách';

      const property = qr.booking.property;

      // ✅ Nội dung chi tiết
    
      if (email) {
        await resend.emails.send({
          from: 'Booking App <onboarding@resend.dev>',
          to: email,
          subject: 'Thông tin phòng & Ưu đãi sau khi xác minh QR',
          html: `
            <p>Xin chào ${fullName},</p>
            <p>Bạn đã checkin phòng thành công tại <strong>${property.name}</strong>.</p>
            <hr/>
    
            <p>Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi.</p>
            <p>Trân trọng,</p>
            <p>Đội ngũ Booking App</p>
          `,
        });
      }
    }

    const propertyId = qr.booking.property.id;
    return NextResponse.redirect(new URL(`/properties/${propertyId}`, req.url));
  } catch (err) {
    console.error('[QR_VERIFY_ERROR]', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
