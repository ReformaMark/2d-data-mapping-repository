"use client"

import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Loading from "@/components/loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { formatDateToMonthYear } from "@/lib/utils"
import dynamic from "next/dynamic"

const Map = dynamic(() => import("@/features/barangays/components/map"), {
  ssr: false,
  loading: () => <div>Loading map...</div>
})

interface BarangayPlotDetailProps {
  plotId: string
}

export function BarangayPlotDetail({ plotId }: BarangayPlotDetailProps) {
  const plot = useQuery(api.agriculturalPlots.getFarmById, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    farmId: plotId as any 
  })

  if (!plot) return <Loading />

  const statusColors = {
    active: "success",
    fallow: "destructive", 
    preparing: "secondary"
  } as const

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{plot.mapMarker?.title}</h2>
        <Badge variant={statusColors[plot.status as keyof typeof statusColors]}>
          {plot.status}
        </Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="soil">Soil Information</TabsTrigger>
          <TabsTrigger value="irrigation">Irrigation</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plot Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Area</p>
                  <p className="text-lg">{plot.area.toFixed(2)} hectares</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Land Use Types</p>
                  <p className="text-lg capitalize">{plot.landUseType.join(", ")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Farmer</p>
                  <p className="text-lg">{plot.user?.fname} {plot.user?.lname}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact</p>
                  <p className="text-lg">{plot.user?.farmerProfile?.contactNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crop History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Crop</TableHead>
                    <TableHead>Planting Date</TableHead>
                    <TableHead>Harvest Date</TableHead>
                    <TableHead>Yield (tons)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plot.cropHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No crop history available
                      </TableCell>
                    </TableRow>
                  ) : (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    plot.cropHistory.map((crop: any) => (
                      <TableRow key={crop._id}>
                        <TableCell className="font-medium capitalize">{crop.name}</TableCell>
                        <TableCell>{formatDateToMonthYear(crop.plantingDate)}</TableCell>
                        <TableCell>
                          {crop.harvestDate ? formatDateToMonthYear(crop.harvestDate) : "Not harvested"}
                        </TableCell>
                        <TableCell>{crop.actualYeilds?.toFixed(2) || "N/A"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <Map />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="soil" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Soil Information</CardTitle>
            </CardHeader>
            <CardContent>
              {plot.soilInfo ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Soil Type</p>
                    <p className="text-lg capitalize">{plot.soilInfo.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">pH Level</p>
                    <p className="text-lg">{plot.soilInfo.pH}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Texture</p>
                    <p className="text-lg capitalize">{plot.soilInfo.texture}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Erosion Risk</p>
                    <p className="text-lg capitalize">{plot.soilInfo.erosionRisk}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No soil information available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="irrigation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Irrigation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Water Source</p>
                  <p className="text-lg capitalize">{plot.waterSource || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Water Usage</p>
                  <p className="text-lg">{plot.waterUsage ? `${plot.waterUsage} m³` : "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Irrigation System</p>
                  <p className="text-lg capitalize">{plot.irrigationSystem || "Not specified"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Farm Infrastructure</CardTitle>
            </CardHeader>
            <CardContent>
              {plot.farmInfrastructure ? (
                <div className="grid gap-4">
                  <div>
                    <p className="text-sm font-medium">Storage Facilities</p>
                    <p className="text-lg capitalize">{plot.farmInfrastructure.storageFacilities.join(", ") || "None"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Farm Equipment</p>
                    <p className="text-lg capitalize">{plot.farmInfrastructure.farmEquipment.join(", ") || "None"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Transportation</p>
                    <p className="text-lg capitalize">{plot.farmInfrastructure.transportation.join(", ") || "None"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No infrastructure information available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 