import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/features/users/api/use-current-user"
import { useEffect } from "react"

export function withAuthMiddleware<P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> {
    return function AuthMiddleware(props: P) {
        const router = useRouter()
        const { data: user, isLoading } = useCurrentUser()

        useEffect(() => {
            if (!isLoading) {
                if (!user) {
                    router.push("/")
                } else if (
                    (user.role === "farmer" && user.farmerProfile?.isActive === false) ||
                    (user.role === "stakeholder" && user.stakeholderProfile?.isActive === false) ||
                    (user.role === "admin" && user.isActive === false)
                ) {
                    router.push("/deactivated")
                }
            }
        }, [user, isLoading, router])

        if (isLoading) return <div>Loading...</div>
        if (!user) return null
        if (
            (user.role === "farmer" && user.farmerProfile?.isActive === false) ||
            (user.role === "stakeholder" && user.stakeholderProfile?.isActive === false) ||
            (user.role === "admin" && user.isActive === false)
        ) {
            return null
        }

        return <WrappedComponent {...props} />
    }
}