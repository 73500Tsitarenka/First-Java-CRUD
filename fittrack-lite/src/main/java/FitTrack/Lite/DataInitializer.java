package FitTrack.Lite;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner loadSampleExercises(ExerciseRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Exercise("Hip Thrust", 160, 3, 12));
                repository.save(new Exercise("Lat Pulldown", 55, 3, 12));
                repository.save(new Exercise("Lateral Raise", 9, 3, 15));
                repository.save(new Exercise("Leg Press", 150, 3, 12));
                repository.save(new Exercise("Biceps Curl", 10, 3, 12));
            }
        };
    }
}

