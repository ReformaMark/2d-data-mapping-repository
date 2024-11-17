
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CreateFarmerForm } from "@/features/admin/components/create-farmer-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

const RegisterFarmerPage = () => {
    return (
        <div className="space-y-6 p-6 max-w-3xl mx-auto">
            <Button variant="default" asChild>
                <Link href="/admin/user-management" className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Farmers List
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Register New Farmer</CardTitle>
                    <CardDescription>
                        Create a new farmer account with their basic information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateFarmerForm />
                </CardContent>
            </Card>
        </div>
    )
}

export default RegisterFarmerPage