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
            <Map/>
        </div>
    )
}

export default FarmerPage