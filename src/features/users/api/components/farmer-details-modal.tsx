import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface FarmerDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    farmer: any // Replace with proper type from your schema
}

export function FarmerDetailsModal({ isOpen, onClose, farmer }: FarmerDetailsModalProps) {
    if (!farmer) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Farmer Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={farmer.image} />
                            <AvatarFallback>{farmer.fname[0]}{farmer.lname[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-bold">{farmer.fname} {farmer.lname}</h2>
                            <p className="text-muted-foreground">{farmer.email}</p>
                            <Badge 
                                variant={farmer.farmerProfile?.isActive ? "default" : "destructive"}
                                className="mt-2"
                            >
                                {farmer.farmerProfile?.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <h3 className="font-semibold">Contact Information</h3>
                            <div className="grid grid-cols-2 gap-1">
                                <span className="text-muted-foreground">Phone:</span>
                                <span>{farmer.farmerProfile?.contactNumber || "—"}</span>
                                <span className="text-muted-foreground">Address:</span>
                                <span>{farmer.farmerProfile?.address || "—"}</span>
                                <span className="text-muted-foreground">Barangay:</span>
                                <span>{farmer.farmerProfile?.barangayName}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">Account Information</h3>
                            <div className="grid grid-cols-2 gap-1">
                                {/* <span className="text-muted-foreground">User ID:</span>
                                <span className="truncate">{farmer._id}</span> */}
                                <span className="text-muted-foreground">Role:</span>
                                <span className="capitalize">{farmer.role}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}