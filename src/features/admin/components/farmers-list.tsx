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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    UserPlus,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { useCurrentUser } from "@/features/users/api/use-current-user"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { FarmerDetailsModal } from "@/features/users/api/components/farmer-details-modal"
import { FarmerEditModal } from "@/features/users/api/components/farmer-edit-modal"

export function FarmersList() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [barangayFilter, setBarangayFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const { data: currentUser } = useCurrentUser()
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const toggleStatus = useMutation(api.admin.toggleUserStatus)
    const farmers = useQuery(api.admin.getAllFarmers)
    const [selectedFarmer, setSelectedFarmer] = useState<NonNullable<typeof farmers>[number] | null>(null)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)


    if (!farmers) return null


    // Filter farmers based on search query and filters
    const filteredFarmers = farmers.filter(farmer => {
        const matchesSearch =
            searchQuery === "" ||
            farmer.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            farmer.lname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            farmer.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesBarangay =
            barangayFilter === "all" ||
            farmer.farmerProfile?.barangayName.toLowerCase() === barangayFilter

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && farmer.farmerProfile?.isActive) ||
            (statusFilter === "inactive" && !farmer.farmerProfile?.isActive)

        return matchesSearch && matchesBarangay && matchesStatus
    })

    const handleToggleStatus = async () => {
        if (!selectedFarmer || !currentUser) return

        try {
            await toggleStatus({
                userId: selectedFarmer._id,
                userType: "farmer",
                adminId: currentUser._id
            })

            toast.success(
                selectedFarmer.farmerProfile?.isActive
                    ? "Farmer account deactivated"
                    : "Farmer account activated"
            )
            setShowConfirmDialog(false)
        } catch (error) {
            toast.error("Failed to update farmer status")
            console.error(error)
        }
    }


    return (
        <>
            <div className="space-y-4 p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-medium">Registered Farmers</h3>
                        <p className="text-sm text-muted-foreground">
                            Manage farmer accounts and their access
                        </p>
                    </div>
                    <Button onClick={() => router.push("/admin/farmers/register")} className="w-full md:w-auto">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Register New Farmer
                    </Button>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search farmers..."
                            className="pl-8 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <Select
                            value={barangayFilter}
                            onValueChange={setBarangayFilter}
                        >
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filter by Barangay" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Barangays</SelectItem>
                                <SelectItem value="turu">Turu</SelectItem>
                                <SelectItem value="balitucan">Balitucan</SelectItem>
                                <SelectItem value="mapinya">Mapinya</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[200px]">Farmer</TableHead>
                                <TableHead className="min-w-[100px]">Barangay</TableHead>
                                <TableHead className="min-w-[120px]">Contact</TableHead>
                                <TableHead className="min-w-[100px]">Status</TableHead>
                                <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredFarmers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No farmers found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredFarmers.map((farmer) => (
                                    <TableRow key={farmer._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8 flex-shrink-0">
                                                    <AvatarImage src={farmer.image} />
                                                    <AvatarFallback>
                                                        {farmer.fname[0]}{farmer.lname[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">
                                                        {farmer.fname} {farmer.lname}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {farmer.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{farmer.farmerProfile?.barangayName}</TableCell>
                                        <TableCell>{farmer.farmerProfile?.contactNumber || "—"}</TableCell>
                                        {/* <TableCell>{farmer.totalArea?.toFixed(2)} ha</TableCell> */}
                                        <TableCell>
                                            <Badge
                                                variant={farmer.farmerProfile?.isActive ? "default" : "destructive"}
                                                className="capitalize"
                                            >
                                                {farmer.farmerProfile?.isActive ? "Active" : "Inactive"}
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
                                                            setSelectedFarmer(farmer)
                                                            setShowDetailsModal(true)
                                                        }}
                                                    >
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedFarmer(farmer)
                                                            setShowEditModal(true)
                                                        }}
                                                    >
                                                        Edit Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedFarmer(farmer)
                                                            setShowConfirmDialog(true)
                                                        }}
                                                        className={farmer.farmerProfile?.isActive ? "text-destructive" : "text-blue-600"}
                                                    >
                                                        {farmer.farmerProfile?.isActive ? "Deactivate Account" : "Activate Account"}
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

            <FarmerDetailsModal
                isOpen={showDetailsModal}
                onClose={() => {
                    setShowDetailsModal(false)
                    setSelectedFarmer(null)
                }}
                farmer={selectedFarmer}
            />

            <FarmerEditModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false)
                    setSelectedFarmer(null)
                }}
                // @ts-expect-error slight typing issue
                farmer={selectedFarmer}
            />

            <ConfirmDialog
                isOpen={showConfirmDialog}
                onClose={() => {
                    setShowConfirmDialog(false)
                    setSelectedFarmer(null)
                }}
                onConfirm={handleToggleStatus}
                title={`${selectedFarmer?.farmerProfile?.isActive ? "Deactivate" : "Activate"} Account`}
                description={`Are you sure you want to ${selectedFarmer?.farmerProfile?.isActive ? "deactivate" : "activate"} the account for ${selectedFarmer?.fname} ${selectedFarmer?.lname}?`}
                confirmText={selectedFarmer?.farmerProfile?.isActive ? "Deactivate" : "Activate"}
            />
        </>
    )
}