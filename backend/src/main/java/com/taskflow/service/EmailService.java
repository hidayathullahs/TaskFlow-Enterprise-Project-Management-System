package com.taskflow.service;

import com.taskflow.entity.User;
import com.taskflow.enums.OtpType;

public interface EmailService {
    void sendWelcomeEmail(User user);
    void sendVerificationEmail(User user, String verificationTokenOrOtp);
    void sendOtpEmail(User user, String otpCode, OtpType type);
    void sendForgotPasswordEmail(User user, String resetTokenOrOtp);
    void sendPasswordChangedNotification(User user);
    void sendAccountLockedNotification(User user);
}
