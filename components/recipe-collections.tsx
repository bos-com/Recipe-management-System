"use client"

import { useState } from "react"
import type { Recipe, RecipeCollection } from "@/types/recipe"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface RecipeCollectionsProps {
  recipes: Recipe[]
  onCreateCollection: (name: string, description: string, recipeIds: string[]) => void
}

export function RecipeCollections({ recipes, onCreateCollection }: RecipeCollectionsProps) {
  const [collections, setCollections] = useState<RecipeCollection[]>([
    {
      id: "c1",
      name: "Quick Weeknight Dinners",
      description: "Easy recipes ready in under 30 minutes",
      recipes: recipes.filter((r) => r.cookTime <= 30).map((r) => r.id),
      createdBy: "admin",
      createdAt: new Date(),
    },
    {
      id: "c2",
      name: "Healthy Eating",
      description: "Low-calorie and nutritious options",
      recipes: recipes.filter((r) => r.nutrition.calories < 300).map((r) => r.id),
      createdBy: "admin",
      createdAt: new Date(),
    },
  ])
  const [showForm, setShowForm] = useState(false)
  const [newCollection, setNewCollection] = useState({ name: "", description: "" })

  const handleCreateCollection = () => {
    if (newCollection.name.trim()) {
      onCreateCollection(newCollection.name, newCollection.description, [])
      setNewCollection({ name: "", description: "" })
      setShowForm(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recipe Collections</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          New Collection
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="text"
            value={newCollection.name}
            onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
            placeholder="Collection name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
          />
          <textarea
            value={newCollection.description}
            onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
            placeholder="Collection description"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
            rows={2}
          />
          <div className="flex gap-2">
            <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCreateCollection} className="flex-1">
              Create
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map((collection) => (
          <div key={collection.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{collection.name}</h4>
                <p className="text-sm text-gray-600">{collection.description}</p>
              </div>
              <button className="text-gray-500 hover:text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500">{collection.recipes.length} recipes</p>
          </div>
        ))}
      </div>
    </div>
  )
}
