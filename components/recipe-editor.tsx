"use client"

import { useState } from "react"
import type { Recipe } from "@/types/recipe"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface RecipeEditorProps {
  recipe?: Recipe
  onSave: (recipe: Recipe) => Promise<void>
  onCancel: () => void
}

export function RecipeEditor({ recipe, onSave, onCancel }: RecipeEditorProps) {
  const [formData, setFormData] = useState<Partial<Recipe>>(
    recipe || {
      name: "",
      description: "",
      category: "Breakfast",
      cookTime: 30,
      servings: 4,
      ingredients: [],
      instructions: [],
      image: "",
      difficulty: "Easy",
      rating: 5,
      reviews: 0,
      tags: [],
      nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    },
  )
  const [ingredient, setIngredient] = useState("")
  const [instruction, setInstruction] = useState("")
  const [tag, setTag] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleAddIngredient = () => {
    if (ingredient.trim()) {
      setFormData({
        ...formData,
        ingredients: [...(formData.ingredients || []), ingredient],
      })
      setIngredient("")
    }
  }

  const handleAddInstruction = () => {
    if (instruction.trim()) {
      setFormData({
        ...formData,
        instructions: [...(formData.instructions || []), instruction],
      })
      setInstruction("")
    }
  }

  const handleAddTag = () => {
    if (tag.trim()) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tag],
      })
      setTag("")
    }
  }

  const handleRemoveIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients?.filter((_, i) => i !== index),
    })
  }

  const handleRemoveInstruction = (index: number) => {
    setFormData({
      ...formData,
      instructions: formData.instructions?.filter((_, i) => i !== index),
    })
  }

  const handleRemoveTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((_, i) => i !== index),
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(formData as Recipe)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-foreground">{recipe ? "Edit Recipe" : "Create Recipe"}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter recipe name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Appetizer">Appetizer</option>
                <option value="Beverage">Beverage</option>
                <option value="Snack">Snack</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
              placeholder="Describe the recipe"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (min)</label>
              <input
                type="number"
                value={formData.cookTime || 0}
                onChange={(e) => setFormData({ ...formData, cookTime: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
              <input
                type="number"
                value={formData.servings || 0}
                onChange={(e) => setFormData({ ...formData, servings: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={formData.difficulty || ""}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddIngredient()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Add ingredient"
              />
              <Button onClick={handleAddIngredient} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.ingredients?.map((ing, idx) => (
                <div
                  key={idx}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                >
                  {ing}
                  <button onClick={() => handleRemoveIngredient(idx)} className="hover:text-primary/70">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddInstruction()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Add instruction"
              />
              <Button onClick={handleAddInstruction} size="sm">
                Add
              </Button>
            </div>
            <ol className="space-y-2">
              {formData.instructions?.map((inst, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="font-semibold text-primary">{idx + 1}.</span>
                  <span className="flex-1">{inst}</span>
                  <button onClick={() => handleRemoveInstruction(idx)} className="text-red-500 hover:text-red-700">
                    ×
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Add tag"
              />
              <Button onClick={handleAddTag} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                >
                  {t}
                  <button onClick={() => handleRemoveTag(idx)} className="hover:text-gray-900">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
              <input
                type="number"
                value={formData.nutrition?.calories || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, calories: Number.parseInt(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
              <input
                type="number"
                value={formData.nutrition?.protein || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, protein: Number.parseInt(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
              <input
                type="number"
                value={formData.nutrition?.carbs || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, carbs: Number.parseInt(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
              <input
                type="number"
                value={formData.nutrition?.fat || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, fat: Number.parseInt(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <Button onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            {isSaving ? "Saving..." : "Save Recipe"}
          </Button>
        </div>
      </div>
    </div>
  )
}
