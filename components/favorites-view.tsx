"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFavorites } from "@/hooks/use-favorites"
import { useRecipes } from "@/hooks/use-recipes"
import { Heart } from "lucide-react"

export function FavoritesView() {
  const { recipes } = useRecipes()
  const { favorites } = useFavorites()

  const favoriteRecipes = recipes.filter((recipe) => favorites.has(recipe.id))

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Heart className="fill-accent text-accent" size={28} />
          Your Favorites
        </h2>
        <p className="text-muted-foreground mt-1">
          {favoriteRecipes.length} recipe{favoriteRecipes.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {favoriteRecipes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground text-lg">
              No favorite recipes yet. Start adding recipes to your favorites!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="overflow-hidden border hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="h-40 bg-muted overflow-hidden">
                <img
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg text-foreground">{recipe.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{recipe.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
