import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const type = searchParams.get('type');

    const artifacts = await prisma.artifact.findMany({
      where: {
        ...(projectId && { projectId }),
        ...(type && { type }),
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(artifacts);
  } catch (error) {
    console.error('Error fetching artifacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artifacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, filePath, fileName, type, language, size, conversationId, metadata } = body;

    if (!filePath || !fileName || !type) {
      return NextResponse.json(
        { error: 'filePath, fileName, and type are required' },
        { status: 400 }
      );
    }

    const artifact = await prisma.artifact.create({
      data: {
        projectId,
        filePath,
        fileName,
        type,
        language,
        size,
        conversationId,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(artifact, { status: 201 });
  } catch (error) {
    console.error('Error creating artifact:', error);
    return NextResponse.json(
      { error: 'Failed to create artifact' },
      { status: 500 }
    );
  }
}
