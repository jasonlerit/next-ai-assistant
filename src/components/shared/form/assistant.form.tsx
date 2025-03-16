import { AI_MODELS } from "@/common/constants/ai-models"
import { PaginatedResponse } from "@/common/types/pagination.type"
import { QueryKey } from "@/common/types/query-key.type"
import { InputError } from "@/components/shared/input/input-error"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Assistant, insertAssistantsSchema } from "@/db/schemas"
import { createAssistant } from "@/lib/api"
import { getQueryClient } from "@/lib/react-query"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"

interface Props {
  shouldResetForm: boolean
}

export function AssistantForm({ shouldResetForm }: Props) {
  const queryClient = getQueryClient()

  const mutation = useMutation({
    mutationFn: createAssistant,
    onMutate: async (newAssistant) => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.ASSISTANTS] })

      const previousPaginatedAssistants = queryClient.getQueryData<PaginatedResponse<Assistant>>([
        QueryKey.ASSISTANTS,
      ])

      const modifiedNewAssistant: Assistant = {
        ...newAssistant,
        id: Date.now().toString(),
        userId: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      queryClient.setQueryData<PaginatedResponse<Assistant>>([QueryKey.ASSISTANTS], (old) => {
        if (old) {
          return {
            ...old,
            items: [...old.items, modifiedNewAssistant],
          }
        }
        return old
      })

      return { previousPaginatedAssistants }
    },
    onError: (error, newAssistant, context) => {
      queryClient.setQueryData<PaginatedResponse<Assistant>>(
        [QueryKey.ASSISTANTS],
        context?.previousPaginatedAssistants
      )

      if (error instanceof AxiosError) {
        const errorData = error.response?.data

        toast.error("Oops! An Error Occurred", {
          description: errorData.message,
        })

        return
      }

      toast.error("Oops! An Error Occurred", {
        description: "Please try again later",
      })
    },
    onSuccess: (newAssistant) => {
      toast.success("Success", {
        description: `Successfully created ${newAssistant?.name}`,
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.ASSISTANTS] })
      form.reset()
      // setShowCreateDialog(false)
    },
  })

  const form = useForm({
    defaultValues: {
      name: "",
      role: "",
      model: "",
      systemInstruction: "",
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value)
    },
    validators: {
      onChange: insertAssistantsSchema,
    },
  })

  useEffect(() => {
    if (shouldResetForm) {
      form.reset()
    }
  }, [shouldResetForm, form])

  return (
    <form
      className='flex flex-col gap-4 '
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field name='name'>
        {(field) => (
          <div className='grid gap-2'>
            <Label htmlFor={field.name}>Name</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              type='text'
              placeholder='Name'
            />
            <InputError field={field} />
          </div>
        )}
      </form.Field>
      <form.Field name='role'>
        {(field) => (
          <div className='grid gap-2'>
            <Label htmlFor={field.name}>Role</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              type='text'
              placeholder='Role'
            />
            <InputError field={field} />
          </div>
        )}
      </form.Field>
      <form.Field name='model'>
        {(field) => (
          <div className='grid gap-2'>
            <Label>Model</Label>
            <Select onValueChange={(value) => field.handleChange(value)}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select a model' />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((model, index) => (
                  <SelectItem key={index} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InputError field={field} />
          </div>
        )}
      </form.Field>
      <form.Field name='systemInstruction'>
        {(field) => (
          <div className='grid gap-2'>
            <Label htmlFor={field.name}>System Instruction</Label>
            <Textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder='You are a helpful assistant...'
            />
            <InputError field={field} />
          </div>
        )}
      </form.Field>
      <form.Subscribe selector={(state) => [state.canSubmit, state.isDirty, state.isSubmitting]}>
        {([canSubmit, isDirty, isSubmitting]) => (
          <Button
            className='cursor-pointer'
            type='submit'
            disabled={!canSubmit || !isDirty || mutation.isPending}
          >
            {(isSubmitting || mutation.isPending) && <Loader2 className='animate-spin' />}
            Create
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
