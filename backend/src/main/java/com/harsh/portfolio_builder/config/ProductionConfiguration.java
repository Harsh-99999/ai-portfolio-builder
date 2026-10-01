package com.harsh.portfolio_builder.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.util.StringUtils;

@Configuration
@Profile("prod")
public class ProductionConfiguration {
    public ProductionConfiguration(@Value("${app.jwt.secret}") String secret,
                                  @Value("${app.cors.allowed-origin}") String allowedOrigins,
                                  @Value("${spring.datasource.url}") String databaseUrl,
                                  @Value("${spring.datasource.username}") String databaseUsername,
                                  @Value("${spring.datasource.password}") String databasePassword) {
        if (!StringUtils.hasText(secret) || secret.getBytes(java.nio.charset.StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException("JWT_SECRET must contain at least 32 bytes when SPRING_PROFILES_ACTIVE=prod");
        }
        if (!StringUtils.hasText(allowedOrigins) || allowedOrigins.contains("localhost") || allowedOrigins.contains("127.0.0.1")) {
            throw new IllegalStateException("FRONTEND_ORIGIN must be set to the hosted frontend origin in production");
        }
        if (!StringUtils.hasText(databaseUrl) || databaseUrl.contains("postgres:5432")
                || databaseUrl.contains("localhost") || "portfolio".equals(databaseUsername)
                || "portfolio".equals(databasePassword)) {
            throw new IllegalStateException("Set DATABASE_URL, DATABASE_USERNAME, and DATABASE_PASSWORD to production database credentials");
        }
    }
}
