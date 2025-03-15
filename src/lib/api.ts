import { Message } from "@/common/types/message.type"
import { PaginatedResponse } from "@/common/types/pagination.type"
import { Assistant, CreateAssistant } from "@/db/schemas/assistants.schema"

// TODO: create reusable fetch ??

export const getAssistants = async (): Promise<PaginatedResponse<Assistant> | null> => {
  const response = await fetch("/api/assistants", {
    headers: {
      "Content-Type": "application/json",
    },
  })
  if (response.status === 401) {
    window.location.href = "/sign-in"
    return null
  }
  if (!response.ok) {
    throw new Error("Something went wrong")
  }
  return response.json()
}

export const createAssistant = async (data: CreateAssistant): Promise<Assistant | null> => {
  const response = await fetch("/api/assistants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (response.status === 401) {
    window.location.href = "/sign-in"
    return null
  }
  if (!response.ok) {
    throw new Error("Something went wrong")
  }
  return response.json()
}

export const getChatMessages = async (id: string): Promise<Message[] | null> => {
  const response = await fetch(`/api/assistants/${id}/chat`, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  if (response.status === 401) {
    window.location.href = "/sign-in"
    return null
  }
  if (!response.ok) {
    throw new Error("Something went wrong")
  }
  return response.json()
}

export const sendChat = async (id: string, data: Message) => {
  const response = await fetch(`/api/assistants/${id}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (response.status === 401) {
    window.location.href = "/sign-in"
    return null
  }
  if (!response.ok) {
    throw new Error("Something went wrong")
  }
  return response.body
}
