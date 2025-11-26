"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { useState } from "react"

const CATEGORIES = ["All Categories", "Breakfast", "Lunch", "Dinner", "Dessert", "Appetizer", "Snack", "Beverage"]

const SORT_OPTIONS = [
  { value: "name-asc", label: "A - Z" },
  { value: "name-desc", label: "Z - A" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
]

interface SearchFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export function SearchFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: SearchFiltersProps) {
  const [sortBy, setSortBy] = useState("newest")

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          placeholder="Search recipes by name or ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-6 text-base"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}
        >
          <SelectTrigger className="flex items-center gap-2">
            <Filter size={18} />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category === "All Categories" ? "all" : category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Filter size={18} />
          Advanced Filters
        </Button>
      </div>
    </div>
  )
}
