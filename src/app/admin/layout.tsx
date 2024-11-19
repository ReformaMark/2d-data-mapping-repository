"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ConvexClientProvider } from "@/components/convex-client-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { withAuthMiddleware } from "@/features/auth/components/auth-middleware"

function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <ConvexClientProvider>
            <div className="flex flex-col h-screen">
                <SidebarProvider>
                    <AppSidebar
                        header="Admin Portal"
                        value="admin"
                    />
                    <div className="flex-1 overflow-y-auto">
                        <div className="container mx-auto py-4 px-4 max-w-7xl pt-8">
                            {children}
                        </div>
                    </div>
                    <Toaster />
                </SidebarProvider>
            </div>
        </ConvexClientProvider>
    )
}

export default withAuthMiddleware(AdminLayout)