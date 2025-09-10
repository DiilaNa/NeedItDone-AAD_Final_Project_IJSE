package lk.ijse.project.backend.service;

public interface EmailService {
    void sendJobCompletionEmail(String homeownerEmail, String workerName, String jobTitle);
    void sendEmail(String to, String subject, String body);
}
