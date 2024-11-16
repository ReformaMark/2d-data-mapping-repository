import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FarmersList } from "@/features/admin/components/farmers-list"
import { UsersList } from "@/features/admin/components/users-list"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { StakeholdersList } from "@/features/admin/components/stakeholders-list"

const UserManagementPage = () => {
    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">User Management</CardTitle>
                    <CardDescription>
                        Manage users, farmers, and stakeholders
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    <Tabs defaultValue="farmers" className="space-y-4">
                        <TabsList className="w-full justify-start">
                            <TabsTrigger value="farmers">Farmers</TabsTrigger>
                            <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
                            <TabsTrigger value="admins">Administrators</TabsTrigger>
                        </TabsList>

                        <TabsContent value="farmers" className="space-y-4">
                            <FarmersList />
                        </TabsContent>

                        <TabsContent value="stakeholders" className="space-y-4">
                            <StakeholdersList />
                        </TabsContent>

                        <TabsContent value="admins" className="space-y-4">
                            <UsersList />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default UserManagementPage