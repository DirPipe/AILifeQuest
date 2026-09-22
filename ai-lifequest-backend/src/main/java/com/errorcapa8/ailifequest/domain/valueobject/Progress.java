package com.errorcapa8.ailifequest.domain.valueobject;

public record Progress(double percentage) {

    public Progress {
        if (percentage < 0.0 || percentage > 100.0) {
            throw new IllegalArgumentException("El porcentaje de progreso debe estar entre 0.0 y 100.0");
        }
    }

    public static Progress calculate(long completedChallenges, long totalChallenges) {
        if (totalChallenges == 0) {
            return new Progress(0.0);
        }
        double calculated = ((double) completedChallenges / totalChallenges) * 100.0;
        return new Progress(Math.round(calculated * 100.0) / 100.0);
    }
}
