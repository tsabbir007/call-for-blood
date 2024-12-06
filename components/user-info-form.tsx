'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from 'lucide-react';

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

export function UserInfoForm({ 
  onSubmit, 
  initialData, 
  loading, 
  divisions, 
  districts, 
  upazillas, 
  onDivisionChange, 
  onDistrictChange 
}: {
  onSubmit: (data: z.infer<typeof userFormSchema>) => void;
  initialData: z.infer<typeof userFormSchema>;
  loading: boolean;
  divisions: string[];
  districts: any[];
  upazillas: string[];
  onDivisionChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
}) {
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
          name="bloodGroup"
          render={({field}) => (
            <FormItem>
              <FormLabel>Blood Group</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
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
          control={form.control}
          name="division"
          render={({field}) => (
            <FormItem>
              <FormLabel>Division</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                onDivisionChange(value);
              }}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select division"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {divisions.map((division) => (
                    <SelectItem key={division} value={division}>{division}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="district"
          render={({field}) => (
            <FormItem>
              <FormLabel>District</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                onDistrictChange(value);
              }}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.district} value={district.district}>{district.district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
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
                    <SelectItem key={upazilla} value={upazilla}>{upazilla}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
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
  );
}

