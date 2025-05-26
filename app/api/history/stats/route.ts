import prisma from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  const { userId } = auth();
  if (!userId) return new NextResponse('Unauthorized', { status: 401 });

  const stats = await prisma.viewHistory.groupBy({
    by: ['propertyId'],
    where: { profileId: userId },
    _count: true,
  });

  return NextResponse.json(stats);
};
