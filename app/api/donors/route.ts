import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import {auth} from "@/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const session = await auth();
    const isAuthenticated = !!session?.user?.email;
    let isAdmin = false;

    if (isAuthenticated && session?.user?.email) {
        const currentUser = await prisma.user.findUnique({
            where: {email: session.user.email},
            select: {role: true}
        });
        if (currentUser?.role === 'ADMIN') {
            isAdmin = true;
        }
    }

    const searchParams = request.nextUrl.searchParams;
    const division = searchParams.get('division');
    const district = searchParams.get('district');
    const upazilla = searchParams.get('upazilla');
    const availability = searchParams.get('availability');
    const bloodGroup = searchParams.get('bloodGroup');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const page_size = parseInt(searchParams.get('page_size') || '10', 10);
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

    const where: any = {
        bloodGroup: {not: null},
        //isVerified: true
    };

    if (division) {
        where.division = division;
    }

    if (district) {
        where.district = district;
    }

    if (upazilla) {
        where.upazilla = upazilla;
    }

    if (availability === 'available') {
        where.lastDonatedAt = {lte: fourMonthsAgo, not: null};
    } else if (availability === 'unavailable') {
        where.lastDonatedAt = {gt: fourMonthsAgo, not: null};
    }

    if (bloodGroup) {
        where.bloodGroup = bloodGroup;
    }

    if (search) {
        where.OR = [
            {name: {contains: search, mode: 'insensitive'}},
            {bloodGroup: {contains: search, mode: 'insensitive'}},
            {division: {contains: search, mode: 'insensitive'}},
            {district: {contains: search, mode: 'insensitive'}},
            {upazilla: {contains: search, mode: 'insensitive'}},
        ];
    }

    const count = await prisma.user.count({where});
    const previous = page > 1 ? page - 1 : null;
    const next = page * page_size < count ? page + 1 : null;

    const donors = await prisma.user.findMany({
        where,
        select: {
            id: true,
            name: true,
            bloodGroup: true,
            lastDonatedAt: true,
            division: true,
            district: true,
            upazilla: true,
            image: true,
            ...(isAuthenticated ? {
                email: true,
                isVerified: true,
                age: true,
            } : {}),
            ...(isAdmin ? {
                role: true,
                phoneNumber: true,
                occupation: true,
            } : {})
        },
        skip: (page - 1) * page_size,
        take: page_size,
    });

    const donorsWithLocation = donors.map((donor: any) => ({
        ...donor,
        current_location: donor.division && donor.district && donor.upazilla
            ? `${donor.upazilla}, ${donor.district}, ${donor.division}`
            : 'N/A',
    }));

    return NextResponse.json({count, previous, next, donors: donorsWithLocation});
}

export async function POST(request: NextRequest) {
    const session = await auth()

    if (!session || !session.user || !session.user.email) {
        return new NextResponse("Unauthorized", {status: 401})
    }

    const currentUser = await prisma.user.findUnique({
        where: {email: session.user.email},
        select: {role: true}
    })

    if (!currentUser || currentUser.role !== 'ADMIN') {
        return new NextResponse("Forbidden", {status: 403})
    }

    try {
        const userData = await request.json()

        // Validate required fields
        if (!userData.name || !userData.email) {
            return NextResponse.json({error: 'Name and email are required'}, {status: 400})
        }

        // Check if user with the same email already exists
        const existingUser = await prisma.user.findUnique({
            where: {email: userData.email}
        })

        if (existingUser) {
            return NextResponse.json({error: 'User with this email already exists'}, {status: 400})
        }

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                role: userData.role || 'USER',
                bloodGroup: userData.bloodGroup,
                phoneNumber: userData.phoneNumber,
                division: userData.division,
                district: userData.district,
                upazilla: userData.upazilla,
                occupation: userData.occupation,
                age: userData.age,
                isVerified: userData.isVerified || false,
            }
        })

        return NextResponse.json(newUser)
    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json({error: 'Failed to create user'}, {status: 500})
    } finally {
        await prisma.$disconnect()
    }
}