package com.errorcapa8.ailifequest.domain.exception;

public class ChallengeAlreadyCompletedException extends DomainException {

    public ChallengeAlreadyCompletedException() {
        super("El reto ya ha sido completado anteriormente.");
    }
}
