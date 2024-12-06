"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UserProfileForm, UserFormData } from "./user-profile-form";
import { UserProfileCard } from "./user-profile-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import UpdateLastDonationDate from "./update-last-donation-date";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';


const userFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
    age: z.string().regex(/^[0-9]{1,3}$/, 'Invalid age'),
    bloodGroup: z.string().regex(/^(A|B|AB|O)[+-]$/, 'Invalid blood group'),
    phoneNumber: z.string().regex(/^\+?[0-9]{11}$/, 'Invalid phone number'),
    division: z.string().min(2, 'Division is required'),
    district: z.string().min(2, 'District is required'),
    upazilla: z.string().min(2, 'Upazilla is required'),
    occupation: z.string().min(2, 'Occupation must be at least 2 characters').max(100, 'Occupation must be at most 100 characters'),
});

export default function ProfilePage() {
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<UserFormData>({
        name: '',
        age: '',
        bloodGroup: '',
        phoneNumber: '',
        division: '',
        district: '',
        upazilla: '',
        occupation: '',
        email: '',
        role: 'USER' as const,
        isVerified: false
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const userForm = useForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: userData,
    });

    useEffect(() => {
        if (session?.user) {
            fetchUserData();
        }
    }, [session]);


    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/user', {
                next: { revalidate: 1800 } // Cache for 30 minutes
            });
            const data = await response.json();
            setUserData(data);
            setImage(data.image);
            userForm.reset(data);
        } catch (error) {
            toast.error('Failed to fetch user data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (data: UserFormData) => {
        const response = await fetch('/api/user', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        setUserData(data);
    };

    if (status === "loading" || loading) {
        return <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-primary">Profile</h1>
                    <div className="w-10" />
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                <UserProfileCard
                    userData={userData}
                    image={image}
                    onUpdateProfile={handleUpdateProfile}
                />

                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="sm:max-w-[450px]">
                        <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you are done.
                            </DialogDescription>
                        </DialogHeader>
                        <UserProfileForm
                            initialData={userData}
                            onSubmit={handleUpdateProfile}
                        />
                    </DialogContent>
                </Dialog>

                <div className="flex justify-center">
                    <UpdateLastDonationDate />
                </div>
            </main>
        </div>
    );
}
