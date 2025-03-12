import { Assistant, CreateAssistant } from "@/db/schemas/assistants.schema"
import axiosInstance from "@/lib/axios"

export const createAssistant = async (data: CreateAssistant): Promise<Assistant> => {
  const response = await axiosInstance.post("/assistants", data)
  return response.data
}
