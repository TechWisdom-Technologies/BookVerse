import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get conversations with most recent message
    const conversations = await prisma.message.findMany({
      where: {
        OR: [{ senderId: user.uid }, { recipientId: user.uid }],
      },
      select: {
        id: true,
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
        recipient: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
        content: true,
        createdAt: true,
        read: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // Group by conversation partner
    const groupedConversations = conversations.reduce((acc: any[], msg) => {
      const partnerId = msg.senderId === user.uid ? msg.recipientId : msg.senderId;
      const partner = msg.senderId === user.uid ? msg.recipient : msg.sender;

      const existing = acc.find((conv) => conv.partnerId === partnerId);
      if (!existing) {
        acc.push({
          partnerId,
          partner,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unread: !msg.read && msg.recipientId === user.uid,
        });
      }
      return acc;
    }, []);

    return NextResponse.json(groupedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { recipientId, content } = body;

    if (!recipientId || !content || !content.trim()) {
      return NextResponse.json(
        { error: 'Recipient and message content are required' },
        { status: 400 }
      );
    }

    if (recipientId === user.uid) {
      return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 });
    }

    // Check if recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
      select: { id: true },
    });

    if (!recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: user.uid,
        recipientId,
        content: content.trim(),
        read: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
        recipient: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
