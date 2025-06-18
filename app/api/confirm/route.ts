import Stripe from 'stripe';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import db from '@/utils/db';
import { Resend } from 'resend';
import { formatDate } from '@/utils/format';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

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
        discount: discount || 0,
        finalPaid: amountPaid,
        voucher: voucherCode
          ? { connect: { code: voucherCode } }
          : undefined,
      },
      include: {
        guest: true,
        profile: true, // 🆕 để lấy user đã đăng ký
        property: true,
      },
    });

    // 👉 Nếu có guest (khách vãng lai), lưu cookie
    if (booking.guestId && booking.guest?.email) {
      cookies().set('guestId', booking.guestId, {
        path: '/',
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    // 👉 Gửi email xác nhận cho người dùng (guest hoặc profile)
    const recipientEmail = booking.guest?.email || booking.profile?.email;
    const recipientName = booking.guest?.fullName || booking.profile?.firstName;

    if (recipientEmail) {
      try {
        await resend.emails.send({
          from: 'Booking App <onboarding@resend.dev>',
          to: recipientEmail,
          subject: 'Xác nhận đặt phòng thành công',
          html: `
            <p>Xin chào ${recipientName || 'quý khách'},</p>
            <p>Bạn đã đặt phòng thành công tại <strong>${booking.property.name}</strong>.</p>
            <ul>
              <li><strong>Ngày nhận phòng:</strong> ${formatDate(booking.checkIn)}</li>
              <li><strong>Ngày trả phòng:</strong> ${formatDate(booking.checkOut)}</li>
              <li><strong>Tổng tiền đã thanh toán:</strong> $${amountPaid.toFixed(2)}</li>
              ${voucherCode ? `<li><strong>Mã giảm giá:</strong> ${voucherCode}</li>` : ''}
            </ul>
            <p>Cảm ơn bạn đã tin tưởng chúng tôi!</p>
          `,
        });
      } catch (emailError) {
        console.error('[EMAIL_SEND_ERROR]', emailError);
      }
    }

    return NextResponse.redirect(new URL('/bookings', req.url));
  } catch (error) {
    console.error('[CONFIRM_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
