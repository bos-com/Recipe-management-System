"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useShoppingList } from "@/hooks/use-shopping-list"
import { ShoppingCart, Download, FileText, Trash2 } from "lucide-react"
import { useState } from "react"

export function ShoppingListView() {
  const { lists, deleteList, toggleItem } = useShoppingList()
  const [selectedListId, setSelectedListId] = useState<string | null>(lists.length > 0 ? lists[0].id : null)

  const currentList = lists.find((list) => list.id === selectedListId)

  const exportAsCSV = (list: (typeof lists)[0]) => {
    const csv = [
      ["Ingredient", "Quantity", "Status"],
      ...list.items.map((item) => [item.ingredient, item.quantity, item.checked ? "Done" : "Pending"]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${list.name}-shopping-list.csv`
    a.click()
  }

  const exportAsPDF = (list: (typeof lists)[0]) => {
    const content = `
SHOPPING LIST: ${list.name}
Created: ${new Date(list.createdAt).toLocaleDateString()}

${list.items.map((item) => `${item.checked ? "[X]" : "[ ]"} ${item.ingredient} - ${item.quantity}`).join("\n")}
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${list.name}-shopping-list.txt`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ShoppingCart size={28} />
          Shopping Lists
        </h2>
        <p className="text-muted-foreground mt-1">Manage and track your ingredients</p>
      </div>

      {lists.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingCart className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground text-lg">No shopping lists yet. Create one from your recipes!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Lists</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {lists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => setSelectedListId(list.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors border ${
                      selectedListId === list.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:bg-muted"
                    }`}
                  >
                    <p className="font-medium truncate">{list.name}</p>
                    <p className="text-xs opacity-75">{list.items.length} items</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {currentList && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>{currentList.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentList.items.filter((i) => i.checked).length} of {currentList.items.length} items checked
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => exportAsCSV(currentList)}>
                      <Download size={16} className="mr-1" />
                      CSV
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => exportAsPDF(currentList)}>
                      <FileText size={16} className="mr-1" />
                      Text
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        deleteList(currentList.id)
                        setSelectedListId(lists[0]?.id || null)
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentList.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Checkbox checked={item.checked} onCheckedChange={() => toggleItem(currentList.id, item.id)} />
                        <div className="flex-1">
                          <p className={`font-medium ${item.checked ? "line-through text-muted-foreground" : ""}`}>
                            {item.ingredient}
                          </p>
                          <p className="text-sm text-muted-foreground">{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
