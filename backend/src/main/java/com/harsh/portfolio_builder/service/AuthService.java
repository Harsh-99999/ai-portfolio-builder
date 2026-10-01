package com.harsh.portfolio_builder.service;

import com.harsh.portfolio_builder.dto.auth.AuthRequest;
import com.harsh.portfolio_builder.dto.auth.AuthResponse;
import com.harsh.portfolio_builder.entity.User;
import com.harsh.portfolio_builder.entity.Profile;
import com.harsh.portfolio_builder.entity.Portfolio;
import com.harsh.portfolio_builder.exception.ApiException;
import com.harsh.portfolio_builder.repository.ProfileRepository;
import com.harsh.portfolio_builder.repository.PortfolioRepository;
import com.harsh.portfolio_builder.repository.UserRepository;
import com.harsh.portfolio_builder.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Transactional
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ProfileRepository profiles;
    private final PortfolioRepository portfolios;
    public AuthService(UserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService,
                       ProfileRepository profiles, PortfolioRepository portfolios) {
        this.users = users; this.passwordEncoder = passwordEncoder; this.jwtService = jwtService;
        this.profiles = profiles; this.portfolios = portfolios;
    }

    public AuthResponse register(AuthRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email))
            throw new ApiException(HttpStatus.CONFLICT, "EMAIL_IN_USE", "An account with this email already exists");
        User user = users.save(new User(email, passwordEncoder.encode(request.password())));
        profiles.save(new Profile(user));
        String base = email.substring(0, email.indexOf('@')).toLowerCase().replaceAll("[^a-z0-9-]", "-");
        portfolios.save(new Portfolio(user, (base.isBlank() ? "portfolio" : base) + "-" + user.getId()));
        return new AuthResponse(jwtService.issue(email), email);
    }

    public AuthResponse login(AuthRequest request) {
        String email = request.email().trim().toLowerCase();
        User user = users.findByEmailIgnoreCase(email).orElseThrow(() ->
                new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Email or password is incorrect"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash()))
            throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Email or password is incorrect");
        return new AuthResponse(jwtService.issue(user.getEmail()), user.getEmail());
    }
}
