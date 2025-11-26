"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Clock, Users, Trash2, Eye, Star, Flame } from "lucide-react"
import { useAuthContext } from "@/components/auth-provider"
import { PermissionGuard } from "@/components/permissions"
import { useFavorites } from "@/hooks/use-favorites"
import { useState } from "react"
import { RecipeDetailModal } from "@/components/recipe-detail-modal"
import type { Recipe } from "@/types/recipe"

interface RecipeCardProps {
  recipe: Recipe
  onAddToList?: (recipe: Recipe) => void
}

export function RecipeCard({ recipe, onAddToList }: RecipeCardProps) {
  const { user } = useAuthContext()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const [isFav, setIsFav] = useState(isFavorite(recipe.id))
  const [showModal, setShowModal] = useState(false)

  const handleFavoriteToggle = () => {
    if (isFav) {
      removeFavorite(recipe.id)
    } else {
      addFavorite(recipe.id)
    }
    setIsFav(!isFav)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700"
      case "Medium":
        return "bg-yellow-100 text-yellow-700"
      case "Hard":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all hover:border-primary/30 border">
        <div className="relative h-48 bg-muted overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-accent/15" />
          <img src={recipe.image || "/placeholder.svg"} alt={recipe.name} className="w-full h-full object-cover" />
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/95 hover:bg-white transition-colors shadow-md"
          >
            <Heart size={20} className={isFav ? "fill-accent text-accent" : "text-secondary"} />
          </button>

          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 rounded-full px-2 py-1 shadow-md">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-foreground">{recipe.rating}</span>
            <span className="text-xs text-gray-600">({recipe.reviews})</span>
          </div>
        </div>

        <CardHeader className="pb-3">
          <h3 className="text-xl font-semibold text-foreground text-balance">{recipe.name}</h3>
          <p className="text-sm text-primary font-medium">{recipe.category}</p>
        </CardHeader>

        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{recipe.description}</p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{recipe.cookTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame size={16} />
              <span>{recipe.nutrition.calories} cal</span>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {recipe.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20"
                >
                  {tag}
                </span>
              ))}
              {recipe.tags.length > 3 && (
                <span className="text-xs text-muted-foreground px-2 py-1">+{recipe.tags.length - 3}</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {recipe.ingredients.slice(0, 2).map((ingredient, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200">
                {ingredient}
              </span>
            ))}
            {recipe.ingredients.length > 2 && (
              <span className="text-xs text-muted-foreground px-2 py-1">+{recipe.ingredients.length - 2} more</span>
            )}
          </div>
        </CardContent>

        <CardFooter className="gap-2">
          <Button variant="default" className="flex-1" onClick={() => setShowModal(true)}>
            <Eye size={16} className="mr-1" />
            View Recipe
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onAddToList?.(recipe)}>
            Add to List
          </Button>
          <PermissionGuard role={user?.role || null} action="delete" fallback={null}>
            <Button variant="ghost" size="icon">
              <Trash2 size={18} />
            </Button>
          </PermissionGuard>
        </CardFooter>
      </Card>

      {showModal && <RecipeDetailModal recipe={recipe} onClose={() => setShowModal(false)} />}
    </>
  )
}
