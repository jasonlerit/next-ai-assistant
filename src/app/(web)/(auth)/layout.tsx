"use client"

import { useAuthSession } from "@/hooks/use-auth-session"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const { user, isPending } = useAuthSession()

  useEffect(() => {
    if (user !== undefined && !isPending) {
      router.push("/assistants")
    }
  }, [router, user, isPending])

  return children
}
