"use client"

import { AppSidebar } from "@/components/app-sidebar";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { withAuthMiddleware } from "@/features/auth/components/auth-middleware";
import { RoleCheck } from "@/features/auth/components/role-check";

function StakeholdersLayout({ children }: { children: React.ReactNode }) {
    const role = RoleCheck();
 
        return (
            <ConvexClientProvider>
                <div className="flex flex-col h-screen">
                    <SidebarProvider>
                    <AppSidebar 
                        header="Farmer Portal"
                        value="farmer"
                    />
                    <RoleCheck/>
                    <div className="flex-1 overflow-y-auto p-4">
                        {children}
                    </div>
                    <Toaster />
                </SidebarProvider>
            </div>
        </ConvexClientProvider>
        )

}

export default withAuthMiddleware(StakeholdersLayout)