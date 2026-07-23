package com.taskflow.dto.response;

import com.taskflow.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponse {

    private String publicId;
    private String title;
    private String message;
    private NotificationType type;
    private boolean read;
    private String link;
    private LocalDateTime createdAt;
}
