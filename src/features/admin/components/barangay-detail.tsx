"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarangayFarmers } from "./barangay-farmers"
import { BarangayOverview } from "./barangay-overview"
import { BarangayPlots } from "./barangay-plots"

interface BarangayDetailProps {
    barangayName: "Turu" | "Balitucan" | "Mapinya"
}

export const BarangayDetail = ({ barangayName }: BarangayDetailProps) => {
    return (
        <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="plots">Plots</TabsTrigger>
                <TabsTrigger value="farmers">Farmers</TabsTrigger>
                {/* <TabsTrigger value="production">Production</TabsTrigger> */}
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
                <BarangayOverview barangayName={barangayName} />
            </TabsContent>

            <TabsContent value="plots" className="space-y-4">
                <BarangayPlots barangayName={barangayName} />
            </TabsContent>

            <TabsContent value="farmers" className="space-y-4">
                <BarangayFarmers barangayName={barangayName} />
            </TabsContent>

            {/* <TabsContent value="production" className="space-y-4">
                <BarangayProduction barangayName={barangayName} />
            </TabsContent> */}
        </Tabs>
    )
}

