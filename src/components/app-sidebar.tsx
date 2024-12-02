"use client";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useCurrentUser } from "@/features/users/api/use-current-user";
import {
  FileText,
  LayoutDashboard,
  LineChart,
  List,
  Map,
  MapIcon,
  MessageSquare,
  Settings,
  Users,
  Menu
} from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function AppSidebar({
  header = "Stakeholder Portal",
  value = "stakeholder",
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  header?: string,
  value?: "admin" | "barangay" | "stakeholder" | "farmer"
}) {
  const adminNav = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "User Management",
      url: "/admin/user-management",
      icon: Users,
      items: [
        {
          title: "Users",
          url: "/admin/user-management",
        },
      ],
    },
    {
      title: "Barangay Management",
      url: "/admin/barangays", 
      icon: Map,
      items: [
        {
          title: "Turu",
          url: "/admin/barangays/Turu",
        },
        {
          title: "Balitucan",
          url: "/admin/barangays/Balitucan",
        },
        {
          title: "Mapinya",
          url: "/admin/barangays/Mapinya",
        },
      ],
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: FileText,
      items: [
        {
          title: "Audit Logs",
          url: "/admin/audit-logs",
        },
      ],
    },
  ];

  const barangayNav = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Farm Management",
      url: "/farm",
      icon: Map,
      items: [
        {
          title: "My Plots",
          url: "/farm/plots",
        },
        {
          title: "Crop Tracking",
          url: "/farm/crops",
        },
      ],
    },
    {
      title: "Production Data",
      url: "/production",
      icon: LineChart,
      items: [
        {
          title: "Record Production",
          url: "/production/record",
        },
        {
          title: "View History",
          url: "/production/history",
        },
      ],
    },
    {
      title: "Communication",
      url: "/messages",
      icon: MessageSquare,
    },
  ];

  const stakeholderNav = [
    {
      title: "Dashboard",
      url: "/stakeholder",
      icon: LayoutDashboard,
    },
    {
      title: "Map",
      url: "/stakeholder/production-analysis",
      icon: MapIcon,
    },
    {
      title: "Farms",
      url: "/stakeholder/farms",
      icon: List,
    },
    {
      title: "Communication",
      url: "/stakeholder/messages",
      icon: MessageSquare,
      items: [
        {
          title: "Announcements",
          url: "/stakeholder/announcements",
        },
        {
          title: "Direct Messages",
          url: "/stakeholder/message",
        },
      ],
    },
    {
      title: "Settings",
      url: "/support",
      icon: Settings,
      items: [
        {
          title: "Profile",
          url: "/stakeholder/profile",
        }
      ]
    },
  ];

  const farmerNav = [
    {
      title: "Dashboard",
      url: "/farmer",
      icon: LayoutDashboard,
    },
    {
      title: "Farm Management",
      url: "/farmer/farm-management",
      icon: LineChart,
      items: [
        {
          title: "My Farm",
          url: "/farmer/my-farm",
        },
        {
          title: "Farms",
          url: "/farmer/farms",
        },
      ],
    },
    {
      title: "Communication",
      url: "/farmer/message",
      icon: MessageSquare,
      items: [
        {
          title: "Direct Messages",
          url: "/farmer/message",
        },
      ],
    },
  ];

  const navigationMap = {
    admin: adminNav,
    barangay: barangayNav,
    stakeholder: stakeholderNav,
    farmer: farmerNav
  };

  const { data: user } = useCurrentUser();

  if (!user) return null;

  const navItems = navigationMap[value];
  const baseUrl = value === 'admin' ? '/admin' : value === 'barangay' ? '/dashboard' : '/stakeholder';

  const SidebarContents = () => (
    <div className="bg-white h-screen">
      <SidebarHeader>
        <Link href={baseUrl} className="flex flex-col items-center mb-8">
          <div className="bg-[#8BC34A] w-full py-4 rounded-md flex flex-col items-center">
            <h1 className="text-sm font-semibold text-center text-white mt-2 px-2">
              {header}
            </h1>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsible="none" {...props} className="bg-white h-screen sticky top-0 left-0">
          <SidebarContents />
          <SidebarRail />
        </Sidebar>
      </div>

      {/* Mobile Sheet */}
      <div className="md:hidden fixed top-4 left-4 z-[9999]">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 bg-white rounded-md shadow-md">
              <Menu className="size-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[300px] z-[9999]">
            <SidebarContents />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}