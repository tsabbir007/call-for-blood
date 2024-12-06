'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserPlus} from 'lucide-react'
import toast from "react-hot-toast"
import { UserProfileForm, userFormSchema } from '@/app/profile/user-profile-form'
import { z } from 'zod'

// Extend the user form schema to include admin-specific fields
const addUserSchema = z.object({
    ...userFormSchema.shape, // Reuse the base user form schema
    email: z.string().email('Invalid email address'),
    role: z.enum(['USER', 'ADMIN']),
    isVerified: z.boolean(),
})

type AddUserFormData = z.infer<typeof addUserSchema>

export default function AddUserDialog({ onUserAdded }: { onUserAdded?: () => void }) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const initialData: AddUserFormData = {
        name: '',
        email: '',
        age: '',
        bloodGroup: '',
        phoneNumber: '',
        division: '',
        district: '',
        upazilla: '',
        occupation: '',
        role: 'USER',
        isVerified: false,
    }

    const handleSubmit = async (data: AddUserFormData) => {
        setLoading(true)
        try {
            const response = await fetch('/api/donors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to add user')
            }

            toast.success('User added successfully')
            setIsOpen(false)
            onUserAdded?.()
        } catch (error) {
            console.error('Error adding user:', error)
            toast.error(error instanceof Error ? error.message : 'Error adding user')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </DialogTrigger>
            <DialogContent className="h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
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