import { AppSidebar } from "@/components/app-sidebar";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <ConvexClientProvider>
            <div className="flex flex-col h-screen">
                <SidebarProvider>
                    <AppSidebar 
                        header="Admin Portal"
                        value="admin"
                    />
                <div className="flex-1 overflow-y-auto p-4">
                    {children}
                    </div>
                    <Toaster />
                </SidebarProvider>
            </div>
        </ConvexClientProvider>
    )
}