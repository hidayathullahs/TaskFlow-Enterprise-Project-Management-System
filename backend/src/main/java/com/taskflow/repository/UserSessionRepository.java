package com.taskflow.repository;

import com.taskflow.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {

    List<UserSession> findByUserIdAndRevokedFalse(Long userId);

    Optional<UserSession> findByPublicIdAndUserIdAndRevokedFalse(String publicId, Long userId);

    void deleteByUserId(Long userId);
}
