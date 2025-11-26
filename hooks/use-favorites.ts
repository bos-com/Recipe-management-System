"use client"

import { useState, useEffect, useCallback } from "react"

const FAVORITES_KEY = "recipe_favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY)
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)))
    }
    setIsLoading(false)
  }, [])

  const addFavorite = useCallback((recipeId: string) => {
    setFavorites((prev) => {
      const updated = new Set(prev)
      updated.add(recipeId)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(updated)))
      return updated
    })
  }, [])

  const removeFavorite = useCallback((recipeId: string) => {
    setFavorites((prev) => {
      const updated = new Set(prev)
      updated.delete(recipeId)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(updated)))
      return updated
    })
  }, [])

  const isFavorite = useCallback(
    (recipeId: string) => {
      return favorites.has(recipeId)
    },
    [favorites],
  )

  return { favorites, addFavorite, removeFavorite, isFavorite, isLoading }
}
