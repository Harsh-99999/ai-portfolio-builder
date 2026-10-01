package com.harsh.portfolio_builder.dto.experience;
import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.Pattern; import jakarta.validation.constraints.Size;
public record ExperienceRequest(@NotBlank @Size(max=180) String company,@NotBlank @Size(max=140) String position,
 @Size(max=120) String location,@Pattern(regexp="^\\d{4}-\\d{2}$") String startDate,@Pattern(regexp="^\\d{4}-\\d{2}$") String endDate,boolean currentlyWorking,@Size(max=3000) String description){}
