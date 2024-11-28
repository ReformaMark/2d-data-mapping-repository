'use client'
import React, { useState } from 'react';
import { LayersControl, MapContainer, Polygon, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMutation, useQuery } from 'convex/react';
import { Button } from '@/components/ui/button';
import { api } from '../../../../convex/_generated/api';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import corn from '@/../public/images/corn.png';
import rice from '@/../public/images/rice.png';
import carrot from '@/../public/images/carrots.png';
import tomatoes from '@/../public/images/tomatoes.png';
import eggplant from '@/../public/images/eggplant.png';
import { AddFarmDialog } from './add-farm-dialog';
import { useCurrentUser } from '@/features/users/api/use-current-user';
import { Badge } from '@/components/ui/badge';
import { formatDateToMonthYear } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Id } from '../../../../convex/_generated/dataModel';
import { toast } from 'sonner';
import Image from 'next/image';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

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
    yields: z.coerce.number().positive({
      message: "Yield must be a positive number.",
    }),
    landUseType: z.array(z.string()).nonempty({
      message: "Please select at least one land use type.",
    }),
  })

export function FarmerMap() {
  const barangay = useQuery(api.barangays.getBarangay);
  const crops = useQuery(api.crops.getCrops);
  const agriculturalPlot = useQuery(api.agriculturalPlots.getAgriculturalPlot);
  const initialCoordinates: [number, number][] = [
    [0, 0],
  ]; 
  const coordinates: [number, number][] = barangay?.coordinates?.map((coord: number[]) => [coord[0], coord[1]]) || initialCoordinates;
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [farmName, setFarmName] = useState('');
  const [markerType, setMarkerType] = useState('corn');
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const mapMarkers = useQuery(api.mapMarkers.getMapMarkers);
  const [editMarkerId, setEditMarkerId] = useState('');
  const userId = useCurrentUser();

  const center: [number, number] = [15.25, 120.71]; // Centered between Barangay Turu, Mapinya, and Balitucan

  const polygonStyle = {
    fillColor: '#ffffff',
    fillOpacity: 0.1,
    color: '#000',
    weight: 2
  };

  function isInsidePolygon(point: [number, number], polygon: [number, number][]) {
    let isInside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      const intersect = ((yi > point[1]) !== (yj > point[1])) &&
        (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
      if (intersect) isInside = !isInside;
    }
    return isInside;
  }

  const formMethods = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      farmName: mapMarkers?.find(marker => marker._id === editMarkerId)?.title || '',
      markerType: mapMarkers?.find(marker => marker._id === editMarkerId)?.markerType || '',
      area: agriculturalPlot?.find(plot => plot.markerId === editMarkerId)?.area || 0,
      status: agriculturalPlot?.find(plot => plot.markerId === editMarkerId)?.status || '',
      plantingDate: crops?.find(crop => crop.plotId === agriculturalPlot?.find(plot => plot.markerId === editMarkerId)?._id)?.plantingDate || '',
      harvestDate: crops?.find(crop => crop.plotId === agriculturalPlot?.find(plot => plot.markerId === editMarkerId)?._id)?.harvestDate || '',
      yields: crops?.find(crop => crop.plotId === agriculturalPlot?.find(plot => plot.markerId === editMarkerId)?._id)?.yields || 0,
      landUseType: agriculturalPlot?.find(plot => plot.markerId === editMarkerId)?.landUseType || [],
    },
  });

  function LocationSelector() {
    useMapEvents({
      click(e) {
        if (isAddingMarker) {
          const location: [number, number] = [e.latlng.lat, e.latlng.lng];
          if (isInsidePolygon(location, coordinates)) {
            setSelectedLocation(location);
            setIsDialogOpen(true);
          } else {
            alert('Selected location is outside the barangay.');
          }
        }
      }
    });
    return null;
  }

  const updateMarker = useMutation(api.mapMarkers.updateMapMarker);
  const updateAgriculturalPlot = useMutation(api.agriculturalPlots.updateAgriculturalPlot);
  const updateCrop = useMutation(api.crops.updateCrop);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (selectedLocation) {
      try {
        // add Marker to mapMarkers Table
        await updateMarker({ 
          markerId: editMarkerId as Id<"mapMarkers">,
          title: data.farmName, 
          markerType: data.markerType,
        });
        // Add agricultural plot
        const plotId = await updateAgriculturalPlot({
            agriculturalPlotId: agriculturalPlot?.find(plot => plot.markerId === editMarkerId)?._id ?? 
                (() => { throw new Error("Agricultural plot not found") })(),
            area: data.area,
            status: data.status,
            landUseType: data.landUseType,
        });
        // Add crop
        await updateCrop({
            cropId: crops?.find(crop => crop.plotId === plotId)?._id ?? 
                (() => { throw new Error("Crop not found") })(),
            name: data.markerType,
        });
       
        formMethods.reset();
        handleCancel();
        toast.success('Farm updated successfully');
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setErrorMessage('An error occurred while saving the data.');
      }
    } else {
      setErrorMessage('Please select a location.');
    }
  };

  const handleCancel = () => {
    setSelectedLocation(null);
    setFarmName('');
    setMarkerType('corn');
    setIsAddingMarker(false);
    setIsDialogOpen(false);
  };

  const handleAddMarker = () => {
    setIsAddingMarker(true);
  };

  const handleCancelDialog = () => {
    setIsEditDialogOpen(false);
  };

  const userHasLocation = mapMarkers?.some(marker => marker.userId === userId?.data?._id);

  return (
    <div>
      <AddFarmDialog 
        isDialogOpen={isDialogOpen} 
        setIsDialogOpen={setIsDialogOpen} 
        farmName={farmName} 
        setFarmName={setFarmName}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        markerType={markerType}
        setMarkerType={setMarkerType}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        setIsAddingMarker={setIsAddingMarker}
        handleCancel={handleCancel}
      />
      <MapContainer center={center} zoom={13} className='h-[600px] w-full'>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Default Map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* Satellite Layer */}
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <Polygon pathOptions={polygonStyle} positions={coordinates} />
        {mapMarkers?.map((marker, index) => (
          <Marker
            key={index}
            position={marker.coordinates as [number, number]}
            icon={L.icon({
              iconUrl: marker.markerType === 'corn' ? corn.src : marker.markerType === 'rice' ? rice.src : marker.markerType === 'carrot' ? carrot.src : marker.markerType === 'tomatoes' ? tomatoes.src : marker.markerType === 'eggplant' ? eggplant.src : '',
              iconSize: [70, 50], // Increased size of the markers
              iconAnchor: [16, 32],
              popupAnchor: [0, -32]
            })}
          >
            <Popup>
              <div className="p-4 space-y-2">
                <p className="font-bold text-lg capitalize">{marker.title}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">Current Crop Type:</span> <span className="font-medium">{marker.markerType}</span></p>
                <p className="text-sm text-gray-700"><span className="font-semibold">Barangay:</span> <span className="font-medium">{marker.barangay}</span></p>
                <p className="text-sm text-gray-700"><span className="font-semibold">Yields:</span> <span className="font-medium">{marker.yields} tons</span></p>
                {agriculturalPlot?.some(plot => plot.markerId === marker._id) && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-700"><span className="font-semibold">Area:</span> <span className="font-medium">{agriculturalPlot.find(plot => plot.markerId === marker._id)?.area} hectares</span></p>
                    {crops?.filter(crop => crop.plotId === agriculturalPlot.find(plot => plot.markerId === marker._id)?._id).map((crop, cropIndex) => (
                      <div key={cropIndex} className="space-y-1">
                        <p className="text-sm text-gray-700"><span className="font-semibold">Planting Date:</span> <span className="font-medium">{formatDateToMonthYear(crop.plantingDate)}</span></p>
                        <p className="text-sm text-gray-700"><span className="font-semibold">Harvest Date:</span> <span className="font-medium">{formatDateToMonthYear(crop.harvestDate)}</span></p>
                        <p className="text-sm text-gray-700"><span className="font-semibold">Yields:</span> <span className="font-medium">{crop.yields} tons</span></p>
                      </div>
                    ))}
                    <p className="text-sm text-gray-700 capitalize"><span className="font-semibold">Land Use Types:</span> <br/>{agriculturalPlot.find(plot => plot.markerId === marker._id)?.landUseType.map((type, index) => (
                      <span key={index} className="inline-flex items-center mr-2">
                        {type === 'corn' && <Image height={200} width={200} src={corn.src} alt="Corn" className="inline-block w-6 h-6 mr-1" />}
                        {type === 'rice' && <Image height={200} width={200} src={rice.src} alt="Rice" className="inline-block w-6 h-6 mr-1" />}
                        {type === 'carrots' && <Image height={200} width={200} src={carrot.src} alt="Carrot" className="inline-block w-6 h-6 mr-1" />}
                        {type === 'tomatoes' && <Image height={200} width={200} src={tomatoes.src} alt="Tomatoes" className="inline-block w-6 h-6 mr-1" />}
                        {type === 'eggplant' && <Image height={200} width={200} src={eggplant.src} alt="Eggplant" className="inline-block w-6 h-6 mr-1" />}
                        <span className="font-medium">{type}</span>
                      </span>
                    ))}</p>
                    <p className="text-sm text-gray-700"><span className="font-semibold">Status:</span> <Badge className="ml-1">{agriculturalPlot.find(plot => plot.markerId === marker._id)?.status}</Badge></p>
                  </div>
                )}
                {marker.userId === userId?.data?._id && (
                  <>
                    <Button variant='ghost' className="mt-2" onClick={() => {
                        setIsEditDialogOpen(true)
                        setEditMarkerId(marker._id)
                    }}>
                      Edit
                    </Button>
                    {isEditDialogOpen && (
                       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                       <DialogContent className="z-[1000] overflow-y-auto">
                         <DialogHeader>
                           <DialogTitle>Edit Marker</DialogTitle>
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
                               name="yields"
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
                    )}
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        {selectedLocation && (
          <Marker
            position={selectedLocation}
            icon={L.icon({
              iconUrl: markerType === 'corn' ? corn.src : markerType === 'rice' ? rice.src : markerType === 'carrot' ? carrot.src : markerType === 'tomatoes' ? tomatoes.src : markerType === 'eggplant' ? eggplant.src : '',
              iconSize: [70, 50], // Increased size of the markers
              iconAnchor: [16, 32],
              popupAnchor: [0, -32]
            })}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{farmName}</h3>
                <p>Crop Type: {markerType}</p>
              </div>
            </Popup>
          </Marker>
        )}
        <LocationSelector />
      </MapContainer>
      <div className="mt-4 space-y-4">
        {!userHasLocation && (
          <Button onClick={isAddingMarker ? handleCancel : handleAddMarker} variant="default">
            {isAddingMarker ? 'Cancel Adding New Farm Location' : 'Add New Farm Location'}
          </Button>
        )}
      </div>
    </div>
  );
}