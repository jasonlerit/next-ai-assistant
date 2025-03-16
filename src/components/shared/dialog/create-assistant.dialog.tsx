import { AssistantForm } from "@/components/shared/form/assistant.form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import { useState } from "react"

export function CreateAssistantDialog() {
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false)

  return (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogTrigger asChild>
        <SidebarMenuButton className='cursor-pointer'>
          <Plus />
          <span>Create Assistant</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Assistant</DialogTitle>
          <DialogDescription>Create a custom AI assistant for your needs.</DialogDescription>
        </DialogHeader>
        <AssistantForm shouldResetForm={showCreateDialog} />
      </DialogContent>
    </Dialog>
  )
}
