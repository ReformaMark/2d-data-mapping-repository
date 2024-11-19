"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuthActions } from "@convex-dev/auth/react"

export default function DeactivatedPage() {
    const router = useRouter()
    const { signOut } = useAuthActions()

    const handleSignOut = async () => {
        await signOut()
        router.push("/auth/login")
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Account Deactivated</CardTitle>
                    <CardDescription>
                        Your account has been deactivated. Please contact the administrator for assistance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSignOut} className="w-full">
                        Sign Out
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}