package com.campusiq.submission.exception;

public class SubmissionNotFoundException extends RuntimeException {

    public SubmissionNotFoundException(Long id) {
        super("Submission not found with id: " + id);
    }

    public SubmissionNotFoundException(String message) {
        super(message);
    }
}
