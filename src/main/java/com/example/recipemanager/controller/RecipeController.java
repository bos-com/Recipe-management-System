package com.example.recipemanager.controller;

import com.example.recipemanager.model.Recipe;
import com.example.recipemanager.service.RecipeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Controller
public class RecipeController {
    private final RecipeService service;

    // upload directory (can be an absolute path). Provided via application.properties
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public RecipeController(RecipeService service) {
    // RecipeController.java
    // This class handles HTTP requests for recipe management operations.
        this.service = service;
    }

    @GetMapping({"/", "/recipes"})
    public String listRecipes(@RequestParam(required = false) String q, Model model) {
        List<Recipe> recipes = (q == null || q.isBlank()) ? service.findAll() : service.searchByName(q);
        model.addAttribute("recipes", recipes);
        model.addAttribute("q", q);
        return "recipes/list";
    }

    @GetMapping("/recipes/new")
    public String newRecipeForm(Model model) {
        model.addAttribute("recipe", new Recipe());
        return "recipes/form";
    }

    @GetMapping("/recipes/edit/{id}")
    public String editRecipe(@PathVariable String id, Model model) {
        Optional<Recipe> r = service.findById(id);
        if (r.isPresent()) {
            model.addAttribute("recipe", r.get());
            return "recipes/form";
        }
        return "redirect:/recipes";
    }

    @PostMapping("/recipes")
    public String saveRecipe(@ModelAttribute Recipe recipe, @RequestParam("image") MultipartFile image) throws IOException {
        // handle comma separated ingredients / steps if user entered as text lines
        // (templates will pass as multi-line, mapping left as exercise — keep simple)

        // Save image file if provided
        if (image != null && !image.isEmpty()) {
            String original = StringUtils.cleanPath(image.getOriginalFilename());
            String filename = System.currentTimeMillis() + "_" + original.replaceAll("\\s+", "_");
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Files.copy(image.getInputStream(), uploadPath.resolve(filename));
            recipe.setImageFilename(filename);
        }

        if (recipe.getCreatedAt() == null) {
            recipe.setCreatedAt(LocalDateTime.now());
        }
        service.save(recipe);
        return "redirect:/recipes";
    }

    @PostMapping("/recipes/delete/{id}")
    public String deleteRecipe(@PathVariable String id) {
        service.deleteById(id);
        return "redirect:/recipes";
    }

    // Small helper to quickly seed example data (not for production)
    @PostMapping("/recipes/seed")
    public String seedExample() {
        Recipe r = new Recipe();
        r.setName("Example Spaghetti");
        r.setDescription("A simple example recipe created by the scaffold.");
        r.setIngredients(Arrays.asList("200g spaghetti", "1 onion", "2 cloves garlic"));
        r.setSteps(Arrays.asList("Boil water", "Cook spaghetti", "Fry sauce"));
        r.setCategory("Pasta");
        r.setPrepTimeMinutes(10);
        r.setCookTimeMinutes(15);
        service.save(r);
        return "redirect:/recipes";
    }
}
