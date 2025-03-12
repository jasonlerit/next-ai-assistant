"use client"

import { AssistantMenu } from "@/components/shared/assistant-menu"
import { NavMenu } from "@/components/shared/nav-menu"
import { NavUser } from "@/components/shared/nav-user"
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
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
  const { data } = authClient.useSession()

  return (
    <Sidebar variant='floating' collapsible='icon'>
      <SidebarContent>
        <AssistantMenu />
        <NavMenu items={navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: data?.user.name ?? "",
            email: data?.user.email ?? "",
            avatar: data?.user.image ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
