import React from 'react'
import {  FormControl, FormField, FormLabel, FormItem, FormMessage, Form } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import {useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Id } from '../../../../convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

export interface FarmTypes {
    _id: Id<"agriculturalPlots">;
    mapMarker: {
        _id: Id<"mapMarkers">;
        _creationTime: number;
        description?: string | undefined;
        yields?: number | undefined;
        title: string;
        coordinates: number[];
        userId: Id<"users">;
        barangay: string;
        markerType: string;
    } | null;
    cropHistory: {
        _id: Id<"crops">;
        _creationTime: number;
        harvestDate?: string | undefined;
        possibleYields?: number | undefined;
        actualYeilds?: number | undefined;
        name: string;
        plotId: Id<"agriculturalPlots">;
        plantingDate: string;
    }[];
    user: {
        _id: Id<"users">;
        _creationTime: number;
        image?: string | undefined;
        isActive?: boolean | undefined;
        farmerProfile?: {
            address: string;
            isActive: boolean;
            barangayId: Id<"barangays">;
            contactNumber: string;
        } | undefined;
        stakeholderProfile?: {
            isActive: boolean;
            contactNumber: string;
        } | undefined;
        fname: string;
        lname: string;
        email: string;
        role: "admin" | "stakeholder" | "farmer";
    };
    soilInfo: {
        type: string;
        pH: number;
        texture: string;
        nutrientContent: {
            nitrogen: number;
            phosphorus: number;
            potassium: number;
        };
        moisture: {
            current: number;
            historical: number[];
        };
        erosionRisk: string;
    } | undefined;
    waterSource: string | undefined;
    waterUsage: number | undefined;
    irrigationSystem: string | undefined;
    rainfallData: {
        season: string;
        rainfallAmount: number;
    } | undefined;
    ownership: {
        owner: {
            role: string;
            name: string;
            contact: string;
        };
        laborForce: {
            role: string;
            workerName: string;
        }[];
        legalDocuments: {
            landTitle?: string | undefined;
            waterPermits?: string | undefined;
            leaseAgreements?: string | undefined;
        };
    } | undefined;
    cropManagement: {
        fertilizerApplication: {
            type: string;
            quantity: number;
            applicationSchedule: string;
        };
        pestAndDiseaseControl: {
            pests: string[];
            diseases: string[];
            controlMeasures: string[];
        };
        cropRotationPlan: {
            schedule: string;
        };
        growthMonitoring: {
            growthStage: string;
            healthAssessments: string[];
        };
        harvestingMethods: string;
    } | undefined;
    financialInformation: {
        inputCosts: {
            seeds: number;
            fertilizers: number;
            labor: number;
            equipment: number;
        };
        productionCosts: {
            costPerHectare: number;
        };
        marketValue: {
            currentPrice: number;
            expectedPrice: number;
        };
        profitMargins: {
            expectedProfit: number;
        };
    } | undefined;
    farmInfrastructure: {
        storageFacilities: string[];
        farmEquipment: string[];
        transportation: string[];
    } | undefined;
    area: number;
    barangayId: Id<"barangays">;
    coordinates: number[][];
    userId: Id<"users">;
    status: string;
    landUseType: string[];
    markerId: Id<"mapMarkers">;
}


const FormSchema = z.object({
    cropManagement: z
      .object({
        fertilizerApplication: z.object({
          type: z.string().nonempty({ message: "Fertilizer type is required." }),
          quantity: z.coerce.number().nonnegative({ message: "Quantity must be a non-negative number." }),
          applicationSchedule: z.string().nonempty({ message: "Application schedule is required." }),
        }),
        pestAndDiseaseControl: z.object({
          pests: z.array(z.string()).default([]),
          diseases: z.array(z.string()).default([]),
          controlMeasures: z.array(z.string()).default([]),
        }),
        cropRotationPlan: z.object({
          schedule: z.string().nonempty({ message: "Crop rotation schedule is required." }),
        }),
        growthMonitoring: z.object({
          growthStage: z.string().nonempty({ message: "Growth stage is required." }),
          healthAssessments: z.array(z.string()).default([]),
        }),
        harvestingMethods: z
          .string()
          .refine(value => value.length > 0, {
            message: "Harvesting methods must be 'manual' or 'mechanized'."
        }),
      })
      .optional(),
});

