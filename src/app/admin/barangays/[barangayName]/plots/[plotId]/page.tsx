"use client"

import { useParams } from "next/navigation"
import { BarangayPlotDetail } from "@/features/admin/components/barangay-plot-detail"

export default function AdminPlotPage() {
  const params = useParams()
  const plotId = params.plotId as string
  
  return (
    <div className="container mx-auto py-6">
      <BarangayPlotDetail plotId={plotId} />
    </div>
  )
} 