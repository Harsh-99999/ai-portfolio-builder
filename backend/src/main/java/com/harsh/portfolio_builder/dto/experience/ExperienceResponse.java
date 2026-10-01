package com.harsh.portfolio_builder.dto.experience;
import com.harsh.portfolio_builder.entity.Experience;
public record ExperienceResponse(Long id,String company,String position,String location,String startDate,String endDate,boolean currentlyWorking,String description){
 public static ExperienceResponse from(Experience e){return new ExperienceResponse(e.getId(),e.getCompany(),e.getPosition(),e.getLocation(),e.getStartDate(),e.getEndDate(),e.isCurrentlyWorking(),e.getDescription());}
}
