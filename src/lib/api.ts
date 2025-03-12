import { PaginatedResponse } from "@/common/types/pagination.type"
import { Assistant, CreateAssistant } from "@/db/schemas/assistants.schema"
import axiosInstance from "@/lib/axios"

export const getAssistants = async (): Promise<PaginatedResponse<Assistant>> => {
  const response = await axiosInstance.get("/assistants")
  return response.data
}

export const createAssistant = async (data: CreateAssistant): Promise<Assistant> => {
  const response = await axiosInstance.post("/assistants", data)
  return response.data
}
