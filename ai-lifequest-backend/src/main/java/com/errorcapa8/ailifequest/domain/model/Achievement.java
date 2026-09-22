package com.errorcapa8.ailifequest.domain.model;

public class Achievement {
    private final String code;
    private String name;
    private String description;
    private boolean active;

    public Achievement(String code, String name, String description) {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("El codigo del logro no puede estar vacio");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("El nombre del logro no puede estar vacio");
        }
        this.code = code;
        this.name = name;
        this.description = description;
        this.active = true;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public boolean isActive() {
        return active;
    }
}
