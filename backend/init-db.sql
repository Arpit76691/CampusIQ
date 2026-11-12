-- CampusIQ Database Initialization
-- Creates all service databases

CREATE DATABASE campusiq_auth;
CREATE DATABASE campusiq_contest;
CREATE DATABASE campusiq_submission;
CREATE DATABASE campusiq_evaluation;
CREATE DATABASE campusiq_analytics;
CREATE DATABASE campusiq_notification;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE campusiq_auth TO postgres;
GRANT ALL PRIVILEGES ON DATABASE campusiq_contest TO postgres;
GRANT ALL PRIVILEGES ON DATABASE campusiq_submission TO postgres;
GRANT ALL PRIVILEGES ON DATABASE campusiq_evaluation TO postgres;
GRANT ALL PRIVILEGES ON DATABASE campusiq_analytics TO postgres;
GRANT ALL PRIVILEGES ON DATABASE campusiq_notification TO postgres;
