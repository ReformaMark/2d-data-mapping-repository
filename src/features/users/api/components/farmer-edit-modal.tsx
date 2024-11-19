import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { useMutation } from "convex/react"
import { toast } from "sonner"
import { api } from "../../../../../convex/_generated/api"
import { Id } from "../../../../../convex/_generated/dataModel"

interface FarmerEditModalProps {
    isOpen: boolean
    onClose: () => void
    farmer: {
        _id: string
        fname: string
        lname: string
        email: string
        farmerProfile?: {
            contactNumber: string
            address: string
            barangayName: string
            isActive: boolean
        }
    } | null
}
type Barangay = "Turu" | "Balitucan" | "Mapinya"

export function FarmerEditModal({ isOpen, onClose, farmer }: FarmerEditModalProps) {
    const updateFarmer = useMutation(api.admin.updateFarmerProfile)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        fname: "",
        lname: "",
        email: "",
        contactNumber: "",
        address: "",
        barangayName: "" as Barangay,
    })

    // Update form data when farmer prop changes or modal opens
    useEffect(() => {
        if (farmer && isOpen) {
            setFormData({
                fname: farmer.fname || "",
                lname: farmer.lname || "",
                email: farmer.email || "",
                contactNumber: farmer.farmerProfile?.contactNumber || "",
                address: farmer.farmerProfile?.address || "",
                barangayName: farmer.farmerProfile?.barangayName as Barangay || "",
            })
        }
    }, [farmer, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await updateFarmer({
                farmerId: farmer?._id as Id<"users">,
                ...formData
            })
            toast.success("Farmer profile updated successfully")
            onClose()
        } catch (error) {
            toast.error("Failed to update farmer profile")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Edit Farmer Profile</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="fname">First Name</Label>
                            <Input
                                id="fname"
                                value={formData.fname}
                                onChange={(e) => setFormData(prev => ({ ...prev, fname: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lname">Last Name</Label>
                            <Input
                                id="lname"
                                value={formData.lname}
                                onChange={(e) => setFormData(prev => ({ ...prev, lname: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contactNumber">Contact Number</Label>
                            <Input
                                id="contactNumber"
                                value={formData.contactNumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                                required
                                placeholder="Enter your contact number"
                                maxLength={11}
                                type="tel"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="barangay">Barangay</Label>
                            <Select
                                value={formData.barangayName}
                                onValueChange={(value: Barangay) => setFormData(prev => ({ ...prev, barangayName: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select barangay" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Turu">Turu</SelectItem>
                                    <SelectItem value="Balitucan">Balitucan</SelectItem>
                                    <SelectItem value="Mapinya">Mapinya</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}