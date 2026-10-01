package com.harsh.portfolio_builder.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.harsh.portfolio_builder.dto.auth.AuthRequest;
import com.harsh.portfolio_builder.entity.User;
import com.harsh.portfolio_builder.repository.PortfolioRepository;
import com.harsh.portfolio_builder.repository.ProfileRepository;
import com.harsh.portfolio_builder.repository.UserRepository;
import com.harsh.portfolio_builder.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock UserRepository users;
    @Mock ProfileRepository profiles;
    @Mock PortfolioRepository portfolios;
    @Mock JwtService jwt;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private AuthService service;

    @BeforeEach void setUp() { service = new AuthService(users, encoder, jwt, profiles, portfolios); }

    @Test void registrationHashesPasswordAndCreatesPortfolioStarterRecords() {
        when(users.existsByEmailIgnoreCase("dev@example.com")).thenReturn(false);
        when(users.save(any(User.class))).thenAnswer(call -> call.getArgument(0));
        when(jwt.issue("dev@example.com")).thenReturn("signed-token");

        var response = service.register(new AuthRequest(" Dev@Example.com ", "password-123"));

        assertEquals("dev@example.com", response.email());
        assertEquals("signed-token", response.token());
        var saved = org.mockito.ArgumentCaptor.forClass(User.class);
        verify(users).save(saved.capture());
        assertNotEquals("password-123", saved.getValue().getPasswordHash());
        verify(profiles).save(any());
        verify(portfolios).save(any());
    }

    @Test void loginAcceptsPasswordMatchingStoredHash() {
        when(users.findByEmailIgnoreCase("dev@example.com"))
                .thenReturn(java.util.Optional.of(new User("dev@example.com", encoder.encode("password-123"))));
        when(jwt.issue("dev@example.com")).thenReturn("signed-token");

        var response = service.login(new AuthRequest("dev@example.com", "password-123"));

        assertEquals("signed-token", response.token());
    }
}
