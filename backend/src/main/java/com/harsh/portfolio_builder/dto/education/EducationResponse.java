package com.harsh.portfolio_builder.dto.education;
import com.harsh.portfolio_builder.entity.Education;
public record EducationResponse(Long id,String institution,String degree,String fieldOfStudy,String startDate,String endDate,String description){
 public static EducationResponse from(Education e){return new EducationResponse(e.getId(),e.getInstitution(),e.getDegree(),e.getFieldOfStudy(),e.getStartDate(),e.getEndDate(),e.getDescription());}
}
