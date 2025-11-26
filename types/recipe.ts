export interface Recipe {
  _id?: string
  id: string
  name: string
  description: string
  category: string
  cookTime: number
  servings: number
  ingredients: string[]
  instructions: string[]
  image: string
  views: number
  isFavorite?: boolean
  rating: number
  reviews: number
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  createdBy?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface RecipeCollection {
  _id?: string
  id: string
  name: string
  description: string
  recipes: string[]
  createdBy: string
  createdAt: Date
}

export interface RecipeReview {
  _id?: string
  id: string
  recipeId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: Date
}
