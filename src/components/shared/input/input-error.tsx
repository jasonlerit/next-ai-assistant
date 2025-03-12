import { AnyFieldApi } from "@tanstack/react-form"

export function InputError({ field }: { field: AnyFieldApi }) {
  const errors = field.state.meta.errors

  if (errors.length > 0) {
    const error = errors[0]
    const errorMessage = typeof error === "string" ? error : error.message
    return <em className='text-xs text-red-500'>{errorMessage}</em>
  }

  return null
}
