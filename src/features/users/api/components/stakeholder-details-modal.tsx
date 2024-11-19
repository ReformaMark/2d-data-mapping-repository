import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface StakeholderDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    stakeholder: {
        _id: string
        fname: string
        lname: string
        email: string
        image?: string
        role: string
        stakeholderProfile?: {
            contactNumber: string
            isActive: boolean
        }
    } | null
}

export function StakeholderDetailsModal({ isOpen, onClose, stakeholder }: StakeholderDetailsModalProps) {
    if (!stakeholder) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Stakeholder Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={stakeholder.image} />
                            <AvatarFallback>{stakeholder.fname[0]}{stakeholder.lname[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-bold">{stakeholder.fname} {stakeholder.lname}</h2>
                            <p className="text-muted-foreground">{stakeholder.email}</p>
                            <Badge 
                                variant={stakeholder.stakeholderProfile?.isActive ? "default" : "destructive"}
                                className="mt-2"
                            >
                                {stakeholder.stakeholderProfile?.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <h3 className="font-semibold">Contact Information</h3>
                            <div className="grid grid-cols-2 gap-1">
                                <span className="text-muted-foreground">Phone:</span>
                                <span>{stakeholder.stakeholderProfile?.contactNumber || "—"}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">Account Information</h3>
                            <div className="grid grid-cols-2 gap-1">
                                <span className="text-muted-foreground">Role:</span>
                                <span className="capitalize">{stakeholder.role}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}