package com.taskflow.service;

import com.taskflow.dto.request.*;
import com.taskflow.dto.response.*;
import com.taskflow.entity.Otp;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface AuthService {
    JwtAuthenticationResponse login(LoginRequest loginRequest, HttpServletRequest request);
    UserResponse register(RegisterRequest registerRequest);
    JwtAuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest);
    void forgotPassword(ForgotPasswordRequest forgotPasswordRequest);
    void resetPassword(ResetPasswordRequest resetPasswordRequest);
    void changePassword(String userPublicId, ChangePasswordRequest changePasswordRequest);
    OtpResponse sendOtp(SendOtpRequest sendOtpRequest);
    boolean verifyOtp(VerifyOtpRequest verifyOtpRequest);
    void verifyEmail(VerifyEmailRequest verifyEmailRequest);
    void resendVerification(String email);
    UserResponse getUserProfile(String userPublicId);
    UserResponse updateUserProfile(String userPublicId, UpdateProfileRequest updateProfileRequest);
    List<UserSessionResponse> getUserSessions(String userPublicId);
    void revokeUserSession(String userPublicId, String sessionPublicId);
    void logoutAllSessions(String userPublicId);
    void logout(String userPublicId);
}
