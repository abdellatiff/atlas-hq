import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, output, error, priority } = body;

    const updateData: Record<string, unknown> = {};

    if (status !== undefined) {
      updateData.status = status;

      if (status === 'active' && !body.startedAt) {
        updateData.startedAt = new Date();
      }

      if ((status === 'completed' || status === 'failed') && !body.completedAt) {
        updateData.completedAt = new Date();

        // Calculate duration if we have a startedAt
        const existingTask = await prisma.task.findUnique({ where: { id } });
        if (existingTask?.startedAt) {
          updateData.duration = Math.floor(
            (Date.now() - existingTask.startedAt.getTime()) / 1000
          );
        }
      }
    }

    if (output !== undefined) updateData.output = output;
    if (error !== undefined) updateData.error = error;
    if (priority !== undefined) updateData.priority = priority;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
