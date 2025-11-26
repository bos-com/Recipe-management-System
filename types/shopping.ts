export interface ShoppingListItem {
  id: string
  ingredient: string
  quantity: string
  checked: boolean
}

export interface ShoppingList {
  id: string
  name: string
  items: ShoppingListItem[]
  recipeIds: string[]
  createdAt: Date
  updatedAt: Date
}
