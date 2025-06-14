import Stripe from 'stripe';
import { type NextRequest, type NextResponse } from 'next/server';
import db from '@/utils/db';
import { formatDate } from '@/utils/format';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const POST = async (req: NextRequest, res: NextResponse) => {
  const { bookingId } = await req.json();
  console.log("b",bookingId);
  
  if (!bookingId) {
    return Response.json(
      { error: 'Missing bookingId' },
      { status: 400 }
    );
  }

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      property: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  if (!booking) {
    return Response.json(
      { error: 'Booking not found' },
      { status: 404 }
    );
  }

  const requestHeaders = new Headers(req.headers);
  const origin = requestHeaders.get('origin') ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  const {
    totalNights,
    orderTotal,
    checkIn,
    checkOut,
    property: { image, name },
  } = booking;

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      metadata: { bookingId: booking.id,
         guestId: booking.guestId ?? '',
       },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${name}`,
              images: [image],
              description: `Stay in this wonderful place for ${totalNights} nights, from ${formatDate(
                checkIn
              )} to ${formatDate(checkOut)}. Enjoy your stay!`,
            },
            unit_amount: orderTotal * 100,
          },
        },
      ],
      mode: 'payment',
      return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`,
    });

    return Response.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Stripe error:', error);
    return Response.json(
      { error: 'Stripe session creation failed' },
      { status: 500 }
    );
  }
};
