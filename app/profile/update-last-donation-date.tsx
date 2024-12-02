import {useRouter} from "next/navigation";
import {useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {format} from "date-fns";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";

const donationFormSchema = z.object({
    donatedAt: z.date({
        required_error: "A date of donation is required.",
    }),
});


export default function UpdateLastDonationDate() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof donationFormSchema>>({
        resolver: zodResolver(donationFormSchema),
        defaultValues: {
            donatedAt: new Date(),
        },
    });

    const onSubmit = async (data: z.infer<typeof donationFormSchema>) => {
        setLoading(true);
        try {
            const response = await fetch('/api/donation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                toast.success('Donation added successfully');
                router.push('/');
            } else {
                throw new Error('Failed to add donation');
            }
        } catch (error) {
            toast.error('Failed to add donation');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                    control={form.control}
                    name="donatedAt"
                    render={({field}) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className={`font-bold text-base`}>Last Donation Date</FormLabel>
                            <FormControl>
                                <Input
                                    id="lastDonatedAt"
                                    name="lastDonatedAt"
                                    type="date"
                                    value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    Update
                </Button>
            </form>
        </Form>
    );
}