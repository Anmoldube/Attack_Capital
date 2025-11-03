import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Generate a new join code
        const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Update workspace with new join code
        const workspace = await prisma.team.update({
            where: { id: params.id },
            data: { joinCode },
        });

        return NextResponse.json(workspace);
    } catch (error) {
        console.error('Error generating join code:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}