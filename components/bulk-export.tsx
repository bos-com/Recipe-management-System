"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Upload } from "lucide-react"
import { exportRecipesAsJSON, exportRecipesAsCSV, importRecipesFromJSON } from "@/lib/export-utils"
import { useRef, useState } from "react"
import type { Recipe } from "@/types/recipe"

interface BulkExportProps {
  recipes: Recipe[]
}

export function BulkExport({ recipes }: BulkExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<string>("")

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const imported = await importRecipesFromJSON(file)
      setImportStatus(`Successfully imported ${imported.length} recipe(s)!`)
      setTimeout(() => setImportStatus(""), 3000)
    } catch (error) {
      setImportStatus("Failed to import recipes")
      setTimeout(() => setImportStatus(""), 3000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download size={20} />
          Bulk Export & Import
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            Export all {recipes.length} recipes in your preferred format
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => exportRecipesAsJSON(recipes)} variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Export as JSON
            </Button>
            <Button onClick={() => exportRecipesAsCSV(recipes)} variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Export as CSV
            </Button>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-sm text-muted-foreground mb-3">Import recipes from a JSON file</p>
          <div>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex items-center gap-2">
              <Upload size={16} />
              Import JSON
            </Button>
            {importStatus && <p className="text-sm mt-2 text-primary">{importStatus}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
