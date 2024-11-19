"use client"

import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Search,
    MoreVertical
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useCurrentUser } from "@/features/users/api/use-current-user"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Id } from "../../../../convex/_generated/dataModel"
import { StakeholderDetailsModal } from "@/features/users/api/components/stakeholder-details-modal"
import { StakeholderEditModal } from "@/features/users/api/components/stakeholder-edit-modal"

export function StakeholdersList() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const stakeholders = useQuery(api.admin.getAllStakeholders)
    const toggleStatus = useMutation(api.admin.toggleUserStatus)
    const { data: currentUser } = useCurrentUser()

    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [selectedStakeholder, setSelectedStakeholder] = useState<NonNullable<typeof stakeholders>[number] | null>(null)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    if (!stakeholders) return null

    const handleToggleStatus = async () => {
        if (!selectedStakeholder || !currentUser) return

        try {
            await toggleStatus({
                userId: selectedStakeholder._id,
                userType: "stakeholder",
                adminId: currentUser._id as Id<"users">
            })

            toast.success(
                selectedStakeholder.stakeholderProfile?.isActive
                    ? "Stakeholder account deactivated"
                    : "Stakeholder account activated"
            )
            setShowConfirmDialog(false)
        } catch (error) {
            toast.error("Failed to update stakeholder status")
            console.error(error)
        }
    }


    const filteredStakeholders = stakeholders.filter(stakeholder =>
        searchQuery === "" ||
        stakeholder.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stakeholder.lname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stakeholder.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-medium">Registered Stakeholders</h3>
                        <p className="text-sm text-muted-foreground">
                            Manage stakeholder accounts
                        </p>
                    </div>
                    {/* <Button onClick={() => router.push("/admin/stakeholders/register")}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register New Stakeholder
                </Button> */}
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search stakeholders..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStakeholders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No stakeholders found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredStakeholders.map((stakeholder) => (
                                    <TableRow key={stakeholder._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={stakeholder.image} />
                                                    <AvatarFallback>
                                                        {stakeholder.fname[0]}{stakeholder.lname[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="font-medium">
                                                    {stakeholder.fname} {stakeholder.lname}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{stakeholder.email}</TableCell>
                                        <TableCell>
                                            {stakeholder.stakeholderProfile?.contactNumber || "—"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={stakeholder.stakeholderProfile?.isActive ? "default" : "destructive"}
                                            >
                                                {stakeholder.stakeholderProfile?.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedStakeholder(stakeholder)
                                                            setShowDetailsModal(true)
                                                        }}
                                                    >
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedStakeholder(stakeholder)
                                                            setShowEditModal(true)
                                                        }}
                                                    >
                                                        Edit Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedStakeholder(stakeholder)
                                                            setShowConfirmDialog(true)
                                                        }}
                                                        className={stakeholder.stakeholderProfile?.isActive ? "text-destructive" : "text-blue-600"}
                                                    >
                                                        {stakeholder.stakeholderProfile?.isActive ? "Deactivate Account" : "Activate Account"}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <StakeholderDetailsModal
                isOpen={showDetailsModal}
                onClose={() => {
                    setShowDetailsModal(false)
                    setSelectedStakeholder(null)
                }}
                // @ts-expect-error slight typing issue
                stakeholder={selectedStakeholder}
            />

            <StakeholderEditModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false)
                    setSelectedStakeholder(null)
                }}
                // @ts-expect-error slight typing issue
                stakeholder={selectedStakeholder}
            />
            <ConfirmDialog
                isOpen={showConfirmDialog}
                onClose={() => {
                    setShowConfirmDialog(false)
                    setSelectedStakeholder(null)
                }}
                onConfirm={handleToggleStatus}
                title={`${selectedStakeholder?.stakeholderProfile?.isActive ? "Deactivate" : "Activate"} Account`}
                description={`Are you sure you want to ${selectedStakeholder?.stakeholderProfile?.isActive ? "deactivate" : "activate"} the account for ${selectedStakeholder?.fname} ${selectedStakeholder?.lname}?`}
                confirmText={selectedStakeholder?.stakeholderProfile?.isActive ? "Deactivate" : "Activate"}
            />
        </>
    )
}