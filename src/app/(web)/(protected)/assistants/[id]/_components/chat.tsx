"use client"

import { ChatForm } from "@/app/(web)/(protected)/assistants/[id]/_components/chat-form"
import { ChatList } from "@/app/(web)/(protected)/assistants/[id]/_components/chat-list"

export function Chat() {
  return (
    <div className='h-full flex flex-col gap-4'>
      <ChatList />
      <ChatForm />
    </div>
  )
}
