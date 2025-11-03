import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { joinCode } = await request.json();

        if (!joinCode || typeof joinCode !== 'string') {
            return NextResponse.json({ error: 'Join code is required' }, { status: 400 });
        }

        // Find workspace by join code
        const workspace = await prisma.team.findUnique({
            where: { joinCode },
        });

        if (!workspace) {
            return NextResponse.json({ error: 'Invalid join code' }, { status: 404 });
        }

        // Check if user is already a member
        const existingMember = await prisma.teamMember.findUnique({
            where: {
                teamId_userId: {
                    teamId: workspace.id,
                    userId: session.user.id,
                },
            },
        });

        if (existingMember) {
            return NextResponse.json({ error: 'Already a member' }, { status: 400 });
        }

        // Add user as member
        await prisma.teamMember.create({
            data: {
                teamId: workspace.id,
                userId: session.user.id,
                role: 'member',
            },
        });

        return NextResponse.json(workspace);
    } catch (error) {
        console.error('Error joining workspace:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}