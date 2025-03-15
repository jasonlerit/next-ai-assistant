import { ChatMessage } from "@/app/(web)/(protected)/assistants/[id]/_components/chat-message"
import { QueryKey } from "@/common/types/query-key.type"
import { getChatMessages } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export function ChatList() {
  const { id } = useParams<{ id: string }>()

  const containerRef = useRef<HTMLDivElement | null>(null)
  const messageRef = useRef<HTMLDivElement | null>(null)

  const [extraPadding, setExtraPadding] = useState(620)

  const { data } = useQuery({
    queryKey: [QueryKey.MESSAGES, id],
    queryFn: () => getChatMessages(id),
  })

  useEffect(() => {
    if (!containerRef.current || !messageRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const messageRect = messageRef.current.getBoundingClientRect()

    const topSpace = messageRect.top - containerRect.top
    const bottomSpace = containerRect.bottom - messageRect.bottom

    const totalSpace = topSpace + bottomSpace

    setExtraPadding(totalSpace)

    setTimeout(() => {
      messageRef.current?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      })
    }, 200)
  }, [data?.length])

  useEffect(() => {
    if (!containerRef.current || !messageRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const messageRect = messageRef.current.getBoundingClientRect()

    const topSpace = messageRect.top - containerRect.top
    const bottomSpace = containerRect.bottom - messageRect.bottom

    const totalSpace = topSpace + bottomSpace

    setExtraPadding(totalSpace > 0 ? totalSpace : 0)
  }, [data])

  return (
    <div ref={containerRef} className='flex-1 overflow-y-auto'>
      <div className='flex flex-col gap-4' style={{ paddingBottom: extraPadding }}>
        {data?.map((message, index) => (
          <ChatMessage
            key={index}
            messageRef={data.length - 1 === index ? messageRef : undefined}
            message={message}
          />
        ))}
      </div>
    </div>
  )
}
