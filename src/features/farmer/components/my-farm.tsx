'use client'
import { useMutation, useQuery } from 'convex/react'
import React, { useState } from 'react'
import { api } from '../../../../convex/_generated/api'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import corn from '@/../public/images/corn.png';
import rice from '@/../public/images/rice.png';
import carrot from '@/../public/images/carrots.png';
import tomatoes from '@/../public/images/tomatoes.png';
import eggplant from '@/../public/images/eggplant.png';
import { Edit, Mountain } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Id } from '../../../../convex/_generated/dataModel'
import { FormControl, FormField, FormLabel, FormItem, FormMessage, Form } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CropManagementForm, { FarmTypes } from './crop-management-form'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import SoilHealthForm from './soil-health-form'
import IrrigationForm from './irrigation-form'
import FarmInfrastructureForm from './farm-infrastructure-form'
import OwnerForm from './owner-form'
import Link from 'next/link'

export default function MyFarm() {
    const farm = useQuery(api.agriculturalPlots.getFarmByUserId)

    if (!farm) {
        return (
          <div className="flex justify-center items-center h-dvh">
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle className="text-center">No Farms Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  You haven&apos;t created any farms yet. Start by creating your farm now!
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Link href="/farmer" className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
                 
                    Create a Farm
                 
                </Link>
              </CardFooter>
            </Card>
          </div>
        );
      }


    return (
        <article className="p-4 w-full bg-white rounded-md shadow-md"> 
            <header className="bg-gray-100 p-6 flex flex-col md:flex-row justify-between items-center">
                <h1 className="text-3xl font-bold flex gap-x-10 uppercase">
                    <Mountain className='text-green' color='green'/> {farm.mapMarker?.title}
                </h1>
            </header>
            <section className="p-6 space-y-6">
                <div className="flex justify-end">
                    <DialogSection title="Farm information" content='main'/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-xl font-semibold">Current Crops</h2>
                        <div className="flex flex-wrap space-x-4 mt-2">
                            {farm.cropHistory.map((crop, index) => (
                                <div key={index} className="flex items-center space-x-2 capitalize">
                                    {crop?.name === 'corn' && <Image height={200} width={200} src={corn.src} alt="Corn" className="w-8 h-8" />}
                                    {crop?.name === 'rice' && <Image height={200} width={200} src={rice.src} alt="Rice" className="w-8 h-8" />}
                                    {crop?.name === 'carrot' && <Image height={200} width={200} src={carrot.src} alt="Carrot" className="w-8 h-8" />}
                                    {crop?.name === 'tomatoes' && <Image height={200} width={200} src={tomatoes.src} alt="Tomatoes" className="w-8 h-8" />}
                                    {crop?.name === 'eggplant' && <Image height={200} width={200} src={eggplant.src} alt="Eggplant" className="w-8 h-8" />}
                                    <span className="font-medium">{crop?.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Potential Crops</h2>
                        <div className="flex flex-wrap space-x-4 mt-2">
                            {farm.landUseType.map((type, index) => (
                                <div key={index} className="flex items-center space-x-2 capitalize">
                                    {type === 'corn' && <Image height={200} width={200} src={corn.src} alt="Corn" className="w-8 h-8" />}
                                    {type === 'rice' && <Image height={200} width={200} src={rice.src} alt="Rice" className="w-8 h-8" />}
                                    {type === 'carrots' && <Image height={200} width={200} src={carrot.src} alt="Carrot" className="w-8 h-8" />}
                                    {type === 'tomatoes' && <Image height={200} width={200} src={tomatoes.src} alt="Tomatoes" className="w-8 h-8" />}
                                    {type === 'eggplant' && <Image height={200} width={200} src={eggplant.src} alt="Eggplant" className="w-8 h-8" />}
                                    <span className="font-medium">{type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='w-full'>
                    <h2 className="text-xl font-semibold">Farm Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <p className="mt-2"><span className="font-semibold">Area:</span> <span className="font-normal">{farm.area} hectares</span></p>
                        <p><span className="font-semibold">Possible Yields:</span> <span className="font-normal">{farm.mapMarker?.yields} tons</span></p>
                        <p><span className="font-semibold">Status:</span> <Badge className="ml-1">{farm.status}</Badge></p>
                    </div>
                </div>
            </section>
            <Separator className='my-5'/>
            <section className="p-6 space-y-6">
                <div>
                    <div className='flex justify-between'>
                        <h2 className="text-xl font-semibold">Crop Management</h2>
                        <DialogSection title='Crop Management' content='Crop'/>
                    </div>
                    {farm.cropManagement ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fertilizer Application */}
                    <Card className="bg-white shadow-md">
                      <CardHeader className="bg-gray-50">
                        <CardTitle className="text-gray-700 font-bold">Fertilizer Application</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600">Type:</span>
                          <Badge>{farm.cropManagement.fertilizerApplication.type || "N/A"}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600">Quantity:</span>
                          <Badge>{farm.cropManagement.fertilizerApplication.quantity || 0} kg</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600">Schedule:</span>
                          <Badge>{farm.cropManagement.fertilizerApplication.applicationSchedule || "No schedule provided"}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  
                    {/* Pest and Disease Control */}
                    <Card className="bg-white shadow-md">
                      <CardHeader className="bg-gray-50">
                        <CardTitle className="text-gray-700 font-bold">Pest and Disease Control</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-gray-600">Pests:</span>
                            {farm.cropManagement.pestAndDiseaseControl.pests ? (
                            
                            <Badge className="bg-yellow-100 text-yellow-700">
                                {farm.cropManagement.pestAndDiseaseControl.pests}
                            </Badge>
                    
                            ) : (
                            <Badge className="bg-gray-100 text-gray-600">None</Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-gray-600">Diseases:</span>
                           {farm.cropManagement.pestAndDiseaseControl.diseases ? (
                            
                            <Badge className="bg-yellow-100 text-yellow-700">
                                {farm.cropManagement.pestAndDiseaseControl.diseases}
                            </Badge>
                    
                            ) : (
                            <Badge className="bg-gray-100 text-gray-600">None</Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-gray-600">Control Measures:</span>
                            {farm.cropManagement.pestAndDiseaseControl.controlMeasures? (
                            
                            <Badge className="bg-yellow-100 text-yellow-700">
                                {farm.cropManagement.pestAndDiseaseControl.controlMeasures}
                            </Badge>
                    
                            ) : (
                            <Badge className="bg-gray-100 text-gray-600">None</Badge>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  
                    {/* Crop Rotation Plan */}
                    <Card className="bg-white shadow-md">
                      <CardHeader className="bg-gray-50">
                        <CardTitle className="text-gray-700 font-bold">Crop Rotation Plan</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          {farm.cropManagement.cropRotationPlan.schedule || "No schedule provided"}
                        </p>
                      </CardContent>
                    </Card>
                  
                    {/* Growth Monitoring */}
                    <Card className="bg-white shadow-md">
                      <CardHeader className="bg-gray-50">
                        <CardTitle className="text-gray-700 font-bold">Growth Monitoring</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600">Stage:</span>
                          <Badge>{farm.cropManagement.growthMonitoring.growthStage || "N/A"}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-gray-600">Health Assessments:</span>
                          {farm.cropManagement.pestAndDiseaseControl.controlMeasures ? (
                                <Badge className="bg-yellow-100 text-yellow-700">
                                    {farm.cropManagement.pestAndDiseaseControl.controlMeasures}
                                </Badge>
                            ) : (
                                <Badge className="bg-gray-100 text-gray-600">None</Badge>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  
                    {/* Harvesting Methods */}
                    <Card className="bg-white shadow-md">
                      <CardHeader className="bg-gray-50">
                        <CardTitle className="text-gray-700 font-bold">Harvesting Methods</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge className="bg-purple-100 text-purple-700">
                          {farm.cropManagement.harvestingMethods || "Not specified"}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                    ) : (
                        <p>The owner or the farmer has not yet provided crop management information.</p>
                    )}
                </div>
                <Separator className='my-5'/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className='flex justify-between items-center'>
                            <h2 className="text-2xl font-semibold text-gray-800">Soil Information</h2>
                            <DialogSection title='Soil Information' content='Soil'/>
                        </div>
                        {farm.soilInfo ? (
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Type:</strong> {farm.soilInfo.type}</p>
                                <p><strong>pH Level:</strong> {farm.soilInfo.pH}</p>
                                <p><strong>Texture:</strong> {farm.soilInfo.texture}</p>
                                <p><strong>Nutrient Content:</strong> Nitrogen - {farm.soilInfo.nutrientContent.nitrogen}, Phosphorus - {farm.soilInfo.nutrientContent.phosphorus}, Potassium - {farm.soilInfo.nutrientContent.potassium}</p>
                                <p><strong>Moisture:</strong> Current - {farm.soilInfo.moisture.current}</p>
                                <p><strong>Erosion Risk:</strong> {farm.soilInfo.erosionRisk}</p>
                            </div>
                        ) : (
                            <p className="text-red-500">The owner or the farmer has not yet provided soil health information.</p>
                        )}
                    </div>
                    <div className="space-y-6">
                        <div className='flex justify-between items-center'>
                            <h2 className="text-2xl font-semibold text-gray-800">Irrigation</h2>
                            <DialogSection title='' content='Irrigation'/>
                        </div>
                        {farm.irrigationSystem ? (
                            <div className="space-y-2 text-gray-700">
                                <p><strong>System:</strong> {farm.irrigationSystem}</p>
                                <p><strong>Water Source:</strong> {farm.waterSource}</p>
                                <p><strong>Water Usage:</strong> {farm.waterUsage} liters</p>
                                <p><strong>Rainfall Data:</strong> Season - {farm.rainfallData?.season}, Amount - {farm.rainfallData?.rainfallAmount} mm</p>
                            </div>
                        ) : (
                            <p className="text-red-500">The owner or the farmer has not yet provided irrigation information.</p>
                        )}
                    </div>
                    <div className="space-y-6">
                        <div className='flex justify-between items-center'>
                            <h2 className="text-2xl font-semibold text-gray-800">Farm Infrastructure</h2>
                            <DialogSection title='' content='Infrastructure'/>
                        </div>
                        {farm.farmInfrastructure ? (
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Storage Facilities:</strong> {farm.farmInfrastructure.storageFacilities.join(', ')}</p>
                                <p><strong>Farm Equipment:</strong> {farm.farmInfrastructure.farmEquipment.join(', ')}</p>
                                <p><strong>Transportation:</strong> {farm.farmInfrastructure.transportation.join(', ')}</p>
                            </div>
                        ) : (
                            <p className="text-red-500">The owner or the farmer has not yet provided farm infrastructure information.</p>
                        )}
                    </div>
                    <div className="space-y-6">
                        <div className='flex justify-between items-center'>
                            <h2 className="text-2xl font-semibold text-gray-800">Owner Information</h2>
                            <DialogSection title='' content='Owner'/>
                        </div>
                        {farm.ownership?.owner ? (
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Owner Name:</strong> {farm.ownership.owner.name}</p>
                                <p><strong>Owner Contact:</strong> {farm.ownership.owner.contact}</p>
                                <p><strong>Owner Role:</strong> {farm.ownership.owner.role}</p>
                            </div>
                        ) : (
                            <p className="text-red-500">The owner or the farmer has not yet provided owner information.</p>
                        )}
                    </div>
                </div>
            </section>
        </article>
    )
}

const FormSchema = z.object({
    area: z.coerce.number().default(0).refine(value => value >= 0, {
        message: "Area must be a non-negative number."
    }),
    status: z.string().default("").refine(value => value.length > 0, {
        message: "Status is required."
    }),
    landUseType: z.array(z.string()).default([]),
    possibleYields: z.coerce.number().default(0).refine(value => value >= 0, {
        message: "Possible yields must be a non-negative number."
    }),
    farmName: z.string().default("").refine(value => value.length > 0, {
        message: "Farm name is required."
    }),
    cropName: z.string().default("").refine(value => value.length > 0, {
        message: "Crop name is required."
    }),
});

function DialogSection({ title, content }: { title: string; content: string }) {
    const farm = useQuery(api.agriculturalPlots.getFarmByUserId)
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const updateFarmInfo = useMutation(api.agriculturalPlots.updateFarmInfo)

    const mainInfoForm = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          cropName: farm?.mapMarker?.markerType || "",
          area: farm?.area || 0,
          status: farm?.status ||"",
          landUseType: farm?.landUseType || [],
          possibleYields: farm?.mapMarker?.yields || 0,
          farmName: farm?.mapMarker?.title || ""
        },
      });
    function onSubmit(values: z.infer<typeof FormSchema>) {
        if (content === 'main') {
            toast.promise(
                updateFarmInfo({
                    plotId: farm?._id as Id<"agriculturalPlots">,
                    cropId: farm?.cropHistory[0]?._id as Id<"crops">,
                    cropName: values.cropName,
                    markerId: farm?.markerId as Id<"mapMarkers">,
                    area: values.area,
                    status: values.status,
                    landUseType: values.landUseType,
                    possibleYields: values.possibleYields,
                    farmName: values.farmName
                }),
                {
                    loading: 'Updating farm information...',
                    success: 'Farm updated successfully',
                    error: 'Failed to update Farm'
                }
            )
            setIsOpen(false)
        }
    }
    const renderContent = () => {
        if (content === 'main') {
            return (
                <Form {...mainInfoForm}>
                    <form onSubmit={mainInfoForm.handleSubmit(onSubmit)}  className="space-y-4">
                        <div className='space-y-4'>
                            <FormField
                                control={mainInfoForm.control}
                                name="farmName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Farm Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Enter farm name" 
                                                {...field} 
                                                className="border p-2 rounded"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={mainInfoForm.control}
                                name="cropName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Crop</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="border p-2 rounded">
                                                    <SelectValue placeholder="Select crop" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="carrot">Carrot</SelectItem>
                                                    <SelectItem value="rice">Rice</SelectItem>
                                                    <SelectItem value="eggplant">Eggplant</SelectItem>
                                                    <SelectItem value="tomatoes">Tomatoes</SelectItem>
                                                    <SelectItem value="corn">Corn</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="landUseType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Land Use Type</FormLabel>
                                        <FormControl>
                                            <div className="space-y-2 space-x-2">
                                                <Checkbox 
                                                    id="tomatoes" 
                                                    value="tomatoes" 
                                                    checked={field.value?.includes('tomatoes') || false} 
                                                    onCheckedChange={(checked) => {
                                                        const newValue = checked 
                                                            ? [...(field.value || []), 'tomatoes'] 
                                                            : (field.value || []).filter((value: string) => value !== 'tomatoes');
                                                        field.onChange(newValue);
                                                    }}
                                                />
                                                <label htmlFor="tomatoes">Tomatoes</label>
                                                <Checkbox 
                                                    id="rice" 
                                                    value="rice" 
                                                    checked={field.value?.includes('rice') || false} 
                                                    onCheckedChange={(checked) => {
                                                        const newValue = checked 
                                                            ? [...(field.value || []), 'rice'] 
                                                            : (field.value || []).filter((value: string) => value !== 'rice');
                                                        field.onChange(newValue);
                                                    }}
                                                />
                                                <label htmlFor="rice">Rice</label>
                                                <Checkbox 
                                                    id="carrots" 
                                                    value="carrots" 
                                                    checked={field.value?.includes('carrots') || false} 
                                                    onCheckedChange={(checked) => {
                                                        const newValue = checked 
                                                            ? [...(field.value || []), 'carrots'] 
                                                            : (field.value || []).filter((value: string) => value !== 'carrots');
                                                        field.onChange(newValue);
                                                    }}
                                                />
                                                <label htmlFor="carrots">Carrots</label>
                                                <Checkbox 
                                                    id="eggplant" 
                                                    value="eggplant" 
                                                    checked={field.value?.includes('eggplant') || false} 
                                                    onCheckedChange={(checked) => {
                                                        const newValue = checked 
                                                            ? [...(field.value || []), 'eggplant'] 
                                                            : (field.value || []).filter((value: string) => value !== 'eggplant');
                                                        field.onChange(newValue);
                                                    }}
                                                />
                                                <label htmlFor="eggplant">Eggplant</label>
                                                <Checkbox 
                                                    id="corn" 
                                                    value="corn" 
                                                    checked={field.value?.includes('corn') || false} 
                                                    onCheckedChange={(checked) => {
                                                        const newValue = checked 
                                                            ? [...(field.value || []), 'corn'] 
                                                            : (field.value || []).filter((value: string) => value !== 'corn');
                                                        field.onChange(newValue);
                                                    }}
                                                />
                                                <label htmlFor="corn">Corn</label>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                          
                            <FormField
                                control={mainInfoForm.control}
                                name="area"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Area (hectares)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="Enter area" 
                                                {...field} 
                                                className="border p-2 rounded"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={mainInfoForm.control}
                                name="possibleYields"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Possible Yields (tons)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="Enter possible yields" 
                                                {...field} 
                                                className="border p-2 rounded"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={mainInfoForm.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Status</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="border p-2 rounded">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="fallow">Fallow</SelectItem>
                                                    <SelectItem value="preparing">Preparing</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex gap-x-10 justify-end'>
                            
                            <Button variant={'destructive'} type="button" onClick={()=>{}}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="default">
                                Submit
                            </Button>
                        </div>
                    </form>
                </Form>
            );
        }

        if (content === 'Crop') {
            return (
                <div className="space-y-4">
                    <CropManagementForm farm={farm as FarmTypes} setIsOpen={setIsOpen} />
                </div>
            )
        }

        if (content === 'Soil') {
            return (
                <div className="space-y-4">
                    <SoilHealthForm farm={farm as FarmTypes} setIsOpen={setIsOpen}/>
                </div>
            );
        }
        if (content === 'Irrigation') {
            return (
                <div className="space-y-4">
                    <IrrigationForm farm={farm as FarmTypes} setIsOpen={setIsOpen}/>
                </div>
            );
        }
        if (content === 'Infrastructure') {
            return (
                <div className="space-y-4">
                    <FarmInfrastructureForm farm={farm as FarmTypes} setIsOpen={setIsOpen}/>
                </div>
            );
        }
        if (content === 'Owner') {
            return (
                <div className="space-y-4">
                    <OwnerForm farm={farm as FarmTypes} setIsOpen={setIsOpen}/>
                </div>
            );
        }
        return <div>{content}</div>;

    };

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => setIsOpen(true)} className="flex items-center">
                        <Edit />
                    </Button>
                </DialogTrigger>
                <DialogContent className='max-w-screen-lg max-h-[80%] overflow-auto'>
                    <DialogTitle>{title}</DialogTitle>
                    {renderContent()}
                </DialogContent>
            </Dialog>
        </div>
    );
}