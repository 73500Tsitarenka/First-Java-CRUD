package FitTrack.Lite;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double weightKg;
    private int sets;
    private int reps;

    public Exercise() {
    }

    public Exercise(String name, double weightKg, int sets, int reps) {
        this.name = name;
        this.weightKg = weightKg;
        this.sets = sets;
        this.reps = reps;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getWeightKg() {
        return weightKg;
    }

    public void setWeightKg(double weightKg) {
        this.weightKg = weightKg;
    }

    public int getSets() {
        return sets;
    }

    public void setSets(int sets) {
        this.sets = sets;
    }

    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

    @Override
    public String toString() {
        return String.format("Exercise[id=%d, name='%s', weightKg=%.1f, sets=%d, reps=%d]",
                id, name, weightKg, sets, reps);
    }
}
