package com.errorcapa8.ailifequest.domain.model;

import com.errorcapa8.ailifequest.domain.enums.UserStatus;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import com.errorcapa8.ailifequest.domain.valueobject.XP;

public class User {
    private final UserId id;
    private String name;
    private String email;
    private XP totalXp;
    private UserStatus status;

    public User(UserId id, String name, String email) {
        this(id, name, email, new XP(0), UserStatus.ACTIVE);
    }

    public User(UserId id, String name, String email, XP totalXp, UserStatus status) {
        if (id == null) {
            throw new IllegalArgumentException("El id del usuario no puede ser nulo");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("El nombre del usuario no puede estar vacio");
        }
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("El email del usuario no puede estar vacio");
        }
        this.id = id;
        this.name = name;
        this.email = email;
        this.totalXp = totalXp == null ? new XP(0) : totalXp;
        this.status = status == null ? UserStatus.ACTIVE : status;
    }

    public void addXp(XP reward) {
        if (reward != null) {
            this.totalXp = this.totalXp.add(reward);
        }
    }

    public void deactivate() {
        this.status = UserStatus.INACTIVE;
    }

    public UserId getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public XP getTotalXp() {
        return totalXp;
    }

    public UserStatus getStatus() {
        return status;
    }
}
