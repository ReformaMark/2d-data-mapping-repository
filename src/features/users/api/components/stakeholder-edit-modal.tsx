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
import { useEffect, useState } from "react"
import { useMutation } from "convex/react"
import { toast } from "sonner"
import { api } from "../../../../../convex/_generated/api"
import { Id } from "../../../../../convex/_generated/dataModel"

interface StakeholderEditModalProps {
    isOpen: boolean
    onClose: () => void
    stakeholder: {
        _id: string
        fname: string
        lname: string
        email: string
        stakeholderProfile?: {
            contactNumber: string
            isActive: boolean
        }
    } | null
}

export function StakeholderEditModal({ isOpen, onClose, stakeholder }: StakeholderEditModalProps) {
    const updateStakeholder = useMutation(api.admin.updateStakeholderProfile)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        fname: "",
        lname: "",
        email: "",
        contactNumber: "",
    })

    useEffect(() => {
        if (stakeholder && isOpen) {
            setFormData({
                fname: stakeholder.fname || "",
                lname: stakeholder.lname || "",
                email: stakeholder.email || "",
                contactNumber: stakeholder.stakeholderProfile?.contactNumber || "",
            })
        }
    }, [stakeholder, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await updateStakeholder({
                stakeholderId: stakeholder?._id as Id<"users">,
                ...formData
            })
            toast.success("Stakeholder profile updated successfully")
            onClose()
        } catch (error) {
            toast.error("Failed to update stakeholder profile")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Edit Stakeholder Profile</DialogTitle>
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
                                placeholder="Enter contact number"
                                maxLength={11}
                                type="tel"
                            />
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