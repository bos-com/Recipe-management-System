package com.example.recipemanager.service;

import com.example.recipemanager.model.Recipe;
import com.example.recipemanager.repository.RecipeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecipeService {
    private final RecipeRepository repo;

    // RecipeService.java
    // This class contains business logic for managing recipes.
    public RecipeService(RecipeRepository repo) {
        this.repo = repo;
    }

    public List<Recipe> findAll() {
        return repo.findAll();
    }

    public Optional<Recipe> findById(String id) {
        return repo.findById(id);
    }

    public Recipe save(Recipe r) {
        return repo.save(r);
    }

    public void deleteById(String id) {
        repo.deleteById(id);
    }

    public List<Recipe> searchByName(String q) {
        return repo.findByNameContainingIgnoreCase(q == null ? "" : q);
    }
}
