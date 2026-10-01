package com.harsh.portfolio_builder.entity;
import jakarta.persistence.*;
@Entity @Table(name="experiences")
public class Experience {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false,fetch=FetchType.LAZY) @JoinColumn(name="user_id",nullable=false) private User user;
 @Column(nullable=false,length=180) private String company;
 @Column(nullable=false,length=140) private String position;
 @Column(length=120) private String location;
 @Column(name="start_date",length=20) private String startDate;
 @Column(name="end_date",length=20) private String endDate;
 @Column(name="currently_working",nullable=false) private boolean currentlyWorking;
 @Column(length=3000) private String description;
 protected Experience() {}
 public Experience(User user,String company,String position){this.user=user;this.company=company;this.position=position;}
 public Long getId(){return id;} public User getUser(){return user;} public String getCompany(){return company;} public void setCompany(String v){company=v;}
 public String getPosition(){return position;} public void setPosition(String v){position=v;} public String getLocation(){return location;} public void setLocation(String v){location=v;}
 public String getStartDate(){return startDate;} public void setStartDate(String v){startDate=v;} public String getEndDate(){return endDate;} public void setEndDate(String v){endDate=v;}
 public boolean isCurrentlyWorking(){return currentlyWorking;} public void setCurrentlyWorking(boolean v){currentlyWorking=v;} public String getDescription(){return description;} public void setDescription(String v){description=v;}
}
