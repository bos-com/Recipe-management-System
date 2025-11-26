"use client"

import { useState } from "react"
import type { Recipe } from "@/types/recipe"
import { useAuthContext } from "@/components/auth-provider"
import { PermissionGuard } from "@/components/permissions"
import { RecipeEditor } from "@/components/recipe-editor"
import { Button } from "@/components/ui/button"
import { Plus, Edit2 } from "lucide-react"

interface RecipeManagementPanelProps {
  recipes: Recipe[]
  onRefresh: () => void
}

export function RecipeManagementPanel({ recipes, onRefresh }: RecipeManagementPanelProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>(undefined)
  const { user } = useAuthContext()

  const handleDelete = async (recipeId: string) => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.role}`,
        },
      })

      if (response.ok) {
        setDeleteConfirm(null)
        onRefresh()
      }
    } catch (error) {
      console.error("[v0] Failed to delete recipe:", error)
    }
  }

  const handleSaveRecipe = async (recipe: Recipe) => {
    try {
      const endpoint = recipe.id ? `/api/recipes/${recipe.id}` : "/api/recipes"
      const method = recipe.id ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.role}`,
        },
        body: JSON.stringify(recipe),
      })

      if (response.ok) {
        setShowEditor(false)
        setEditingRecipe(undefined)
        onRefresh()
      }
    } catch (error) {
      console.error("[v0] Failed to save recipe:", error)
    }
  }

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe)
    setShowEditor(true)
  }

  return (
    <PermissionGuard
      role={user?.role || ""}
      action="dashboard"
      fallback={<div className="text-center py-8">Access denied</div>}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Manage Recipes</h3>
              <Button onClick={() => setShowEditor(true)} size="sm" className="flex items-center gap-2">
                <Plus size={16} />
                New Recipe
              </Button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={`p-3 rounded-lg cursor-pointer border transition ${
                    selectedRecipe?.id === recipe.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{recipe.name}</p>
                      <p className="text-sm text-gray-600">{recipe.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">{recipe.rating}</div>
                      <div className="text-xs text-gray-600">{recipe.views} views</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recipe Details</h3>
          {selectedRecipe ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-foreground font-semibold">{selectedRecipe.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Category</p>
                <p className="text-foreground">{selectedRecipe.category}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-lg font-semibold text-primary">{selectedRecipe.rating}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Reviews</p>
                  <p className="text-lg font-semibold text-foreground">{selectedRecipe.reviews}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Difficulty</p>
                <p className="text-foreground">{selectedRecipe.difficulty}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tags</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedRecipe.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Nutrition</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Calories: {selectedRecipe.nutrition.calories}</p>
                  <p>Protein: {selectedRecipe.nutrition.protein}g</p>
                  <p>Carbs: {selectedRecipe.nutrition.carbs}g</p>
                  <p>Fat: {selectedRecipe.nutrition.fat}g</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={() => handleEditRecipe(selectedRecipe)}
                  className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit Recipe
                </button>
                <button
                  onClick={() => setDeleteConfirm(selectedRecipe.id)}
                  className="w-full py-2 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition"
                >
                  Delete Recipe
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">Select a recipe to view details</p>
          )}
        </div>
      </div>

      {showEditor && (
        <RecipeEditor
          recipe={editingRecipe}
          onSave={handleSaveRecipe}
          onCancel={() => {
            setShowEditor(false)
            setEditingRecipe(undefined)
          }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold text-foreground mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this recipe? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </PermissionGuard>
  )
}
