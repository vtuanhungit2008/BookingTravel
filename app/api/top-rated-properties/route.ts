// app/api/top-rated-properties/route.ts

import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';

// ✅ Tái tạo cache sau mỗi 60 giây
export const revalidate = 60;

export async function GET(req: NextRequest) {
  // Lấy top 5 property có rating trung bình cao nhất
  const ratings = await db.review.groupBy({
    by: ['propertyId'],
    _avg: { rating: true },
    _count: { rating: true },
    orderBy: {
      _avg: { rating: 'desc' },
    },
    take: 5,
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

  return NextResponse.json(merged, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate',
    },
  });
}
