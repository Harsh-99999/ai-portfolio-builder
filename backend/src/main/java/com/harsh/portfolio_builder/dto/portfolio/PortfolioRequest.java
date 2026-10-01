package com.harsh.portfolio_builder.dto.portfolio;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
public record PortfolioRequest(@Size(max = 120) String title,
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Use lowercase letters, numbers, and hyphens") @Size(min = 3, max = 90) String slug,
    @Pattern(regexp = "minimal|modern|developer", message = "Choose a supported template") String template) {}
