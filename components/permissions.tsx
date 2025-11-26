import type React from "react"
import type { UserRole } from "@/types/auth"

export function canViewRecipe(role: UserRole): boolean {
  return ["admin", "user", "guest"].includes(role)
}

export function canCreateRecipe(role: UserRole): boolean {
  return ["admin", "user"].includes(role)
}

export function canEditRecipe(role: UserRole, isOwner: boolean): boolean {
  return role === "admin" || isOwner
}

export function canDeleteRecipe(role: UserRole, isOwner: boolean): boolean {
  return role === "admin" || isOwner
}

export function canManageUsers(role: UserRole): boolean {
  return role === "admin"
}

export function canAccessDashboard(role: UserRole): boolean {
  return ["admin", "user"].includes(role)
}

export interface PermissionProps {
  role: UserRole | null
  isOwner?: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
  action: "view" | "create" | "edit" | "delete" | "manage" | "dashboard"
}

export function PermissionGuard({ role, isOwner = false, children, fallback, action }: PermissionProps) {
  if (!role) return <>{fallback}</> || null

  let hasPermission = false

  switch (action) {
    case "view":
      hasPermission = canViewRecipe(role)
      break
    case "create":
      hasPermission = canCreateRecipe(role)
      break
    case "edit":
      hasPermission = canEditRecipe(role, isOwner)
      break
    case "delete":
      hasPermission = canDeleteRecipe(role, isOwner)
      break
    case "manage":
      hasPermission = canManageUsers(role)
      break
    case "dashboard":
      hasPermission = canAccessDashboard(role)
      break
  }

  return <>{hasPermission ? children : fallback}</> || null
}
