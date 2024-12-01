import React from 'react'

import { FormControl, FormField, FormLabel, FormItem, FormMessage, Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { FarmTypes } from './crop-management-form'
import { Input } from '@/components/ui/input'


const FormSchema = z.object({
    ownership: z.object({
        owner: z.object({
            name: z.string().nonempty({ message: "Owner's name is required." }),
            contact: z.string().nonempty({ message: "Contact information is required." }),
            role: z.string().nonempty({ message: "Role in farm operations is required." }),
        })
    }),
});

export default function OwnerForm({
    farm,
    setIsOpen
}: {
    farm: FarmTypes,
    setIsOpen: (value: boolean) => void
}) {
    const updateOwner = useMutation(api.agriculturalPlots.updateOwner)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            ownership: {
                owner: {
                    name: farm.ownership?.owner.name,
                    contact: farm.ownership?.owner.contact,
                    role: farm.ownership?.owner.role,
                }
            },
        },
    });

    function onSubmit(values: z.infer<typeof FormSchema>) {
        toast.promise(
            updateOwner({
                agriculturalPlotId: farm._id,
                ownership: {
                    owner: {
                        name: values.ownership.owner.name,
                        contact: values.ownership.owner.contact,
                        role: values.ownership.owner.role,
                    }
                },
            }),
            {
                loading: "Updating farm information...",
                success: "Farm updated successfully!",
                error: "Failed to update farm information.",
            }
        );
        setIsOpen(false);
    }
  return (
    <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                    control={form.control}
                    name="ownership.owner.name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">
                                Owner Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter owner's name"
                                    {...field}
                                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="ownership.owner.contact"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">
                                Owner Contact <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter owner's contact"
                                    {...field}
                                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="ownership.owner.role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">
                                Owner Role <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter owner's role"
                                    {...field}
                                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
              
                <div className='flex gap-x-10 justify-end col-span-2'>
                    <Button variant={'destructive'} type="button" onClick={() => {setIsOpen(false)}}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="default">
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    </div>
  )
}
