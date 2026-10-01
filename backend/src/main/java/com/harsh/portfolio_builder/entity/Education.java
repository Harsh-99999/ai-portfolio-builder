package com.harsh.portfolio_builder.entity;
import jakarta.persistence.*;
@Entity @Table(name="educations")
public class Education {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false,fetch=FetchType.LAZY) @JoinColumn(name="user_id",nullable=false) private User user;
 @Column(nullable=false,length=180) private String institution;
 @Column(nullable=false,length=120) private String degree;
 @Column(name="field_of_study",length=120) private String fieldOfStudy;
 @Column(name="start_date",length=20) private String startDate;
 @Column(name="end_date",length=20) private String endDate;
 @Column(length=2000) private String description;
 protected Education() {}
 public Education(User user,String institution,String degree){this.user=user;this.institution=institution;this.degree=degree;}
 public Long getId(){return id;} public User getUser(){return user;} public String getInstitution(){return institution;} public void setInstitution(String v){institution=v;}
 public String getDegree(){return degree;} public void setDegree(String v){degree=v;} public String getFieldOfStudy(){return fieldOfStudy;} public void setFieldOfStudy(String v){fieldOfStudy=v;}
 public String getStartDate(){return startDate;} public void setStartDate(String v){startDate=v;} public String getEndDate(){return endDate;} public void setEndDate(String v){endDate=v;}
 public String getDescription(){return description;} public void setDescription(String v){description=v;}
}
