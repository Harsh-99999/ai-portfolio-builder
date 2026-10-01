package com.harsh.portfolio_builder.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.time.Instant;

@Entity @Table(name = "projects")
public class Project {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false) private User user;
    @Column(nullable = false, length = 120) private String name;
    @Column(name = "short_description", length = 300) private String shortDescription;
    @Column(length = 4000) private String description;
    @Column(name = "image_url", length = 500) private String imageUrl;
    @Column(name = "github_url", length = 500) private String githubUrl;
    @Column(name = "live_url", length = 500) private String liveUrl;
    @Column(name = "display_order", nullable = false) private int displayOrder;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt = Instant.now();
    @Column(name = "updated_at", nullable = false) private Instant updatedAt = Instant.now();
    @ElementCollection @CollectionTable(name = "project_technologies", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "technology", nullable = false, length = 60) private List<String> technologies = new ArrayList<>();
    protected Project() {}
    @PreUpdate
    void markUpdated() { updatedAt = Instant.now(); }
    public Project(User user, String name) { this.user = user; this.name = name; }
    public Long getId() { return id; } public User getUser() { return user; }
    public String getName() { return name; } public void setName(String value) { name = value; }
    public String getShortDescription() { return shortDescription; } public void setShortDescription(String value) { shortDescription = value; }
    public String getDescription() { return description; } public void setDescription(String value) { description = value; }
    public String getImageUrl() { return imageUrl; } public void setImageUrl(String value) { imageUrl = value; }
    public String getGithubUrl() { return githubUrl; } public void setGithubUrl(String value) { githubUrl = value; }
    public String getLiveUrl() { return liveUrl; } public void setLiveUrl(String value) { liveUrl = value; }
    public int getDisplayOrder() { return displayOrder; } public void setDisplayOrder(int value) { displayOrder = value; }
    public List<String> getTechnologies() { return technologies; } public void setTechnologies(List<String> value) { technologies = value == null ? new ArrayList<>() : new ArrayList<>(value); }
}
