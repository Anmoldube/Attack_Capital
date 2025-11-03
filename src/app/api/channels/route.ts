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

        const { name, workspaceId } = await request.json();

        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: 'Channel name is required' }, { status: 400 });
        }

        if (!workspaceId || typeof workspaceId !== 'string') {
            return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
        }

        // Create new channel
        const channel = await prisma.channel.create({
            data: {
                name,
                workspaceId,
            },
        });

        return NextResponse.json(channel);
    } catch (error) {
        console.error('Error creating channel:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}