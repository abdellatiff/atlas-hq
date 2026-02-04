import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const projectId = searchParams.get('projectId');
    const days = parseInt(searchParams.get('days') || '7');

    const since = new Date();
    since.setDate(since.getDate() - days);

    const events = await prisma.analyticsEvent.findMany({
      where: {
        ...(type && { type }),
        ...(projectId && { projectId }),
        createdAt: {
          gte: since,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Also return aggregated stats
    const stats = await prisma.analyticsEvent.groupBy({
      by: ['type'],
      where: {
        createdAt: {
          gte: since,
        },
      },
      _count: true,
    });

    return NextResponse.json({
      events,
      stats: stats.reduce((acc, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, projectId } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'type is required' },
        { status: 400 }
      );
    }

    const event = await prisma.analyticsEvent.create({
      data: {
        type,
        data: data ? JSON.stringify(data) : null,
        projectId,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating analytics event:', error);
    return NextResponse.json(
      { error: 'Failed to create analytics event' },
      { status: 500 }
    );
  }
}
