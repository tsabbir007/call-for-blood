import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    const session = await auth()

    if (!session || !session.user || !session.user.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            role: true,
            email: true,
            isVerified: true,
            name: true,
        }
    });

    if (!user) {
        return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({
        role: user.role,
        email: user.email,
        isVerified: user.isVerified,
        name: user.name,
    })
}