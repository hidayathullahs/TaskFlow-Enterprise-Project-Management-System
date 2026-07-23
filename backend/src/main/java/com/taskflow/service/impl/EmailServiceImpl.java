package com.taskflow.service.impl;

import com.taskflow.entity.User;
import com.taskflow.enums.OtpType;
import com.taskflow.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@taskflow.com}")
    private String fromEmail;

    public EmailServiceImpl(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    @Override
    public void sendWelcomeEmail(User user) {
        String subject = "Welcome to TaskFlow Enterprise System";
        String htmlContent = String.format(
            "<h2>Welcome to TaskFlow, %s!</h2>" +
            "<p>Your employee account has been initialized successfully.</p>" +
            "<p>Log in to access your projects, Kanban boards, and tasks.</p>",
            user.getFirstName()
        );
        sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }

    @Async
    @Override
    public void sendVerificationEmail(User user, String token) {
        String subject = "Verify Your TaskFlow Email Address";
        String htmlContent = String.format(
            "<h2>Email Verification Required</h2>" +
            "<p>Hello %s, please verify your email address using the code/token below:</p>" +
            "<h3 style='color: #3B82F6;'>%s</h3>" +
            "<p>This verification link/code will expire in 24 hours.</p>",
            user.getFirstName(), token
        );
        sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }

    @Async
    @Override
    public void sendOtpEmail(User user, String otpCode, OtpType type) {
        String subject = "TaskFlow Security OTP Code: " + otpCode;
        String htmlContent = String.format(
            "<h2>TaskFlow Security Verification</h2>" +
            "<p>Hello %s, your OTP code for <b>%s</b> is:</p>" +
            "<h1 style='color: #10B981; letter-spacing: 4px;'>%s</h1>" +
            "<p>This OTP is valid for 10 minutes. Do not share this code with anyone.</p>",
            user.getFirstName(), type != null ? type.name() : "LOGIN", otpCode
        );
        sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }

    @Async
    @Override
    public void sendForgotPasswordEmail(User user, String resetTokenOrOtp) {
        String subject = "TaskFlow Password Reset Request";
        String htmlContent = String.format(
            "<h2>Password Reset Authorization</h2>" +
            "<p>Hello %s, we received a request to reset your password.</p>" +
            "<p>Your reset code is: <b>%s</b></p>" +
            "<p>If you did not request a password reset, please contact your security admin immediately.</p>",
            user.getFirstName(), resetTokenOrOtp
        );
        sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }

    @Async
    @Override
    public void sendPasswordChangedNotification(User user) {
        String subject = "TaskFlow Security Alert: Password Changed";
        String htmlContent = String.format(
            "<h2>Password Security Update</h2>" +
            "<p>Hello %s, your TaskFlow account password was updated successfully.</p>" +
            "<p>If you did not perform this change, please report this incident to IT Security.</p>",
            user.getFirstName()
        );
        sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }

    @Async
    @Override
    public void sendAccountLockedNotification(User user) {
        String subject = "TaskFlow Security Notice: Account Temporarily Suspended";
        String htmlContent = String.format(
            "<h2>Account Security Lock</h2>" +
            "<p>Hello %s, your account has been temporarily locked due to 5 failed login attempts.</p>" +
            "<p>Your account will automatically unlock in 15 minutes.</p>",
            user.getFirstName()
        );
        sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }

    private void sendHtmlEmail(String to, String subject, String body) {
        if (mailSender == null) {
            log.info("[SIMULATION LOG] Email to {} | Subject: {} | Body length: {}", to, subject, body.length());
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
