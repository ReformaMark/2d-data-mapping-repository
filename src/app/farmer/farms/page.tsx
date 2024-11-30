'use client'

import React, { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Card, CardHeader, CardFooter, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import corn from '@/../public/images/corn.png';
import rice from '@/../public/images/rice.png';
import carrot from '@/../public/images/carrots.png';
import tomatoes from '@/../public/images/tomatoes.png';
import eggplant from '@/../public/images/eggplant.png';
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'

function FarmsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const farms = useQuery(api.agriculturalPlots.getAllFarms)

  const filteredFarms = farms?.filter(farm => 
    farm.mapMarker?.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="p-4">
      <CardHeader>
        <Input
          type="text"
          placeholder="Search for a farm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-1/3"
        />
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredFarms && filteredFarms.length > 0 ? (
          filteredFarms.map((farm, index) => (
            <Card key={index} className="shadow-lg bg-white">
              <CardHeader className="bg-green-100">
                <h2 className="text-xl font-bold">{farm.mapMarker?.title}</h2>
              </CardHeader>
              <div className="p-6 space-y-2">
                <p className="text-sm font-semibold">
                  Barangay: <span className="font-normal">{farm.mapMarker?.barangay}</span>
                </p>
                <p className="flex items-center text-sm font-semibold">
                  Current Crops: 
                  <span className="font-normal capitalize">
                    {farm.cropHistory.map((crop, index) => (
                      <span key={index} className="inline-flex items-center mr-2">
                        {crop?.name === 'corn' && <Image height={200} width={200} src={corn.src} alt="Corn" className="inline-block w-6 h-6 mr-1" />}
                        {crop?.name === 'rice' && <Image height={200} width={200} src={rice.src} alt="Rice" className="inline-block w-6 h-6 mr-1" />}
                        {crop?.name === 'carrot' && <Image height={200} width={200} src={carrot.src} alt="Carrot" className="inline-block w-6 h-6 mr-1" />}
                        {crop?.name === 'tomatoes' && <Image height={200} width={200} src={tomatoes.src} alt="Tomatoes" className="inline-block w-6 h-6 mr-1" />}
                        {crop?.name === 'eggplant' && <Image height={200} width={200} src={eggplant.src} alt="Eggplant" className="inline-block w-6 h-6 mr-1" />}
                        <span className="font-medium">{crop?.name}</span>
                      </span>
                    ))}
                  </span>
                </p>
                <p className="text-sm font-semibold">
                  Can Plant: <br/>
                  <span className="font-normal capitalize">
                    {farm.landUseType.map((type, index) => (
                      <span key={index} className="inline-flex items-center mr-2">
                        {type === 'corn' && <Image height={200} width={200} src={corn.src} alt="Corn" className="inline-block w-6 h-6 mr-1" />}
                        {type === 'rice' && <Image height={200} width={200} src={rice.src} alt="Rice" className="inline-block w-6 h-6 mr-1" />}
                        {type === 'carrots' && <Image height={200} width={200} src={carrot.src} alt="Carrot" className="inline-block w-6 h-6 mr-1" />}
                        {type === 'tomatoes' && <Image height={200} width={200} src={tomatoes.src} alt="Tomatoes" className="inline-block w-6 h-6 mr-1" />}
                        {type === 'eggplant' && <Image height={200} width={200} src={eggplant.src} alt="Eggplant" className="inline-block w-6 h-6 mr-1" />}
                        <span className="font-medium">{type}</span>
                      </span>
                    ))}
                  </span>
                </p>
                <p className="text-sm font-semibold">
                  Area: <span className="font-normal">{farm.area} hectares</span>
                </p>
                <p className="text-sm font-semibold">
                  Possible Yields: <span className="font-normal">{farm.mapMarker?.yields} tons</span>
                </p>
                <p className="text-sm font-semibold">
                  Status: <Badge className="ml-1">{farm.status}</Badge>
                </p>
              </div>
              <CardFooter className="bg-gray-50 flex justify-end items-center">
                <Link href={`/farmer/farms/${farm._id}`} className="text-blue-500 hover:underline">See More Details</Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No farms found matching your search.</p>
        )}
      </CardContent>
    </Card>
  )
}

export default FarmsPage