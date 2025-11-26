package com.example.recipemanager.repository;

// RecipeRepository.java
// This interface provides data access methods for recipes.

import com.example.recipemanager.model.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends MongoRepository<Recipe, String> {
    // Simple search by name containing text
    List<Recipe> findByNameContainingIgnoreCase(String name);
    List<Recipe> findByCategoryIgnoreCase(String category);
}
