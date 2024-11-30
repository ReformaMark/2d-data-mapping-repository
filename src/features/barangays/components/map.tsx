/* eslint-disable */
"use client"
import React, { useState } from 'react'
import { LayersControl, MapContainer, Polygon, Popup, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts"
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import corn from '@/../public/images/corn.png';
import rice from '@/../public/images/rice.png';
import carrot from '@/../public/images/carrots.png';
import tomatoes from '@/../public/images/tomatoes.png';
import eggplant from '@/../public/images/eggplant.png';
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { formatDateToMonthYear } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Image from 'next/image'

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

function MyMap() {
  const searchParams = useSearchParams()
  const search = searchParams.get('search')
  const crops = useQuery(api.crops.getCrops);
  const agriculturalPlot = useQuery(api.agriculturalPlots.getAgriculturalPlot);
  const allBarangays = useQuery(api.barangays.get)
  const allMapMarkers = useQuery(api.mapMarkers.getAllMapMarkers)
  const router = useRouter()
  const [position, setPosition] = useState({
    lat: 15.24559014,  // Centered between the 3 barangays
    lng: 120.73375338, // Centered between the 3 barangays
    zoom: 15     // Zoomed out to show all 3 barangays
  })

  console.log(crops)
  console.log(agriculturalPlot)
  
  const [searchQuery, setSearchQuery] = useState(search || "")
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null)

  const coordinates: [number, number] = [position.lat, position.lng]
  
  const barangays = allBarangays?.map(barangay => ({
    name: barangay.name,
    coordinates: barangay.coordinates,
    resources: barangay.resources.map(resource => ({
      name: resource.name,
      description: resource.description,
      coordinates: resource.coordinates,
      icon: resource.name === "Rice" ? rice.src : resource.name === "Corn" ? corn.src : resource.name === "Carrots" ? carrot.src : resource.name === "Tomatoes" ? tomatoes.src : eggplant.src,
      production: resource.production
    }))
  })) || [];

  const filteredBarangays = barangays.filter(barangay =>
    barangay.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearch = () => {
    if (filteredBarangays.length === 1) {
      toast.success(`${filteredBarangays[0].name} selected`)
      const barangay = filteredBarangays[0];
      setPosition({
        lat: barangay.coordinates[0][0],
        lng: barangay.coordinates[0][1],
        zoom: 14
      });
      if(barangay.name === "Mapinya") {
        setPosition({
          lat: 15.260086,
          lng: 120.684951,
            zoom: 20
          });
        } else if(barangay.name === "Turu") {
          setPosition({
            lat: 15.24559014,
            lng: 120.73375338,
            zoom: 20
          });
        } else {
          setPosition({
            lat: 15.2577,
            lng: 120.7110,
            zoom: 14
          });
        }
      setSelectedBarangay(barangay.name);
    }
  };

  const polygonStyle = {
    fillColor: '#ffffff',
    fillOpacity: 0.5,
    color: '#000',
    weight: 2
  }

  const chartData = allMapMarkers?.reduce((acc, marker) => {
    if (!selectedBarangay || marker.barangay === selectedBarangay) {
      const existing = acc.find(item => item.cropType === marker.markerType);
      if (existing) {
        existing.totalYields += marker.yields || 0;
      } else {
        acc.push({
          cropType: marker.markerType,
          totalYields: marker.yields || 0
        });
      }
    }
    return acc;
  }, [] as { cropType: string, totalYields: number }[]);

  const COLORS = {
    corn: '#FFD700', // Yellow
    tomatoes: '#FF0000', // Red
    eggplant: '#8A2BE2', // Violet
    carrot: '#ffa500', // Orange
    rice: '#D2B48C' // Light Brown
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 flex items-center space-x-2">
          <Input
            placeholder="Search barangays..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleSearch}>Search</Button>
        </CardContent>
      </Card>

      <MapContainer center={coordinates} zoom={position.zoom} className='h-[700px] w-full'>
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
        {filteredBarangays.map((barangay) => {
          const aggregatedResources = barangay.resources.reduce((acc, resource) => {
            const existingResource = acc.find(r => r.name === resource.name);
            if (existingResource) {
              existingResource.production += resource.production;
            } else {
              acc.push({ 
                ...resource, 
                coordinates: resource.coordinates as [number, number] 
              });
            }
            return acc;
          }, [] as { name: string, production: number, coordinates: [number, number], icon: string, description: string }[]);

          const pieData = aggregatedResources.map(resource => ({
            name: resource.name,
            value: resource.production
          }));

          return (
            <React.Fragment key={barangay.name}>
              <Polygon 
                pathOptions={polygonStyle}
                positions={barangay.coordinates as [number, number][]}
                eventHandlers={{
                  click: () => setSelectedBarangay(barangay.name)
                }}
              >
                <Popup>
                  <span className='font-semibold'>Barangay {barangay.name}<br/>Magalang, Pampanga</span>
                  {/* <PieChart width={200} height={200}>
                    <Pie
                      data={pieData}
                      cx={100}
                      cy={100}
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart> */}
                </Popup>
              </Polygon>
              {allMapMarkers?.filter(marker => marker.barangay === barangay.name).map((marker, index) => (
                <Marker
                  key={`${barangay.name}-resource-${index}`}
                  position={marker.coordinates as [number, number]}
                  icon={L.icon({
                    iconUrl: marker.markerType === "rice" ? rice.src : marker.markerType === "corn" ? corn.src : marker.markerType === "carrot" ? carrot.src : marker.markerType === "tomatoes" ? tomatoes.src : eggplant.src,
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
            
                      {agriculturalPlot?.some(plot => plot.markerId === marker._id) && (
                        <div className="space-y-1">
                          <div className="text-sm text-gray-700"><span className="font-semibold">Area:</span> <span className="font-medium">{agriculturalPlot.find(plot => plot.markerId === marker._id)?.area} hectares</span></div>
                          {crops?.filter(crop => crop.plotId === agriculturalPlot?.find(plot => plot.markerId === marker._id)?._id).map((crop, cropIndex) => (
                            <div key={cropIndex} className="space-y-2">
                              <p className="text-sm text-gray-700"><span className="font-semibold">Planting Date:</span> <span className="font-medium">{formatDateToMonthYear(crop.plantingDate)}</span></p>
                              <p className="text-sm text-gray-700"><span className="font-semibold">Harvest Date:</span> <span className="font-medium">{formatDateToMonthYear(crop.harvestDate)}</span></p>
                              <p className="text-sm text-gray-700"><span className="font-semibold">Possible Yields:</span> <span className="font-medium">{crop.possibleYields} tons</span></p>
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
                      <div className="flex justify-end mt-2">
                        <Button variant="link" onClick={() => {
                          const find = agriculturalPlot?.find(plot => plot.markerId === marker._id)
                          router.push(`/stakeholder/farms/${find?._id}`)
                        }}>
                          More Details
                        </Button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          )
        })}
      </MapContainer>
      {selectedBarangay && (
        <>
          <div className="text-center text-xl font-semibold my-4">Production Analysis for {selectedBarangay}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Agricultural Production by Crop Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="cropType" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value} tons`} />
                      <Bar dataKey="totalYields" name="Total Yields">
                        {chartData?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.cropType.toLowerCase() as keyof typeof COLORS]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className=''>
              <CardHeader>
                <CardTitle>Agricultural Production by Crop Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mt-4 flex justify-center items-center">
                  <ul className="list-none grid grid-cols-5">
                    {chartData?.map((entry, index) => (
                      <li key={`legend-${index}`} className="flex items-center">
                        <span
                          className="inline-block w-10 h-3 mr-2"
                          style={{ backgroundColor: COLORS[entry.cropType.toLowerCase() as keyof typeof COLORS] }}
                        ></span>
                        <span className="capitalize">{entry.cropType}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="totalYields"
                        nameKey="cropType"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.cropType.toLowerCase() as keyof typeof COLORS]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props: any) => [
                          `${value} tons ${props?.payload?.[0]?.percent ? `(${(props.payload[0].percent * 100).toFixed(2)}%)` : ''}`,
                          name
                        ]} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

export default MyMap
