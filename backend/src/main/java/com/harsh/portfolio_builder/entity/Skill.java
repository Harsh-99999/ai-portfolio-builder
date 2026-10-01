package com.harsh.portfolio_builder.entity;

import jakarta.persistence.*;

@Entity @Table(name = "skills")
public class Skill {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false) private User user;
    @Column(nullable = false, length = 80) private String name;
    @Column(length = 80) private String category;
    protected Skill() {}
    public Skill(User user, String name, String category) { this.user = user; this.name = name; this.category = category; }
    public Long getId() { return id; } public User getUser() { return user; }
    public String getName() { return name; } public void setName(String value) { name = value; }
    public String getCategory() { return category; } public void setCategory(String value) { category = value; }
}
