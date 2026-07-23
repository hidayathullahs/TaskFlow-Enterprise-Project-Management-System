package com.taskflow.validation;

import com.taskflow.entity.PasswordHistory;
import com.taskflow.entity.User;
import com.taskflow.exception.BadRequestException;
import com.taskflow.repository.PasswordHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class PasswordPolicyValidator {

    private static final String PASSWORD_PATTERN = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!._-])(?=\\S+$).{12,}$";
    private static final Pattern PATTERN = Pattern.compile(PASSWORD_PATTERN);

    private static final List<String> COMMON_PASSWORDS = List.of(
            "password123", "password@123", "1234567890", "admin123456", "taskflow123456"
    );

    private final PasswordHistoryRepository passwordHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    public void validatePasswordPolicy(String newPassword) {
        if (newPassword == null || !PATTERN.matcher(newPassword).matches()) {
            throw new BadRequestException("Password must be at least 12 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
        }

        if (COMMON_PASSWORDS.contains(newPassword.toLowerCase())) {
            throw new BadRequestException("Password is too common. Please choose a stronger unique password.");
        }
    }

    public void validatePasswordHistory(User user, String newPassword) {
        // Validate password against current active password
        if (passwordEncoder.matches(newPassword, user.getPasswordHash())) {
            throw new BadRequestException("New password cannot be identical to your current password.");
        }

        // Validate against recent 5 password history records
        List<PasswordHistory> historyList = passwordHistoryRepository.findTop5ByUserIdOrderByCreatedAtDesc(user.getId());
        for (PasswordHistory history : historyList) {
            if (passwordEncoder.matches(newPassword, history.getPasswordHash())) {
                throw new BadRequestException("New password matches one of your recent 5 passwords. Please select a different password.");
            }
        }
    }
}
