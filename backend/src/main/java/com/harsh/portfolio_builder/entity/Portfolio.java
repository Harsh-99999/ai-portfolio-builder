package com.harsh.portfolio_builder.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name = "portfolios")
public class Portfolio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false, unique = true) private User user;
    @Column(nullable = false, length = 120) private String title = "My Portfolio";
    @Column(nullable = false, unique = true, length = 90) private String slug;
    @Column(nullable = false, length = 30) private String template = "minimal";
    @Column(name = "is_published", nullable = false) private boolean published;
    @Column(name = "published_at") private Instant publishedAt;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt = Instant.now();
    @Column(name = "updated_at", nullable = false) private Instant updatedAt = Instant.now();
    protected Portfolio() {}
    public Portfolio(User user, String slug) { this.user = user; this.slug = slug; }
    @PreUpdate
    void markUpdated() { updatedAt = Instant.now(); }
    public Long getId() { return id; } public User getUser() { return user; }
    public String getTitle() { return title; } public void setTitle(String value) { title = value; }
    public String getSlug() { return slug; } public void setSlug(String value) { slug = value; }
    public String getTemplate() { return template; } public void setTemplate(String value) { template = value; }
    public boolean isPublished() { return published; }
    public void publish() { published = true; publishedAt = Instant.now(); }
    public void unpublish() { published = false; publishedAt = null; }
    public Instant getPublishedAt() { return publishedAt; }
}
