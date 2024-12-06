'use client'
import React from 'react'

import MyFarm from '@/features/farmer/components/my-farm'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Link from 'next/link'

export default function MyFarmPage() {
  const mapMarker = useQuery(api.mapMarkers.getMapMarkerByUserId)

  if (!mapMarker || mapMarker.length < 1) {
    return (
      <div className="flex justify-center items-center h-full">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-center">No Farms Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              You haven't created any farms yet. Start by creating your farm now!
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
    <div>
      
       <MyFarm/> 
    </div>
  )
}
