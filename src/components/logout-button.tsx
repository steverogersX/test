"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { nhost } from "@/lib/nhost"

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    setIsLoading(true)
    const session = nhost.getUserSession()

    try {
      await nhost.auth.signOut({ refreshToken: session?.refreshToken })
    } catch {
      // Ignore errors - clear the local session and redirect regardless.
    } finally {
      nhost.clearSession()
      router.push("/login")
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoading}>
      {isLoading ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
      Log out
    </Button>
  )
}
