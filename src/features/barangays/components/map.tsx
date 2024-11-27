"use client"
  /* eslint-disable */
import React, { useState } from 'react'
import { LayersControl, MapContainer, Polygon, Popup, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
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
import { useSearchParams } from 'next/navigation'


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});


function MyMap() {
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const allBarangays = useQuery(api.barangays.get)
  const [position] = useState({
    lat: 15.25,  // Centered between the 3 barangays
    lng: 120.71, // Centered between the 3 barangays
    zoom: 12     // Zoomed out to show all 3 barangays
  })

  const [searchQuery, setSearchQuery] = useState(search || "")

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

  const polygonStyle = {
    fillColor: '#ffffff',
    fillOpacity: 0.5,
    color: '#000',
    weight: 2
  }

  const chartData = barangays.map(barangay => ({
    name: barangay.name,
    Rice: barangay.resources.filter(resource => resource.name === "Rice").reduce((acc, resource) => acc + resource.production, 0),
    Corn: barangay.resources.filter(resource => resource.name === "Corn").reduce((acc, resource) => acc + resource.production, 0),
    Carrots: barangay.resources.filter(resource => resource.name === "Carrots").reduce((acc, resource) => acc + resource.production, 0),
    Tomatoes: barangay.resources.filter(resource => resource.name === "Tomatoes").reduce((acc, resource) => acc + resource.production, 0),
    Eggplant: barangay.resources.filter(resource => resource.name === "Eggplant").reduce((acc, resource) => acc + resource.production, 0)
  }))

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search barangays..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      <MapContainer center={coordinates} zoom={position.zoom} className='h-[600px] w-full'>
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
              >
                <Popup>
                  <span>Barangay {barangay.name}<br/>Magalang, Pampanga</span>
                  <PieChart width={200} height={200}>
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
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </Popup>
              </Polygon>
              {barangay.resources.map((resource, index) => (
                <Marker
                  key={`${barangay.name}-resource-${index}`}
                  position={resource.coordinates as [number, number]}
                  icon={L.icon({
                    iconUrl: resource.icon,
                    iconSize: [70, 50], // Increased size of the markers
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                  })}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{resource.name}</h3>
                      <p>{resource.description}</p>
                      <p>Production: {resource.production}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          )
        })}
      </MapContainer>

      <Card>
        <CardHeader>
          <CardTitle>Agricultural Production by Barangay</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Rice" fill="#8884d8" />
                <Bar dataKey="Corn" fill="#82ca9d" />
                <Bar dataKey="Carrots" fill="#ffc658" />
                <Bar dataKey="Tomatoes" fill="#ff8042" />
                <Bar dataKey="Eggplant" fill="#8dd1e1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MyMap
