"use client";

import {useState, useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation'
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ArrowLeft, Loader2, Edit, CalendarIcon, ChevronLeft} from "lucide-react";
import {useSession} from "next-auth/react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import toast, {Toaster} from 'react-hot-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import UpdateLastDonationDate from "@/app/profile/update-last-donation-date";

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
    const {data: session, status} = useSession();
    const [userData, setUserData] = useState({
        name: '',
        age: '',
        bloodGroup: '',
        phoneNumber: '',
        division: '',
        district: '',
        upazilla: '',
        occupation: '',
    });
    const [divisions, setDivisions] = useState<string[]>([]);
    const [districts, setDistricts] = useState<{ district: string; upazilla: string[] }[]>([]);
    const [upazillas, setUpazillas] = useState<string[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const userForm = useForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: userData,
    });

    useEffect(() => {
        if (session?.user) {
            fetchUserData();
        }
        fetchDivisions();
    }, [session]);


    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/user', {
                next: {revalidate: 1800} // Cache for 30 minutes
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

    const fetchDivisions = async () => {
        try {
            const response = await fetch('https://bdapis.com/api/v1.2/divisions');
            const data = await response.json();
            setDivisions(data.data.map((division: any) => division.division));
        } catch (error) {
            toast.error('Failed to fetch divisions');
        }
    };

    const fetchDistricts = async (division: string) => {
        try {
            const response = await fetch(`https://bdapis.com/api/v1.2/division/${division}`);
            const data = await response.json();
            setDistricts(data.data);
            userForm.setValue('district', '');
            userForm.setValue('upazilla', '');
        } catch (error) {
            toast.error('Failed to fetch districts');
        }
    };

    const updateUpazillas = (district: string) => {
        const selectedDistrict = districts.find(d => d.district === district);
        setUpazillas(selectedDistrict ? selectedDistrict.upazilla : []);
        userForm.setValue('upazilla', '');
    };

    const onUserSubmit = async (data: z.infer<typeof userFormSchema>) => {
        setLoading(true);
        try {
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                toast.success('Profile updated successfully');
                setUserData(data);
                setIsEditModalOpen(false);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin"/>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-6 w-6"/>
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-primary">Profile</h1>
                    <div className="w-10"/>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                <Card className="max-w-2xl mx-auto mb-8">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Avatar className="w-20 h-20">
                                    <AvatarImage src={image} alt={userData.name}/>
                                    <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-lg md:text-xl font-bold">{userData.name}</CardTitle>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Edit className="h-4 w-4"/>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[450px]">
                                    <DialogHeader>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your profile here. Click save when you are done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Form {...userForm}>
                                        <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
                                            <FormField
                                                control={userForm.control}
                                                name="name"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={userForm.control}
                                                name="age"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Age</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={userForm.control}
                                                name="bloodGroup"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Blood Group</FormLabel>
                                                        <Select onValueChange={field.onChange}
                                                                defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select blood group"/>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                                                                    <SelectItem key={group}
                                                                                value={group}>{group}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={userForm.control}
                                                name="phoneNumber"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Phone Number (BD🇧🇩 +88)</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <h2 className="text-lg font-semibold">Current Location</h2>
                                            <FormField
                                                control={userForm.control}
                                                name="division"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Division</FormLabel>
                                                        <Select onValueChange={(value) => {
                                                            field.onChange(value);
                                                            fetchDistricts(value);
                                                        }}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select division"/>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {divisions.map((division) => (
                                                                    <SelectItem key={division}
                                                                                value={division}>{division}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={userForm.control}
                                                name="district"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>District</FormLabel>
                                                        <Select onValueChange={(value) => {
                                                            field.onChange(value);
                                                            updateUpazillas(value);
                                                        }}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select district"/>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {districts.map((district) => (
                                                                    <SelectItem key={district.district}
                                                                                value={district.district}>{district.district}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={userForm.control}
                                                name="upazilla"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Upazilla</FormLabel>
                                                        <Select onValueChange={field.onChange}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select upazilla"/>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {upazillas.map((upazilla) => (
                                                                    <SelectItem key={upazilla}
                                                                                value={upazilla}>{upazilla}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={userForm.control}
                                                name="occupation"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Occupation</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" className="w-full" disabled={loading}>
                                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                                Save Changes
                                            </Button>
                                        </form>
                                    </Form>
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
                <div className={`flex justify-center`}>
                    <UpdateLastDonationDate/>
                </div>
            </main>
        </div>
    );
}