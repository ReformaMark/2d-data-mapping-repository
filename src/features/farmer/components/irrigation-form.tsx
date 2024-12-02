'use client'

import { FormControl, FormField, FormLabel, FormItem, FormMessage, Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { FarmTypes } from './crop-management-form'


const FormSchema = z.object({
    waterSource: z.string().nonempty("Water source is required."), // Water Source: Irrigation, rain-fed, river, or well.
    waterUsage: z.optional(z.coerce.number()), // Water Usage: Volume of water needed per crop cycle.
    irrigationSystem: z.optional(z.string()), // Irrigation System: Type of irrigation system installed (e.g., drip, sprinkler, or flood).
    rainfallData: z.optional(z.object({ // Rainfall Data: Seasonal rainfall patterns.
        season: z.string(),
        rainfallAmount: z.coerce.number(), // in millimeters
    })),


});

export default function IrrigationForm({
    farm,
    setIsOpen
}: {
    farm: FarmTypes,
    setIsOpen: (value: boolean) => void
}) {
    const updateIrrigation = useMutation(api.agriculturalPlots.updateIrrigation)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            waterSource: farm.waterSource || "", // Water Source: Irrigation, rain-fed, river, or well.
            waterUsage: farm.waterUsage ?? undefined, // Water Usage: Volume of water needed per crop cycle.
            irrigationSystem: farm.irrigationSystem ?? undefined, // Irrigation System: Type of irrigation system installed (e.g., drip, sprinkler, or flood).
            rainfallData: farm.rainfallData ? {
                season: farm.rainfallData.season,
                rainfallAmount: farm.rainfallData.rainfallAmount,
            } : undefined, // Rainfall Data: Seasonal rainfall patterns.
        },
    });

    function onSubmit(values: z.infer<typeof FormSchema>) {
        const irrigationData = {
            agriculturalPlotId: farm._id,
            waterSource: values.waterSource,
            waterUsage: values.waterUsage,
            irrigationSystem: values.irrigationSystem,
            rainfallData: values.rainfallData,
        };

        toast.promise(
            updateIrrigation(irrigationData),
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
         <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="waterSource"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-bold">
                            Water Source <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Enter water source (e.g., irrigation, rain-fed, river, well)"
                                {...field}
                                className="border p-2 rounded"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="waterUsage"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-bold">
                            Water Usage (L)
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="Enter water usage per crop cycle"
                                {...field}
                                className="border p-2 rounded"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="irrigationSystem"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-bold">
                            Irrigation System <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Enter irrigation system type (e.g., drip, sprinkler, flood)"
                                {...field}
                                className="border p-2 rounded"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="rainfallData.season"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-bold">
                            Rainfall Season <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Enter rainfall season"
                                {...field}
                                className="border p-2 rounded"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="rainfallData.rainfallAmount"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-bold">
                            Rainfall Amount (mm) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="Enter rainfall amount"
                                {...field}
                                className="border p-2 rounded"
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