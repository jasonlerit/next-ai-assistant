"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export default function SignIn() {
  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    })
  }

  return (
    <main className='w-full h-screen grid place-content-center'>
      <Button onClick={handleSignIn}>Sign In</Button>
    </main>
  )
}
