import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET(req: NextRequest) {
  // Truy vấn đánh giá trung bình cho mỗi property
  const ratings = await db.review.groupBy({
    by: ['propertyId'],
    _avg: { rating: true },
    _count: { rating: true },
    orderBy: {
      _avg: { rating: 'desc' }, // sắp xếp theo rating trung bình
    },
    take: 3,
  });

  const propertyIds = ratings.map((r) => r.propertyId);

  const properties = await db.property.findMany({
    where: {
      id: { in: propertyIds },
    },
    select: {
      id: true,
      name: true,
      image: true,
      tagline: true,
    },
  });

  const merged = properties.map((p) => {
    const r = ratings.find((x) => x.propertyId === p.id);
    return {
      ...p,
      rating: r?._avg.rating?.toFixed(1),
      reviewCount: r?._count.rating,
    };
  });

  return NextResponse.json(merged);
}
