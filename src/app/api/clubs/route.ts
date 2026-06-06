import { NextRequest, NextResponse } from 'next/server';
import { getAuth, getCurrentUser } from '@/lib/auth';
import { hasFeatureAccess, paidFeatureError } from '@/lib/entitlements';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

/**
 * GET /api/clubs
 * Fetch all clubs with optional filters
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get('genre');
    const isPrivate = searchParams.get('isPrivate') === 'true';
    const search = searchParams.get('search');

    const where: any = {};
    if (genre) where.genre = genre;
    if (isPrivate !== undefined && searchParams.has('isPrivate')) where.isPrivate = isPrivate;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const clubs = await prisma.club.findMany({
      where,
      include: {
        owner: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        members: {
          select: { userId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(clubs);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clubs' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clubs
 * Create a new club
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await hasFeatureAccess(user, 'AUTHOR'))) {
      return NextResponse.json(paidFeatureError('AUTHOR'), { status: 402 });
    }

    const { name, description, genre, isPrivate, coverUrl, maxMembers } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Club name is required' },
        { status: 400 }
      );
    }

    // Check if club name already exists
    const existing = await prisma.club.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Club name already taken' },
        { status: 409 }
      );
    }

    const club = await prisma.club.create({
      data: {
        name,
        description: description || null,
        genre: genre || null,
        isPrivate: isPrivate || false,
        coverUrl: coverUrl || null,
        maxMembers: maxMembers ? parseInt(maxMembers) : 50,
        ownerId: user.id,
        joinCode: crypto.randomBytes(3).toString('hex').toUpperCase(),
        members: {
          create: {
            userId: user.id,
            role: 'ADMIN',
          },
        },
      },
      include: {
        owner: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        members: {
          select: { userId: true },
        },
      },
    });

    return NextResponse.json(club, { status: 201 });
  } catch (error) {
    console.error('Error creating club:', error);
    return NextResponse.json(
      { error: 'Failed to create club' },
      { status: 500 }
    );
  }
}
