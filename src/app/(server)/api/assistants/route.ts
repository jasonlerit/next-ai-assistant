import db from "@/db"
import { assistants, insertAssistantsSchema } from "@/db/schemas/assistants.schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { ZodError } from "zod"

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return new Response(null, { status: 401 })
    }

    const { name, role, model, instruction } = await req.json()

    const parsedData = insertAssistantsSchema.parse({
      name,
      role,
      model,
      instruction,
    })

    const [inserted] = await db
      .insert(assistants)
      .values({
        ...parsedData,
        userId: session.user.id,
      })
      .returning()

    return Response.json(inserted, {
      status: 201,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(error, {
        status: 400,
      })
    }

    return Response.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    )
  }
}
