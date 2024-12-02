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
    soilInfo: z.object({
        type: z.string().nonempty("Soil Type is required."), // Soil Type: Clay, loam, sandy, etc.
        pH: z.coerce.number().min(0, "Soil pH must be a positive number."), // Soil pH Level: Acidity or alkalinity of the soil.
        texture: z.string().nonempty("Soil Texture is required."),
        nutrientContent: z.object({
            nitrogen: z.coerce.number().min(0, "Nitrogen Content is required."), // Levels of nitrogen (N)
            phosphorus: z.coerce.number().min(0, "Phosphorus Content is required."), // Levels of phosphorus (P)
            potassium: z.coerce.number().min(0, "Potassium Content is required."), // Levels of potassium (K)
        }),
        moisture: z.object({
            current: z.coerce.number().min(0, "Current Moisture is required."), // Current moisture level
            historical: z.array(z.number()), // Historical moisture levels
        }),
        erosionRisk: z.string().nonempty("Erosion Risk is required."), // Soil Erosion Data: Risk of soil degradation or erosion
    })
});

export default function SoilHealthForm({
    farm,
    setIsOpen
}: {
    farm: FarmTypes,
    setIsOpen: (value: boolean) => void
}) {
    const updateSoilHealth = useMutation(api.agriculturalPlots.updateSoilHealth)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            soilInfo: {
                type: farm.soilInfo?.type || "", // Soil Type: Clay, loam, sandy, etc.
                pH: farm.soilInfo?.pH || 0, // Default to 0 if pH value is not provided
                texture: farm.soilInfo?.texture || "", // Default to an empty string
                nutrientContent: {
                    nitrogen: farm.soilInfo?.nutrientContent?.nitrogen || 0, // Default to 0 for nitrogen
                    phosphorus: farm.soilInfo?.nutrientContent?.phosphorus || 0, // Default to 0 for phosphorus
                    potassium: farm.soilInfo?.nutrientContent?.potassium || 0, // Default to 0 for potassium
                },
                moisture: {
                    current: farm.soilInfo?.moisture?.current || 0, // Default to 0 for current moisture
                    historical: farm.soilInfo?.moisture?.historical || [], // Default to an empty array
                },
                erosionRisk: farm.soilInfo?.erosionRisk || "", // Default to an empty string
            }
        },
    });

    function onSubmit(values: z.infer<typeof FormSchema>) {
        const soilInfo = {
            type: values.soilInfo.type,
            pH: values.soilInfo.pH,
            texture: values.soilInfo.texture,
            nutrientContent: {
                nitrogen: values.soilInfo.nutrientContent.nitrogen,
                phosphorus: values.soilInfo.nutrientContent.phosphorus,
                potassium: values.soilInfo.nutrientContent.potassium,
            },
            moisture: {
                current: values.soilInfo.moisture.current,
                historical: values.soilInfo.moisture.historical,
            },
            erosionRisk: values.soilInfo.erosionRisk,
        };

        toast.promise(
            updateSoilHealth({
                agriculturalPlotId: farm._id,
                soilInfo,
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="soilInfo.type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">
                                    Soil Type <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter soil type"
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
                        name="soilInfo.pH"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">
                                    Soil pH 
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter soil pH"
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
                        name="soilInfo.texture"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">
                                    Soil Texture <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter soil texture"
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
                        name="soilInfo.nutrientContent.nitrogen"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">
                                    Nitrogen Content 
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter nitrogen level"
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
                        name="soilInfo.nutrientContent.phosphorus"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">
                                    Phosphorus Content
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter phosphorus level"
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
                        name="soilInfo.nutrientContent.potassium"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">
                                    Potassium Content
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter potassium level"
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
                        name="soilInfo.moisture.current"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">
                                    Current Moisture 
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter current moisture level"
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
                        name="soilInfo.erosionRisk"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">
                                    Erosion Risk <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter erosion risk"
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
