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
  HelpCircle,
  LayoutDashboard,
  LineChart,
  Map,
  MessageSquare
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function AppSidebar({ 
  header = "Stakeholder Portal", 
  value = "stakeholder",
  ...props 
}: React.ComponentProps<typeof Sidebar> & { 
  header?: string,
  value?: "admin" | "barangay" | "stakeholder" 
}) {
  const adminNav = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Barangay Management",
      url: "/admin/barangays",
      icon: Map,
      items: [
        {
          title: "Turu",
          url: "/admin/barangays/turu",
        },
        {
          title: "Balitucan",
          url: "/admin/barangays/balitucan",
        },
        {
          title: "Mapinya",
          url: "/admin/barangays/mapinya",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: LineChart,
      items: [
        {
          title: "Production Overview",
          url: "/admin/analytics/production",
        },
        {
          title: "Yield Analysis",
          url: "/admin/analytics/yield",
        },
        {
          title: "Weather Impact",
          url: "/admin/analytics/weather",
        },
      ],
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: FileText,
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
      title: "Agricultural Data",
      url: "/stakeholder/data",
      icon: LineChart,
      items: [
        {
          title: "Production Analysis",
          url: "/stakeholder/data/production",
        },
        {
          title: "Market Trends",
          url: "/stakeholder/data/market",
        },
        {
          title: "Development Metrics",
          url: "/stakeholder/data/development",
        },
      ],
    },
    {
      title: "Communication",
      url: "/stakeholder/messages",
      icon: MessageSquare,
      items: [
        {
          title: "Announcements",
          url: "/stakeholder/messages/announcements",
        },
        {
          title: "Direct Messages",
          url: "/stakeholder/messages/inbox",
        },
      ],
    },
    {
      title: "Support",
      url: "/support",
      icon: HelpCircle,
    },
  ];

  const navigationMap = {
    admin: adminNav,
    barangay: barangayNav,
    stakeholder: stakeholderNav
  };

  const { data: user } = useCurrentUser();

  if (!user) return null;

  const navItems = navigationMap[value];
  const baseUrl = value === 'admin' ? '/admin' : value === 'barangay' ? '/dashboard' : '/stakeholder';

  return (
    <Sidebar collapsible="none" {...props} className="bg-white h-screen sticky top-0 left-0">
      <SidebarHeader>
        <Link href={baseUrl} className="flex flex-col items-center mb-8">
          <div className="bg-[#8BC34A] w-full py-4 rounded-md flex flex-col items-center">
            <Image src="/logo.svg" alt="A1 Agro" width={50} height={50} className="size-16" />
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

      <SidebarRail />
    </Sidebar>
  );
}