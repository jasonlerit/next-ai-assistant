import { Message } from "@/common/types/message.type"
import { Role } from "@/common/types/role.type"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { LegacyRef } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Props {
  messageRef?: LegacyRef<HTMLDivElement>
  message: Message
}

export function ChatMessage({ messageRef, message }: Props) {
  return (
    <Card
      ref={messageRef}
      className={`${message.role === Role.USER ? "max-w-[90%] lg:max-w-[80%] self-end bg-primary text-primary-foreground" : "border-none shadow-none"} py-0`}
    >
      <CardContent className='flex gap-4 p-4'>
        {message.role === Role.ASSISTANT && (
          <Avatar>
            <AvatarImage src='https://github.com/jasonlerit.png' alt='avatar' />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        )}
        <div className='flex flex-col gap-2'>
          <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
        </div>
      </CardContent>
    </Card>
  )
}
