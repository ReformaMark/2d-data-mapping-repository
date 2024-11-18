'use client';
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { Activity, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const AuditLogOverview = () => {
    const logs = useQuery(api.admin.getRecentAuditLogs)

    if (!logs) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (logs.length === 0) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                        <AlertCircle className="h-8 w-8 mb-2" />
                        <p>No recent activity</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                        {logs.map((log) => (
                            <div
                                key={log._id}
                                className="flex flex-col space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-primary">{log.action}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{log.details}</p>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="mt-4 text-right">
                    <Link
                        href="/admin/audit-logs"
                        className={cn(
                            buttonVariants({ variant: "default", size: "sm" }),
                            "text-white"
                        )}
                    >
                        View all activity
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}