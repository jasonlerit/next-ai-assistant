"use client"

import { QueryKey } from "@/common/types/query-key.type"
import { CreateAssistantDialog } from "@/components/shared/dialog/create-assistant.dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getAssistants } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AssistantMenu() {
  const pathname = usePathname()

  const { data } = useQuery({
    queryKey: [QueryKey.ASSISTANTS],
    queryFn: getAssistants,
  })

  return (
    <SidebarGroup>
      <SidebarGroupLabel>AI Assistants</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <CreateAssistantDialog />
          </SidebarMenuItem>
          {data?.items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                className='h-fit'
                asChild
                isActive={`/assistants/${item.id}` === pathname}
              >
                <Link href={`/assistants/${item.id}`}>
                  <Avatar className='h-10 w-10 rounded-lg'>
                    <AvatarImage src={""} alt={item.name} />
                    <AvatarFallback className='bg-gray-300 rounded-lg' />
                  </Avatar>
                  <div className='flex flex-col'>
                    <p className='font-semibold'>{item.name}</p>
                    <p className='text-sm text-muted-foreground'>{item.role}</p>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
