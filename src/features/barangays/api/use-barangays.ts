import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export const useBarangays = () => {
    const data = useQuery(api.barangays.get, {})
    const isLoading = data === undefined

    return {
        data,
        isLoading,
    }
}