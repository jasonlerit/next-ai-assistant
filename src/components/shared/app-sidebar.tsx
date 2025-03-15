"use client"

import { AssistantMenu } from "@/components/shared/assistant-menu"
import { NavMenu } from "@/components/shared/nav-menu"
import { NavUser } from "@/components/shared/nav-user"
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar"
import { LifeBuoy, Send } from "lucide-react"

const navSecondary = [
  {
    title: "Support",
    url: "#",
    icon: LifeBuoy,
  },
  {
    title: "Feedback",
    url: "#",
    icon: Send,
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant='floating' collapsible='icon'>
      <SidebarContent>
        <AssistantMenu />
        <NavMenu items={navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
