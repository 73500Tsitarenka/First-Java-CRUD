# FitTrack Lite

A simple fitness exercise tracker built with **Java, Spring Boot, Spring Data JPA, H2 Database, HTML, CSS, and JavaScript**.

FitTrack Lite allows users to manage their exercises through a web interface. Users can add new exercises, view their workout data, edit existing exercises, delete exercises, and search the exercise list.

## Features

- **View exercises** — display a list of saved exercises.
- **Add exercises** — create a new exercise with its name, weight, number of sets, and repetitions.
- **Edit exercises** — update existing exercise information.
- **Delete exercises** — remove exercises from the list.
- **Search exercises** — find exercises by name.
- **Dashboard statistics** — view summary information about the exercise list.
- **Input validation** — prevent invalid exercise data from being saved.
- **REST API** — communicate between the frontend and backend using HTTP requests.
- **H2 database** — store exercise data in an in-memory database.

## Technologies Used

| Technology | Purpose |
|---|---|
| Java | Backend programming language |
| Spring Boot | Application framework |
| Spring Web | REST API and HTTP request handling |
| Spring Data JPA | Database access and data management |
| Hibernate | Object-relational mapping |
| H2 Database | In-memory relational database |
| HTML | Web page structure |
| CSS | User interface styling |
| JavaScript | Frontend functionality and API communication |
| Maven | Project build and dependency management |

## Project Structure

```text
fittrack-lite/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── FitTrack/
│   │   │       └── Lite/
│   │   │           ├── FittrackLiteApplication.java
│   │   │           ├── Exercise.java
│   │   │           ├── ExerciseRepository.java
│   │   │           ├── ExerciseController.java
│   │   │           └── DataInitializer.java
│   │   └── resources/
│   │       ├── static/
│   │       │   ├── index.html
│   │       │   ├── styles.css
│   │       │   └── app.js
│   │       └── application.properties
│   └── test/
├── mvnw
├── mvnw.cmd
├── pom.xml
└── README.md
```

## Requirements

Before running the application, make sure you have:

- Java Development Kit (JDK) compatible with the project configuration.
- The Maven Wrapper included in the project.
- A web browser.

You can check your Java version with:

```powershell
java -version
```

## Installation and Setup

### 1. Open the project directory

Open PowerShell in the project root:

```powershell
cd "C:\university\3rd year\5th semester\IT Elective\First-Java-CRUD\fittrack-lite"
```

### 2. Build and test the application

Run the tests and compile the project:

```powershell
.\mvnw.cmd clean test
```

A successful build should finish with:

```text
BUILD SUCCESS
```

### 3. Start the application

Run Spring Boot:

```powershell
.\mvnw.cmd spring-boot:run
```

Wait until the terminal indicates that the application has started.

### 4. Open the web application

Open the following address in your browser:

http://localhost:8080/

The frontend is served by Spring Boot, so a separate frontend development server is not required.

### 5. Stop the application

To stop the application, press `Ctrl + C` in the terminal running Spring Boot.

## REST API

The backend exposes the following endpoints.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/exercises` | Retrieve all exercises |
| POST | `/api/exercises` | Create a new exercise |
| PUT | `/api/exercises/{id}` | Update an existing exercise |
| DELETE | `/api/exercises/{id}` | Delete an exercise by ID |

### Example: Retrieve all exercises

Request:

```http
GET /api/exercises
```

Example response:

```json
[
  {
    "id": 1,
    "name": "Bench Press",
    "weightKg": 40.0,
    "sets": 3,
    "reps": 10
  }
]
```

The returned data depends on the exercises currently stored in the database.

### Example: Create an exercise

Request:

```http
POST /api/exercises
Content-Type: application/json
```

Request body:

```json
{
  "name": "Squat",
  "weightKg": 60,
  "sets": 3,
  "reps": 10
}
```

### Example: Update an exercise

Request:

```http
PUT /api/exercises/1
Content-Type: application/json
```

Request body:

```json
{
  "name": "Bench Press",
  "weightKg": 45,
  "sets": 4,
  "reps": 8
}
```

### Example: Delete an exercise

```http
DELETE /api/exercises/1
```

The API validates exercise information, including the exercise name, weight, sets, and repetitions.

## Database

FitTrack Lite uses an H2 in-memory database.

The database is configured in `src/main/resources/application.properties`. The application uses Hibernate to manage the database schema and Spring Data JPA to perform database operations.

**Important:** Because the database is stored in memory, its data is normally lost when the application stops. Sample exercises may be inserted automatically when the application starts, depending on the data initializer configuration.

The H2 console is available at:

http://localhost:8080/h2-console

When prompted, use the connection settings configured in `application.properties`. For the current in-memory configuration, the JDBC URL is:

```text
jdbc:h2:mem:fittrackdb
```

## Validation

The backend checks exercise data before saving it:

- Exercise name is required and cannot exceed 100 characters.
- Weight must be a valid, non-negative number.
- Sets must be between 1 and 100.
- Repetitions must be between 1 and 1000.

Invalid requests are rejected with a `400 Bad Request` response.

## Testing

To run the automated tests, execute:

```powershell
.\mvnw.cmd clean test
```

To check whether the API is responding while the application is running, open a second PowerShell terminal and execute:

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/exercises" -Method Get
```

The command should return the current list of exercises if the backend and database are running correctly.

## Future Improvements

Possible improvements include:

- Add user accounts and authentication.
- Store data persistently using a file-based or external database.
- Add workout history and progress tracking.
- Introduce exercise categories and muscle groups.
- Add automated tests for CRUD operations and input validation.
- Improve accessibility and mobile responsiveness.

## Author

Developed as a Java CRUD application project for learning backend development, REST APIs, database integration, and frontend-backend communication.
