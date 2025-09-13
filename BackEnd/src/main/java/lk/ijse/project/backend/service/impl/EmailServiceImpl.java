package lk.ijse.project.backend.service.impl;


import lk.ijse.project.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;

    @Override
    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
    @Override
    public void sendJobCompletionEmail(String homeownerEmail, String workerName, String jobTitle) {
        String subject = "✅ Job Marked as Completed";
        String body = "Hello,\n\nThe worker " + workerName + " has marked the job '" + jobTitle +
                "' as completed.\n\nPlease review and confirm the completion. " +
                "Once confirmed, you’ll be able to leave a rating.\n\nThank you for using NeedItDone!";

        sendEmail(homeownerEmail, subject, body);
    }
}