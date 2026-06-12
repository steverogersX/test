"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/lib/auth-context"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/login")
    }
  }, [isLoading, session, router])

  if (isLoading || !session) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}
