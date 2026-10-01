package com.harsh.portfolio_builder.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

class JwtServiceTest {
    @Test void tokenContainsVerifiedSubjectAndRejectsModifiedSignature() {
        JwtService service = new JwtService("unit-test-secret-with-at-least-32-characters", 10);
        String token = service.issue("dev@example.com");
        assertEquals("dev@example.com", service.subject(token));
        assertNull(service.subject(token + "tampered"));
    }

    @Test void expiredTokensAreRejected() {
        JwtService service = new JwtService("unit-test-secret-with-at-least-32-characters", 0);
        assertNull(service.subject(service.issue("dev@example.com")));
    }
}
