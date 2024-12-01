'use client'
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
import { TagInput } from './tag-input'


const FormSchema = z.object({
    farmInfrastructure: z.object({
        storageFacilities: z.array(z.string()),
        farmEquipment: z.array(z.string()),
        transportation: z.array(z.string())
    })
});

export default function FarmInfrastructureForm({
    farm,
    setIsOpen
}: {
    farm: FarmTypes,
    setIsOpen: (value: boolean) => void
}) {
    const updateFarmInfrastructure = useMutation(api.agriculturalPlots.updateFarmInfrastructure)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            farmInfrastructure: {
                storageFacilities: farm.farmInfrastructure?.storageFacilities,
                farmEquipment: farm.farmInfrastructure?.farmEquipment,
                transportation: farm.farmInfrastructure?.transportation
            }
        },
    });

    function onSubmit(values: z.infer<typeof FormSchema>) {
        toast.promise(
            updateFarmInfrastructure({
                agriculturalPlotId: farm._id,
                farmInfrastructure: {
                    storageFacilities: values.farmInfrastructure.storageFacilities,
                    farmEquipment: values.farmInfrastructure.farmEquipment,
                    transportation: values.farmInfrastructure.transportation,
                }
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
                <FormField
                    control={form.control}
                    name="farmInfrastructure.storageFacilities"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">
                                Storage Facilities <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <div className="flex flex-col">
                                    <TagInput 
                                        initialTags={field.value} 
                                        onTagsChange={(newTags) => field.onChange(newTags)} 
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="farmInfrastructure.farmEquipment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">
                                Farm Equipment <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <div className="flex flex-col">
                                    <TagInput 
                                        initialTags={field.value} 
                                        onTagsChange={(newTags) => field.onChange(newTags)} 
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="farmInfrastructure.transportation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">
                                Transportation <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <div className="flex flex-col">
                                    <TagInput 
                                        initialTags={field.value} 
                                        onTagsChange={(newTags) => field.onChange(newTags)} 
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex gap-x-10 justify-end'>
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
