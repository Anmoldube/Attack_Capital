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

        const { name } = await request.json();

        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 });
        }

        // Update workspace
        const workspace = await prisma.team.update({
            where: { id: params.id },
            data: { name },
        });

        return NextResponse.json(workspace);
    } catch (error) {
        console.error('Error updating workspace:', error);
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

        // Delete workspace
        const workspace = await prisma.team.delete({
            where: { id: params.id },
        });

        return NextResponse.json(workspace);
    } catch (error) {
        console.error('Error deleting workspace:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}