import { Card } from "@/components/ui/card"
import { AuditLogsTable } from "@/features/admin/components/audit-logs-table"

const AuditLogsPage = () => {
    return (
        <Card className="p-6">
            <div className="space-y-8">
                <div className="border-b pb-4">
                    <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                    <p className="text-muted-foreground mt-1">
                        View and filter system activity logs
                    </p>
                </div>
                <AuditLogsTable />
            </div>
        </Card>
    )
}

export default AuditLogsPage