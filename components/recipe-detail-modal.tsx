"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, FileJson, FileText, FileSpreadsheet, Star, Flame, Droplet, Wheat, Bookmark } from "lucide-react"
import { exportRecipeAsJSON, exportRecipeAsCSV, exportRecipeAsText } from "@/lib/export-utils"
import { useState } from "react"
import { RecipeReviews } from "@/components/recipe-reviews"
import type { Recipe, RecipeReview } from "@/types/recipe"

interface RecipeDetailModalProps {
  recipe: Recipe
  onClose: () => void
}

export function RecipeDetailModal({ recipe, onClose }: RecipeDetailModalProps) {
  const [reviews, setReviews] = useState<RecipeReview[]>([])
  const [isInCollection, setIsInCollection] = useState(false)

  const handleAddReview = (rating: number, comment: string) => {
    const newReview: RecipeReview = {
      id: `r${Date.now()}`,
      recipeId: recipe.id,
      userId: "current-user",
      userName: "You",
      rating,
      comment,
      createdAt: new Date(),
    }
    setReviews([newReview, ...reviews])
  }

  const handleAddToCollection = () => {
    setIsInCollection(!isInCollection)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 sticky top-0 bg-card border-b border-border shadow-sm">
          <CardTitle className="text-2xl text-foreground">{recipe.name}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div>
            <img
              src={recipe.image || "/placeholder.svg"}
              alt={recipe.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-muted p-4 rounded-lg border border-border text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <p className="text-lg font-bold text-primary">{recipe.rating}</p>
              </div>
              <p className="text-xs text-muted-foreground">{recipe.reviews} reviews</p>
            </div>
            <div className="bg-muted p-4 rounded-lg border border-border text-center">
              <p className="text-sm text-muted-foreground mb-1">Category</p>
              <p className="text-lg font-semibold text-primary">{recipe.category}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg border border-border text-center">
              <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
              <p className="text-lg font-semibold text-primary">{recipe.difficulty}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg border border-border text-center">
              <p className="text-sm text-muted-foreground mb-1">Servings</p>
              <p className="text-lg font-semibold text-primary">{recipe.servings}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">Cook Time</p>
              <p className="text-lg font-semibold text-primary">{recipe.cookTime} min</p>
            </div>
            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">Views</p>
              <p className="text-lg font-semibold text-primary">{recipe.views}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">Reviews</p>
              <p className="text-lg font-semibold text-primary">{recipe.reviews}</p>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3">Nutrition per Serving</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Flame size={16} className="text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">{recipe.nutrition.calories}</p>
                <p className="text-xs text-muted-foreground">Calories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{recipe.nutrition.protein}g</p>
                <p className="text-xs text-muted-foreground">Protein</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Wheat size={16} className="text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-foreground">{recipe.nutrition.carbs}g</p>
                <p className="text-xs text-muted-foreground">Carbs</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Droplet size={16} className="text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">{recipe.nutrition.fat}g</p>
                <p className="text-xs text-muted-foreground">Fat</p>
              </div>
            </div>
          </div>

          {recipe.tags && recipe.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-muted-foreground">{recipe.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-primary font-semibold">•</span>
                  <span className="text-foreground">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Instructions</h3>
            <ol className="space-y-3">
              {recipe.instructions.map((instruction, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-primary font-semibold min-w-6">{idx + 1}.</span>
                  <span className="text-foreground">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          <RecipeReviews recipe={recipe} reviews={reviews} onAddReview={handleAddReview} />

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bookmark size={20} />
              Save to Collection
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Add this recipe to your personal collections for easy organization.
            </p>
            <Button
              onClick={handleAddToCollection}
              className={`w-full ${isInCollection ? "bg-green-600 hover:bg-green-700" : "bg-primary"}`}
            >
              {isInCollection ? "✓ Added to Collection" : "Add to Collection"}
            </Button>
          </div>

          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground mb-3 font-medium">Export Recipe</p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => exportRecipeAsJSON(recipe)}
                className="flex items-center gap-2"
              >
                <FileJson size={16} />
                JSON
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => exportRecipeAsCSV(recipe)}
                className="flex items-center gap-2"
              >
                <FileSpreadsheet size={16} />
                CSV
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => exportRecipeAsText(recipe)}
                className="flex items-center gap-2"
              >
                <FileText size={16} />
                Text
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
