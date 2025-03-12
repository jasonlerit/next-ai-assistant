"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data, isPending } = authClient.useSession()

  useEffect(() => {
    if (data !== null && !isPending) {
      router.push("/assistants")
    }
  }, [router, data, isPending])

  return children
}
