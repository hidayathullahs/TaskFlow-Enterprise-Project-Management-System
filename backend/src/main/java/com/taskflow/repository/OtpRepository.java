package com.taskflow.repository;

import com.taskflow.entity.Otp;
import com.taskflow.enums.OtpType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {

    Optional<Otp> findTopByUserIdAndTypeAndVerifiedFalseOrderByCreatedAtDesc(Long userId, OtpType type);

    Optional<Otp> findTopByUserIdAndOtpCodeAndTypeAndVerifiedFalseOrderByCreatedAtDesc(Long userId, String otpCode, OtpType type);

    void deleteByExpiresAtBefore(LocalDateTime now);
}
