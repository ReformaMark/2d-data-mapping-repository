'use client'
import React, { useState } from 'react';
import { LayersControl, MapContainer, Polygon, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from 'convex/react';
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
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


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

export function FarmerMap() {
    const barangay = useQuery(api.barangays.getBarangay);
    const initialCoordinates: [number, number][] = [
        [0, 0],
    ]; 
    const coordinates: [number, number][] = barangay?.coordinates?.map((coord: number[]) => [coord[0], coord[1]]) || initialCoordinates;
    const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
    const [farmName, setFarmName] = useState('');
    const [markerType, setMarkerType] = useState('corn');
    const [isAddingMarker, setIsAddingMarker] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const saveLocation = useMutation(api.mapMarkers.createMapMarker);
    const mapMarkers = useQuery(api.mapMarkers.getMapMarkers);

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
            saveLocation={saveLocation}
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
              <div>
                <h3 className="font-bold">{marker.title}</h3>
                <p>Crop Type: {marker.markerType}</p>
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
        <Button onClick={isAddingMarker ? handleCancel : handleAddMarker} variant="default">
          {isAddingMarker ? 'Cancel Adding Marker' : 'Add Marker'}
        </Button>
      </div>
    </div>
  );
}