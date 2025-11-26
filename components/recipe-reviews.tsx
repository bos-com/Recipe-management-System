"use client"

import { useState } from "react"
import type { Recipe, RecipeReview } from "@/types/recipe"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface RecipeReviewsProps {
  recipe: Recipe
  reviews?: RecipeReview[]
  onAddReview: (rating: number, comment: string) => void
}

export function RecipeReviews({ recipe, reviews = [], onAddReview }: RecipeReviewsProps) {
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")

  const mockReviews: RecipeReview[] = [
    {
      id: "r1",
      recipeId: recipe.id,
      userId: "u1",
      userName: "Sarah Johnson",
      rating: 5,
      comment: "Amazing recipe! Very easy to follow and turned out delicious.",
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: "r2",
      recipeId: recipe.id,
      userId: "u2",
      userName: "Mike Chen",
      rating: 4,
      comment: "Great flavors but took longer than expected.",
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: "r3",
      recipeId: recipe.id,
      userId: "u3",
      userName: "Emma Wilson",
      rating: 5,
      comment: "Perfect! Will make this again.",
      createdAt: new Date(Date.now() - 259200000),
    },
  ]

  const allReviews = reviews.length > 0 ? reviews : mockReviews

  const handleSubmit = () => {
    if (comment.trim()) {
      onAddReview(rating, comment)
      setComment("")
      setRating(5)
      setShowForm(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Reviews</h3>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={i < Math.floor(recipe.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-lg font-bold text-foreground">{recipe.rating}</span>
          <span className="text-sm text-gray-600">({recipe.reviews} reviews)</span>
        </div>
      </div>

      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="w-full mb-6">
          Write a Review
        </Button>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="text-2xl transition">
                  <Star size={24} className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this recipe..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
            rows={3}
          />
          <div className="flex gap-2">
            <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Submit Review
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {allReviews.map((review) => (
          <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-foreground">{review.userName}</p>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-700 text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
