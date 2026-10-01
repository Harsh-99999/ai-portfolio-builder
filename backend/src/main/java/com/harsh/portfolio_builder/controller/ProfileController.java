package com.harsh.portfolio_builder.controller;
import com.harsh.portfolio_builder.dto.profile.*;
import com.harsh.portfolio_builder.service.ProfileService;
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/profile")
public class ProfileController {
    private final ProfileService service; public ProfileController(ProfileService service) { this.service=service; }
    @GetMapping public ProfileResponse get(Principal principal) { return service.get(principal.getName()); }
    @PutMapping public ProfileResponse update(Principal principal, @Valid @RequestBody ProfileRequest request) { return service.update(principal.getName(),request); }
}
