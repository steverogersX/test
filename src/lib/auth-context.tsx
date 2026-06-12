"use client"

import { createContext, useContext, useSyncExternalStore } from "react"
import type { StoredSession } from "@nhost/nhost-js/session"

import { nhost } from "@/lib/nhost"

interface AuthContextValue {
  session: StoredSession | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  isLoading: true,
})

// Cached so useSyncExternalStore receives a stable reference until the
// session actually changes (nhost reads/parses localStorage on every call).
let cachedSession: StoredSession | null | undefined

function subscribe(callback: () => void) {
  return nhost.sessionStorage.onChange((session) => {
    cachedSession = session
    callback()
  })
}

function getSnapshot(): StoredSession | null | undefined {
  if (cachedSession === undefined) {
    cachedSession = nhost.getUserSession()
  }
  return cachedSession
}

function getServerSnapshot(): StoredSession | null | undefined {
  return undefined
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return (
    <AuthContext.Provider
      value={{ session: session ?? null, isLoading: session === undefined }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
