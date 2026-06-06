import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const quiz = await prisma.onboardingQuiz.findFirst({
      where: { userId: user.id },
    });

    if (!quiz) {
      return NextResponse.json(
        { completed: false, message: 'Quiz not started' },
        { status: 200 }
      );
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { genrePreferences, readingLevel, favoriteAuthors, phoneNumber, address, nationality } = body;

    if (!genrePreferences || genrePreferences.length === 0) {
      return NextResponse.json(
        { error: 'At least one genre preference is required' },
        { status: 400 }
      );
    }

    const quiz = await prisma.onboardingQuiz.upsert({
      where: { userId: user.id },
      update: {
        genrePreferences,
        readingLevel: readingLevel || 'INTERMEDIATE',
        favoriteAuthors: favoriteAuthors || [],
        completed: true,
      },
      create: {
        userId: user.id,
        genrePreferences,
        readingLevel: readingLevel || 'INTERMEDIATE',
        favoriteAuthors: favoriteAuthors || [],
        completed: true,
      },
    });

    if (phoneNumber !== undefined || address !== undefined || nationality !== undefined) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(phoneNumber !== undefined && { phoneNumber: phoneNumber || null }),
          ...(address !== undefined && { address: address || null }),
          ...(nationality !== undefined && { nationality: nationality || null }),
        },
      });
    }

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error('Error saving quiz:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
