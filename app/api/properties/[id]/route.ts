import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name } = await req.json();
    const updated = await prisma.property.update({
      where: { id: params.id },
      data: { name },
    });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.property.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
