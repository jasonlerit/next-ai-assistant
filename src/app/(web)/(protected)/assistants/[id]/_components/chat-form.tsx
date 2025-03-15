import { Message } from "@/common/types/message.type"
import { QueryKey } from "@/common/types/query-key.type"
import { Role } from "@/common/types/role.type"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { sendChat } from "@/lib/api"
import { getQueryClient } from "@/lib/react-query"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Loader2, LucideSend } from "lucide-react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"

export function ChatForm() {
  const { id } = useParams<{ id: string }>()

  const queryClient = getQueryClient()

  const mutation = useMutation({
    mutationFn: (value: Message) => sendChat(id, value),
    onMutate: async (newMessage: Message) => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.MESSAGES, id] })

      const previousMessages = queryClient.getQueryData<Message[]>([QueryKey.MESSAGES, id])

      queryClient.setQueryData<Message[]>([QueryKey.MESSAGES, id], (old) => {
        if (old) {
          return [
            ...old,
            newMessage,
            {
              role: Role.ASSISTANT,
              content: "",
            },
          ]
        }

        return old
      })

      return { previousMessages }
    },
    onError: (error, newMessage, context) => {
      queryClient.setQueryData<Message[]>([QueryKey.MESSAGES, id], context?.previousMessages)

      setLastMessage("Oops! An Error Occurred")

      toast.error("Oops! An Error Occurred", {
        description: "Please try again later",
      })
    },
    onSuccess: async (message) => {
      if (message !== null) {
        const reader = message.getReader()
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          const chunk = new TextDecoder().decode(value)
          setLastMessage(chunk)
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.MESSAGES, id] })
      form.reset()
    },
  })

  const form = useForm({
    defaultValues: {
      role: Role.USER,
      content: "",
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value)
    },
    validators: {
      onChange: z.object({
        role: z.nativeEnum(Role),
        content: z.string().min(1, { message: "Must be at least 1 character." }).max(2000, {
          message: "Must be no more than 2000 characters.",
        }),
      }),
    },
  })

  const setLastMessage = (value: string) => {
    queryClient.setQueryData<Message[]>([QueryKey.MESSAGES, id], (old) => {
      if (old) {
        const lastIndex = old.length - 1
        if (lastIndex < 0) {
          return old
        }
        const lastMessage = old[lastIndex]
        return [
          ...old.slice(0, lastIndex),
          {
            ...lastMessage,
            content: lastMessage.content.concat(value),
          },
        ]
      }
      return old
    })
  }

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      form.handleSubmit()
    }
  }

  return (
    <form
      className='flex gap-4 w-1/2'
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field name='content'>
        {(field) => (
          <Textarea
            className='w-full resize-none min-h-10'
            name={field.name}
            value={field.state.value}
            placeholder='How can I help you?'
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            onKeyDown={handleOnKeyDown}
            disabled={mutation.isPending}
            rows={1}
            // autoResize
            // maxHeight={116}
          />
        )}
      </form.Field>
      <form.Subscribe selector={(state) => [state.canSubmit, state.isDirty, state.isSubmitting]}>
        {([canSubmit, isDirty, isSubmitting]) => (
          <Button
            className='cursor-pointer'
            type='submit'
            disabled={!canSubmit || !isDirty || mutation.isPending}
          >
            {isSubmitting || mutation.isPending ? (
              <Loader2 className='animate-spin' />
            ) : (
              <LucideSend />
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
