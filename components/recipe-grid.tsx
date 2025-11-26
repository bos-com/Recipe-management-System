"use client"

import { RecipeCard } from "@/components/recipe-card"
import { useRecipes } from "@/hooks/use-recipes"
import { useMemo } from "react"
import type { Recipe } from "@/types/recipe"

interface RecipeGridProps {
  searchQuery: string
  selectedCategory: string
  onAddToList?: (recipe: Recipe) => void
}

export function RecipeGrid({ searchQuery, selectedCategory, onAddToList }: RecipeGridProps) {
  const { recipes } = useRecipes()

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = !selectedCategory || recipe.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [recipes, searchQuery, selectedCategory])

  if (filteredRecipes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-muted-foreground">No recipes found. Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRecipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} onAddToList={onAddToList} />
      ))}
    </div>
  )
}
