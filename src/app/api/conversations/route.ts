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

        const { workspaceId, participantId } = await request.json();

        if (!workspaceId || typeof workspaceId !== 'string') {
            return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
        }

        if (!participantId || typeof participantId !== 'string') {
            return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
        }

        // Check if conversation already exists
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                workspaceId,
                AND: {
                    members: {
                        every: {
                            OR: [
                                { userId: session.user.id },
                                { userId: participantId },
                            ],
                        },
                    },
                },
            },
        });

        if (existingConversation) {
            return NextResponse.json(existingConversation);
        }

        // Create new conversation
        const conversation = await prisma.conversation.create({
            data: {
                workspaceId,
                members: {
                    create: [
                        { userId: session.user.id },
                        { userId: participantId },
                    ],
                },
            },
        });

        return NextResponse.json(conversation);
    } catch (error) {
        console.error('Error creating/getting conversation:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}