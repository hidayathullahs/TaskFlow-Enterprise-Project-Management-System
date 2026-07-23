package com.taskflow.controller;

import com.taskflow.dto.request.*;
import com.taskflow.dto.response.*;
import com.taskflow.security.SecurityUtils;
import com.taskflow.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication & Security Module", description = "Enterprise Auth APIs: Login, Registration, JWT Refresh, OTP, Password Reset, Sessions & Profile")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "User Login", description = "Authenticates user with email & password, tracks device session, enforces brute-force protection, and returns JWT tokens.")
    public ResponseEntity<ApiResponse<JwtAuthenticationResponse>> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        JwtAuthenticationResponse jwtResponse = authService.login(loginRequest, request);
        return ResponseEntity.ok(ApiResponse.success("Authentication successful", jwtResponse));
    }

    @PostMapping("/register")
    @Operation(summary = "Register User Account", description = "Creates a new user account, records initial password history, and triggers welcome & verification emails.")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        UserResponse userResponse = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("User registered successfully", userResponse));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh JWT Access Token", description = "Exchanges a valid Refresh Token for a new Bearer Access Token.")
    public ResponseEntity<ApiResponse<JwtAuthenticationResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        JwtAuthenticationResponse jwtResponse = authService.refreshToken(refreshTokenRequest);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", jwtResponse));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Initiate Password Reset", description = "Generates a 6-digit OTP code and dispatches a password reset email.")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        authService.forgotPassword(forgotPasswordRequest);
        return ResponseEntity.ok(ApiResponse.success("Password reset instructions and OTP sent to your email", null));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset Forgotten Password", description = "Validates OTP code, enforces 12-char password policy & password history check, updates password, and revokes active sessions.")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
        authService.resetPassword(resetPasswordRequest);
        return ResponseEntity.ok(ApiResponse.success("Password reset completed successfully. Please login with your new password.", null));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change User Password", description = "Allows authenticated users to update their password with history and policy validation.")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
        String currentPublicId = SecurityUtils.getCurrentUserPublicId()
                .orElseThrow(() -> new RuntimeException("Unauthorized request"));
        authService.changePassword(currentPublicId, changePasswordRequest);
        return ResponseEntity.ok(ApiResponse.success("Password updated successfully", null));
    }

    @PostMapping("/send-otp")
    @Operation(summary = "Request Security OTP", description = "Generates and emails a 6-digit OTP for 2FA, verification, or login.")
    public ResponseEntity<ApiResponse<OtpResponse>> sendOtp(@Valid @RequestBody SendOtpRequest sendOtpRequest) {
        OtpResponse response = authService.sendOtp(sendOtpRequest);
        return ResponseEntity.ok(ApiResponse.success("OTP generated and sent", response));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify Security OTP Code", description = "Verifies 6-digit OTP code against expiry and max retry limits.")
    public ResponseEntity<ApiResponse<Boolean>> verifyOtp(@Valid @RequestBody VerifyOtpRequest verifyOtpRequest) {
        boolean verified = authService.verifyOtp(verifyOtpRequest);
        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully", verified));
    }

    @PostMapping("/verify-email")
    @Operation(summary = "Verify Account Email Address", description = "Activates user account upon verifying email token or OTP code.")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@Valid @RequestBody VerifyEmailRequest verifyEmailRequest) {
        authService.verifyEmail(verifyEmailRequest);
        return ResponseEntity.ok(ApiResponse.success("Email address verified successfully", null));
    }

    @PostMapping("/resend-verification")
    @Operation(summary = "Resend Email Verification", description = "Resends email verification link or code.")
    public ResponseEntity<ApiResponse<Void>> resendVerification(@RequestParam String email) {
        authService.resendVerification(email);
        return ResponseEntity.ok(ApiResponse.success("Verification email resent", null));
    }

    @GetMapping("/profile")
    @Operation(summary = "Get Profile Details", description = "Fetches current authenticated user profile.")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile() {
        String currentPublicId = SecurityUtils.getCurrentUserPublicId()
                .orElseThrow(() -> new RuntimeException("Unauthorized request"));
        UserResponse response = authService.getUserProfile(currentPublicId);
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved", response));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update Profile Details", description = "Updates authenticated user profile parameters.")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@Valid @RequestBody UpdateProfileRequest updateProfileRequest) {
        String currentPublicId = SecurityUtils.getCurrentUserPublicId()
                .orElseThrow(() -> new RuntimeException("Unauthorized request"));
        UserResponse response = authService.updateUserProfile(currentPublicId, updateProfileRequest);
        return ResponseEntity.ok(ApiResponse.success("User profile updated", response));
    }

    @GetMapping("/sessions")
    @Operation(summary = "Get Active User Sessions", description = "Retrieves active device sessions for authenticated user.")
    public ResponseEntity<ApiResponse<List<UserSessionResponse>>> getActiveSessions() {
        String currentPublicId = SecurityUtils.getCurrentUserPublicId()
                .orElseThrow(() -> new RuntimeException("Unauthorized request"));
        List<UserSessionResponse> sessions = authService.getUserSessions(currentPublicId);
        return ResponseEntity.ok(ApiResponse.success("Active user sessions retrieved", sessions));
    }

    @DeleteMapping("/sessions/{id}")
    @Operation(summary = "Revoke Specific User Session", description = "Terminates specific device session by public ID.")
    public ResponseEntity<ApiResponse<Void>> revokeSession(@PathVariable("id") String sessionPublicId) {
        String currentPublicId = SecurityUtils.getCurrentUserPublicId()
                .orElseThrow(() -> new RuntimeException("Unauthorized request"));
        authService.revokeUserSession(currentPublicId, sessionPublicId);
        return ResponseEntity.ok(ApiResponse.success("Session revoked successfully", null));
    }

    @DeleteMapping("/logout-all")
    @Operation(summary = "Logout All Devices & Sessions", description = "Revokes all refresh tokens and sessions for current user.")
    public ResponseEntity<ApiResponse<Void>> logoutAllSessions() {
        String currentPublicId = SecurityUtils.getCurrentUserPublicId()
                .orElseThrow(() -> new RuntimeException("Unauthorized request"));
        authService.logoutAllSessions(currentPublicId);
        return ResponseEntity.ok(ApiResponse.success("Logged out from all devices successfully", null));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout Current Session", description = "Logs out current active session and revokes tokens.")
    public ResponseEntity<ApiResponse<Void>> logout() {
        SecurityUtils.getCurrentUserPublicId().ifPresent(authService::logout);
        return ResponseEntity.ok(ApiResponse.success("User logged out successfully", null));
    }
}
