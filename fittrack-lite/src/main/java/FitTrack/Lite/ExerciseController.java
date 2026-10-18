
package FitTrack.Lite;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    private final ExerciseRepository repository;

    public ExerciseController(ExerciseRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Exercise> getAllExercises() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createExercise(@RequestBody Exercise exercise) {
        String error = validate(exercise);

        if (error != null) {
            return ResponseEntity.badRequest().body(error);
        }

        exercise.setName(exercise.getName().trim());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(repository.save(exercise));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExercise(
            @PathVariable Long id,
            @RequestBody Exercise updatedExercise) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        String error = validate(updatedExercise);

        if (error != null) {
            return ResponseEntity.badRequest().body(error);
        }

        Exercise exercise = repository.findById(id).orElseThrow();
        exercise.setName(updatedExercise.getName().trim());
        exercise.setWeightKg(updatedExercise.getWeightKg());
        exercise.setSets(updatedExercise.getSets());
        exercise.setReps(updatedExercise.getReps());

        return ResponseEntity.ok(repository.save(exercise));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private String validate(Exercise exercise) {
        if (exercise.getName() == null
                || exercise.getName().isBlank()) {
            return "Exercise name is required.";
        }

        if (exercise.getName().trim().length() > 100) {
            return "Exercise name must be 100 characters or fewer.";
        }

        if (!Double.isFinite(exercise.getWeightKg())
                || exercise.getWeightKg() < 0) {
            return "Weight must be a valid non-negative number.";
        }

        if (exercise.getSets() < 1 || exercise.getSets() > 100) {
            return "Sets must be between 1 and 100.";
        }

        if (exercise.getReps() < 1 || exercise.getReps() > 1000) {
            return "Reps must be between 1 and 1000.";
        }

        return null;
    }
}
