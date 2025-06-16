import Stripe from 'stripe';
import { type NextRequest, type NextResponse } from 'next/server';
import db from '@/utils/db';
import { formatDate } from '@/utils/format';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const { bookingId, voucherCode } = await req.json();

    if (!bookingId) {
      return Response.json({ error: 'Missing bookingId' }, { status: 400 });
    }

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: { select: { name: true, image: true } },
        voucher: true, // hiện tại
      },
    });

    if (!booking) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    const {
      totalNights,
      orderTotal,
      checkIn,
      checkOut,
      guestId,
      property: { image, name },
    } = booking;

    let discount = 0;
    let appliedVoucher = null;

    if (voucherCode) {
      const voucher = await db.voucher.findUnique({ where: { code: voucherCode } });

      if (!voucher) {
        return Response.json({ error: 'Voucher not found' }, { status: 400 });
      }

      const expired = new Date(voucher.expiresAt) < new Date();
      if (expired) {
        return Response.json({ error: 'Voucher expired' }, { status: 400 });
      }

      discount = voucher.type === 'PERCENT'
        ? Math.round(orderTotal * (voucher.discount / 100))
        : voucher.discount;

      appliedVoucher = voucher;

      // Update booking to attach voucher
      await db.booking.update({
        where: { id: bookingId },
        data: { voucherId: voucher.id },
      });
    }

    const finalAmount = Math.max(orderTotal - discount, 0);

    const origin = new Headers(req.headers).get('origin') ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
  ui_mode: 'embedded',
  client_reference_id: `${bookingId}-${Date.now()}`, // 💥 ép Stripe tạo session mới
  metadata: {
    bookingId,
    guestId: guestId ?? '',
    voucherCode: appliedVoucher?.code ?? '',
    discount: discount.toString(),
  },
  line_items: [
    {
      quantity: 1,
      price_data: {
        currency: 'usd',
        product_data: {
          name,
          images: [image],
          description: `Stay for ${totalNights} nights, from ${formatDate(checkIn)} to ${formatDate(checkOut)}`,
        },
        unit_amount: finalAmount * 100,
      },
    },
  ],
  mode: 'payment',
  return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`,
});

    return Response.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('[💥 STRIPE_PAYMENT_ERROR]', error);
    return Response.json({ error: 'Stripe session creation failed' }, { status: 500 });
  }
};
