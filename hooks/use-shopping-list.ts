"use client"

import { useState, useCallback, useEffect } from "react"
import type { ShoppingList, ShoppingListItem } from "@/types/shopping"

const SHOPPING_LISTS_KEY = "shopping_lists"

export function useShoppingList() {
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(SHOPPING_LISTS_KEY)
    if (saved) {
      setLists(JSON.parse(saved))
    }
    setIsLoading(false)
  }, [])

  const createList = useCallback((name: string, recipeIds: string[], ingredients: string[]) => {
    const newList: ShoppingList = {
      id: Math.random().toString(),
      name,
      recipeIds,
      items: ingredients.map((ingredient, idx) => ({
        id: Math.random().toString(),
        ingredient,
        quantity: "1",
        checked: false,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setLists((prev) => {
      const updated = [...prev, newList]
      localStorage.setItem(SHOPPING_LISTS_KEY, JSON.stringify(updated))
      return updated
    })

    return newList
  }, [])

  const updateList = useCallback((listId: string, items: ShoppingListItem[]) => {
    setLists((prev) => {
      const updated = prev.map((list) => (list.id === listId ? { ...list, items, updatedAt: new Date() } : list))
      localStorage.setItem(SHOPPING_LISTS_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const deleteList = useCallback((listId: string) => {
    setLists((prev) => {
      const updated = prev.filter((list) => list.id !== listId)
      localStorage.setItem(SHOPPING_LISTS_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const toggleItem = useCallback((listId: string, itemId: string) => {
    setLists((prev) => {
      const updated = prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item)),
            updatedAt: new Date(),
          }
        }
        return list
      })
      localStorage.setItem(SHOPPING_LISTS_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  return { lists, createList, updateList, deleteList, toggleItem, isLoading }
}
