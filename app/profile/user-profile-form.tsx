import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';

export const userFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    age: z.string().regex(/^[0-9]{1,3}$/, 'Invalid age').optional(),
    bloodGroup: z.string().regex(/^(A|B|AB|O)[+-]$/, 'Invalid blood group'),
    phoneNumber: z.string().regex(/^\+?[0-9]{11}$/, 'Invalid phone number').optional(),
    division: z.string().min(2, 'Division is required').optional(),
    district: z.string().min(2, 'District is required').optional(),
    upazilla: z.string().min(2, 'Upazilla is required').optional(),
    occupation: z.string().min(2).max(100).optional(),
    email: z.string().email('Invalid email address'),
    role: z.enum(['USER', 'ADMIN']),
    isVerified: z.boolean(),
});

export type UserFormData = z.infer<typeof userFormSchema>;

interface UserProfileFormProps {
    initialData: UserFormData;
    onSubmit: (data: UserFormData) => Promise<void>;
    loading?: boolean;
    showAdminFields?: boolean;
    buttonText?: string;
}

export function UserProfileForm({
    initialData,
    onSubmit,
    loading = false,
    showAdminFields = false,
    buttonText = 'Save Changes',
}: UserProfileFormProps) {
    const [divisions, setDivisions] = useState<string[]>([]);
    const [districts, setDistricts] = useState<{ district: string; upazilla: string[] }[]>([]);
    const [upazillas, setUpazillas] = useState<string[]>([]);

    const form = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: initialData,
    });

    useEffect(() => {
        fetchDivisions();
    }, []);

    const fetchDivisions = async () => {
        try {
            const response = await fetch('https://bdapis.com/api/v1.2/divisions');
            const data = await response.json();
            setDivisions(data.data.map((division: any) => division.division));
        } catch (error) {
            console.error('Failed to fetch divisions:', error);
        }
    };

    const fetchDistricts = async (division: string) => {
        try {
            const response = await fetch(`https://bdapis.com/api/v1.2/division/${division}`);
            const data = await response.json();
            setDistricts(data.data);
            form.setValue('district', '');
            form.setValue('upazilla', '');
        } catch (error) {
            console.error('Failed to fetch districts:', error);
        }
    };

    const updateUpazillas = (district: string) => {
        const selectedDistrict = districts.find(d => d.district === district);
        setUpazillas(selectedDistrict ? selectedDistrict.upazilla : []);
        form.setValue('upazilla', '');
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {showAdminFields && (
                    <>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="USER">User</SelectItem>
                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isVerified"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Verified User
                                        </FormLabel>
                                        <FormDescription>
                                            Mark this user as verified
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </>
                )}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Blood Group</FormLabel>
                            <Select onValueChange={field.onChange}
                                defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select blood group" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                                        <SelectItem key={group}
                                            value={group}>{group}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number (BD🇧🇩 +88)</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <h2 className="text-lg font-semibold">Current Location</h2>
                <FormField
                    control={form.control}
                    name="division"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Division</FormLabel>
                            <Select onValueChange={(value) => {
                                field.onChange(value);
                                fetchDistricts(value);
                            }}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select division" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {divisions.map((division) => (
                                        <SelectItem key={division}
                                            value={division}>{division}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>District</FormLabel>
                            <Select onValueChange={(value) => {
                                field.onChange(value);
                                updateUpazillas(value);
                            }}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select district" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {districts.map((district) => (
                                        <SelectItem key={district.district}
                                            value={district.district}>{district.district}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="upazilla"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Upazilla</FormLabel>
                            <Select onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select upazilla" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {upazillas.map((upazilla) => (
                                        <SelectItem key={upazilla}
                                            value={upazilla}>{upazilla}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-between gap-4">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {buttonText ? buttonText : showAdminFields ? 'Add User' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}