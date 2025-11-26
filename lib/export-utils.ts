import type { Recipe } from "@/types/recipe"

export function exportRecipeAsJSON(recipe: Recipe): void {
  const json = JSON.stringify(recipe, null, 2)
  const blob = new Blob([json], { type: "application/json" })
  downloadFile(blob, `${recipe.name}.json`)
}

export function exportRecipesAsJSON(recipes: Recipe[]): void {
  const json = JSON.stringify(recipes, null, 2)
  const blob = new Blob([json], { type: "application/json" })
  downloadFile(blob, `recipes-${new Date().toISOString().split("T")[0]}.json`)
}

export function exportRecipeAsCSV(recipe: Recipe): void {
  const rows = [
    ["Field", "Value"],
    ["Name", recipe.name],
    ["Category", recipe.category],
    ["Cook Time (min)", recipe.cookTime],
    ["Servings", recipe.servings],
    ["Description", recipe.description],
    ["", ""],
    ["Ingredients", ""],
    ...recipe.ingredients.map((ing) => [ing, ""]),
    ["", ""],
    ["Instructions", ""],
    ...recipe.instructions.map((inst) => [inst, ""]),
  ]

  const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  downloadFile(blob, `${recipe.name}.csv`)
}

export function exportRecipesAsCSV(recipes: Recipe[]): void {
  const rows = [
    ["Name", "Category", "Cook Time (min)", "Servings", "Ingredients Count", "Description"],
    ...recipes.map((r) => [r.name, r.category, r.cookTime, r.servings, r.ingredients.length, r.description]),
  ]

  const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  downloadFile(blob, `recipes-${new Date().toISOString().split("T")[0]}.csv`)
}

export function generateRecipePDF(recipe: Recipe): string {
  const content = `
╔════════════════════════════════════════════════════════════════╗
║                        RECIPE CARD                             ║
╚════════════════════════════════════════════════════════════════╝

RECIPE: ${recipe.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Category:     ${recipe.category}
Cook Time:    ${recipe.cookTime} minutes
Servings:     ${recipe.servings}

DESCRIPTION:
${recipe.description}

INGREDIENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${recipe.ingredients.map((ing, i) => `  ${i + 1}. ${ing}`).join("\n")}

INSTRUCTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${recipe.instructions.map((inst, i) => `  Step ${i + 1}: ${inst}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
  `
  return content
}

export function exportRecipeAsText(recipe: Recipe): void {
  const content = generateRecipePDF(recipe)
  const blob = new Blob([content], { type: "text/plain" })
  downloadFile(blob, `${recipe.name}.txt`)
}

export function importRecipesFromJSON(file: File): Promise<Recipe[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        const recipes = Array.isArray(json) ? json : [json]
        resolve(recipes)
      } catch (error) {
        reject(new Error("Invalid JSON file"))
      }
    }
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsText(file)
  })
}

function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
