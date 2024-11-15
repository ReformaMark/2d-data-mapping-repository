"use client"

import { Button } from "@/components/ui/button"
import { useMutation } from "convex/react"
import { toast } from "sonner"
import { api } from "../../convex/_generated/api"

export function SeedDatabase() {
    const seed = useMutation(api.seed.seedDatabase)

    const handleSeed = async () => {
        try {
            await seed()
            toast.success("Database seeded successfully")
        } catch (error) {
            toast.error("Failed to seed database")
            console.error(error)
        }
    }

    return (
        <Button
            variant="outline"
            onClick={handleSeed}
        >
            Seed Database
        </Button>
    )
}