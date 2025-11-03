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

        const { value, messageId } = await request.json();

        if (!value || typeof value !== 'string') {
            return NextResponse.json({ error: 'Reaction value is required' }, { status: 400 });
        }

        if (!messageId || typeof messageId !== 'string') {
            return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
        }

        // Check if reaction already exists
        const existingReaction = await prisma.reaction.findUnique({
            where: {
                messageId_userId_value: {
                    messageId,
                    userId: session.user.id,
                    value,
                },
            },
        });

        if (existingReaction) {
            // Delete the reaction (toggle off)
            await prisma.reaction.delete({
                where: {
                    messageId_userId_value: {
                        messageId,
                        userId: session.user.id,
                        value,
                    },
                },
            });

            return NextResponse.json({ deleted: true });
        }

        // Create new reaction (toggle on)
        const reaction = await prisma.reaction.create({
            data: {
                messageId,
                userId: session.user.id,
                value,
            },
        });

        return NextResponse.json(reaction);
    } catch (error) {
        console.error('Error toggling reaction:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}