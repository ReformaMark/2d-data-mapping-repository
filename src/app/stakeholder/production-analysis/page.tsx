
import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'



export default function MyMap() {
    const Map = useMemo(() => dynamic(
        () => import('@/features/barangays/components/map'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

  return (
    <div className="space-y-4">
        <Map />
    </div>
  )
}
