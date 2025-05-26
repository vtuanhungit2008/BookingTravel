import prisma from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await prisma.profile.update({
      where: { id: params.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        username: body.username,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.profile.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
