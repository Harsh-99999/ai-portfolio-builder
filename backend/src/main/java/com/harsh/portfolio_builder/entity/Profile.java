package com.harsh.portfolio_builder.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name = "profiles")
public class Profile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    @Column(name = "full_name", length = 120) private String fullName;
    @Column(length = 160) private String headline;
    @Column(length = 3000) private String bio;
    @Column(name = "profile_image_url", length = 500) private String profileImageUrl;
    @Column(length = 120) private String location;
    @Column(length = 40) private String phone;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt = Instant.now();
    @Column(name = "updated_at", nullable = false) private Instant updatedAt = Instant.now();

    @PreUpdate
    void markUpdated() { updatedAt = Instant.now(); }
    protected Profile() {}
    public Profile(User user) { this.user = user; }
    public Long getId() { return id; } public User getUser() { return user; }
    public String getFullName() { return fullName; } public void setFullName(String value) { fullName = value; }
    public String getHeadline() { return headline; } public void setHeadline(String value) { headline = value; }
    public String getBio() { return bio; } public void setBio(String value) { bio = value; }
    public String getProfileImageUrl() { return profileImageUrl; } public void setProfileImageUrl(String value) { profileImageUrl = value; }
    public String getLocation() { return location; } public void setLocation(String value) { location = value; }
    public String getPhone() { return phone; } public void setPhone(String value) { phone = value; }
}