export default function CropManagementForm({ farm, setIsOpen }: {
    farm: FarmTypes;
    setIsOpen: (value: boolean) => void
}) {

    const updateCropManagement = useMutation(api.agriculturalPlots.updateCropManagement)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          cropManagement: {
            fertilizerApplication: {
              type: farm.cropManagement?.fertilizerApplication?.type || "",
              quantity: farm.cropManagement?.fertilizerApplication?.quantity || 0,
              applicationSchedule: farm.cropManagement?.fertilizerApplication?.applicationSchedule || "",
            },
            pestAndDiseaseControl: {
              pests: farm.cropManagement?.pestAndDiseaseControl?.pests || [],
              diseases: farm.cropManagement?.pestAndDiseaseControl?.diseases || [],
              controlMeasures: farm.cropManagement?.pestAndDiseaseControl?.controlMeasures || [],
            },
            cropRotationPlan: {
              schedule: farm.cropManagement?.cropRotationPlan?.schedule || "",
            },
            growthMonitoring: {
              growthStage: farm.cropManagement?.growthMonitoring?.growthStage || "",
              healthAssessments: farm.cropManagement?.growthMonitoring?.healthAssessments || [],
            },
            harvestingMethods: farm.cropManagement?.harvestingMethods || "", // Default to "manual"
          },
        },
      });
      
    function onSubmit(values: z.infer<typeof FormSchema>) {
    toast.promise(
        updateCropManagement({
        cropManagement: {
            fertilizerApplication: {
            type: values.cropManagement?.fertilizerApplication.type || farm.cropManagement?.fertilizerApplication?.type || "",
            quantity: values.cropManagement?.fertilizerApplication.quantity || farm.cropManagement?.fertilizerApplication?.quantity || 0,
            applicationSchedule: values.cropManagement?.fertilizerApplication.applicationSchedule || farm.cropManagement?.fertilizerApplication?.applicationSchedule || "",
            },
            pestAndDiseaseControl: {
            pests: values.cropManagement?.pestAndDiseaseControl.pests || farm.cropManagement?.pestAndDiseaseControl?.pests || [],
            diseases: values.cropManagement?.pestAndDiseaseControl.diseases || farm.cropManagement?.pestAndDiseaseControl?.diseases || [],
            controlMeasures: values.cropManagement?.pestAndDiseaseControl.controlMeasures || farm.cropManagement?.pestAndDiseaseControl?.controlMeasures || [],
            },
            cropRotationPlan: {
            schedule: values.cropManagement?.cropRotationPlan.schedule || farm.cropManagement?.cropRotationPlan?.schedule || "",
            },
            growthMonitoring: {
            growthStage: values.cropManagement?.growthMonitoring.growthStage || farm.cropManagement?.growthMonitoring?.growthStage || "",
            healthAssessments: values.cropManagement?.growthMonitoring.healthAssessments || farm.cropManagement?.growthMonitoring?.healthAssessments || [],
            },
            harvestingMethods: values.cropManagement?.harvestingMethods || farm.cropManagement?.harvestingMethods || "manual",
        },
        agriculturalPlotId: farm?._id, // Assuming farm._id is the correct identifier for the plot
        }),
        {
        loading: "Updating farm information...",
        success: "Farm updated successfully!",
        error: "Failed to update farm information.",
        }
    );
    setIsOpen(false)
    }
      
   
  return (
    <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="cropManagement.fertilizerApplication.type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">Fertilizer Type <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter fertilizer type"
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
                    name="cropManagement.fertilizerApplication.quantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">Fertilizer Quantity <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter fertilizer quantity"
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
                    name="cropManagement.fertilizerApplication.applicationSchedule"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">Application Schedule <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter application schedule"
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
                    name="cropManagement.pestAndDiseaseControl.pests"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">Pests <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter pests (comma separated)"
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
                    name="cropManagement.pestAndDiseaseControl.diseases"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">Diseases <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter diseases (comma separated)"
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
                    name="cropManagement.pestAndDiseaseControl.controlMeasures"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">Control Measures <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter control measures (comma separated)"
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
                    name="cropManagement.cropRotationPlan.schedule"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">Crop Rotation Schedule <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter crop rotation schedule"
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
                    name="cropManagement.growthMonitoring.growthStage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">Growth Stage <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter growth stage"
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
                    name="cropManagement.growthMonitoring.healthAssessments"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">Health Assessments <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter health assessments (comma separated)"
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
                    name="cropManagement.harvestingMethods"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">Harvesting Methods <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="border p-2 rounded">
                                        <SelectValue placeholder="Select harvesting method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="manual">Manual</SelectItem>
                                        <SelectItem value="mechanized">Mechanized</SelectItem>
                                    </SelectContent>
                                </Select>
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
