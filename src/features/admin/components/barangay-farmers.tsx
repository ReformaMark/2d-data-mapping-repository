"use client"

import { useQuery } from "convex/react"
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
import { Eye, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "../../../../convex/_generated/api"

interface BarangayFarmersProps {
    barangayName: "Turu" | "Balitucan" | "Mapinya"
}

export function BarangayFarmers({ barangayName }: BarangayFarmersProps) {
    const router = useRouter()
    const farmers = useQuery(api.admin.getBarangayFarmers, {
        name: barangayName
    })

    if (!farmers) return null

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Registered Farmers</h3>
                <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Farmer
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Farmer</TableHead>
                        <TableHead>Contact Number</TableHead>
                        <TableHead>Total Area</TableHead>
                        <TableHead>Active Plots</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {farmers.map((farmer) => (
                        <TableRow key={farmer._id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={farmer.image} />
                                        <AvatarFallback>
                                            {farmer.fname[0]}{farmer.lname[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{farmer.fname} {farmer.lname}</div>
                                        <div className="text-sm text-muted-foreground">{farmer.email}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{farmer.farmerProfile?.contactNumber}</TableCell>
                            <TableCell>{farmer.totalArea.toFixed(2)} ha</TableCell>
                            <TableCell>{farmer.activePlots}</TableCell>
                            <TableCell>
                                <Badge variant={farmer.farmerProfile?.isActive ? "default" : "secondary"}>
                                    {farmer.farmerProfile?.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => router.push(`/admin/farmers/${farmer._id}`)}
                                >
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