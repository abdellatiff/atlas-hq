import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const projectId = searchParams.get('projectId');

    const since = new Date();
    since.setDate(since.getDate() - days);

    // Base query filter
    const baseFilter: any = {
      createdAt: { gte: since },
    };
    if (projectId) baseFilter.projectId = projectId;

    // Get all events
    const events = await prisma.analyticsEvent.findMany({
      where: baseFilter,
      orderBy: { createdAt: 'desc' },
    });

    // Aggregate stats by type
    const typeStats = await prisma.analyticsEvent.groupBy({
      by: ['type'],
      where: baseFilter,
      _count: true,
    });

    // Parse tool usage from events
    const toolUsage: Record<string, number> = {};
    const channelDistribution: Record<string, number> = {};
    const dailyActivity: Record<string, number> = {};
    let totalMessages = 0;
    let totalToolCalls = 0;
    let totalTokens = 0;

    events.forEach((event) => {
      const data = event.data ? JSON.parse(event.data) : {};
      
      // Count by event type
      switch (event.type) {
        case 'message':
          totalMessages++;
          if (data.channel) {
            channelDistribution[data.channel] = (channelDistribution[data.channel] || 0) + 1;
          }
          break;
        case 'tool_call':
          totalToolCalls++;
          if (data.tool) {
            toolUsage[data.tool] = (toolUsage[data.tool] || 0) + 1;
          }
          break;
        case 'task_complete':
          if (data.tokens) totalTokens += data.tokens;
          break;
      }

      // Daily activity
      const day = event.createdAt.toISOString().split('T')[0];
      dailyActivity[day] = (dailyActivity[day] || 0) + 1;
    });

    // Get project activity
    const projectActivity = await prisma.analyticsEvent.groupBy({
      by: ['projectId'],
      where: baseFilter,
      _count: true,
    });

    // Enrich with project names
    const projectIds = projectActivity
      .filter((p) => p.projectId)
      .map((p) => p.projectId);
    
    const projects = projectIds.length > 0
      ? await prisma.project.findMany({
          where: { id: { in: projectIds as string[] } },
          select: { id: true, name: true },
        })
      : [];

    const projectActivityWithNames = projectActivity.map((p) => ({
      projectId: p.projectId,
      count: p._count,
      name: projects.find((proj) => proj.id === p.projectId)?.name || 'Unknown',
    }));

    return NextResponse.json({
      summary: {
        totalMessages,
        totalToolCalls,
        totalTokens,
        activeDays: Object.keys(dailyActivity).length,
        period: days,
      },
      events: events.slice(0, 100), // Last 100 events
      stats: typeStats.reduce((acc, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {} as Record<string, number>),
      toolUsage,
      channelDistribution,
      dailyActivity,
      projectActivity: projectActivityWithNames,
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
    const { type, data, projectId, channel, tool } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'type is required' },
        { status: 400 }
      );
    }

    // Enrich data with channel/tool info for better analytics
    const enrichedData = {
      ...(data || {}),
      ...(channel && { channel }),
      ...(tool && { tool }),
      timestamp: new Date().toISOString(),
    };

    const event = await prisma.analyticsEvent.create({
      data: {
        type,
        data: JSON.stringify(enrichedData),
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
