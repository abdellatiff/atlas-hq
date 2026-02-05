import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get('channel');
    const projectId = searchParams.get('projectId');
    const limit = parseInt(searchParams.get('limit') || '50');

    const conversations = await prisma.conversation.findMany({
      where: {
        ...(channel && { channel }),
        ...(projectId && { projectId }),
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
    });

    // Transform to include stats
    const enrichedConversations = conversations.map((conv) => ({
      id: conv.id,
      channel: conv.channel,
      preview: conv.summary || 'No preview available',
      toolCalls: conv.metadata ? JSON.parse(conv.metadata).toolCalls || 0 : 0,
      filesCreated: conv.metadata ? JSON.parse(conv.metadata).filesCreated || 0 : 0,
      updatedAt: conv.updatedAt,
      title: conv.title || `Conversation on ${conv.channel}`,
    }));

    return NextResponse.json(enrichedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, channel, projectId, title, summary, metadata } = body;

    if (!sessionId || !channel) {
      return NextResponse.json(
        { error: 'sessionId and channel are required' },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.create({
      data: {
        sessionId,
        channel,
        projectId,
        title,
        summary,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
