
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

const FormSchema = z.object({
  farmName: z.string().min(2, {
    message: "Farm name must be at least 2 characters.",
  }),
  markerType: z.string().nonempty({
    message: "Please select a crop type.",
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
  saveLocation: (location: { coordinates: [number, number]; title: string; markerType: string }) => void;
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
    saveLocation,
    setIsAddingMarker,
    handleCancel,
  }: AddFarmDialogProps) {
    const formMethods = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        farmName: '',
        markerType: '',

      },
    });
  
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
      if (selectedLocation) {
        await saveLocation({ coordinates: selectedLocation, title: data.farmName, markerType: data.markerType });
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
