package com.taskflow.service;

import com.taskflow.dto.request.LoginRequest;
import com.taskflow.dto.request.RegisterRequest;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.entity.Role;
import com.taskflow.entity.User;
import com.taskflow.enums.RoleType;
import com.taskflow.enums.UserStatus;
import com.taskflow.exception.BadRequestException;
import com.taskflow.exception.DuplicateResourceException;
import com.taskflow.repository.*;
import com.taskflow.security.BruteForceProtectionService;
import com.taskflow.security.JwtTokenProvider;
import com.taskflow.service.impl.AuthServiceImpl;
import com.taskflow.validation.PasswordPolicyValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private AuthenticationManager authenticationManager;
    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private DepartmentRepository departmentRepository;
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private UserSessionRepository userSessionRepository;
    @Mock private OtpRepository otpRepository;
    @Mock private PasswordHistoryRepository passwordHistoryRepository;
    @Mock private SecurityEventRepository securityEventRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider tokenProvider;
    @Mock private EmailService emailService;
    @Mock private BruteForceProtectionService bruteForceProtectionService;
    @Mock private PasswordPolicyValidator passwordPolicyValidator;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;
    private Role sampleRole;

    @BeforeEach
    void setUp() {
        sampleRole = Role.builder().name(RoleType.ROLE_EMPLOYEE).build();
        sampleUser = User.builder()
                .firstName("Test")
                .lastName("User")
                .email("test.user@taskflow.com")
                .passwordHash("$2a$10$encodedHash")
                .status(UserStatus.ACTIVE)
                .emailVerified(true)
                .build();
    }

    @Test
    @DisplayName("Should successfully register user with valid credentials")
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest("Test", "User", "test.user@taskflow.com", "SecurePass123!", "+15550100", "Engineer", "ENG");

        when(userRepository.existsByEmailAndDeletedFalse(request.getEmail())).thenReturn(false);
        when(roleRepository.findByName(RoleType.ROLE_EMPLOYEE)).thenReturn(Optional.of(sampleRole));
        when(passwordEncoder.encode(any())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        UserResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("test.user@taskflow.com", response.getEmail());
        verify(emailService, times(1)).sendWelcomeEmail(any(User.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when email is already registered")
    void testRegisterDuplicateEmail() {
        RegisterRequest request = new RegisterRequest("Test", "User", "test.user@taskflow.com", "SecurePass123!", null, null, null);
        when(userRepository.existsByEmailAndDeletedFalse(request.getEmail())).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
    }
}
