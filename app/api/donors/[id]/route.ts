import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params

    if (!id) {
        return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
        where: { id },
        select: {email: true}
    });

    if(user?.email === "satsabbir11@gmail.com") {
        return NextResponse.json({ error: 'You cannot update this user' }, { status: 403 })
    }

    try {
        const userData = await request.json()

        const { email, id: userId, ...updateData } = userData
        const sanitizedData: any = {}

        if (updateData.name) sanitizedData.name = String(updateData.name)
        if (updateData.role) sanitizedData.role = String(updateData.role)
        if (updateData.bloodGroup) sanitizedData.bloodGroup = String(updateData.bloodGroup)
        if (updateData.phoneNumber) sanitizedData.phoneNumber = String(updateData.phoneNumber)
        if (updateData.division) sanitizedData.division = String(updateData.division)
        if (updateData.district) sanitizedData.district = String(updateData.district)
        if (updateData.upazilla) sanitizedData.upazilla = String(updateData.upazilla)
        if (updateData.occupation) sanitizedData.occupation = String(updateData.occupation)
        if (updateData.age) sanitizedData.age = String(updateData.age)
        if (updateData.isVerified !== undefined) sanitizedData.isVerified = Boolean(updateData.isVerified)

        // Convert lastDonatedAt to Date object if it exists
        if (updateData.lastDonatedAt) {
            sanitizedData.lastDonatedAt = new Date(updateData.lastDonatedAt)
            if (isNaN(sanitizedData.lastDonatedAt.getTime())) {
                return NextResponse.json({ error: 'Invalid date for lastDonatedAt' }, { status: 400 })
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: sanitizedData,
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}