package com.taskflow.service.impl;

import com.taskflow.dto.request.*;
import com.taskflow.dto.response.*;
import com.taskflow.entity.*;
import com.taskflow.enums.*;
import com.taskflow.exception.BadRequestException;
import com.taskflow.exception.DuplicateResourceException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.repository.*;
import com.taskflow.security.BruteForceProtectionService;
import com.taskflow.security.JwtTokenProvider;
import com.taskflow.security.UserPrincipal;
import com.taskflow.service.AuthService;
import com.taskflow.service.EmailService;
import com.taskflow.utils.DeviceExtractorUtils;
import com.taskflow.validation.PasswordPolicyValidator;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserSessionRepository userSessionRepository;
    private final OtpRepository otpRepository;
    private final PasswordHistoryRepository passwordHistoryRepository;
    private final SecurityEventRepository securityEventRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;
    private final BruteForceProtectionService bruteForceProtectionService;
    private final PasswordPolicyValidator passwordPolicyValidator;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Override
    @Transactional
    public JwtAuthenticationResponse login(LoginRequest loginRequest, HttpServletRequest request) {
        User user = userRepository.findByEmailAndDeletedFalse(loginRequest.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        bruteForceProtectionService.checkIfAccountIsLocked(user);

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
        } catch (Exception ex) {
            bruteForceProtectionService.loginFailed(user);
            logSecurityEvent(user, SecurityEventType.LOGIN_FAILED.name(), request, "Failed login attempt for " + loginRequest.getEmail());
            throw new UnauthorizedException("Invalid email or password");
        }

        bruteForceProtectionService.loginSucceeded(user);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshTokenStr = tokenProvider.generateRefreshTokenFromPublicId(userPrincipal.getPublicId());

        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .user(user)
                .token(refreshTokenStr)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();
        RefreshToken savedRefreshToken = refreshTokenRepository.save(refreshTokenEntity);

        // Register Active Session
        String userAgent = DeviceExtractorUtils.getUserAgent(request);
        UserSession session = UserSession.builder()
                .user(user)
                .refreshToken(savedRefreshToken)
                .deviceName(DeviceExtractorUtils.extractBrowser(userAgent))
                .deviceType("Desktop/Mobile")
                .operatingSystem(DeviceExtractorUtils.extractOperatingSystem(userAgent))
                .browser(DeviceExtractorUtils.extractBrowser(userAgent))
                .ipAddress(DeviceExtractorUtils.getClientIp(request))
                .lastAccessedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();
        userSessionRepository.save(session);

        logSecurityEvent(user, SecurityEventType.LOGIN_SUCCESS.name(), request, "Successful user login");

        Set<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> auth.startsWith("ROLE_"))
                .collect(Collectors.toSet());

        Set<String> permissions = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> !auth.startsWith("ROLE_"))
                .collect(Collectors.toSet());

        return JwtAuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationMs())
                .user(mapUserToUserResponse(user))
                .roles(roles)
                .permissions(permissions)
                .build();
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmailAndDeletedFalse(registerRequest.getEmail())) {
            throw new DuplicateResourceException("User", "email", registerRequest.getEmail());
        }

        passwordPolicyValidator.validatePasswordPolicy(registerRequest.getPassword());

        Role defaultRole = roleRepository.findByName(RoleType.ROLE_EMPLOYEE)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", RoleType.ROLE_EMPLOYEE));

        Set<Role> roles = new HashSet<>();
        roles.add(defaultRole);

        Department department = null;
        if (registerRequest.getDepartmentCode() != null && !registerRequest.getDepartmentCode().isEmpty()) {
            department = departmentRepository.findByCodeAndDeletedFalse(registerRequest.getDepartmentCode())
                    .orElse(null);
        }

        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());

        User user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .phone(registerRequest.getPhone())
                .passwordHash(encodedPassword)
                .designation(registerRequest.getDesignation())
                .status(UserStatus.ACTIVE)
                .emailVerified(true)
                .department(department)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);

        // Record initial PasswordHistory
        PasswordHistory history = PasswordHistory.builder()
                .user(savedUser)
                .passwordHash(encodedPassword)
                .createdAt(LocalDateTime.now())
                .build();
        passwordHistoryRepository.save(history);

        emailService.sendWelcomeEmail(savedUser);
        return mapUserToUserResponse(savedUser);
    }

    @Override
    @Transactional
    public JwtAuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        String tokenStr = refreshTokenRequest.getRefreshToken();
        if (!tokenProvider.validateToken(tokenStr)) {
            throw new BadRequestException("Invalid or expired refresh token");
        }

        RefreshToken refreshToken = refreshTokenRepository.findByTokenAndRevokedFalse(tokenStr)
                .orElseThrow(() -> new BadRequestException("Refresh token not found or revoked"));

        if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            throw new BadRequestException("Refresh token has expired. Please login again.");
        }

        User user = refreshToken.getUser();
        String newAccessToken = tokenProvider.generateAccessTokenFromPublicId(user.getPublicId());

        UserPrincipal userPrincipal = UserPrincipal.create(user);

        Set<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> auth.startsWith("ROLE_"))
                .collect(Collectors.toSet());

        Set<String> permissions = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> !auth.startsWith("ROLE_"))
                .collect(Collectors.toSet());

        return JwtAuthenticationResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(tokenStr)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationMs())
                .user(mapUserToUserResponse(user))
                .roles(roles)
                .permissions(permissions)
                .build();
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest forgotPasswordRequest) {
        User user = userRepository.findByEmailAndDeletedFalse(forgotPasswordRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", forgotPasswordRequest.getEmail()));

        String otpCode = generateNumericOtp();
        Otp otp = Otp.builder()
                .user(user)
                .otpCode(otpCode)
                .type(OtpType.PASSWORD_RESET)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .maxAttempts(3)
                .verified(false)
                .build();
        otpRepository.save(otp);

        emailService.sendForgotPasswordEmail(user, otpCode);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest resetPasswordRequest) {
        passwordPolicyValidator.validatePasswordPolicy(resetPasswordRequest.getNewPassword());

        Otp otp = otpRepository.findAll().stream()
                .filter(o -> o.getOtpCode().equals(resetPasswordRequest.getToken()) && !o.isVerified())
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Invalid or expired password reset token/OTP"));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Password reset token/OTP has expired");
        }

        User user = otp.getUser();
        passwordPolicyValidator.validatePasswordHistory(user, resetPasswordRequest.getNewPassword());

        String newPasswordHash = passwordEncoder.encode(resetPasswordRequest.getNewPassword());
        user.setPasswordHash(newPasswordHash);
        userRepository.save(user);

        otp.setVerified(true);
        otpRepository.save(otp);

        // Save to password history
        passwordHistoryRepository.save(PasswordHistory.builder()
                .user(user)
                .passwordHash(newPasswordHash)
                .createdAt(LocalDateTime.now())
                .build());

        // Revoke all active sessions
        logoutAllSessions(user.getPublicId());
        emailService.sendPasswordChangedNotification(user);
    }

    @Override
    @Transactional
    public void changePassword(String userPublicId, ChangePasswordRequest changePasswordRequest) {
        User user = userRepository.findByPublicIdAndDeletedFalse(userPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "publicId", userPublicId));

        if (!passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password does not match");
        }

        passwordPolicyValidator.validatePasswordPolicy(changePasswordRequest.getNewPassword());
        passwordPolicyValidator.validatePasswordHistory(user, changePasswordRequest.getNewPassword());

        String newPasswordHash = passwordEncoder.encode(changePasswordRequest.getNewPassword());
        user.setPasswordHash(newPasswordHash);
        userRepository.save(user);

        passwordHistoryRepository.save(PasswordHistory.builder()
                .user(user)
                .passwordHash(newPasswordHash)
                .createdAt(LocalDateTime.now())
                .build());

        emailService.sendPasswordChangedNotification(user);
    }

    @Override
    @Transactional
    public OtpResponse sendOtp(SendOtpRequest sendOtpRequest) {
        User user = userRepository.findByEmailAndDeletedFalse(sendOtpRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", sendOtpRequest.getEmail()));

        String otpCode = generateNumericOtp();
        Otp otp = Otp.builder()
                .user(user)
                .otpCode(otpCode)
                .type(sendOtpRequest.getType())
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .maxAttempts(3)
                .verified(false)
                .build();

        Otp savedOtp = otpRepository.save(otp);
        emailService.sendOtpEmail(user, otpCode, sendOtpRequest.getType());

        return OtpResponse.builder()
                .publicId(savedOtp.getPublicId())
                .type(savedOtp.getType())
                .expiresAt(savedOtp.getExpiresAt())
                .maxAttempts(savedOtp.getMaxAttempts())
                .message("OTP sent successfully to " + user.getEmail())
                .build();
    }

    @Override
    @Transactional
    public boolean verifyOtp(VerifyOtpRequest verifyOtpRequest) {
        User user = userRepository.findByEmailAndDeletedFalse(verifyOtpRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", verifyOtpRequest.getEmail()));

        Otp otp = otpRepository.findTopByUserIdAndTypeAndVerifiedFalseOrderByCreatedAtDesc(user.getId(), verifyOtpRequest.getType())
                .orElseThrow(() -> new BadRequestException("No active OTP found for this operation"));

        if (otp.getAttemptsCount() >= otp.getMaxAttempts()) {
            throw new BadRequestException("Maximum OTP verification attempts exceeded. Please request a new OTP.");
        }

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP has expired. Please request a new OTP.");
        }

        otp.setAttemptsCount(otp.getAttemptsCount() + 1);

        if (!otp.getOtpCode().equals(verifyOtpRequest.getOtpCode())) {
            otpRepository.save(otp);
            throw new BadRequestException("Invalid OTP code");
        }

        otp.setVerified(true);
        otpRepository.save(otp);
        return true;
    }

    @Override
    @Transactional
    public void verifyEmail(VerifyEmailRequest verifyEmailRequest) {
        Otp otp = otpRepository.findAll().stream()
                .filter(o -> o.getOtpCode().equals(verifyEmailRequest.getToken()) && o.getType() == OtpType.EMAIL_VERIFICATION && !o.isVerified())
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Invalid or expired email verification code"));

        User user = otp.getUser();
        user.setEmailVerified(true);
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);

        otp.setVerified(true);
        otpRepository.save(otp);
    }

    @Override
    @Transactional
    public void resendVerification(String email) {
        User user = userRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (user.isEmailVerified()) {
            throw new BadRequestException("Email is already verified");
        }

        String otpCode = generateNumericOtp();
        Otp otp = Otp.builder()
                .user(user)
                .otpCode(otpCode)
                .type(OtpType.EMAIL_VERIFICATION)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .maxAttempts(3)
                .verified(false)
                .build();

        otpRepository.save(otp);
        emailService.sendVerificationEmail(user, otpCode);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserProfile(String userPublicId) {
        User user = userRepository.findByPublicIdAndDeletedFalse(userPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "publicId", userPublicId));
        return mapUserToUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUserProfile(String userPublicId, UpdateProfileRequest updateProfileRequest) {
        User user = userRepository.findByPublicIdAndDeletedFalse(userPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "publicId", userPublicId));

        if (updateProfileRequest.getFirstName() != null) user.setFirstName(updateProfileRequest.getFirstName());
        if (updateProfileRequest.getLastName() != null) user.setLastName(updateProfileRequest.getLastName());
        if (updateProfileRequest.getPhone() != null) user.setPhone(updateProfileRequest.getPhone());
        if (updateProfileRequest.getDesignation() != null) user.setDesignation(updateProfileRequest.getDesignation());
        if (updateProfileRequest.getSkills() != null) user.setSkills(updateProfileRequest.getSkills());
        if (updateProfileRequest.getExperienceYears() != null) user.setExperienceYears(updateProfileRequest.getExperienceYears());
        if (updateProfileRequest.getBio() != null) user.setBio(updateProfileRequest.getBio());

        User savedUser = userRepository.save(user);
        return mapUserToUserResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSessionResponse> getUserSessions(String userPublicId) {
        User user = userRepository.findByPublicIdAndDeletedFalse(userPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "publicId", userPublicId));

        List<UserSession> sessions = userSessionRepository.findByUserIdAndRevokedFalse(user.getId());
        return sessions.stream()
                .map(s -> UserSessionResponse.builder()
                        .publicId(s.getPublicId())
                        .deviceName(s.getDeviceName())
                        .deviceType(s.getDeviceType())
                        .operatingSystem(s.getOperatingSystem())
                        .browser(s.getBrowser())
                        .ipAddress(s.getIpAddress())
                        .lastAccessedAt(s.getLastAccessedAt())
                        .expiresAt(s.getExpiresAt())
                        .isCurrentSession(true)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void revokeUserSession(String userPublicId, String sessionPublicId) {
        User user = userRepository.findByPublicIdAndDeletedFalse(userPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "publicId", userPublicId));

        UserSession session = userSessionRepository.findByPublicIdAndUserIdAndRevokedFalse(sessionPublicId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("UserSession", "publicId", sessionPublicId));

        session.setRevoked(true);
        userSessionRepository.save(session);
    }

    @Override
    @Transactional
    public void logoutAllSessions(String userPublicId) {
        User user = userRepository.findByPublicIdAndDeletedFalse(userPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "publicId", userPublicId));

        List<UserSession> sessions = userSessionRepository.findByUserIdAndRevokedFalse(user.getId());
        sessions.forEach(s -> s.setRevoked(true));
        userSessionRepository.saveAll(sessions);

        refreshTokenRepository.deleteByUserId(user.getId());
    }

    @Override
    @Transactional
    public void logout(String userPublicId) {
        logoutAllSessions(userPublicId);
    }

    private String generateNumericOtp() {
        int otp = 100000 + SECURE_RANDOM.nextInt(900000);
        return String.valueOf(otp);
    }

    private void logSecurityEvent(User user, String eventType, HttpServletRequest request, String details) {
        try {
            SecurityEvent event = SecurityEvent.builder()
                    .user(user)
                    .eventType(eventType)
                    .ipAddress(DeviceExtractorUtils.getClientIp(request))
                    .userAgent(DeviceExtractorUtils.getUserAgent(request))
                    .details(details)
                    .createdAt(LocalDateTime.now())
                    .build();
            securityEventRepository.save(event);
        } catch (Exception e) {
            log.error("Failed to log security event: {}", e.getMessage());
        }
    }

    private UserResponse mapUserToUserResponse(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());

        return UserResponse.builder()
                .publicId(user.getPublicId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .status(user.getStatus())
                .emailVerified(user.isEmailVerified())
                .designation(user.getDesignation())
                .joiningDate(user.getJoiningDate())
                .salary(user.getSalary())
                .skills(user.getSkills())
                .experienceYears(user.getExperienceYears())
                .bio(user.getBio())
                .departmentName(user.getDepartment() != null ? user.getDepartment().getName() : null)
                .departmentPublicId(user.getDepartment() != null ? user.getDepartment().getPublicId() : null)
                .reportingManagerName(user.getReportingManager() != null ? user.getReportingManager().getFirstName() + " " + user.getReportingManager().getLastName() : null)
                .roles(roleNames)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
