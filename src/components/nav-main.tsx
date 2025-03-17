"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()
   const messengers = useQuery(api.chats.getMessengers)

   const hasUnreadChat = messengers?.some(m => m.unreadChat !== null)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Handle Dashboard and Reports as standalone items
          if (item.title === "Dashboard" || item.title === "Employee List" || item.title === "Vouchers" || item.title === "Payroll Sheet" || item.title === "Support" || item.title === "Farms" || item.title === "Map") {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-gray-100 rounded-lg transition",
                    pathname === item.url ? "text-[#8BC34A] bg-gray-100" : "text-gray-600"
                  )}
                >
                  <Link href={item.url}>
                    {item.icon && (
                      <item.icon className={cn("h-5 w-5 mr-3",
                        pathname === item.url ? "text-[#8BC34A]" : "text-gray-500"
                      )} />
                    )}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // Handle other items with dropdowns
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      "text-sm relative group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-gray-100 rounded-lg transition",
                      pathname === item.url ? "text-[#8BC34A] bg-gray-100" : "text-gray-600"
                    )}
                  >
                    {item.icon && (
                      <item.icon className={cn("h-5 w-5 mr-3",
                        pathname === item.url ? "text-[#8BC34A]" : "text-gray-500"
                      )} />
                    )}
                    <span>{item.title}</span>
                    <ChevronRight className={cn(
                      "ml-auto transition-transform duration-200 h-5 w-5",
                      "group-data-[state=open]/collapsible:rotate-90",
                      pathname === item.url ? "text-[#8BC34A]" : "text-gray-500"
                    )} />
                    {(hasUnreadChat && item.title === "Communication") && (
                      <div className="absolute transition-all duration-500 ease-linear top-0 right-0 bg-red-600 rounded-full size-3"></div>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <>
                      {subItem.title === "Direct Messages" ? (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className={cn(
                            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-gray-100 rounded-lg transition",
                            pathname === subItem.url ? "text-[#8BC34A] bg-gray-100" : "text-gray-600"
                          )}
                          >
                          <Link href={subItem.url} className="relative">
                            <span>{subItem.title}</span>
                            {hasUnreadChat && (
                              <div className="absolute top-0 right-0 bg-red-600 rounded-full size-3"></div>
                            )}
                          </Link>
                         
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      ): (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className={cn(
                            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-gray-100 rounded-lg transition",
                            pathname === subItem.url ? "text-[#8BC34A] bg-gray-100" : "text-gray-600"
                          )}
                          >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      )}
                      
                      </>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
