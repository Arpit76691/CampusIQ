package com.campusiq.contest.exception;

public class ContestNotFoundException extends RuntimeException {

    public ContestNotFoundException(Long id) {
        super("Contest not found with id: " + id);
    }

    public ContestNotFoundException(String message) {
        super(message);
    }
}
