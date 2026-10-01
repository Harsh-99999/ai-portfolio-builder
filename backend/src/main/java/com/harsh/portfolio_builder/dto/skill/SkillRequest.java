package com.harsh.portfolio_builder.dto.skill;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public record SkillRequest(@NotBlank @Size(max = 80) String name, @Size(max = 80) String category) {}
