"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useConvexAuth } from "convex/react"
import { useRole } from "../api/use-role"

export function RoleCheck() {
    const router = useRouter()
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth()
    const { data: role, isLoading: isRoleLoading } = useRole()

    useEffect(() => {
        if (!isAuthLoading && !isRoleLoading && isAuthenticated) {
            if (role === "admin") {
                router.push("/admin")
            } else if (role === "stakeholder") {
                router.push("/stakeholder")
            } else if (role === "farmer") {
                router.push("/farmer")
            }
        }
    }, [isAuthenticated, isAuthLoading, isRoleLoading, role, router])

    return null
}