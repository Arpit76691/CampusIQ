@echo off
echo Starting CampusIQ Backend Services...

set KAFKA=localhost:29092
set LOG=d:\campus\backend\logs

mkdir %LOG% 2>nul

echo [1/8] Auth Service (8081)...
start /B "" java -jar "d:\campus\backend\auth-service\target\auth-service-1.0.0.jar" ^
  --spring.kafka.bootstrap-servers=%KAFKA% ^
  > "%LOG%\auth-service.log" 2>&1

timeout /t 15 /nobreak > nul

echo [2/8] Contest Service (8082)...
start /B "" java -jar "d:\campus\backend\contest-service\target\contest-service-1.0.0.jar" ^
  --spring.kafka.bootstrap-servers=%KAFKA% ^
  > "%LOG%\contest-service.log" 2>&1

echo [3/8] Submission Service (8083)...
start /B "" java -jar "d:\campus\backend\submission-service\target\submission-service-0.0.1-SNAPSHOT.jar" ^
  --spring.kafka.bootstrap-servers=%KAFKA% ^
  > "%LOG%\submission-service.log" 2>&1

echo [4/8] Evaluation Service (8084)...
start /B "" java -jar "d:\campus\backend\evaluation-service\target\evaluation-service-0.0.1-SNAPSHOT.jar" ^
  --spring.kafka.bootstrap-servers=%KAFKA% ^
  > "%LOG%\evaluation-service.log" 2>&1

echo [5/8] Leaderboard Service (8085)...
start /B "" java -jar "d:\campus\backend\leaderboard-service\target\leaderboard-service-0.0.1-SNAPSHOT.jar" ^
  --spring.kafka.bootstrap-servers=%KAFKA% ^
  > "%LOG%\leaderboard-service.log" 2>&1

echo [6/8] Analytics Service (8086)...
start /B "" java -jar "d:\campus\backend\analytics-service\target\analytics-service-0.0.1-SNAPSHOT.jar" ^
  --spring.kafka.bootstrap-servers=%KAFKA% ^
  > "%LOG%\analytics-service.log" 2>&1

echo [7/8] Notification Service (8087)...
start /B "" java -jar "d:\campus\backend\notification-service\target\notification-service-0.0.1-SNAPSHOT.jar" ^
  --spring.kafka.bootstrap-servers=%KAFKA% ^
  > "%LOG%\notification-service.log" 2>&1

timeout /t 20 /nobreak > nul

echo [8/8] API Gateway (8080)...
start /B "" java -jar "d:\campus\backend\api-gateway\target\api-gateway-0.0.1-SNAPSHOT.jar" ^
  --spring.cloud.gateway.routes[0].uri=http://localhost:8081 ^
  > "%LOG%\api-gateway.log" 2>&1

echo All services started! Logs at d:\campus\backend\logs\
