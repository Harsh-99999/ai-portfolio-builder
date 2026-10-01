package com.harsh.portfolio_builder.dto.project;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;
import java.util.List;
public record ProjectRequest(@NotBlank @Size(max = 120) String name, @Size(max = 300) String shortDescription,
    @Size(max = 4000) String description, @URL @Size(max = 500) String imageUrl, @URL @Size(max = 500) String githubUrl, @URL @Size(max = 500) String liveUrl,
    @Size(max = 20) List<@Size(max = 60) String> technologies, int displayOrder) {}
