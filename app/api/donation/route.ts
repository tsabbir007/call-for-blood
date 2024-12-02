import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.redirect('/');
        }

        const email = session.user.email;
        const { donatedAt } = await req.json();

        console.log("nop", donatedAt);

        if (!donatedAt) {
            return new Response("Bad Request", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        const donation = await prisma.donation.create({
            data: {
                userId: user.id,
                donatedAt: new Date(donatedAt)
            },
        });

        await prisma.user.update({
            where: { id: user.id },
            data: {
                lastDonatedAt: new Date(donatedAt)
            },
        });

        return NextResponse.json(donation);
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}