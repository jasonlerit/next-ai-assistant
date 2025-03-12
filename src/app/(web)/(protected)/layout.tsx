import { AppSidebar } from "@/components/shared/app-sidebar"
import { Navbar } from "@/components/shared/navbar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full px-2 pb-2'>
        <Navbar />
        {children}
      </main>
    </SidebarProvider>
  )
}
