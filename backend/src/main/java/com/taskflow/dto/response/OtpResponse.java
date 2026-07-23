package com.taskflow.dto.response;

import com.taskflow.enums.OtpType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OtpResponse {

    private String publicId;
    private OtpType type;
    private LocalDateTime expiresAt;
    private int maxAttempts;
    private String message;
}
