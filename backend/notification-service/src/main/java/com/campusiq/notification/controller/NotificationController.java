package com.campusiq.notification.controller;

import com.campusiq.notification.dto.MarkReadRequest;
import com.campusiq.notification.dto.NotificationResponse;
import com.campusiq.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Base endpoint – prevents 500 from NoResourceFoundException on GET /api/notifications.
     */
    @GetMapping
    public ResponseEntity<Map<String, String>> index() {
        return ResponseEntity.ok(Map.of("service", "notification-service", "status", "ok"));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getUserNotifications(@PathVariable Long userId) {
        List<NotificationResponse> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable Long userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @PutMapping("/user/{userId}/mark-read")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable Long userId,
            @Valid @RequestBody MarkReadRequest request) {
        notificationService.markAsRead(userId, request.getNotificationIds());
        return ResponseEntity.ok(Map.of("message", "Notifications marked as read"));
    }

    @PutMapping("/user/{userId}/mark-all-read")
    public ResponseEntity<Map<String, String>> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
}
