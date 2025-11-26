"use client"

import { useState, useEffect } from "react"
import type { Recipe } from "@/types/recipe"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useAuthContext } from "@/components/auth-provider"
import { PermissionGuard } from "@/components/permissions"

export function StakeholderDashboard() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [stats, setStats] = useState({
    totalRecipes: 0,
    avgRating: 0,
    totalViews: 0,
    topCategory: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuthContext()

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/recipes")
        const data = await response.json()
        setRecipes(data.recipes)

        // Calculate statistics
        const avgRating = (
          data.recipes.reduce((sum: number, r: Recipe) => sum + r.rating, 0) / data.recipes.length
        ).toFixed(1)
        const totalViews = data.recipes.reduce((sum: number, r: Recipe) => sum + r.views, 0)
        const categories = data.recipes.reduce((acc: Record<string, number>, r: Recipe) => {
          acc[r.category] = (acc[r.category] || 0) + 1
          return acc
        }, {})
        const topCategory = Object.entries(categories).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"

        setStats({
          totalRecipes: data.recipes.length,
          avgRating: Number.parseFloat(avgRating),
          totalViews,
          topCategory,
        })
      } catch (error) {
        console.error("[v0] Failed to fetch recipes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  const categoryData = recipes.reduce((acc: Record<string, number>, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }))

  const ratingData = [
    { name: "5 Star", value: recipes.filter((r) => r.rating >= 4.8).length },
    { name: "4-4.8 Star", value: recipes.filter((r) => r.rating >= 4 && r.rating < 4.8).length },
    { name: "Below 4", value: recipes.filter((r) => r.rating < 4).length },
  ]

  const COLORS = ["#1b5e20", "#81c784", "#c8e6c9"]

  if (isLoading) {
    return <div className="text-center py-8">Loading dashboard...</div>
  }

  return (
    <PermissionGuard
      role={user?.role || ""}
      action="dashboard"
      fallback={<div className="text-center py-8">Access denied</div>}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="text-gray-600 text-sm font-medium">Total Recipes</div>
            <div className="text-4xl font-bold text-primary mt-2">{stats.totalRecipes}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="text-gray-600 text-sm font-medium">Average Rating</div>
            <div className="text-4xl font-bold text-primary mt-2">{stats.avgRating}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="text-gray-600 text-sm font-medium">Total Views</div>
            <div className="text-4xl font-bold text-primary mt-2">{stats.totalViews}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="text-gray-600 text-sm font-medium">Top Category</div>
            <div className="text-2xl font-bold text-primary mt-2">{stats.topCategory}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recipes by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1b5e20" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Rating Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ratingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ratingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Recipes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-2 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-2 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-2 px-4 font-semibold text-gray-700">Rating</th>
                  <th className="text-left py-2 px-4 font-semibold text-gray-700">Views</th>
                  <th className="text-left py-2 px-4 font-semibold text-gray-700">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {recipes.slice(0, 8).map((recipe) => (
                  <tr key={recipe.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-foreground">{recipe.name}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                        {recipe.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground font-semibold">{recipe.rating}</td>
                    <td className="py-3 px-4 text-gray-600">{recipe.views}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          recipe.difficulty === "Easy"
                            ? "bg-green-100 text-green-700"
                            : recipe.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {recipe.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PermissionGuard>
  )
}
