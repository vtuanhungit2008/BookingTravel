import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get('propertyId');

  if (!propertyId) {
    return NextResponse.json({ error: 'Missing propertyId' }, { status: 400 });
  }

  try {
    const result = await db.review.groupBy({
      by: ['propertyId'],
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
      where: {
        propertyId,
      },
    });

    const data = {
      rating: result[0]?._avg.rating?.toFixed(1) ?? 0,
      count: result[0]?._count.rating ?? 0,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching rating:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
