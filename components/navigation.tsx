"use client"

import { Button } from "@/components/ui/button"
import { ChefHat, BarChart3, Moon, Sun, LogOut, Heart, ShoppingCart, Settings } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { useAuthContext } from "@/components/auth-provider"
import { useState } from "react"

interface NavigationProps {
  currentView: "recipes" | "dashboard" | "favorites" | "shopping" | "management"
  setCurrentView: (view: "recipes" | "dashboard" | "favorites" | "shopping" | "management") => void
}

export function Navigation({ currentView, setCurrentView }: NavigationProps) {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuthContext()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <nav className="border-b border-border bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg shadow-md">
              <ChefHat className="text-primary-foreground" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-primary">RecipeHub</h1>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant={currentView === "recipes" ? "default" : "ghost"}
              onClick={() => setCurrentView("recipes")}
              size="sm"
            >
              Recipes
            </Button>
            <Button
              variant={currentView === "favorites" ? "default" : "ghost"}
              onClick={() => setCurrentView("favorites")}
              size="sm"
              className="flex items-center gap-2"
            >
              <Heart size={16} />
              Favorites
            </Button>
            <Button
              variant={currentView === "shopping" ? "default" : "ghost"}
              onClick={() => setCurrentView("shopping")}
              size="sm"
              className="flex items-center gap-2"
            >
              <ShoppingCart size={16} />
              Lists
            </Button>
            <Button
              variant={currentView === "dashboard" ? "default" : "ghost"}
              onClick={() => setCurrentView("dashboard")}
              size="sm"
              className="flex items-center gap-2"
            >
              <BarChart3 size={16} />
              Dashboard
            </Button>
            {user?.role === "admin" && (
              <Button
                variant={currentView === "management" ? "default" : "ghost"}
                onClick={() => setCurrentView("management")}
                size="sm"
                className="flex items-center gap-2"
              >
                <Settings size={16} />
                Manage
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            {user && (
              <div className="flex items-center gap-3 pl-3 border-l border-border">
                <div className="text-sm">
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                  <LogOut size={18} />
                </Button>
              </div>
            )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMenu(!showMenu)}>
            ☰
          </Button>
        </div>

        {showMenu && (
          <div className="md:hidden flex flex-col gap-2 mt-4 border-t border-border pt-4">
            <Button
              variant={currentView === "recipes" ? "default" : "ghost"}
              onClick={() => {
                setCurrentView("recipes")
                setShowMenu(false)
              }}
              className="w-full justify-start"
            >
              Recipes
            </Button>
            <Button
              variant={currentView === "favorites" ? "default" : "ghost"}
              onClick={() => {
                setCurrentView("favorites")
                setShowMenu(false)
              }}
              className="w-full justify-start flex items-center gap-2"
            >
              <Heart size={16} />
              Favorites
            </Button>
            <Button
              variant={currentView === "shopping" ? "default" : "ghost"}
              onClick={() => {
                setCurrentView("shopping")
                setShowMenu(false)
              }}
              className="w-full justify-start flex items-center gap-2"
            >
              <ShoppingCart size={16} />
              Shopping Lists
            </Button>
            <Button
              variant={currentView === "dashboard" ? "default" : "ghost"}
              onClick={() => {
                setCurrentView("dashboard")
                setShowMenu(false)
              }}
              className="w-full justify-start flex items-center gap-2"
            >
              <BarChart3 size={16} />
              Dashboard
            </Button>
            {user?.role === "admin" && (
              <Button
                variant={currentView === "management" ? "default" : "ghost"}
                onClick={() => {
                  setCurrentView("management")
                  setShowMenu(false)
                }}
                className="w-full justify-start flex items-center gap-2"
              >
                <Settings size={16} />
                Manage
              </Button>
            )}
            {user && (
              <>
                <div className="px-3 py-2 text-sm border-t border-border mt-2">
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <Button variant="ghost" onClick={logout} className="w-full justify-start">
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
