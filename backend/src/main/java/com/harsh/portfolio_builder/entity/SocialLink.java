package com.harsh.portfolio_builder.entity;
import jakarta.persistence.*;
@Entity @Table(name="social_links")
public class SocialLink {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false,fetch=FetchType.LAZY) @JoinColumn(name="user_id",nullable=false) private User user;
 @Column(nullable=false,length=60) private String platform;
 @Column(nullable=false,length=500) private String url;
 protected SocialLink() {}
 public SocialLink(User user,String platform,String url){this.user=user;this.platform=platform;this.url=url;}
 public Long getId(){return id;} public User getUser(){return user;} public String getPlatform(){return platform;} public void setPlatform(String v){platform=v;} public String getUrl(){return url;} public void setUrl(String v){url=v;}
}
