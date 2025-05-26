import { auth } from '@clerk/nextjs/server';
import prisma from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

import { startOfDay, endOfDay } from 'date-fns';

export const POST = async (req: NextRequest) => {
  const { userId } = auth();
  if (!userId) return new NextResponse('Unauthorized', { status: 401 });

  const { propertyId } = await req.json();
  if (!propertyId) return new NextResponse('Missing propertyId', { status: 400 });

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const exists = await prisma.viewHistory.findFirst({
    where: {
      profileId: userId,
      propertyId,
      viewedAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  if (exists) {
    return NextResponse.json({ message: 'Already viewed today' });
  }

  await prisma.viewHistory.create({
    data: { profileId: userId, propertyId },
  });

  return NextResponse.json({ success: true });
};

export const GET = async () => {
  const { userId } = auth();
  if (!userId) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const history = await prisma.viewHistory.findMany({
      where: { profileId: userId },
      orderBy: { viewedAt: 'desc' },
      include: { property: true },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return new NextResponse('Error', { status: 500 });
  }
};
export const DELETE = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const { userId } = auth();
  const id = searchParams.get("id");

  if (!userId || !id) return new NextResponse('Unauthorized', { status: 401 });

  await prisma.viewHistory.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
};

