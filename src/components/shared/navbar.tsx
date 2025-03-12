"use client"

import { ModeToggle } from "@/components/shared/mode-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"

export const Navbar = () => {
  return (
    <header>
      <nav className='h-16 flex justify-between items-center'>
        <SidebarTrigger />
        <ModeToggle />
      </nav>
    </header>
  )
}
