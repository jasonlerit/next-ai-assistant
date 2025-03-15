import { Role } from "@/common/types/role.type"

export interface Message {
  role: Role
  content: string
}
