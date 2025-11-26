import type { NextRequest } from "next/server"
import { SAMPLE_RECIPES } from "@/lib/sample-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const recipe = SAMPLE_RECIPES.find((r) => r.id === params.id)

    if (!recipe) {
      return Response.json({ error: "Recipe not found" }, { status: 404 })
    }

    return Response.json({ recipe })
  } catch (error) {
    console.error("[v0] Error fetching recipe:", error)
    return Response.json({ error: "Failed to fetch recipe" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.includes("admin")) {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updatedData = await request.json()

    // In production, this would update MongoDB
    console.log("[v0] Recipe updated:", params.id, updatedData)

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating recipe:", error)
    return Response.json({ error: "Failed to update recipe" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.includes("admin")) {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    // In production, this would delete from MongoDB
    console.log("[v0] Recipe deleted:", params.id)

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting recipe:", error)
    return Response.json({ error: "Failed to delete recipe" }, { status: 500 })
  }
}
