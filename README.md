# Recipe Manager — Final Year Project

This is a Spring Boot web application for managing restaurant recipes. It uses MongoDB as the database and Thymeleaf + Bootstrap for a responsive UI.

Quick start

1. Set MongoDB connection (optional):
   - By default the app uses mongodb://localhost:27017/recipe_db
   - To override, set an environment variable MONGODB_URI.

2. Build & run:

```powershell
mvn clean package
mvn spring-boot:run
```

3. Open http://localhost:8080 in your browser.

Image uploads

- Images are saved to the `uploads/` directory by default. You can change the path in `src/main/resources/application.properties` (property `app.upload.dir`).
- The UI shows a placeholder when no image is provided.

What I added

- Maven POM with Spring Boot, Thymeleaf, and MongoDB dependencies
- Basic domain model, repository, service and controllers
- Thymeleaf templates with Bootstrap responsive layout
- README / .gitignore

Next steps (suggested)

- Add authentication/authorization for stakeholders
- Add pagination and filtering for large datasets
- Store images in cloud storage (S3) for production
