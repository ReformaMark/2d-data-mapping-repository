import React from 'react'

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
    farmName,
    setFarmName,
    selectedLocation,
    setSelectedLocation,
    markerType,
    setMarkerType,
    errorMessage,
    setErrorMessage,
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
      },
    });
    const saveLocation = useMutation(api.mapMarkers.createMapMarker);

    const addCrop = useMutation(api.crops.addCrop);
    const addAgriculturalPlot = useMutation(api.agriculturalPlots.addAgriculturalPlot);
    const addPlots = useMutation(api.agriculturalPlots.addPlots);
  
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
      if (selectedLocation) {
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
          landUseType: data.markerType,
          markerId: markerId as Id<"mapMarkers">,
        });
        // Add crop
        const cropId = await addCrop({
            plotId: plotId,
            name: data.farmName,
            plantingDate: data.plantingDate,
            harvestDate: data.harvestDate,
        });
        // Add crop cropHistory
        await addPlots({
            agriculturalPlotId: plotId,
            cropId: cropId,
        }); 
        formMethods.reset();
        handleCancel();
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
        <DialogContent className="z-[1000]">
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

