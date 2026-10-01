package com.harsh.portfolio_builder.dto.project;
import com.harsh.portfolio_builder.entity.Project;
import java.util.List;
public record ProjectResponse(Long id, String name, String shortDescription, String description, String imageUrl, String githubUrl,
    String liveUrl, List<String> technologies, int displayOrder) {
    public static ProjectResponse from(Project p) { return new ProjectResponse(p.getId(), p.getName(), p.getShortDescription(), p.getDescription(), p.getImageUrl(), p.getGithubUrl(), p.getLiveUrl(), List.copyOf(p.getTechnologies()), p.getDisplayOrder()); }
}
