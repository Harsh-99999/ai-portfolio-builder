package com.harsh.portfolio_builder.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final byte[] secret;
    private final long expirationSeconds;
    private final ObjectMapper mapper = new ObjectMapper();

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration-minutes}") long expirationMinutes) {
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationSeconds = expirationMinutes * 60;
    }

    public String issue(String email) {
        try {
            String header = encode(mapper.writeValueAsBytes(Map.of("alg", "HS256", "typ", "JWT")));
            String payload = encode(mapper.writeValueAsBytes(Map.of("sub", email,
                    "iat", Instant.now().getEpochSecond(), "exp", Instant.now().getEpochSecond() + expirationSeconds)));
            String input = header + "." + payload;
            return input + "." + encode(sign(input));
        } catch (Exception exception) { throw new IllegalStateException("Could not create access token", exception); }
    }

    public String subject(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return null;
            String input = parts[0] + "." + parts[1];
            if (!java.security.MessageDigest.isEqual(sign(input), Base64.getUrlDecoder().decode(parts[2]))) return null;
            Map<?, ?> claims = mapper.readValue(Base64.getUrlDecoder().decode(parts[1]), Map.class);
            if (!(claims.get("exp") instanceof Number exp) || exp.longValue() <= Instant.now().getEpochSecond()) return null;
            return claims.get("sub") instanceof String sub ? sub : null;
        } catch (Exception exception) { return null; }
    }

    private byte[] sign(String value) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret, "HmacSHA256"));
        return mac.doFinal(value.getBytes(StandardCharsets.UTF_8));
    }
    private String encode(byte[] value) { return Base64.getUrlEncoder().withoutPadding().encodeToString(value); }
}
