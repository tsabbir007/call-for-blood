'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MoreHorizontal } from "lucide-react"
import toast from "react-hot-toast"
import { UserProfileForm, userFormSchema } from '@/app/profile/user-profile-form'
import { z } from 'zod'

// Extend the user form schema to include admin-specific fields
const editUserSchema = z.object({
    ...userFormSchema.shape,
    email: z.string().email('Invalid email address'),
    role: z.enum(['USER', 'ADMIN']),
    isVerified: z.boolean(),
})

type EditUserFormData = z.infer<typeof editUserSchema>

interface Donor {
    id: string
    email: string
    isVerified: boolean
    role: string
    name: string
    image: string | null
    bloodGroup: string | null
    phoneNumber: string | null
    division: string | null
    district: string | null
    upazilla: string | null
    occupation: string | null
    age: string | null
    lastDonatedAt: Date | null
}

export default function ActionCell({ donor }: { donor: Donor }) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const initialData: EditUserFormData = {
        name: donor.name,
        email: donor.email,
        age: donor.age || '',
        bloodGroup: donor.bloodGroup || '',
        phoneNumber: donor.phoneNumber || '',
        division: donor.division || '',
        district: donor.district || '',
        upazilla: donor.upazilla || '',
        occupation: donor.occupation || '',
        role: donor.role as 'USER' | 'ADMIN',
        isVerified: donor.isVerified,
    }

    const handleSubmit = async (data: EditUserFormData) => {
        setLoading(true)
        try {
            const response = await fetch(`/api/donors/${donor.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to update user')
            }

            toast.success('User updated successfully')
            setIsOpen(false)
        } catch (error) {
            console.error('Error updating user:', error)
            toast.error(error instanceof Error ? error.message : 'Error updating user')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <UserProfileForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    loading={loading}
                    showAdminFields
                />
            </DialogContent>
        </Dialog>
    )
}