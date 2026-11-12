package com.campusiq.notification.service;

import com.campusiq.notification.dto.ContestEvent;
import com.campusiq.notification.dto.LeaderboardUpdate;
import com.campusiq.notification.dto.NotificationResponse;
import com.campusiq.notification.model.Notification;
import com.campusiq.notification.model.NotificationType;
import com.campusiq.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void processContestStarted(ContestEvent event) {
        log.info("Processing contest started event for contest: {}", event.getTitle());

        Notification notification = Notification.builder()
                .userId(null)
                .type(NotificationType.CONTEST_STARTED)
                .title("Contest Started")
                .message("Contest " + event.getTitle() + " has started!")
                .metadata("{\"contestId\":" + event.getContestId() + ",\"subject\":\"" + event.getSubject() + "\"}")
                .build();

        notificationRepository.save(notification);
    }

    @Transactional
    public void processContestEnded(ContestEvent event) {
        log.info("Processing contest ended event for contest: {}", event.getTitle());

        Notification notification = Notification.builder()
                .userId(null)
                .type(NotificationType.CONTEST_ENDED)
                .title("Contest Ended")
                .message("Contest " + event.getTitle() + " has ended!")
                .metadata("{\"contestId\":" + event.getContestId() + ",\"subject\":\"" + event.getSubject() + "\"}")
                .build();

        notificationRepository.save(notification);
    }

    @Transactional
    public void processLeaderboardUpdate(LeaderboardUpdate update) {
        log.info("Processing leaderboard update for contest: {}", update.getContestId());

        Notification notification = Notification.builder()
                .userId(null)
                .type(NotificationType.LEADERBOARD_UPDATE)
                .title("Leaderboard Updated")
                .message("The leaderboard for contest " + update.getContestId() + " has been updated.")
                .metadata("{\"contestId\":" + update.getContestId() + "}")
                .build();

        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(Long userId) {
        List<Notification> userNotifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<Notification> broadcastNotifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(null);

        return Stream.concat(broadcastNotifications.stream(), userNotifications.stream())
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        long userUnread = notificationRepository.countByUserIdAndReadFalse(userId);
        long broadcastUnread = notificationRepository.countByUserIdAndReadFalse(null);
        return userUnread + broadcastUnread;
    }

    @Transactional
    public void markAsRead(Long userId, List<Long> notificationIds) {
        List<Notification> notifications = notificationRepository.findAllById(notificationIds);
        notifications.stream()
                .filter(n -> n.getUserId() == null || n.getUserId().equals(userId))
                .forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> userUnread = notificationRepository.findByUserIdAndReadFalse(userId);
        List<Notification> broadcastUnread = notificationRepository.findByUserIdAndReadFalse(null);

        Stream.concat(userUnread.stream(), broadcastUnread.stream())
                .forEach(n -> n.setRead(true));

        notificationRepository.saveAll(userUnread);
        notificationRepository.saveAll(broadcastUnread);
    }

    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .read(notification.isRead())
                .metadata(notification.getMetadata())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
