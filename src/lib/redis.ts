/* eslint-disable no-console */

import env from "@/common/env"
import { Message } from "@/common/types/message.type"
import { createClient } from "redis"

const client = createClient({
  url: env.REDIS_URL,
})

client.on("ready", () => {
  console.log("Redis connected")
})

client.on("error", (error) => {
  console.error("Redis Error", error)
})

client.connect()

export const getCache = async (key: string): Promise<Message[]> => {
  const data = await client.get(key)
  return data !== null ? JSON.parse(data) : []
}

export const setCache = async (key: string, value: Message[], ttl?: number) => {
  const defaultTtl = Number(env.REDIS_TTL ?? 300)
  await client.setEx(key, ttl ?? defaultTtl, JSON.stringify(value))
}
