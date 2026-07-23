package com.taskflow.service.impl;

import com.taskflow.dto.response.NotificationResponse;
import com.taskflow.entity.Notification;
import com.taskflow.entity.User;
import com.taskflow.enums.NotificationType;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.NotificationRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(String userPublicId) {
        User user = userRepository.findByPublicIdAndDeletedFalse(userPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "publicId", userPublicId));

        return notificationRepository.findAll().stream()
                .filter(n -> n.getUser() != null && n.getUser().getId().equals(user.getId()) && !n.isDeleted())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(String userPublicId) {
        User user = userRepository.findByPublicIdAndDeletedFalse(userPublicId).orElse(null);
        if (user == null) return 0;
        return notificationRepository.countByUserIdAndReadFalseAndDeletedFalse(user.getId());
    }

    @Override
    @Transactional
    public void markAsRead(String notificationPublicId) {
        Notification notification = notificationRepository.findByPublicIdAndDeletedFalse(notificationPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "publicId", notificationPublicId));

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(String userPublicId) {
        User user = userRepository.findByPublicIdAndDeletedFalse(userPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "publicId", userPublicId));

        List<Notification> unreadList = notificationRepository.findAll().stream()
                .filter(n -> n.getUser() != null && n.getUser().getId().equals(user.getId()) && !n.isRead() && !n.isDeleted())
                .toList();

        for (Notification n : unreadList) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unreadList);
    }

    @Override
    @Transactional
    public void deleteNotification(String notificationPublicId) {
        Notification notification = notificationRepository.findByPublicIdAndDeletedFalse(notificationPublicId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "publicId", notificationPublicId));

        notification.setDeleted(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void sendNotification(String userPublicId, String title, String message, NotificationType type, String link) {
        User user = userRepository.findByPublicIdAndDeletedFalse(userPublicId).orElse(null);
        if (user == null) return;

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type != null ? type : NotificationType.SYSTEM)
                .link(link)
                .read(false)
                .build();

        Notification saved = notificationRepository.save(notification);
        NotificationResponse response = mapToResponse(saved);

        try {
            messagingTemplate.convertAndSendToUser(userPublicId, "/queue/notifications", response);
        } catch (Exception e) {
            log.error("Failed to push STOMP notification: {}", e.getMessage());
        }
    }

    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .publicId(n.getPublicId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .read(n.isRead())
                .link(n.getLink())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
