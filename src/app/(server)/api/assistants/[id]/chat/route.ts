import env from "@/common/env"
import { Role } from "@/common/types/role.type"
import db from "@/db"
import { assistants } from "@/db/schemas"
import { auth } from "@/lib/auth"
import { getCache, setCache } from "@/lib/redis"
import { and, eq } from "drizzle-orm"
import { headers } from "next/headers"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return new Response(null, { status: 401 })
  }

  const { id } = await params

  const userId = session.user.id

  const key = id + "_" + userId
  const chatHistory = await getCache(key)

  if (chatHistory.length > 0) {
    chatHistory.shift()
  }

  return Response.json(chatHistory)
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return new Response(null, { status: 401 })
  }

  const { id } = await params
  const { content } = await req.json()

  const userId = session.user.id

  const key = id + "_" + userId
  const chatHistory = await getCache(key)

  if (chatHistory.length === 0) {
    const assistant = await db.query.assistants.findFirst({
      where: and(eq(assistants.id, id), eq(assistants.userId, userId)),
    })

    if (!assistant) {
      return Response.json(
        {
          message: "Not found",
        },
        {
          status: 404,
        }
      )
    }

    chatHistory.push({
      role: Role.SYSTEM,
      content: assistant.systemInstruction,
    })
  }

  chatHistory.push({
    role: Role.USER,
    content,
  })

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: chatHistory,
    stream: true,
  })

  const readableStream = new ReadableStream({
    async start(controller) {
      let response = ""
      for await (const chunk of stream) {
        const content = chunk.choices[0].delta.content ?? ""
        controller.enqueue(content)
        response = response.concat(content)
      }
      controller.close()

      chatHistory.push({
        role: Role.ASSISTANT,
        content: response,
      })

      await setCache(key, chatHistory)
    },
  })

  return new Response(readableStream)
}
