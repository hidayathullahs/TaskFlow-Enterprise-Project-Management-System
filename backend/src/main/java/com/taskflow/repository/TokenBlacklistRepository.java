package com.taskflow.repository;

import com.taskflow.entity.TokenBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface TokenBlacklistRepository extends JpaRepository<TokenBlacklist, Long> {

    boolean existsByToken(String token);

    Optional<TokenBlacklist> findByToken(String token);

    void deleteByExpiresAtBefore(LocalDateTime now);
}
