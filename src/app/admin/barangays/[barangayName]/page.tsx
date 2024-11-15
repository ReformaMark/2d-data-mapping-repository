import { BarangayDetail } from "@/features/admin/components/barangay-detail"
import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface BarangayPageProps {
    params: {
        barangayName: string
    }
}

const validBarangays = ["Turu", "Balitucan", "Mapinya"]

const BarangayPage = ({ params }: BarangayPageProps) => {
    if (!validBarangays.includes(params.barangayName)) {
        notFound()
    }

    const barangayName = params.barangayName as "Turu" | "Balitucan" | "Mapinya"

    return (
        <Card className="p-4 md:p-6">
            <div className="space-y-6 md:space-y-8">
                <div className="border-b pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <MapPin className="h-6 w-6 text-emerald-500" />
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Barangay {barangayName}
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base">
                        Manage and monitor agricultural data across {barangayName}
                    </p>
                </div>

                <div className="w-full overflow-x-auto">
                    <BarangayDetail barangayName={barangayName} />
                </div>
            </div>
        </Card>
    )
}

export default BarangayPage
