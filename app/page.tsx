"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { RecipeGrid } from "@/components/recipe-grid"
import { SearchFilters } from "@/components/search-filters"
import { FavoritesView } from "@/components/favorites-view"
import { ShoppingListView } from "@/components/shopping-list-view"
import { LoginForm } from "@/components/login-form"
import { useAuthContext } from "@/components/auth-provider"
import { PermissionGuard } from "@/components/permissions"
import { useShoppingList } from "@/hooks/use-shopping-list"
import { useRecipes } from "@/hooks/use-recipes"
import type { Recipe } from "@/types/recipe"
import { StakeholderDashboard } from "@/components/stakeholder-dashboard"
import { RecipeManagementPanel } from "@/components/recipe-management-panel"

export default function Home() {
  const [currentView, setCurrentView] = useState<"recipes" | "dashboard" | "favorites" | "shopping" | "management">(
    "recipes",
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const { user, isLoading } = useAuthContext()
  const { createList } = useShoppingList()
  const { recipes } = useRecipes()

  const handleAddToList = (recipe: Recipe) => {
    const listName = `Shopping List - ${new Date().toLocaleDateString()}`
    createList(listName, [recipe.id], recipe.ingredients)
    setCurrentView("shopping")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onSuccess={() => window.location.reload()} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView as any} setCurrentView={setCurrentView as any} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === "recipes" && (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Your Recipe Collection</h1>
              <p className="text-muted-foreground text-lg">Discover, organize, and cook your favorite recipes</p>
            </div>

            <div className="mb-8">
              <SearchFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>

            <RecipeGrid searchQuery={searchQuery} selectedCategory={selectedCategory} onAddToList={handleAddToList} />
          </>
        )}

        {currentView === "favorites" && <FavoritesView />}

        {currentView === "shopping" && <ShoppingListView />}

        {currentView === "dashboard" && (
          <PermissionGuard
            role={user.role}
            action="dashboard"
            fallback={
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">Dashboard access is restricted to registered users.</p>
              </div>
            }
          >
            <StakeholderDashboard />
          </PermissionGuard>
        )}

        {currentView === "management" && user?.role === "admin" && (
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Recipe Management</h1>
            <p className="text-muted-foreground text-lg mb-8">Manage and monitor your recipe collection</p>
            <RecipeManagementPanel recipes={recipes} onRefresh={() => window.location.reload()} />
          </div>
        )}
      </main>
    </div>
  )
}
