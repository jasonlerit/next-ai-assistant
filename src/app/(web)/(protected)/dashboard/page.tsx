"use client"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()
  const { data } = authClient.useSession()

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in")
        },
      },
    })
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hi {data?.user.name}</p>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  )
}
