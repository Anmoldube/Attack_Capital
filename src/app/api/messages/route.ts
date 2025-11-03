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

export async function POST(request: NextRequest) {
    try {
        const session = await getSession(request);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { body, image, workspaceId, channelId, conversationId, parentMessageId } = await request.json();

        if (!body || typeof body !== 'string') {
            return NextResponse.json({ error: 'Message body is required' }, { status: 400 });
        }

        if (!workspaceId || typeof workspaceId !== 'string') {
            return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                body,
                image,
                workspaceId,
                channelId,
                conversationId,
                parentMessageId,
                userId: session.user.id,
            },
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error('Error creating message:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}