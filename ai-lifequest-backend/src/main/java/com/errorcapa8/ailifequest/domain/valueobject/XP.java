package com.errorcapa8.ailifequest.domain.valueobject;

public record XP(int value) {

    public XP {
        if (value < 0) {
            throw new IllegalArgumentException("La XP no puede ser un valor negativo");
        }
    }

    public XP add(XP other) {
        if (other == null) {
            throw new IllegalArgumentException("La XP a sumar no puede ser nula");
        }
        return new XP(this.value + other.value());
    }
}
