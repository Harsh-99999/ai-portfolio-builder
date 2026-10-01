package com.harsh.portfolio_builder.dto.ai;
import jakarta.validation.constraints.Size;
import java.util.List;
public record AiRequest(@Size(max=120) String name,@Size(max=160) String headline,
    @Size(max=3000) String text,@Size(max=3000) String bio,@Size(max=120) String company,
    @Size(max=120) String role,@Size(max=120) String projectName,@Size(max=500) String shortDescription,
    @Size(max=3000) String repositoryInfo,@Size(max=200) List<@Size(max=80) String> skills,
    @Size(max=200) List<@Size(max=80) String> technologies,@Size(max=200) List<@Size(max=100) String> experience,
    @Size(max=200) List<@Size(max=100) String> education,@Size(max=200) List<@Size(max=200) String> projects,
    @Size(max=30) String tone,@Size(max=30) String length) {}
