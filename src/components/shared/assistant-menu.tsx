"use client"

import { CreateAssistantDialog } from "@/components/shared/dialog/create-assistant-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

interface Assistant {
  id: string
  name: string
  role: string
  image: string
}

export function AssistantMenu() {
  const pathname = usePathname()

  const [items, setItems] = useState<Assistant[]>([
    {
      id: "1",
      name: "Name 1",
      role: "Grammar Fixer",
      image:
        "https://images.pexels.com/photos/264905/pexels-photo-264905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: "2",
      name: "Name 2",
      role: "Commit Artisan",
      image:
        "https://images.pexels.com/photos/163077/mario-yoschi-figures-funny-163077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: "3",
      name: "Name 3",
      role: "Personal Coach",
      image:
        "https://images.pexels.com/photos/163077/mario-yoschi-figures-funny-163077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>AI Assistants</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <CreateAssistantDialog />
          </SidebarMenuItem>
          {items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                className='h-fit'
                asChild
                isActive={`/assistants/${item.id}` === pathname}
              >
                <Link href={`/assistants/${item.id}`}>
                  <Avatar className='h-10 w-10 rounded-lg'>
                    <AvatarImage src={item.image} alt={item.name} />
                    <AvatarFallback className='rounded-lg'>{item.name}</AvatarFallback>
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
