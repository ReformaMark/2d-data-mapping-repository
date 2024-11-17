"use client"

import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { MoreVertical, PlusIcon } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye } from "lucide-react"
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

export const UsersList = () => {
    const admins = useQuery(api.admin.getAllAdmins)
    const toggleStatus = useMutation(api.admin.toggleAdminStatus)
    const deleteAdmin = useMutation(api.admin.deleteAdmin)
    const resetPassword = useMutation(api.admin.resetAdminPassword)
    const router = useRouter()
    const { data: currentUser } = useCurrentUser()

    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showStatusDialog, setShowStatusDialog] = useState(false)
    const [adminToDelete, setAdminToDelete] = useState<any>(null)
    const [adminToToggle, setAdminToToggle] = useState<any>(null)

    if (!admins) return null

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
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold">System Administrators</h3>
                        <p className="text-sm text-muted-foreground">
                            Manage system administrators
                        </p>
                    </div>
                    <Button onClick={() => router.push("/admin/sysadmin/register")}>
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Administrator
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Administrator</TableHead>
                            <TableHead>Role</TableHead>
                            {/* <TableHead>Last Active</TableHead> */}
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {admins.map((admin) => (
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
                                {/* <TableCell>
                                {admin.farmerProfile?.lastLogin
                                    ? new Date(admin.farmerProfile.lastLogin).toLocaleDateString()
                                    : "Never"}
                            </TableCell> */}
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
                                            {/* <DropdownMenuItem onClick={() => router.push(`/admin/administrators/${admin._id}`)}>
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => router.push(`/admin/administrators/${admin._id}/edit`)}>
                                                Edit Profile
                                            </DropdownMenuItem> */}
                                            {/* <DropdownMenuItem onClick={() => handlePasswordReset(admin._id)}>
                                            Reset Password
                                        </DropdownMenuItem> */}
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
                        ))}
                    </TableBody>
                </Table>
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