package com.campusiq.contest.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic contestStartedTopic() {
        return TopicBuilder.name("contest.started")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic contestEndedTopic() {
        return TopicBuilder.name("contest.ended")
                .partitions(3)
                .replicas(1)
                .build();
    }
}
