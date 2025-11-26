"use client"

import React, { createContext } from "react"
import { useAuth } from "@/hooks/use-auth"
import type { User } from "@/types/auth"

export const AuthContext = createContext<
  | {
      user: User | null
      isLoading: boolean
      login: (email: string, password: string) => Promise<void>
      signup: (email: string, password: string, name: string) => Promise<void>
      logout: () => void
    }
  | undefined
>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within AuthProvider")
  }
  return context
}
