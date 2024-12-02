"use client"

import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { MoreVertical, PlusIcon, Search, Shield } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "@/features/users/api/use-current-user"
import { useState } from "react"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Id } from "../../../../convex/_generated/dataModel"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const UsersList = () => {
    const admins = useQuery(api.admin.getAllAdmins)
    const toggleStatus = useMutation(api.admin.toggleAdminStatus)
    const deleteAdmin = useMutation(api.admin.deleteAdmin)
    const router = useRouter()
    const { data: currentUser } = useCurrentUser()

    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showStatusDialog, setShowStatusDialog] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [adminToDelete, setAdminToDelete] = useState<any>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [adminToToggle, setAdminToToggle] = useState<any>(null)

    if (!admins) return null

    // Filter admins based on search query and status filter
    const filteredAdmins = admins.filter(admin => {
        const matchesSearch =
            searchQuery === "" ||
            admin.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            admin.lname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            admin.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && admin.isActive) ||
            (statusFilter === "inactive" && !admin.isActive)

        return matchesSearch && matchesStatus
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleToggleStatus = async (admin: any) => {
        setAdminToToggle(admin)
        setShowStatusDialog(true)
    }

    const confirmToggleStatus = async () => {
        try {
            await toggleStatus({
                adminId: adminToToggle._id,
                currentAdminId: currentUser?._id as Id<"users">,
            })
            toast.success(`Account ${adminToToggle.isActive ? 'deactivated' : 'activated'} successfully`)
            setShowStatusDialog(false)
        } catch (error) {
            toast.error("Failed to update account status")
            console.error(error)
        }
    }

    const handleDeleteAdmin = async (adminId: string) => {
        setAdminToDelete(adminId)
        setShowDeleteDialog(true)
    }

    const confirmDelete = async () => {
        try {
            await deleteAdmin({
                adminId: adminToDelete,
                currentAdminId: currentUser?._id as Id<"users">,
            })
            toast.success("Administrator account deleted successfully")
            setShowDeleteDialog(false)
        } catch (error) {
            toast.error("Failed to delete administrator account")
            console.error(error)
        }
    }

    return (
        <>
            <div className="space-y-4 p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-medium">System Administrators</h3>
                        <p className="text-sm text-muted-foreground">
                            Manage system administrators
                        </p>
                    </div>
                    <Button onClick={() => router.push("/admin/sysadmin/register")} className="w-full md:w-auto">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Administrator
                    </Button>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search administrators..."
                            className="pl-8 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-[180px]">
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-full">
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
                                <TableHead className="min-w-[200px]">Administrator</TableHead>
                                <TableHead className="min-w-[120px]">Role</TableHead>
                                <TableHead className="min-w-[100px]">Status</TableHead>
                                <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAdmins.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No administrators found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAdmins.map((admin) => (
                                    <TableRow key={admin._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={admin.image} />
                                                    <AvatarFallback>
                                                        {admin.fname[0]}{admin.lname[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">
                                                        {admin.fname} {admin.lname}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {admin.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-blue-500" />
                                                <span>Administrator</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={admin.isActive ? "default" : "destructive"}>
                                                {admin.isActive ? "Active" : "Inactive"}
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
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleToggleStatus(admin)}
                                                        className={admin.isActive ? "text-destructive" : "text-blue-600"}
                                                        disabled={currentUser?._id === admin._id}
                                                    >
                                                        {admin.isActive ? "Deactivate Account" : "Activate Account"}
                                                        {currentUser?._id === admin._id && (
                                                            <span className="ml-2 text-xs text-muted-foreground">
                                                                (Cannot modify own account)
                                                            </span>
                                                        )}
                                                    </DropdownMenuItem>
                                                    {currentUser?._id !== admin._id && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteAdmin(admin._id)}
                                                            className="text-destructive"
                                                        >
                                                            Delete Account
                                                        </DropdownMenuItem>
                                                    )}
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

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            administrator account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to {adminToToggle?.isActive ? 'deactivate' : 'activate'} this administrator account?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmToggleStatus}>
                            {adminToToggle?.isActive ? 'Deactivate' : 'Activate'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}