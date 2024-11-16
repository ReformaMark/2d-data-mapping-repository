"use client"

import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
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

export const UsersList = () => {
    const admins = useQuery(api.admin.getAllAdmins)

    if (!admins) return null

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">System Administrators</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage system administrators
                    </p>
                </div>
                <Button>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Administrator
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Administrator</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Last Active</TableHead>
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
                            {/* <TableCell>
                                <Badge variant={admin.isActive ? "default" : "secondary"}>
                                    {admin.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell> */}
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}