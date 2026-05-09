import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, storyId } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 });
    }

    // Wrap content in spoiler-masked format
    const spoileredContent = `||${content}||`;

    const spoiler = await prisma.spoilerTag.create({
      data: {
        originalContent: content,
        maskedContent: spoileredContent,
        storyId: storyId || null,
      },
    });

    return NextResponse.json(spoiler, { status: 201 });
  } catch (error) {
    console.error('Error creating spoiler tag:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
