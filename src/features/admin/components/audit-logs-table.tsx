"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { Download, RefreshCcw } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"
import * as XLSX from 'xlsx'
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"

export function AuditLogsTable() {
    const [dateRange, setDateRange] = useState<{
        from: Date
        to: Date | undefined
    }>({
        from: new Date(new Date().setHours(0, 0, 0, 0)), // Start of day
        to: new Date(new Date().setHours(23, 59, 59, 999)), // End of day
    })

    const logs = useQuery(api.admin.getAuditLogs, {
        startDate: dateRange.from.getTime(),
        endDate: dateRange.to ? new Date(dateRange.to.setHours(23, 59, 59, 999)).getTime() : new Date().getTime(),
    })

    const handleExport = () => {
        try {
            if (!logs || logs.length === 0) {
                toast.error("No data to export")
                return
            }

            // Transform the data for export
            const exportData = logs.map(log => ({
                Action: log.action,
                Details: log.details,
                "User Type": log.targetType,
                Timestamp: format(log.timestamp, "PPp")
            }))

            // Create worksheet
            const ws = XLSX.utils.json_to_sheet(exportData)

            // Create workbook
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, "Audit Logs")

            // Generate filename with date range
            const fromDate = format(dateRange.from, "yyyy-MM-dd")
            const toDate = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
            const fileName = `audit-logs_${fromDate}_to_${toDate}.xlsx`

            // Save file
            XLSX.writeFile(wb, fileName)
            toast.success("Audit logs exported successfully")
        } catch (error) {
            console.error("Export failed:", error)
            toast.error("Failed to export audit logs")
        }
    }

    if (!logs) return (
        <div className="flex items-center justify-center h-64">
            <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
    )

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 w-full sm:w-auto"
                    onClick={handleExport}
                >
                    <Download className="h-4 w-4" />
                    Export to Excel
                </Button>
                <DateRangePicker
                    initialDateFrom={dateRange.from}
                    initialDateTo={dateRange.to}
                    onUpdate={({ range }) => {
                        setDateRange({
                            from: range.from,
                            to: range.to ?? new Date()
                        })
                    }}
                    align="start"
                    showCompare={false}
                />
            </div>

            <div className="rounded-md border overflow-hidden">
                <ScrollArea className="w-full overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[120px]">Action</TableHead>
                                <TableHead className="min-w-[200px]">Details</TableHead>
                                <TableHead className="min-w-[120px]">User Type</TableHead>
                                <TableHead className="min-w-[150px]">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No audit logs found for the selected date range
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log._id}>
                                        <TableCell className="font-medium">
                                            {log.action}
                                        </TableCell>
                                        <TableCell>{log.details}</TableCell>
                                        <TableCell className="capitalize">
                                            {log.targetType}
                                        </TableCell>
                                        <TableCell>
                                            {format(log.timestamp, "PPp")}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    )
}