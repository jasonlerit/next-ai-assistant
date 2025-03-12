import db from "@/db"
import { assistants, insertAssistantsSchema } from "@/db/schemas/assistants.schema"
import { auth } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { NextRequest } from "next/server"
import { ZodError } from "zod"

const PAGE_SIZE = 20

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return new Response(null, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const parsedPage = Number(searchParams.get("page") ?? 1)
    const page = isNaN(parsedPage) ? 1 : parsedPage

    const items = await db.query.assistants.findMany({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      where: eq(assistants.userId, session.user.id),
    })

    const totalCount = await db.$count(assistants)
    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    const previousPage = page > 1 ? page - 1 : null
    const nextPage = page < totalPages ? page + 1 : null

    return Response.json({
      items,
      metadata: {
        current_page: page,
        previous_page: previousPage,
        next_page: nextPage,
        total_count: totalCount,
        total_pages: totalPages,
      },
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

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return new Response(null, { status: 401 })
    }

    const { name, role, model, systemInstruction } = await req.json()

    const parsedData = insertAssistantsSchema.parse({
      name,
      role,
      model,
      systemInstruction,
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
