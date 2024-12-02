'use client'
import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'

function FarmerPage() {
    const Map = useMemo(() => dynamic(
        () => import('@/features/farmer/components/map').then(mod => mod.FarmerMap),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 ml-16">Farmer Dashboard</h1>
            <Map/>
        </div>
    )
}

export default FarmerPage