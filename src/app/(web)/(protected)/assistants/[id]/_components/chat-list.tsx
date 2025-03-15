import { ChatMessage } from "@/app/(web)/(protected)/assistants/[id]/_components/chat-message"
import { QueryKey } from "@/common/types/query-key.type"
import { getChatMessages } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"

export function ChatList() {
  const { id } = useParams<{ id: string }>()

  const { data } = useQuery({
    queryKey: [QueryKey.MESSAGES, id],
    queryFn: () => getChatMessages(id),
  })

  return (
    <div className='flex-1 overflow-y-auto'>
      <div className='flex flex-col gap-4'>
        {data?.map((message, index) => <ChatMessage key={index} message={message} />)}
      </div>
    </div>
  )
}
