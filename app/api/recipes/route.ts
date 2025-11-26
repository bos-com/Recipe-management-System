import type { NextRequest } from "next/server"
import { SAMPLE_RECIPES } from "@/lib/sample-data"
import type { Recipe } from "@/types/recipe"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    let recipes: Recipe[] = SAMPLE_RECIPES

    if (category && category !== "All Categories") {
      recipes = recipes.filter((r) => r.category === category)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      recipes = recipes.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.description.toLowerCase().includes(searchLower) ||
          r.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    return Response.json({ recipes, total: recipes.length })
  } catch (error) {
    console.error("[v0] Error fetching recipes:", error)
    return Response.json({ error: "Failed to fetch recipes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const recipe: Recipe = await request.json()

    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.includes("admin")) {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    // In production, this would save to MongoDB
    console.log("[v0] Recipe created:", recipe)

    return Response.json({ success: true, recipe }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating recipe:", error)
    return Response.json({ error: "Failed to create recipe" }, { status: 500 })
  }
}
