import { BarangayCard } from "@/features/admin/components/barangay-card"
import { BarangayStats } from "@/features/admin/components/barangay-stats"
import { Card } from "@/components/ui/card"
import { Suspense } from "react"

const BarangayManagementPage = () => {
    return (
        <Card className="p-6">
            <div className="space-y-8">
                <div className="border-b pb-4">
                    <h1 className="text-3xl font-bold tracking-tight">Barangay Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and monitor agricultural data across barangays
                    </p>
                </div>

                <Suspense fallback={
                    <div className="h-32 flex items-center justify-center">
                        <div className="animate-pulse">Loading statistics...</div>
                    </div>
                }>
                    <BarangayStats />
                </Suspense>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <Suspense fallback={
                        <div className="col-span-full h-48 flex items-center justify-center">
                            <div className="animate-pulse">Loading barangay cards...</div>
                        </div>
                    }>
                        <BarangayCard barangayName="Turu" />
                        <BarangayCard barangayName="Balitucan" />
                        <BarangayCard barangayName="Mapinya" />
                    </Suspense>
                </div>
            </div>
        </Card>
    )
}

export default BarangayManagementPage