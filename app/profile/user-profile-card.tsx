import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { UserProfileForm, UserFormData } from "./user-profile-form";
import { useState } from "react";

interface UserProfileCardProps {
    userData: UserFormData;
    image: string;
    onUpdateProfile: (data: UserFormData) => Promise<void>;
    loading?: boolean;
}

export function UserProfileCard({ 
    userData, 
    image, 
    onUpdateProfile,
    loading = false 
}: UserProfileCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSubmit = async (data: UserFormData) => {
        await onUpdateProfile(data);
        setIsDialogOpen(false);
    };

    return (
        <Card className="max-w-2xl mx-auto mb-8">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={image} alt={userData.name} />
                            <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-lg md:text-xl font-bold">{userData.name}</CardTitle>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px]">
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you are done.
                                </DialogDescription>
                            </DialogHeader>
                            <UserProfileForm 
                                initialData={userData}
                                onSubmit={handleSubmit}
                                loading={loading}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold">Age</h3>
                        <p>{userData.age}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Blood Group</h3>
                        <p>{userData.bloodGroup}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Phone Number</h3>
                        <p>{userData.phoneNumber}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Current Location</h3>
                        {userData.division && (
                            <p>{`${userData.upazilla}, ${userData.district}, ${userData.division}`}</p>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold">Occupation</h3>
                        <p>{userData.occupation}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}