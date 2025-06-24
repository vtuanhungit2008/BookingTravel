import Stripe from 'stripe';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import db from '@/utils/db';
import { Resend } from 'resend';
import { formatDate } from '@/utils/format';
import QRCodeLib from 'qrcode';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
const BUCKET = 'data_bookingtravel/qr';

const uploadQRImageToSupabase = async (base64: string): Promise<string> => {
  const base64Data = base64.replace(/^data:image\/png;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const fileName = `qr-${uuidv4()}.png`;

  const { error } = await supabase.storage.from(BUCKET).upload(fileName, buffer, {
    contentType: 'image/png',
  });
  if (error) throw new Error('Failed to upload QR image to Supabase');

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
};

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get('session_id');

  if (!session_id) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const bookingId = session.metadata?.bookingId;
    if (session.status !== 'complete' || !bookingId) {
      throw new Error('Invalid session');
    }

    const discount = parseInt(session.metadata?.discount || '0', 10);
    const voucherCode = session.metadata?.voucherCode || null;
    const amountPaid = session.amount_total ? session.amount_total / 100 : 0;

    const booking = await db.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: true,
        discount,
        finalPaid: amountPaid,
        voucher: voucherCode ? { connect: { code: voucherCode } } : undefined,
      },
      include: {
        guest: true,
        profile: true,
        property: true,
      },
    });

    // ✅ QR
    const qr = await db.qRCode.create({
      data: {
        code: crypto.randomUUID(),
        bookingId: booking.id,
      },
    });
    const qrUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify?code=${qr.code}`;
    const qrBase64 = await QRCodeLib.toDataURL(qrUrl);
    const qrImageUrl = await uploadQRImageToSupabase(qrBase64);

    // ✅ Cookie guest
    if (booking.guestId) {
      cookies().set('guestId', booking.guestId, {
        path: '/',
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    const receiverEmail = booking.guest?.email || booking.profile?.email;
    const receiverName = booking.guest?.fullName || booking.profile?.firstName || 'Quý khách';

    // ✅ Email
    if (receiverEmail) {
      await resend.emails.send({
        from: 'Booking App <onboarding@resend.dev>',
        to: receiverEmail,
        subject: 'Xác nhận đặt phòng + Mã QR',
        html: `
          <p>Xin chào ${receiverName},</p>
          <p>Bạn đã đặt phòng thành công tại <strong>${booking.property.name}</strong>.</p>
          <ul>
            <li><strong>Ngày nhận phòng:</strong> ${formatDate(booking.checkIn)}</li>
            <li><strong>Ngày trả phòng:</strong> ${formatDate(booking.checkOut)}</li>
            <li><strong>Tổng tiền đã thanh toán:</strong> $${amountPaid.toFixed(2)}</li>
             <li><strong>Địa chỉ:</strong> ${booking.property.country}</li>
            ${voucherCode ? `<li><strong>Mã giảm giá:</strong> ${voucherCode}</li>` : ''}
          </ul>
          <p>📲 Mã QR này dùng để checkin tại lễ tân</p>
          <img src="${qrImageUrl}" alt="QR Code" width="300" height="300" />
          <p>Hoặc nhấn vào đây: <a href="${qrUrl}">${qrUrl}</a></p>
          <p>Trân trọng,</p>
          <p>Đội ngũ Booking App</p>
        `,
      });
    }

    // ✅ Gửi thông báo hệ thống
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: '🎉 Đặt phòng mới!',
        content: `${receiverName} vừa đặt phòng tại ${booking.property.name} từ ${formatDate(booking.checkIn)} đến ${formatDate(booking.checkOut)}.`,
        type: 'INFO',
        visible: true,
      }),
    });

    return NextResponse.redirect(new URL('/bookings', req.url));
  } catch (error) {
    console.error('[CONFIRM_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
