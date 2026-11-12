package com.campusiq.auth.service;

import com.campusiq.auth.dto.*;
import com.campusiq.auth.exception.TokenRefreshException;
import com.campusiq.auth.exception.UserAlreadyExistsException;
import com.campusiq.auth.model.RefreshToken;
import com.campusiq.auth.model.Role;
import com.campusiq.auth.model.User;
import com.campusiq.auth.repository.RefreshTokenRepository;
import com.campusiq.auth.repository.UserRepository;
import com.campusiq.auth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new UserAlreadyExistsException("Email already in use: " + normalizedEmail);
        }

        User user = User.builder()
                .name(request.getName() != null ? request.getName().trim() : "")
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? Role.valueOf(request.getRole().toUpperCase()) : Role.STUDENT)
                .build();

        user = userRepository.save(user);

        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = createRefreshToken(user.getId());

        return AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = createRefreshToken(user.getId());

        return AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    @Transactional
    public AuthResponse refreshToken(TokenRefreshRequest request) {
        String requestToken = request.getRefreshToken();

        RefreshToken refreshToken = refreshTokenRepository.findByToken(requestToken)
                .orElseThrow(() -> new TokenRefreshException(requestToken, "Refresh token not found"));

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new TokenRefreshException(requestToken, "Refresh token has expired");
        }

        User user = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new TokenRefreshException(requestToken, "User not found"));

        String newAccessToken = jwtUtil.generateToken(user);

        return AuthResponse.builder()
                .token(newAccessToken)
                .refreshToken(requestToken)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    @Transactional
    public MessageResponse logout(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
        return new MessageResponse("Logged out successfully");
    }

    public User getCurrentUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private String createRefreshToken(Long userId) {
        // delete existing tokens for user
        refreshTokenRepository.deleteByUserId(userId);

        RefreshToken token = RefreshToken.builder()
                .userId(userId)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(604800000L)) // 7 days
                .build();

        refreshTokenRepository.save(token);
        return token.getToken();
    }
}
