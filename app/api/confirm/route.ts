import Stripe from 'stripe';
import { NextResponse, type NextRequest } from 'next/server';
import db from '@/utils/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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

    const booking = await db.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: true },
      include: { guest: true },
    });

    const response = NextResponse.redirect(new URL('/bookings', req.url));
    if (booking.guestId) {
      response.cookies.set('guestId', booking.guestId, {
        path: '/',
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
