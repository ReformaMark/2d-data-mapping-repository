"use client"

import { AppSidebar } from "@/components/app-sidebar";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { withAuthMiddleware } from "@/features/auth/components/auth-middleware";
import { RoleCheck } from "@/features/auth/components/role-check";

function StakeholdersLayout({ children }: { children: React.ReactNode }) {
    return ( 
        <ConvexClientProvider>
            <div className="flex flex-col h-screen">
                <SidebarProvider>
                    <AppSidebar 
                        header="Stakeholder Portal"
                        value="stakeholder"
                    />
                     <RoleCheck/>
                    <div className="block w-full overflow-y-auto p-4">
                        {children}
                    </div>
                    <Toaster />
                </SidebarProvider>
            </div>
        </ConvexClientProvider>
    )
}

export default withAuthMiddleware(StakeholdersLayout)