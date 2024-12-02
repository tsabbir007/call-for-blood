import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.redirect('/');
        }

        const email = session.user.email;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.redirect('/');
        }

        const email = session.user.email;
        const { name, age, bloodGroup, phoneNumber, division, district, upazilla, occupation } = await req.json();
        console.log(name, age, bloodGroup, phoneNumber, division, district, upazilla, occupation);

        if (!name || !age || !bloodGroup || !phoneNumber || !division || !district || !upazilla || !occupation) {
            return new Response("Bad Request", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                name,
                age,
                bloodGroup,
                phoneNumber,
                division,
                district,
                upazilla,
                occupation
            },
        });

        return NextResponse.json({ message: "User updated successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}