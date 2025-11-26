// MongoDB connection client for stakeholder management
export const mongoConfig = {
  uri: process.env.MONGODB_URI || "mongodb://localhost:27017/recipe-management",
  database: "recipe-management",
  collections: {
    recipes: "recipes",
    users: "users",
    reviews: "reviews",
    collections: "collections",
  },
}

// Helper function to validate stakeholder access
export function validateStakeholder(userRole: string): boolean {
  return userRole === "admin"
}
