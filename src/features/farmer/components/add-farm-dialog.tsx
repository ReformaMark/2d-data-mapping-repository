import React from 'react'

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormField,
  } from "@/components/ui/form"
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { toast } from 'sonner';

const FormSchema = z.object({
  farmName: z.string().min(2, {
    message: "Farm name must be at least 2 characters.",
  }),
  markerType: z.string().nonempty({
    message: "Please select a crop type.",
  }),
  area: z.coerce.number().positive({
    message: "Area must be a positive number.",
  }),
  status: z.string().nonempty({
    message: "Please select a status.",
  }),
  plantingDate: z.string().nonempty({
    message: "Please provide a planting date.",
  }),
  harvestDate: z.string().optional(),
  possibleYields: z.coerce.number().positive({
    message: "Yield must be a positive number.",
  }),
  landUseType: z.array(z.string()).nonempty({
    message: "Please select at least one land use type.",
  }),
})

interface AddFarmDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  farmName: string;
  setFarmName: (name: string) => void;
  selectedLocation: [number, number] | null;
  setSelectedLocation: (location: [number, number] | null) => void;
  markerType: string;
  setMarkerType: (type: string) => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  setIsAddingMarker: (adding: boolean) => void;
  handleCancel: () => void;
}

export function AddFarmDialog({
    isDialogOpen,
    setIsDialogOpen,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    farmName,
    setFarmName,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedLocation,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSelectedLocation,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    markerType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setMarkerType,
    errorMessage,
    setErrorMessage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setIsAddingMarker,
    handleCancel,
  }: AddFarmDialogProps) {
    const formMethods = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        farmName: '',
        markerType: '',
        area: 0,
        status: '',
        plantingDate: '',
        harvestDate: '',
        possibleYields: 0,
        landUseType: [],
      },
    });
    const saveLocation = useMutation(api.mapMarkers.createMapMarker);

    const addCrop = useMutation(api.crops.addCrop);
    const addAgriculturalPlot = useMutation(api.agriculturalPlots.addAgriculturalPlot);
    const addPlots = useMutation(api.agriculturalPlots.addPlots);
  
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
      if (selectedLocation) {
        try {
          // add Marker to mapMarkers Table
          const markerId = await saveLocation({ 
            coordinates: selectedLocation, 
            title: data.farmName, 
            markerType: data.markerType,
          });
          // Add agricultural plot
          const plotId = await addAgriculturalPlot({
            coordinates: [selectedLocation],
            area: data.area,
            status: data.status,
            cropHistory: [],
            landUseType: data.landUseType,
            markerId: markerId as Id<"mapMarkers">,
          });
          // Add crop
          const cropId = await addCrop({
              plotId: plotId,
              name: data.markerType,
              plantingDate: data.plantingDate,
              harvestDate: data.harvestDate,
              possibleYields: data.possibleYields,
          });
          // Add crop cropHistory
          await addPlots({
              agriculturalPlotId: plotId,
              cropId: cropId,
          }); 
          formMethods.reset();
          handleCancel();
          toast.success('Farm added successfully');
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setErrorMessage('An error occurred while saving the data.');
        }
      } else {
        setErrorMessage('Please select a location.');
      }
    };
  
    const handleCancelDialog = () => {
        formMethods.reset();
        setFarmName('');
        setIsDialogOpen(false);
        setErrorMessage('');
    };
  
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="z-[1000] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Marker</DialogTitle>
          </DialogHeader>
          <Form {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
              <FormField
                name="farmName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter farm name" 
                        {...field} 
                        className={errorMessage ? 'border-red-500' : ''}
                      />
                    </FormControl>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                  </FormItem>
                )}
              />
              <FormField
                name="markerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value} >
                        <SelectTrigger className={errorMessage ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select crop type" />
                        </SelectTrigger>
                        <SelectContent className="z-[1000]">
                          <SelectItem value="corn">Corn</SelectItem>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="carrot">Carrot</SelectItem>
                          <SelectItem value="tomatoes">Tomatoes</SelectItem>
                          <SelectItem value="eggplant">Eggplant</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                  </FormItem>
                )}
              />
              <FormField
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area (ha or hectares)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="Enter area" 
                        {...field} 
                        className={errorMessage ? 'border-red-500' : ''}
                      />
                    </FormControl>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                  </FormItem>
                )}
              />
              <FormField
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value} >
                        <SelectTrigger className={errorMessage ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="z-[1000]">
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="fallow">Fallow</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                  </FormItem>
                )}
              />
              <FormField
                name="plantingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Planting Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field} 
                        className={errorMessage ? 'border-red-500' : ''}
                      />
                    </FormControl>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                  </FormItem>
                )}
              />
              <FormField
                name="harvestDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harvest Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field} 
                        className={errorMessage ? 'border-red-500' : ''}
                      />
                    </FormControl>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                  </FormItem>
                )}
              />
              <FormField
                name="possibleYields"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yield (tons)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="Enter yield" 
                        {...field} 
                        className={errorMessage ? 'border-red-500' : ''}
                      />
                    </FormControl>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                  </FormItem>
                )}
              />
              <FormField
                name="landUseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Land Use Type</FormLabel>
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
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" variant="default">
                  Save Selected Location
                </Button>
                <Button type="button" onClick={handleCancelDialog} variant="default">
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

