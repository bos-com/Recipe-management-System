"use client"

import { useState, useEffect } from "react"
import type { Recipe } from "@/types/recipe"
import { SAMPLE_RECIPES } from "@/lib/sample-data"

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setRecipes(SAMPLE_RECIPES)
    setIsLoading(false)
  }, [])

  return { recipes, isLoading }
}
