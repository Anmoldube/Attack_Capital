import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

async function getSession(req: NextRequest) {
    try {
        const headersList = await headers();
        const cookieHeader = headersList.get('cookie') || '';

        const session = await auth.api.getSession({
            headers: {
                cookie: cookieHeader,
            },
        });

        return session;
    } catch (error) {
        console.error('Session retrieval error:', error);
        return null;
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession(request);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { body } = await request.json();

        if (!body || typeof body !== 'string') {
            return NextResponse.json({ error: 'Message body is required' }, { status: 400 });
        }

        // Check if message exists and user is the owner
        const existingMessage = await prisma.message.findUnique({
            where: { id: params.id },
        });

        if (!existingMessage) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        if (existingMessage.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Update message
        const message = await prisma.message.update({
            where: { id: params.id },
            data: { body },
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error('Error updating message:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession(request);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if message exists and user is the owner
        const existingMessage = await prisma.message.findUnique({
            where: { id: params.id },
        });

        if (!existingMessage) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        if (existingMessage.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Delete message
        const message = await prisma.message.delete({
            where: { id: params.id },
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error('Error deleting message:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}